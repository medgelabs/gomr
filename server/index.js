const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

// setup cors to only accept origins from our app
app.use(cors());
app.options("*", cors());

// POST /game creates a new game
//   client making request is player1
//   player2 joins with POST /join with joinKey
//   Any spectators will simply GET /room/:roomId
//
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
app.post("/game", (_, res) => {
  const roomId = uuidv4().replace(/-/g, "");
  const expiration = new Date();
  expiration.setDate(expiration.getDate() + 1); // JS date object automatically increments year/month appropriately.

  rooms.set(roomId, {
    id: roomId,
    player1: undefined,
    player2: undefined,
    boardState: [],
    expiration,
  });

  res.send({
    roomId,
    expiration,
  });
});

// app.get("/join/:roomId")

app.listen(3000, () => console.log("listening on port 3000"));

const wss = new WebSocket.Server({
  port: 8081,
  clientTracking: true,
  path: "/gomr",
});

wss.on("connection", (sock, _) => {
  sock.on("message", (raw) => {
    const data = JSON.parse(raw);

    // { messageType: 'joinRoom', roomId }
    if (data.messageType === "joinRoom") {
      const room = rooms.get(data.roomId);

      if (room && !room.player1) {
        room.player1 = sock;
        console.log("first player");
      } else if (room && room.player1) {
        room.player2 = sock;
        // send start game message
        room.player1.send(
          JSON.stringify({
            color: "black",
            boardState: room.boardState,
          })
        );
        console.log("starting game");
      } else {
        // no room found
        console.log("No room found");
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
    } else if (data.messageType === "play") {
      console.log("received play: " + JSON.stringify(data));
      const room = rooms.get(data.roomId);

      if (!room) {
        console.error(`Invalid play. Room ${data.roomId} does not exist`);
      }

      room.boardState.push(data.move);

      /**
       * sendMessage to client
       * data {
       *   boardState: [[x,y, color]]
       *   color: 'white' | 'black'
       * }
       */
      if (data.sender === "player1") {
        console.log("sending to player 2");

        if (!room.player2) {
          console.log("Player 2 hasn't joined yet. Holding response...")
          return
        }

        room.player2.send(
          JSON.stringify({
            // send message to player2
            boardState: room.boardState,
            color: "white",
          })
        );
      } else {
        room.player1.send(
          JSON.stringify({
            boardState: room.boardState,
            color: "black",
          })
        );
      }
    }
  });
});
