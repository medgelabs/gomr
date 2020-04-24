import React, { useEffect, useRef } from "react"

import Header from "./header/Header"
import { gameLoop } from "./gameLoop"
import { config } from "./config"
import "./App.css"

const App = () => {
  useEffect(() => {
    gameLoop(canvasRef)
  })

  const canvasRef = useRef(null)

  const state = {
    numCells: 19,
    cellSize: 40,
    padding: 10,
    gutter: 50, // gutter around grid
    stoneRadius: 15,
  }

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

export default App
