import React, { useRef } from "react"
import { gameLoop } from "../utils/gameLoop"
import { useHistory } from "react-router-dom"
import queryString from "query-string"
import { config } from "../config"
import "./Game.css"

const Game = () => {
  const history = useHistory()
  const queryMap = queryString.parse(history.location.search)
  const ws = new WebSocket(queryMap.serverUrl)

  ws.onopen = () => ws.send(JSON.stringify({ messageType: "joinRoom", roomId: queryMap.roomId }))

  const sendMove = (boardState) => {
    ws.send(
      JSON.stringify({
        messageType: "play",
        roomId: queryMap.roomId,
        boardState,
        sender: queryMap.playerId,
      })
    )
  }

  ws.onmessage = (message) => {
    if (typeof message.data === "string") {
      const raw = JSON.parse(message.data)
      gameLoop(canvasRef, raw.boardState, raw.color, sendMove)
    } else {
      console.log("Could not understand socket message")
    }
  }

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
