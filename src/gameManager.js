import { Game } from "./game.js";

const getNewRoomId = (c) => {
  const gameIdHanlder = c.get("gameIdHanlder");
  const gameId = gameIdHanlder.nextId();

  return gameId
}

const createRoom = (c, player1, player2) => {
  const roomId = getNewRoomId(c)
  const games = c.get("games");
  const game = new Game(roomId, player1, player2)
  games[roomId] = game;

  return roomId
}

export const isPlayerAvailable = (c, player) => {
  const listners = c.get("listners")

  if (listners.length >= 1) {
    const player2 = listners.shift();

    const roomId = createRoom(c, player, player2)

    const data = { roomId: roomId }

    player2.resolveWaiting(data)
    delete player2.resolveWaiting;

    return { isPlayerGotPair: true, data }
  }

  return { isPlayerGotPair: false, data: {} }
}
