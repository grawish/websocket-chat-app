const express = require("express");
const app = express();
require("express-ws")(app);

app.use(express.static("public"));

// const sockets = [
//   {
//     id: "1",
//     ws: {},
//   },
// ];

let groups = [];

const handleMessage = (ws, message) => {
  try {
    const { type, payload } = JSON.parse(message);
    const { text, groupId } = payload;
    const group = groups.find((group) => group.id === groupId);
    switch (type) {
      case "join":
        if (!group) {
          groups.push({
            id: groupId,
            sockets: new Set([ws]),
          });
        } else {
          group.sockets.add(ws);
        }
        if (!ws.userId) {
          ws.userId = Math.random().toString(36).substring(7);
        }
        group?.sockets.forEach((socket) => {
          socket.send(
            JSON.stringify({
              type: "join",
              payload: {
                userId: ws.userId,
              },
            })
          );
        });
        break;
      case "send":
        if (group) {
          group.sockets.forEach((socket) => {
            socket.send(
              JSON.stringify({
                type: "message",
                payload: { text, userId: ws.userId },
              })
            );
          });
        }
        break;
      default:
        break;
    }
  } catch (e) {
    console.log(e);
  }
};

app.ws("/", (ws) => {
  ws.on("message", function (msg) {
    if (msg === "ping") {
      ws.send("pong");
      return;
    }
    handleMessage(ws, msg);
  });

  ws.on("close", () => {
    groups = groups.filter((group) => {
      if (group.sockets.size === 1) {
        return false;
      }
      group.sockets.delete(ws);
      group.sockets.forEach((socket) => {
        socket.send(
          JSON.stringify({
            type: "close",
            payload: {
              userId: ws.userId,
            },
          })
        );
      });
      return true;
    });
  });
});

app.listen(3000, () => console.log("Server started on port 3000"));
