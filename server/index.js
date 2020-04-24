const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081, clientTracking: true });
const ws = new WebSocket('ws://localhost:8081')
const ws2 = new WebSocket('ws://localhost:8081')

var connectionCount = 0;
new Promise((resolve) => {
  wss.on('connection', function connection(ws) {

    connectionCount++;
    if (connectionCount == 2) {
      resolve()
    }
  });
}).then(() => {
  var iter = wss.clients.entries();
  const player1 = iter.next().value[1];
  const player2 = iter.next().value[1];


  player1.on('message', (message) => {
    player2.send(message);
  });

  player2.on('message', (message) => {
    player1.send(message);
  });

  player1.send("white");

  player2.send("black");
  
});


// ws.on('open', function open() {
//   const array = new Uint8Array(3);
//   array[0] = 1;
//   array[1] = 2;
//   array[2] = 3;
//   ws.send(array);
// });

// ws2.on('message', (message) => {
//   console.log(message)
// })

// ws.on('message', (message) => {
//   console.log(message)
// })

// ws2.on('open', function open() {
//   const array = new Uint8Array(3);
//   array[0] = 4;
//   array[1] = 5;
//   array[2] = 6;
//   ws.send(array);
// });