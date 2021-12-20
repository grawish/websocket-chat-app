const express = require('express');
const app = express();
require('express-ws')(app);

app.use(express.static('public'));

// const sockets = [
//   {
//     id: "1",
//hi     ws: {},
//   },
// ];

let groups = [];

const handleMessage = (ws, message) => {
  try {
    const { type, payload } = JSON.parse(message);
    const { text, groupId, userId } = payload;
    const group = groups.find((group) => group.id === groupId);
    switch (type) {
      case 'join':
        if (!group) {
          groups.push({
            id: groupId,
            sockets: new Set([ws]),
          });
        } else {
          group.sockets.add(ws);
        }
        group?.sockets.forEach((socket) => {
          socket.send(
            JSON.stringify({
              type: 'join',
              payload: {
                userId: userId,
              },
            })
          );
        });
        break;
      case 'send':
        if (group) {
          group.sockets.forEach((socket) => {
            socket.send(
              JSON.stringify({
                type: 'message',
                payload: { text, userId },
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

app.ws('/', (ws) => {
  ws.on('message', function (msg) {
    if (msg === 'ping') {
      ws.send('pong');
      return;
    }
    handleMessage(ws, msg);
  });

  ws.on('close', () => {
    groups = groups.filter((group) => {
      if (group.sockets.size === 1) {
        return false;
      }
      group.sockets.delete(ws);
      group.sockets.forEach((socket) => {
        socket.send(
          JSON.stringify({
            type: 'close',
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

app.listen(3000, () => console.log('Server started on port 3000'));
