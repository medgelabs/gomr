import { drawStone, drawBoard } from "./drawUtils"
import { config } from "./config"

const gameLoop = (canvasRef, gameState, color, sendMove) => {
  drawBoard(canvasRef, config)
  canvasRef.current.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    const xCoord = Math.round((x - config.padding) / config.cellSize)
    const yCoord = Math.round((y - config.padding) / config.cellSize)

    const opacityBlack = "rgba(0, 0, 0, 0.5)"
    const opacityWhite = "rgba(255, 255, 255, 0.5)"

    drawBoard(canvasRef, config)
    drawStone(canvasRef, xCoord, yCoord, color.current === "black" ? opacityBlack : opacityWhite, config)
    gameState.current.forEach((element) => {
      drawStone(canvasRef, element[0], element[1], element[2], config)
    })
  })

  canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    const xCoord = Math.round((x - config.padding) / config.cellSize)
    const yCoord = Math.round((y - config.padding) / config.cellSize)

    gameState.current.push([xCoord, yCoord, color.current])
    sendMove([xCoord, yCoord])
    drawStone(canvasRef, xCoord, yCoord, color.current, config)
  })
}

export { gameLoop }
