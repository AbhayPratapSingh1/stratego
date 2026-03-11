
const renderBlock = (value, bg, sizeX, sizeY,) => {
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
      const bgColor = ICONS[bg] || bg
      renderBlock(value, bgColor, sizeX, sizeY)
      translate(sizeY, 0);
    }
    pop()
    translate(0, sizeY);
  }
  push()

}
