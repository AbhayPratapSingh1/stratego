import { Hono } from "hono"
import { serveStatic } from "hono/deno"
import { setCookie, getCookie } from "hono/cookie"
import { logger } from "hono/logger"
import { Game } from "./game.js";

const getPlayerSessionId = (name) => {
  player.push(name);
  return player.length++;

}

const handlePossibleGames = () => {
  listners.forEach(res => res(1));
}

const TIMEOUT_TIME = 1000

const player = [];
const game = new Game()
const piecesOne = "123456".split("").map((_, i) => ({ x: i, y: 0, value: i + 1 }));
const piecesTwo = "123456".split("").map((_, i) => ({ x: i, y: 9, value: i + 1 }));
game.addPlayerPiece(piecesOne, "R");
game.addPlayerPiece(piecesTwo, "G");
const listners = [];

let turnOf = 0;


const handleGame = async (c) => {
  const user = getCookie(c, "username");
  console.log("game request from", user);

  if (!user) {
    return c.text("Bad Request", 400);
  }
  try {
    if (player.length < 2) {
      await new Promise((resolve, reject) => {
        listners.push(resolve);
        setTimeout(() => {
          reject(1);
        }, TIMEOUT_TIME)
      })
    }
  } catch (e) {
    console.log("/game => ", e);
    return c.text(null, 204)
  }

  if (user === player[turnOf]) {
    return c.json({ board: game.getBoard() })
  }
  const data = await new Promise((resolve, reject) => {
    listners.push(resolve)
    setTimeout(() => {
      reject(1);
    }, TIMEOUT_TIME);
  }).then(() => c.json({ board: game.getBoard() }))
    .catch(() => c.text(null, 204));
  return data;
}



const ACTIONS = {
  "move": ({ from, to }) => {
    game.updatePos(from, to);
  }
}

export const createApp = () => {

  const app = new Hono()
  app.use(logger())


  app.post("/action", async (c) => {

    const user = getCookie(c, "username");
    const { action, data } = await c.req.json();
    if (user !== player[turnOf] || !(action in ACTIONS)) {
      return c.text("Bad Request", 400);
    }

    ACTIONS[action](data)
    turnOf = 1 - turnOf;
    return c.json("Done!");

  })
  app.get("/game", handleGame)
  app.get("/game-and-role", async (c) => {
    const user = getCookie(c, "username");
    if (!user) {
      return c.text("Bad Request", 400);
    }
    try {
      if (player.length < 2) {
        await new Promise((resolve, reject) => {
          listners.push(resolve);
          setTimeout(() => {
            reject(1);
          }, TIMEOUT_TIME)
        })
      }
    } catch (e) {
      return c.text(null, 204)
    }

    return c.json({ board: game.getBoard(), color: player.indexOf(user) === 0 ? "R" : "G" })
  })


  app.post("/login", async (c) => {
    const { name } = await c.req.json();


    if (!name) {
      return c.text("Bad Request", 400);
    }

    const sid = getPlayerSessionId(name);
    handlePossibleGames();
    setCookie(c, "username", sid);

    return c.json({ status: true });
  })

  app.get("*", serveStatic({ root: "public" }))

  return app
}
