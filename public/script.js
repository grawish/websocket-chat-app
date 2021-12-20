const ws = new WebSocket('ws://localhost:3000');
const console = document.getElementById('logger');
let username;
let roomname;
// username

document.getElementById('generate-room-name').addEventListener('click', () => {
  const roomName = document.getElementById('room-name');
  roomName.value = generateRoomName();
});

document.getElementById('generate-username').addEventListener('click', () => {
  const username = document.getElementById('username');
  username.value = generateUsername();
});

document.getElementById('initial-form').addEventListener('submit', (e) => {
  e.preventDefault();
  username = document.getElementById('username').value;
  roomname = document.getElementById('room-name').value;
  ws.send(
    JSON.stringify({
      type: 'join',
      payload: {
        groupId: document.getElementById('room-name').value,
        userId: document.getElementById('username').value,
      },
    })
  );
});

const generateRoomName = () => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let roomName = '';
  for (let i = 0; i < 5; i++) {
    roomName += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return roomName;
};

const generateUsername = () => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let username = '';
  for (let i = 0; i < 5; i++) {
    username += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return username;
};

console.__proto__.log = (e) => {
  console.innerHTML += e + '<br>';
};

ws.addEventListener('open', () => {
  console.log('Connected to server');
});

ws.addEventListener('message', (e) => {
  console.log(e.data);
});

document.getElementById('send').addEventListener('click', () => {
  const message = document.getElementById('message').value;
  ws.send(
    JSON.stringify({
      type: 'send',
      payload: {
        text: message,
        userId: username,
        groupId: roomname,
      },
    })
  );
});
