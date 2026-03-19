
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
