import React, { useRef, useEffect, useState } from "react"
import { gameLoop } from "../utils/gameLoop"
import { useParams } from "react-router-dom"
import { config } from "../config"
import "./Game.css"

const serverUrl = "ws://localhost:8081/gomr"

const Game = () => {
  const canvasRef = useRef(null)
  const canvasWidth = config.numCells * config.cellSize + config.gutter
  const canvasHeight = config.numCells * config.cellSize + config.gutter

  //  const [board, setBoard] = useState(".".repeat(Math.pow(config.numCells, 2)))
  const board = useRef(".".repeat(Math.pow(config.numCells, 2)))
  const color = useRef("")
  const playerId = useRef("player1")

  // Init the game loop
  useEffect(() => {
    gameLoop(canvasRef, board, color, sendMove)
  })

  let { roomId } = useParams()
  const ws = new WebSocket(serverUrl)

  // sendMove([x, y, color])
  // modifying temporarily to send the whole board state back and forth
  const sendMove = (move) => {
    ws.send(
      JSON.stringify({
        messageType: "play",
        roomId: roomId,
        move,
        sender: playerId.current,
      })
    )
  }

  useEffect(() => {
    ws.onopen = () => ws.send(JSON.stringify({ messageType: "joinRoom", roomId: roomId }))

    ws.onmessage = (message) => {
      console.log(JSON.stringify(JSON.parse(message.data)))
      if (typeof message.data === "string") {
        const raw = JSON.parse(message.data)
        // setBoard(raw.boardState)
        board.current = raw.boardState
        color.current = raw.color
        playerId.current = raw.playerId
        // setPlayerId(raw.playerId)
      } else {
        console.log("Could not understand socket message")
      }
    }
  })

  return (
    <div className="main">
      <canvas
        style={{ alignSelf: "flex-start" }}
        ref={canvasRef}
        id="canvas"
        width={canvasWidth}
        height={canvasHeight}
      />
    </div>
  )
}

export default Game
