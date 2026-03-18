

function mousePressed() {
  gameState.selected = clickedBox(mouseX, mouseY)
}

function mouseReleased() {
  if (!gameState.isTurn || gameState.isLoading) {
    console.log("Waiting...");
    return;
  }

  const { x, y } = gameState.selected
  const newPos = clickedBox(mouseX, mouseY);
  const { x: nx, y: ny } = newPos;

  const isPrevOccupied = gameState.game.isOccupied(x, y)
  const isWater = gameState.game.isWater(x, y)
  const isNewPlaceOccupied = gameState.game.isOccupied(nx, ny);
  const isMoveablePiece = gameState.game.isValidPieceToMove(x, y);
  if (isPrevOccupied && !isNewPlaceOccupied && !isWater) {
    if (isMoveablePiece) {
      gameState.isTurn = false
      gameState.game.updatePos({ x, y }, newPos)
      sendAction(gameState.selected, newPos)
      matrixHandler.save([]);
    }
    else {
      console.log("Invalid Peice SEleecion");
    }

  }
}