import { config } from "../config"

const numCells = config.numCells

/*
 * Convert cartesian coordinates into flattened coordinates
 *
 * @param(index) {Array} the cartesian coordinate pair represented as an array.
 * @return {Number} the flattened index
 */
export const flatten = (index) => numCells * index[0] + index[1]

/*
 * Convert flattened coordinates into cartesian ones
 * @param(flatCoords) {Number} the flattened coordinates to convert to
 *      cartesian
 * @return {Array} a coordinate pair represented as an array
 */
export const unflatten = (flatCoords) => [Math.floor(flatCoords / numCells), flatCoords % numCells]

/*
 * Tell if an index is on the board by it's cartesian coordinates
 * @param(index) {Array} the cartesian coordinates represented as an array
 * @return {Boolean} true if the coordinates are on the board, false if not
 */
const isOnBoard = (index) =>
  index[0] % numCells === index[0] &&
  index[1] % numCells === index[1] &&
  Math.abs(index[0]) === index[0] &&
  Math.abs(index[1]) === index[1]

/*
 * Given a flattened coordinate, this will return an array of flattened
 * coordinates representing all of the possible neighbors that the
 * point could have.
 *
 * @param(flattenedCoords) {Number} the flattened coordinate to the valid
 * neighbors of.
 * @return {Array} the list of flattened coordinates of valid neighbors
 */
const getValidNeighbors = (flattenedCoords) => {
  const coords = unflatten(flattenedCoords)
  const possibleNeighbors = [
    [coords[0] + 1, coords[1]],
    [coords[0] - 1, coords[1]],
    [coords[0], coords[1] + 1],
    [coords[0], coords[1] - 1],
  ]

  // worth noting that we could easily cache these results in
  // an array for quick access.
  return possibleNeighbors.filter(isOnBoard).map(flatten)
}

/*
 * Finds two things:
 *   The longest chain of color starting from flattenedCoords and using the
 *   color found there.
 *
 *   The set of all colors reached (@reached). This is important for
 *   determining if we need to capture any stones. As an example, if we
 *   determine that the only color in the frontier is the opposing teams
 *   color then we know that we will need to capture all of the stones
 *   in the chain that we just found.
 *
 */
const findReached = (board, flattenedCoords) => {
  const color = board[flattenedCoords]
  const chain = new Set([flattenedCoords])
  const reached = new Set()
  const frontier = [flattenedCoords]

  while (frontier.length !== 0) {
    const currentFlatCoords = frontier.pop()
    chain.add(currentFlatCoords)

    // for each neigbor of the location under inspection
    // fetch all of it's valid neighbors.
    getValidNeighbors(currentFlatCoords).forEach((flatNeighbor) => {
      // if the neighbor is the same color and we haven't already
      // visited it, add it to the frontier (or stack of neighbors to
      // visit)
      if (board[flatNeighbor] === color && !chain.has(flatNeighbor)) {
        frontier.push(flatNeighbor)

        // if the neighbor is a different color, add the color to the set
        // of reached colors.
      } else if (board[flatNeighbor] !== color) {
        reached.add(flatNeighbor)
      }
    })
  }

  // return the chain, and the set of all colors reached.
  return {
    chain,
    reached,
  }
}

/*
 * places a stone on the board by modifying the character that is there
 *
 * @param(color) {String} the color to place at the flatCoord
 * @param(board) {String} the board on which to place the stone
 * @param(flatCoord) {Number} the index to place the stone at
 * @return {String} the board with the new stone placed at the specified
 *      location
 */
const placeStone = (color, board, flatCoord) => {
  const newBoard = board.split("")
  newBoard[flatCoord] = color
  return newBoard.join("")
}

/*
 * Consumes a color, a board, and a list of flattened coordinates
 * and places the specified color at each of the locations specified
 * in the array.
 *
 * @param(color) {String} the color to set at each location
 * @param(board) {String} the board on which to set all of the colors
 * @param(stones) {Array} the list of flattened coordinates to place stones at
 */
const bulkPlaceStones = (color, board, stones) => {
  const newBoard = board.split("")
  stones.forEach((flatStone) => {
    newBoard[flatStone] = color
  })

  return newBoard.join("")
}

/*
 * Determines if it is necessary to capture stones by checking if
 * all of the neighbors on the outer boundary of the chain are the opposing
 * teams color. If they are the opposing teams color then a bulk place is
 * performed to replace the chain with empty space.
 *
 * @param(board) {String} the board to perform the capture algo on.
 * @param(flatCoord) {Number} the starting point to check if any captures need
 *      to happen.
 * @return {String} a string representing the new board, and a set
 *      containing the list of coordinates that were captured <if any>.
 */
const captureStones = (board, flatCoord) => {
  const { chain, reached } = findReached(board, flatCoord)

  const filtered = Array.from(reached).filter((flatReached) => board[flatReached] === ".")

  if (filtered.length === 0) {
    board = bulkPlaceStones(".", board, chain)
    return board
  }
  return board
}

/*
 * function that places a stone at the provideded flattened coordinate
 * and then makes any necessary captures
 *
 * @param(board) {String} the board on which to play the move
 * @param(flatCoord) {String} the coordinate to attempt to place a stone
 * @param(color) {String} the color of the stone to attempt to place
 * @return {String} the updated board after the move has been played
 */
export const playMove = (board, flatCoord, color) => {
  // the client should flatten the coordinates.
  if (board[flatCoord] !== ".") {
    throw new Error("invalid move, cannot play on top of stone")
  }

  board = placeStone(color, board, flatCoord)

  const oppColor = color === "X" ? "O" : "X"
  const oppStones = []
  const myStones = []

  getValidNeighbors(flatCoord).forEach((flatNeighbor) => {
    if (board[flatNeighbor] === color) {
      myStones.push(flatNeighbor)
    } else if (board[flatNeighbor] === oppColor) {
      oppStones.push(flatNeighbor)
    }
  })

  oppStones.forEach((flatStone) => {
    board = captureStones(board, flatStone)
  })

  myStones.forEach((flatStone) => {
    board = captureStones(board, flatStone)
  })

  return board
}
