import React from "react"

import Header from "./header/Header"
import "./App.css"

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      numCells: 19,
      cellSize: 40,
      padding: 10,
      gutter: 50, // gutter around grid
      stoneRadius: 15,
    }

    // calculate total grid size
    this.canvasWidth = this.state.numCells * this.state.cellSize + this.state.gutter
    this.canvasHeight = this.state.numCells * this.state.cellSize + this.state.gutter

    this.updateCanvas = this.updateCanvas.bind(this)
  }

  componentDidMount() {
    this.updateCanvas()
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext("2d")
    const bw = this.state.numCells * this.state.cellSize
    const bh = this.state.numCells * this.state.cellSize
    const p = this.state.padding
    const cellSize = this.state.cellSize

    for (var x = 0; x <= bw; x += cellSize) {
      ctx.moveTo(0.5 + x + p, p)
      ctx.lineTo(0.5 + x + p, bh + p)
    }

    for (var x = 0; x <= bh; x += cellSize) {
      ctx.moveTo(p, 0.5 + x + p)
      ctx.lineTo(bw + p, 0.5 + x + p)
    }

    ctx.strokeStyle = "black"
    ctx.stroke()
    this.drawStone(30, 40, "black")
  }

  render() {
    return (
      <div>
        <Header />
        <main>
          <canvas ref="canvas" id="canvas" width={this.canvasWidth} height={this.canvasHeight}></canvas>
        </main>
      </div>
    )
  }

  drawStone(xCoord, yCoord, color) {
    const ctx = this.refs.canvas.getContext("2d")
    ctx.moveTo(xCoord + this.state.stoneRadius, yCoord)
    ctx.arc(xCoord, yCoord, this.state.stoneRadius, 0, 2 * Math.PI, false)

    ctx.fillStyle = color
    ctx.fill()
    ctx.stroke()
  }
}

export default App
