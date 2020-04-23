import { drawStone, drawBoard } from "./drawUtils"
import { config } from "./config"

const gameState = []
var isBlack = true

const gameLoop = (canvasRef) => {
  drawBoard(canvasRef, config)
  canvasRef.current.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    const xCoord = Math.round((x - config.padding) / config.cellSize)
    const yCoord = Math.round((y - config.padding) / config.cellSize)

    canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    const opacityBlack = "rgba(0, 0, 0, 0.5)"
    const opacityWhite = "rgba(255, 255, 255, 0.5)"

    drawBoard(canvasRef, config)
    drawStone(canvasRef, xCoord, yCoord, isBlack ? opacityBlack : opacityWhite, config)
    gameState.forEach((element) => {
      drawStone(canvasRef, element[0], element[1], element[2], config)
    })
  })

  canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    const xCoord = Math.round((x - config.padding) / config.cellSize)
    const yCoord = Math.round((y - config.padding) / config.cellSize)

    gameState.push([xCoord, yCoord, isBlack ? "black" : "white"])
    drawStone(canvasRef, xCoord, yCoord, isBlack ? "black" : "white", config)
    isBlack = !isBlack
  })
}

export { gameLoop }
