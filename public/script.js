const ws = new WebSocket("ws://localhost:3000");
const console = document.getElementById("logger");

console.__proto__.log = (e) => {
  console.innerHTML += e + "<br>";
};

ws.addEventListener("open", () => {
  console.log("Connected to server");
});

ws.addEventListener("message", (e) => {
  console.log(e.data);
});

document.getElementById("send").addEventListener("click", () => {
  const message = document.getElementById("message").value;

  ws.send(message);
});
