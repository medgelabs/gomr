const drawBoard = (canvasRef, state) => {
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
}

const drawStone = (canvasRef, xCoord, yCoord, color, state) => {
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

export { drawStone, drawBoard }
