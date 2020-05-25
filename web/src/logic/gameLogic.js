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

const getValidNeighbors;
