const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081, clientTracking: true });

var connectionCount = 0;
new Promise((resolve) => {
  wss.on('connection', function connection(ws) {
    console.log("connection")

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
  
});