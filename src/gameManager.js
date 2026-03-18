export const handlePossibleGames = (c) => {
  const listners = c.get("listners")

  if (listners.length >= 2) {
    const [player1, player2] = listners.splice(0, 2);

    const data = { data: "123" }
    player1.resolveWaiting({ data: "123" })
    player1.resolveWaiting()

    delete player1.resolveWaiting;
    delete player2.resolveWaiting;

    return { isPlayerGotPair: true, data }
  }
  return { isPlayerGotPair: false, data: {} }
}
