import { setCookie } from "hono/cookie";
import { isPlayerAvailable } from "./gameManager.js";
import { getPlayerId, getPlayerSessionId, getUserDetail, assignRoomId, isNumber } from "./utilities.js";

const TIMEOUT = 10000;

export const loginHandler = async (c) => {
  const name = (await c.req.formData()).get("name")

  if (!name) {
    return c.text("Bad Request", 400);
  }

  const id = getPlayerId(c)
  const sid = getPlayerSessionId(c);

  const players = c.get("players");
  players.push({ name, id, sid });

  setCookie(c, "sid", sid);

  return c.redirect("/", 303);
}

export const findMatchHanlder = async (c) => {
  const playerDetail = getUserDetail(c)
  if (!playerDetail) {
    return c.json({ type: "redirect", data: {} })
  }

  const listener = c.get("listners");
  const matching = isPlayerAvailable(c, playerDetail);

  if (matching.isPlayerGotPair) {
    assignRoomId(c, playerDetail, matching.data.roomId);
    return c.json({ type: "data", data: matching.data });
  }

  return await new Promise((res, rej) => {
    playerDetail.resolveWaiting = res;
    listener.push(playerDetail)
    setTimeout(() => {
      const playerIndex = listener.findIndex(each => each === playerDetail)
      listener.splice(playerIndex, 1);
      delete playerDetail.resolveWaiting;
      rej("Request Time out");
    }, TIMEOUT)
  }).then((data) => {
    assignRoomId(c, playerDetail, data.roomId);
    return c.json({ type: "data", data });
  })
    .catch((e) => console.log("failed to find match :", { e }) || c.text(null, 204))

}


export const handleUpdates = async (c) => {
  const userData = getUserDetail(c);
  const { lastId } = await c.req.json();

  if (!userData || lastId === undefined) {
    return c.text("Bad Request", 404);
  }

  const game = c.get("games")[userData.roomId];

  if (!game) {
    return c.text("Bad Request", 404);
  }

  console.log({ lastId });

  if (lastId < game.lastId && lastId >= 0) {
    return c.json({ board: game.getBoard(userData.id), isPlayerTurn: userData.id === game.getTurnOf(), lastId: game.lastId });
  }

  return await new Promise((res, rej) => {
    game.addListner(userData.id, res);

    setTimeout(() => {
      game.removeListner(userData.id);
      rej("Request Time out");
    }, TIMEOUT)

  })
    .then((board) => {
      return c.json({ board: board, isPlayerTurn: userData.id === game.getTurnOf(), lastId: game.lastId });
    })
    .catch((e) => {
      console.log("No new Data :", { e });
      return c.text(null, 204);
    })
}


const parseSetup = (setup) => {
  return setup.map(({ x, y, value }) => ({ x: Number(x), y: Number(y), value: Number(value), }))
}


const isValidSetup = (setup) => {
  for (const { x, y, value } of setup) {
    if (!isNumber(x) || !isNumber(y) || !isNumber(value)) {
      return false;
    }
  }
  return true;
}
export const handleSetPieces = async (c) => {
  const userData = getUserDetail(c);
  const { setup } = await c.req.json();

  if (!userData || setup === undefined) {
    return c.text("Bad Request", 404);
  }

  const game = c.get("games")[userData.roomId];

  if (!game) {
    console.log({ game });
    return c.text("Bad Request", 404);
  }

  const parsedSetup = parseSetup(setup);

  if (!isValidSetup(parsedSetup)) {
    console.log("Invalid setip");

    return c.text("Bad Request", 404);
  }
  const result = game.setUserPieces(userData.id, parsedSetup)

  if (result.status !== 0) {
    console.log({ result });
    return c.text("Bad Request", 404);
  }

  return c.json({ status: true, message: "Added" })
}

export const handleGetSetupPieces = (c) => {
  const userData = getUserDetail(c);

  if (!userData) {
    return c.text("Bad Request", 404);
  }

  const game = c.get("games")[userData.roomId];

  if (!game) {
    return c.text("Bad Request", 404);
  }

  const pieces = game.getSetupPieces()
  return c.json({ pieces })
}