
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

const renderBoard = (board, h, w) => {
  const sizeX = width / w;
  const sizeY = height / h;
  const matrix = board

  push()
  for (let c = 0; c < w; c++) {
    push()
    for (let r = 0; r < h; r++) {
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
