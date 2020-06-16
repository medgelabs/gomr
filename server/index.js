const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const http = require("http");

const port = process.env.SERVER_PORT || 3000;

// Setup REST and WS servers
const app = express();
const server = http.createServer(app)
const wss = new WebSocket.Server({
  server: server,
  path: "/gomr",
});


// setup cors to only accept origins from our app
app.use(cors());
app.options("*", cors());

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

  const room = {
    id: roomId,
    player1: {
      sock: undefined,
      id: "player1",
      color: "X",
    },
    player2: {
      sock: undefined,
      id: "player2",
      color: "O",
    },
    boardState: ".".repeat(361),
    expiration,
  };

  room.currentTurn = room.player1.id;
  rooms.set(roomId, room);

  res.send({
    roomId,
    expiration,
    player1: room.player1.id,
    player2: room.player2.id,
  });
});

// app.get("/join/:roomId")


// WebSocket APIs
wss.on("connection", (sock, _) => {
  sock.on("message", (raw) => {
    const data = JSON.parse(raw);

    // { messageType: 'joinRoom', roomId }
    if (data.messageType === "joinRoom") {
      const room = rooms.get(data.roomId);

      if (!room) {
        console.log(`Attempt to join invalid room: ${data.roomId}`);
        sock.send(
          JSON.stringify({
            error: "Invalid room",
          })
        );
        return;
      }

      if (!room.player1.sock) {
        room.player1.sock = sock;
        sock.send(
          JSON.stringify({
            messageType: "joined",
            playerId: room.player1.id,
            color: room.player1.color,
            boardState: room.boardState,
          })
        )
        console.log("Player 1 joined " + data.roomId);
      } else if (room.player1.sock) {
        room.player2.sock = sock;

        sock.send(
          JSON.stringify({
            messageType: "joined",
            playerId: room.player2.id,
            color: room.player2.color,
            boardState: room.boardState,
          })
        )
        console.log("Player 2 joined room " + data.roomId);
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
      // console.log("received play: " + JSON.stringify(data));
      const room = rooms.get(data.roomId);

      if (!room) {
        console.error(`Invalid play. Room ${data.roomId} does not exist`);
        return;
      }

      // If not your turn - reject play
      if (room.currentTurn !== data.sender) {
        sock.send(
          JSON.stringify({
            error: "Not your turn",
            boardState: room.boardState, // TODO not efficient
          })
        );
        return;
      }

      // TODO how can we send individual plays instead?
      room.boardState = data.move;

      // Flip turn
      if (data.sender == room.player1.id) {
        room.currentTurn = room.player2.id;
      } else if (data.sender == room.player2.id) {
        room.currentTurn = room.player1.id;
      } else {
        console.log(`Unknown player: ${data.sender}`);
        return;
      }

      console.log(`Now player ${room.currentTurn}'s turn`)

      // Send play to opposite player
      if (data.sender === room.player1.id) {
        sockSend(room.player2, {
            messageType: "play",
            playerId: room.player2.id,
            color: room.player2.color,
            boardState: data.move,
        })
      } else if (data.sender == room.player2.id) {
        sockSend(room.player1, {
          messageType: "play",
          playerId: room.player1.id,
          color: room.player1.color,
          boardState: data.move,
        })
      } else {
        console.log(`Unknown sender: ${data.sender}`);
        sock.send(
          JSON.stringify({
            error: "Who are you??",
          })
        );
      }
    }
  });
});

function sockSend(player, message) {
  if (!player) {
    console.error("Undefined player received. Typo somewhere?")
    return; // TODO should crash
  }

  if (!player.sock) {
    console.error(`${player.id}'s socket not connected. Can't send message: ${message}`)
    return
  }

  player.sock.send(
    JSON.stringify(message)
  )
}

// Start the combo server
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
