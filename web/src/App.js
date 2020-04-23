import React, { useEffect, useRef } from "react"

import Header from "./header/Header"
import { gameLoop } from "./gameLoop"
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

  const canvasWidth = state.numCells * state.cellSize + state.gutter
  const canvasHeight = state.numCells * state.cellSize + state.gutter

  return (
    <div>
      <Header />
      <main style={{ display: "flex", justifyContent: "center" }}>
        <canvas ref={canvasRef} id="canvas" width={canvasWidth} height={canvasHeight}></canvas>
      </main>
    </div>
  )
}

export default App
