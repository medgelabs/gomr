import { drawStone, drawBoard } from "./drawUtils"
import { config } from "../config"

const gameLoop = (canvasRef, gameState, color, sendMove) => {
  console.log(gameState)
  drawBoard(canvasRef)
  gameState.forEach((element) => {
    drawStone(canvasRef, element[0], element[1], element[2])
  })
  canvasRef.current.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    const xCoord = Math.round((x - config.padding - config.xOffset) / config.cellSize)
    const yCoord = Math.round((y - config.padding - config.yOffset) / config.cellSize)
    const opacityBlack = "rgba(0, 0, 0, 0.5)"
    const opacityWhite = "rgba(255, 255, 255, 0.5)"

    drawBoard(canvasRef)
    drawStone(canvasRef, xCoord, yCoord, color === "black" ? opacityBlack : opacityWhite)
    gameState.forEach((element) => {
      drawStone(canvasRef, element[0], element[1], element[2])
    })
  })

  canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    const xCoord = Math.round((x - config.padding - config.xOffset) / config.cellSize)
    const yCoord = Math.round((y - config.padding - config.yOffset) / config.cellSize)

    gameState.push([xCoord, yCoord, color])
    sendMove(gameState)
    drawStone(canvasRef, xCoord, yCoord, color)
  })
}

export { gameLoop }
