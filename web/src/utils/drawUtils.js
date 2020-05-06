import { config } from "../config"

const drawBoard = (canvasRef) => {
  const ctx = canvasRef.current.getContext("2d")
  const canvas = canvasRef.current

  ctx.fillStyle = "#f3b16c"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.beginPath()
  const bw = config.numCells * config.cellSize
  const bh = config.numCells * config.cellSize
  const p = config.padding
  const cellSize = config.cellSize

  for (var x = 0; x <= bw; x += cellSize) {
    ctx.moveTo(config.xOffset + x + p, config.yOffset + p)
    ctx.lineTo(config.xOffset + x + p, config.yOffset + bh + p)
  }

  for (var x = 0; x <= bh; x += cellSize) {
    ctx.moveTo(config.xOffset + p, config.yOffset + x + p)
    ctx.lineTo(config.xOffset + bw + p, config.yOffset + x + p)
  }
  ctx.stroke()
}

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
const drawStone = (canvasRef, xCoord, yCoord, color) => {
  // translate to board intersections
  const x = xCoord * config.cellSize + config.padding
  const y = yCoord * config.cellSize + config.padding

  // get the canvas ref
  const ctx = canvasRef.current.getContext("2d")
  ctx.beginPath()

  // move to the location where the arc will start to be drawn
  // you have to add the radius here because it moves the canvas
  // cursor to the middle of the circle otherwise and you get strange
  // looking white stones.
  ctx.moveTo(config.xOffset + x + config.stoneRadius, config.yOffset + y)

  // draw the arc
  ctx.arc(config.xOffset + x, config.yOffset + y, config.stoneRadius, 0, 2 * Math.PI, false)

  ctx.fillStyle = color
  ctx.fill()
  ctx.stroke()
}

export { drawStone, drawBoard }
