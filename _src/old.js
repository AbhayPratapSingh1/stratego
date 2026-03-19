

// const CONSTANTS = {
//   blocks: 10
// }
// const game = new Game()
// const piecesOne = "123456".split("").map((_, i) => ({ x: i, y: 0, value: i + 1 }));
// const piecesTwo = "123456".split("").map((_, i) => ({ x: i, y: 9, value: i + 1 }));
// game.addPlayerPiece(piecesOne, "R");
// game.addPlayerPiece(piecesTwo, "G");


// export class Game {
//   constructor(size) {
//     this.size = size
//     this.blockSize = this.size / CONSTANTS.blocks

//     this.waterPos = [
//       { x: 2, y: 4 },
//       { x: 3, y: 4 },
//       { x: 2, y: 5 },
//       { x: 3, y: 5 },

//       { x: 6, y: 4 },
//       { x: 7, y: 4 },
//       { x: 6, y: 5 },
//       { x: 7, y: 5 },
//     ]

//     this.matrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ value: 0, bg: " " })))
//     this.addWater(this.matrix);
//   }

//   addWater(matrix) {
//     this.waterPos.forEach(({ x, y }) => {
//       matrix[y][x] = { bg: "W", value: 0 }
//     })

//     return matrix
//   }

//   addPlayerPiece(pieces, playerColor) {
//     for (const { x, y, value } of pieces) {
//       this.matrix[y][x] = { bg: playerColor, value }
//     }
//   }

//   getBoard() {
//     return this.matrix.map(row => row.map((obj) => ({ ...obj })))
//   }

//   addPiece(value, pos, player) {
//     let bg = "R";
//     if (player === 1) {
//       bg = "G";
//     }
//     this.matrix[pos.y][pos.x] = { bg, value }
//     return this
//   }

//   updatePos({ x, y }, newPos) {
//     const soilder = this.matrix[y][x];
//     this.matrix[newPos.y][newPos.x] = soilder
//     this.matrix[y][x] = { value: 0, bg: " " }
//     return this
//   }

//   isOccupied(x, y) {
//     if (this.waterPos.some(pos => pos.x === x && pos.y === y)) {
//       return true
//     }

//     const value = this.matrix[y][x].value
//     return isNumber(value) && value !== 0
//   }
// }

export class Game {
  constructor(roomId, player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.roomId = roomId;
    this.listners = {};
    this.lastId = 0
  }
  getBoard() {
    return this.matrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ value: 0, bg: " " })))
  }

  getTurnOf() {
    return this.player1.id
  }

  addListner(id, resolver) {
    this.listners[id] = resolver;
  }

  removeListner(id) {
    delete this.listners[id];
  }

  getData() {
    return this.getBoard();
  }

  updateGame() {
    this.lastId++;
    for (const resolver of this.listners) {
      resolver(this.getData())
    }
  }
} 