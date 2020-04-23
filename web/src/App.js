import React, { useState, useEffect, useRef } from "react"

import Header from "./header/Header"
import "./App.css"

const App = () => {
  useEffect(() => {
    updateCanvas()
    canvasRef.current.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect()
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top

      const xCoord = Math.round((x - state.padding) / state.cellSize)
      const yCoord = Math.round((y - state.padding) / state.cellSize)

      canvasRef.current.getContext("2d").clearRect(0, 0, canvasWidth, canvasHeight)
      updateCanvas()
      drawStone(xCoord, yCoord, "rgba(255, 255, 255, 0.5)")
    })
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

  /**
   * Places a stone at the specified grid coordinate. These coordinates
   * would be the index of the intersection that you want to place the stone
   * at *not* the pixel coordinates.
   *
   * The grid system has the origin at the top left of the board. Positive x
   * is to the right and positive y is down.
   *
   * @param {Number} xCoord the x coord to place the stone at
   * @param {Number} yCoord the y coord to place the stone at
   * @param {String} color the string value for the color of the stone
   */
  const drawStone = (xCoord, yCoord, color) => {
    // translate to board intersections
    const x = xCoord * state.cellSize + state.padding
    const y = yCoord * state.cellSize + state.padding

    // get the canvas ref
    const ctx = canvasRef.current.getContext("2d")
    ctx.beginPath()

    // move to the location where the arc will start to be drawn
    // you have to add the radius here because it moves the canvas
    // cursor to the middle of the circle otherwise and you get strange
    // looking white stones.
    ctx.moveTo(x + state.stoneRadius, y)

    // draw the arc
    ctx.arc(x, y, state.stoneRadius, 0, 2 * Math.PI, false)

    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke()
  }

  const updateCanvas = () => {
    const ctx = canvasRef.current.getContext("2d")
    const canvas = canvasRef.current

    ctx.fillStyle = "#f3b16c"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.beginPath()
    const bw = state.numCells * state.cellSize
    const bh = state.numCells * state.cellSize
    const p = state.padding
    const cellSize = state.cellSize

    for (var x = 0; x <= bw; x += cellSize) {
      ctx.moveTo(0.5 + x + p, p)
      ctx.lineTo(0.5 + x + p, bh + p)
    }

    for (var x = 0; x <= bh; x += cellSize) {
      ctx.moveTo(p, 0.5 + x + p)
      ctx.lineTo(bw + p, 0.5 + x + p)
    }
    ctx.stroke()

    drawStone(4, 7, "white")
    drawStone(17, 3, "white")
    drawStone(2, 16, "white")
    drawStone(5, 8, "black")
    drawStone(11, 19, "black")
    drawStone(14, 18, "black")

    canvas.addEventListener("mousedown", (event) => {
      const rect = canvas.getBoundingClientRect()
      let x = event.clientX - rect.left
      let y = event.clientY - rect.top

      const xCoord = (x - state.padding) / state.cellSize
      const yCoord = (y - state.padding) / state.cellSize
      drawStone(Math.round(xCoord), Math.round(yCoord), "white")
    })
  }

  return (
    <div>
      <Header />
      <main>
        <canvas ref={canvasRef} id="canvas" width={canvasWidth} height={canvasHeight}></canvas>
      </main>
    </div>
  )
}

export default App
