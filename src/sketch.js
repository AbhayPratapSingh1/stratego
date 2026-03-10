/// <reference types="p5/global"/>
// @ts-nocheck

const CONFIG = {
  size: 800
}

const CONSTANTS = {
  blocks: 10
}


const icons = {
  " ": "grey",
  "W": "blue",
  "R": "red",
  "G": "green"
}

const isNumber = (val) => /^\d+$/.test(val)

const renderBlock = (value, bg, sizeX, sizeY,) => {
  console.log(bg, value);

  fill(bg)
  rect(0, 0, sizeX, sizeY)
  if (isNumber(value) && +value > 0) {
    push();
    translate(sizeX / 2, sizeY / 2)
    textAlign("center", "center")
    textSize(24);
    fill(1)
    text(value, 0, 0)
    pop()
    return
  }
}

const renderBoard = (board) => {
  const sizeX = width / board.width;
  const sizeY = height / board.height;
  const matrix = board.matrix

  push()
  for (let c = 0; c < board.width; c++) {
    push()
    for (let r = 0; r < board.height; r++) {
      const { bg, value } = matrix[c][r]
      const bgColor = icons[bg] || [0, 0, 0, 0]
      renderBlock(value, bgColor, sizeX, sizeY)
      translate(sizeY, 0);
    }
    pop()
    translate(0, sizeY);
  }
  push()

}

class Game {
  constructor(size) {
    this.size = size
    this.blockSize = this.size / CONSTANTS.blocks
    this.waterPos = [
      {
        x: 2, y: 4, sizeX: 2, sizeY: 2,
      }, {
        x: 6, y: 4, sizeX: 2, sizeY: 2,
      }
    ]
  }

  addWater(matrix) {
    for (const { x, y, sizeX, sizeY } of this.waterPos) {
      for (let i = x; i < x + sizeX; i++) {
        for (let j = y; j < y + sizeY; j++) {
          matrix[j][i] = { bg: "W", value: 0 }
        }
      }
    }

    matrix[0][0] = { value: 10, bg: [0, 255, 0, 50] }
    return matrix
  }

  getBoard() {
    const matrix = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ value: 0, bg: " " })))
    return { matrix: this.addWater(matrix), height: 10, width: 10 };
  }

  drawWater() {
    const size = this.blockSize;
    push()
    for (const { x, y } of this.waterPositions) {
      rect()
    }
  }

}

const drawGrid = () => {

}

const gameState = {
  game: null
}
function setup() {
  createCanvas(CONFIG.size, CONFIG.size);
  gameState.game = new Game(CONFIG.size);
}

function draw() {
  background(220)

  fill(1)

  const board = gameState.game.getBoard()
  renderBoard(board)
  noLoop()
}