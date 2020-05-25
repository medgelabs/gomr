import { drawStone, drawBoard } from "./drawUtils"
import { config } from "../config"
import { unflatten, flatten, playMove } from "../logic/gameLogic"

export const gameLoop = (canvasRef, gameState, color, sendMove) => {
  console.log(gameState)

  drawBoard(canvasRef)

  console.log("gamestate length " + gameState.length)
  for (var i = 0; i < gameState.length; i += 1) {
    if (gameState[i] !== ".") {
      const coords = unflatten(i)
      drawStone(canvasRef, coords[0], coords[1], "black")
    }
  }

  canvasRef.current.addEventListener("mousemove", (event) => {
    const rect = canvasRef.current.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    const xCoord = Math.round((x - config.padding - config.xOffset) / config.cellSize)
    const yCoord = Math.round((y - config.padding - config.yOffset) / config.cellSize)
    const opacityBlack = "rgba(0, 0, 0, 0.5)"
    const opacityWhite = "rgba(255, 255, 255, 0.5)"

    drawBoard(canvasRef)
    drawStone(canvasRef, xCoord, yCoord, color === "black" ? opacityBlack : opacityWhite)
    for (var i = 0; i < gameState.length; i += 1) {
      if (gameState[i] !== ".") {
        console.log(gameState[i])
        const coords = unflatten(i)
        drawStone(canvasRef, coords[0], coords[1], "black")
      }
    }
  })

  canvasRef.current.addEventListener("mousedown", (event) => {
    const rect = canvasRef.current.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    const xCoord = Math.round((x - config.padding - config.xOffset) / config.cellSize)
    const yCoord = Math.round((y - config.padding - config.yOffset) / config.cellSize)

    const move = [xCoord, yCoord, color]
    console.log(move)
    console.log(playMove(gameState, flatten([xCoord, yCoord]), "X"))
    sendMove(move)
    drawStone(canvasRef, xCoord, yCoord, color)
  })
}
