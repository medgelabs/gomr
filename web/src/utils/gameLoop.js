import { drawStone, drawBoard, drawStones } from "./drawUtils"
import { config } from "../config"
import { unflatten, flatten, playMove } from "../logic/gameLogic"

export const gameLoop = (canvasRef, board, color, sendMove) => {
  drawBoard(canvasRef)

  drawStones(canvasRef, board)

  canvasRef.current.addEventListener("mousemove", (event) => {
    const rect = canvasRef.current.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    const xCoord = Math.round((x - config.padding - config.xOffset) / config.cellSize)
    const yCoord = Math.round((y - config.padding - config.yOffset) / config.cellSize)
    const opacityBlack = "rgba(0, 0, 0, 0.5)"
    const opacityWhite = "rgba(255, 255, 255, 0.5)"

    drawBoard(canvasRef)
    drawStone(canvasRef, xCoord, yCoord, color.current === "X" ? opacityBlack : opacityWhite)
    drawStones(canvasRef, board)
  })

  canvasRef.current.addEventListener("mousedown", (event) => {
    const rect = canvasRef.current.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    const xCoord = Math.round((x - config.padding - config.xOffset) / config.cellSize)
    const yCoord = Math.round((y - config.padding - config.yOffset) / config.cellSize)

    const move = [xCoord, yCoord, color.current]
    console.log(move)
    board.current = playMove(board.current, flatten([xCoord, yCoord]), color.current)
    sendMove(board.current)
    drawStone(canvasRef, xCoord, yCoord, color.current === "X" ? "black" : "white")
  })
}
