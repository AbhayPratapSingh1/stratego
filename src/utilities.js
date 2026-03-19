import { getCookie, setCookie } from "hono/cookie";

export const isNumber = (val) => /^\d+$/.test(val);
export const getUserDetail = (c) => {
  const sid = getCookie(c, "sid");
  if (!sid && sid !== "0") {
    return
  }
  const players = c.get("players");
  const playerDetail = players.find(({ id }) => sid.toString() === id.toString());

  return playerDetail;
};

export const getPlayerSessionId = (c) => {
  const players = c.get("players");
  return players.length + 1
};


export const getPlayerId = (c) => {
  const players = c.get("players");
  return players.length + 1
}


export const assignRoomId = (c, playerDetail, roomId) => {
  playerDetail.roomId = roomId;
  setCookie(c, "roomId", roomId);
}
