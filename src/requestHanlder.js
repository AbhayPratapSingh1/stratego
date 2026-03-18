import { setCookie } from "hono/cookie";
import { handlePossibleGames } from "./gameManager.js";

const getPlayerSessionId = (c, name) => {
  const player = c.get("players")
  player.push({ name, id: player.length });
  return player.at(-1).id;

}

export const loginHandler = async (c) => {

  const { name } = await c.req.json();
  if (!name) {
    return c.text("Bad Request", 400);
  }

  const sid = getPlayerSessionId(c, name);

  setCookie(c, "sid", sid);
  return c.json({ status: true });
}