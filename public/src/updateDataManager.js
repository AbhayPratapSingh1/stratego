const updateData = async () => {
  while (true) {
    const updatedId = gameState.play.lastUpdatedId
    console.log("id befer", updatedId);

    const data = await newUpdatesFetching(updatedId)
    console.log(data);
    gameState.play.lastUpdatedId = data.lastId;
  }
}