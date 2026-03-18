
class Game {
  constructor(size) {
    this.size = size
    this.blockSize = this.size / CONSTANTS.blocks
    this.waterPos = [
      { x: 2, y: 4 },
      { x: 3, y: 4 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },

      { x: 6, y: 4 },
      { x: 7, y: 4 },
      { x: 6, y: 5 },
      { x: 7, y: 5 },
    ]
    this.matrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ value: 0, bg: " " })))
    this.addWater();
    this.color = " ";
  }

  storeMatrix(matrix) {
    this.matrix = matrix
  }

  addWater() {
    this.waterPos.forEach(({ x, y }) => {
      this.matrix[y][x] = { bg: "W", value: 0 }
    })

    return this
  }

  getBoard() {
    return this.matrix;
  }

  addPiece(value, pos, player) {
    let bg = "R";
    if (player === 1) {
      bg = "G";
    }
    this.matrix[pos.y][pos.x] = { bg, value }
    return this
  }
  isValidPieceToMove(x, y) {
    return this.color === this.matrix[y][x].bg;
  }

  setRole(color) {
    this.color = color;
  }

  updatePos({ x, y }, newPos) {
    const soilder = this.matrix[y][x];
    this.matrix[newPos.y][newPos.x] = soilder
    this.matrix[y][x] = { value: 0, bg: " " }
    return this
  }

  isWater(x, y) {
    this.waterPos.some(pos => pos.x === x && pos.y === y)
  }

  isOccupied(x, y) {
    if (this.waterPos.some(pos => pos.x === x && pos.y === y)) {
      return true
    }
    const value = this.matrix[y][x].value
    return isNumber(value) && value !== 0
  }
}