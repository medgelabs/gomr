const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const { v4: uuidv4} = require('uuid')

const app = express();

// setup cors to only accept origins from our app
app.use(cors());
app.options('*', cors());


/**
 * {
 *   id: UUID
 *   player1: WebSocket
 *   player2: WebSocket
 *   expiration: Date
 *   boardState: [[x, y, color]]
 * }
 */
const rooms = new Map();

/**
 * Creates a new game for a user. This will generate a uuid roomID, 
 * add it to the rooms array and then send back the guid for the client
 * to request the game.
 */
app.post('/game', (_, res) => {
  const roomId = uuidv4();
  const expiration = new Date(); 
  // JS date object automatically increments year/month appropriately.
  expiration.setDate(expiration.getDate() + 1);
  rooms.set(roomId, {
    id: roomId,
    player1: undefined,
    player2: undefined,
    boardState: [],
    expiration
  });

  res.send({
    url: 'ws://localhost:8081/gomr',
    roomId,
    expiration
  })
})

app.listen(3000, () => console.log('listening on port 3000'))

const wss = new WebSocket.Server({ port: 8081, clientTracking: true, path: '/gomr'});

wss.on('connection', (sock, request) => {
  sock.on('message', (raw) => {
    const data = JSON.parse(raw);

    /**
     * message type **joinRoom**
     * 
     * data: {
     *   messageType: 'joinRoom'
     *   roomId
     * }
     */
    if (data.messageType === 'joinRoom') {
      // fetch first available room
      const room = rooms.get(data.roomId)
      if (room && !room.player1) {
        room.player1 = sock;
        console.log('first player')
      } else if (room && room.player1) {
        room.player2 = sock;
        // send start game message
        room.player1.send(JSON.stringify({
          color: 'black',
          boardState: room.boardState
        }))
        console.log('starting game')
      } else {
        // no room found
        console.log('No room found')
      }
    
    /**
     * message type **play**
     * 
     * data: {
     *   roomId,
     *   sender,
     *   boardState,
     * }
     */
    } else if (data.messageType === 'play') {
      console.log("received play")
      const room = rooms.get(data.roomId);
      
      if (room) {
        console.log(JSON.stringify(data))
        room.boardState = data.boardState;
          /**
           * sendMessage to client
           * data {
           *   boardState: [[x,y, color]]
           *   color: 'white' | 'black'
           * }
           */
        if (data.sender === 'player1') {
          console.log('sending to player 2')
          room.player2.send(JSON.stringify({ // send message to player2
            boardState: room.boardState,
            color: 'white'
          }))
        } else {
          room.player1.send(JSON.stringify({
            boardState: room.boardState,
            color: 'black'
          })) // send play to player1
        }
      }
    }
  })
})

/**
 * Next Steps
 * - determine message format for sending back to the players
 * - build frontend to support this backend.
 * - Cleanup this code (break out websocket code from express code)
 * - Cleanup frontend (inevitably)
 */

// const ws1 = new WebSocket('http://localhost:8081/gomr');
// const ws2 = new WebSocket('http://localhost:8081/gomr');

// ws1.on('open', () => {
//   ws1.send(JSON.stringify({messageType: 'joinRoom', roomId: 'blarg'}));
// })

// ws2.on('open', () => {
//   ws2.send(JSON.stringify({messageType: 'joinRoom', roomId: 'blarg'}))
// })


/**
 * **Web Server**
 * Generate a guid
 * send that down to the user and redirect to waiting page
 * The client will open a connection to ws://localhost/gomr
 * 
 * **Socket Server**
 * Identify who connected - both players will send a guid
 * socket server will determine if a game room is available
 *   Do we have a game room? 
 *   - Yes: have the sockets communicate with each other
 *   - No: send back a 'no game room found reply'
 * 
 */

// Instead of polling, use a promise to wait for 
// two connections to occur then resolve and implement your server code
// new Promise((resolve) => {
//   wss.on('connection', function connection(ws) {
//     console.log("connection")

//     connectionCount++;
//     if (connectionCount == 2) {
//       resolve()
//     }
//   });
// }).then(() => {
//   var iter = wss.clients.entries();
//   const player1 = iter.next().value[1];
//   const player2 = iter.next().value[1];


//   player1.on('message', (message) => {
//     player2.send(message);
//   });

//   player2.on('message', (message) => {
//     player1.send(message);
//   });

//   player1.send("white");
  
// });