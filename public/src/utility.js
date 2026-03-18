const isNumber = (val) => /^\d+$/.test(val);

const clickedBox = (x, y) => {
  const sizeX = width / CONSTANTS.blocks;
  const sizeY = height / CONSTANTS.blocks;

  const posX = Math.floor(x / sizeX);
  const posY = Math.floor(y / sizeY);
  return { x: posX, y: posY }

}
