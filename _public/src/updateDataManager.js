const updateData = async () => {
  while (true) {
    const updatedId = gameState.play.lastUpdatedId
    console.log("update - Id", updatedId);
    const data = await newUpdatesFetching(updatedId)
    console.log(data);

    gameState.play.lastUpdatedId = data.lastId;

    gameState.game.setBoard(data.board);
    gameState.game.setTurn(data.turn);
    console.log(gameState.play.color);
  }
}