/// <reference types="p5/global"/>
// @ts-nocheck


const gameState = {
  game: null,
  selected: { x: -1, y: -1 }
}

function setup() {
  createCanvas(CONFIG.size, CONFIG.size);
  gameState.game = new Game(CONFIG.size);
  gameState.game.addPiece(5, { x: 3, y: 3 }, 1)
  gameState.game.addPiece(5, { x: 3, y: 2 }, 0)
}

const clickedBox = (x, y) => {
  const sizeX = width / CONSTANTS.blocks;
  const sizeY = height / CONSTANTS.blocks;

  const posX = Math.floor(x / sizeX);
  const posY = Math.floor(y / sizeY);
  return { x: posX, y: posY }

}


function mousePressed() {
  gameState.selected = clickedBox(mouseX, mouseY)
}

function mouseReleased() {
  const { x, y } = gameState.selected
  const { x: nx, y: ny } = clickedBox(mouseX, mouseY);

  const isPrevOccupied = gameState.game.isOccupied(x, y)
  const isNewPlaceOccupied = gameState.game.isOccupied(nx, ny);
  
  if (isPrevOccupied && !isNewPlaceOccupied) {
    gameState.game.updatePos({ x, y }, { x: nx, y: ny })
  }
}

function draw() {

  background(220)
  fill(1)
  const board = gameState.game.getBoard()
  renderBoard(board)
  // noLoop()
}  
