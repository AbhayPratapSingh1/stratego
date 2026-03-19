export const renderBoard = () => {
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
    }
  }
};


const PIECE_COLOR_MAP = {
  "W": "water",
  "R": "red",
  "B": "blue",
  "X": "empty",
}

const setBoardBox = (gameState, box, value, pieceColor, row) => {

  const classToAdd = PIECE_COLOR_MAP[pieceColor]

  box.textContent = value === 0 ? " " : value;
  box.classList.add(classToAdd);

  box.dataset.notPlaceAble = pieceColor === gameState.selfColor;
  if (gameState.state === "placement") {
    box.dataset.notPlaceAble = pieceColor === "W" || row < 5 ? "true" : "false";
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