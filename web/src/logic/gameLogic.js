// import { config } from '../config';

const numCells = 19;

// initialize board to be all dots
var board = ".".repeat(Math.pow(numCells, 2));

/*
 * Convert cartesian coordinates into flattened coordinates
 *
 * @param(index) {Array} the cartesian coordinate pair represented as an array.
 * @return {Number} the flattened index
 */
const flatten = (index) => numCells * index[0] + index [1]

/*
 * Convert flattened coordinates into cartesian ones
 * @param(flatCoords) {Number} the flattened coordinates to convert to 
 *      cartesian
 * @return {Array} a coordinate pair represented as an array
 */
const unflatten = (flatCoords) => 
    [Math.floor(flatCoords / numCells), flatCoords % numCells]

/*
 * Tell if an index is on the board by it's cartesian coordinates
 * @param(index) {Array} the cartesian coordinates represented as an array
 * @return {Boolean} true if the coordinates are on the board, false if not
 */
const isOnBoard = (index) =>
    index[0] % numCells === index[0] 
    && index[1] % numCells === index[1]
    && Math.abs(index[0]) === index[0]
    && Math.abs(index[1]) === index[1]

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
    const coords = unflatten(flattenedCoords);
    const possibleNeighbors = [
        [coords[0] + 1, coords[1]],
        [coords[0] - 1, coords[1]],
        [coords[0], coords[1] + 1],
        [coords[0], coords[1] - 1]
    ];

    // worth noting that we could easily cache these results in
    // an array for quick access.
    return possibleNeighbors.filter(isOnBoard).map(flatten);
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
    const color = board[flattenedCoords];
    const chain = new Set([flattenedCoords]);
    const reached = new Set();
    const frontier = [flattenedCoords];
 
    while (frontier.length !== 0) {
        const currentFlatCoords = frontier.pop();
        chain.add(currentFlatCoords);

        // for each neigbor of the location under inspection
        // fetch all of it's valid neighbors. 
        getValidNeighbors(currentFlatCoords).forEach((flatNeighbor) => {

            // if the neighbor is the same color and we haven't already 
            // visited it, add it to the frontier (or stack of neighbors to
            // visit)
            if (board[flatNeighbor] === color && !(chain.has(flatNeighbor))) {
                frontier.push(flatNeighbor);

            // if the neighbor is a different color, add the color to the set
            // of reached colors.
            } else if (board[flatNeighbor] !== color) { 
                reached.add(flatNeighbor);
            }
        })
    }

    // return the chain, and the set of all colors reached.
    return {
        chain,
        reached
    }
}
