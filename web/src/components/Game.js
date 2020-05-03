import React, { useEffect, useRef } from "react"

import { gameLoop } from "../utils/gameLoop"
import { config } from "../config"
import "./Game.css"

const Game = () => {
  const ws = new WebSocket("ws://localhost:8081")
  const color = useRef("black")

  const gameState = useRef([])

  const sendMove = (move) => {
    ws.send(Uint8Array.from(move))
  }

  ws.onmessage = (message) => {
    if (typeof message.data === "string") {
      color.current = message.data
    } else {
      message.data.arrayBuffer().then((buffer) => {
        const dataBuffer = new Uint8Array(buffer)
        gameState.current.push([dataBuffer[0], dataBuffer[1], color.current === "black" ? "white" : "black"])
      })
    }
  }
  useEffect(() => {
    gameLoop(canvasRef, gameState, color, sendMove)
  })

  const canvasRef = useRef(null)

  const canvasWidth = config.numCells * config.cellSize + config.gutter
  const canvasHeight = config.numCells * config.cellSize + config.gutter

  return (
    <div className="main">
      <canvas
        style={{ alignSelf: "flex-start" }}
        ref={canvasRef}
        id="canvas"
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
    </div>
  )
}

export default Game
