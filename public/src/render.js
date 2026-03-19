
export const renderBoard = () => {
  const board = document.querySelector("#board");
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {

      const box = document.createElement("div");
      box.id = `box-${row}-${col}`;
      box.classList.add("block");
      box.textContent = " ";
      box.dataset.y = row;
      box.dataset.x = col;
      board.append(box);
    }
  }
};


export const updateBoard = (gameState) => {
  const board = gameState.board
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const box = document.querySelector(`#box-${row}-${col}`);
      const detail = board[row][col]

      box.textContent = detail.value === 0 ? " " : detail.value;
      switch (detail.pieceColor) {
        case "W":
          box.classList.add("water");
          box.dataset.notPlaceAble = "true";
          break;

        case "R":
          box.classList.add("red");
          break
        case "B":
          box.classList.add("blue");
          break
        case "X":
          box.classList.add("empty");

          const isNotPlaceable = gameState.state === "placement" && row < 5
          box.dataset.notPlaceAble = `${isNotPlaceable}`;
          break
      }
    }
  }
}