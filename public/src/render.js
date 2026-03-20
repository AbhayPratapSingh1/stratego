import { PIECE_COLOR_MAP } from "./utilities.js";

export const renderBoard = (gameState) => {
  const board = document.querySelector("#board");
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const box = document.createElement("div");
      box.id = `box-${row}-${col}`;
      box.classList.add("block");
      box.textContent = " ";
      box.dataset.y = row.toString();
      box.dataset.x = col.toString();
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
  const color = box.dataset.color

  if (color) {
    const prevClass = PIECE_COLOR_MAP[box.dataset.color]
    box.classList.remove(prevClass);
  }

  const classToAdd = PIECE_COLOR_MAP[pieceColor]

  box.textContent = value === 0 ? " " : value;
  box.classList.add(classToAdd);


  const boxDetail = gameState.boardData[box.id]
  boxDetail.value = value;
  boxDetail.color = pieceColor;
  boxDetail.placeAble = pieceColor !== gameState.selfColor && pieceColor !== "W";

  box.dataset.value = value;
  box.dataset.color = pieceColor;

  box.dataset.placeAble = pieceColor !== gameState.selfColor && pieceColor !== "W";

  if (gameState.state === "placement") {
    box.dataset.placeAble = pieceColor === "W" || row < 5 ? "true" : "false";
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