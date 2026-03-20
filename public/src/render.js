import { PIECE_COLOR_MAP } from "./utilities.js";

export const renderBoard = (gameState) => {
  const board = document.querySelector("#board");
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const box = document.createElement("div");
      box.id = `box-${row}-${col}`;
      box.classList.add("block");
      box.textContent = " ";
      board.append(box);
      gameState.boardData[box.id] = {
        x: col,
        y: row,
        value: " ",
      }
    }
  }
};



const setBoardBox = (gameState, box, value, pieceColor, row) => {

  const boxDetail = gameState.boardData[box.id]
  const color = boxDetail.color
  if (color) {
    const prevClass = PIECE_COLOR_MAP[color]
    box.classList.remove(prevClass);
  }

  const classToAdd = PIECE_COLOR_MAP[pieceColor]

  box.textContent = value === 0 ? " " : value;
  box.classList.add(classToAdd);


  boxDetail.value = value;
  boxDetail.color = pieceColor;
  boxDetail.placeAble = pieceColor !== gameState.selfColor && pieceColor !== "W";

  if (gameState.state === "placement") {
    boxDetail.placeAble = pieceColor === "W" || row > 4;
  }
}

export const updateBoard = (gameState) => {
  const board = gameState.board
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const box = document.querySelector(`#box-${row}-${col}`);
      const { value, pieceColor } = board[row][col];
      setBoardBox(gameState, box, value, pieceColor, row);
    }
  }
}