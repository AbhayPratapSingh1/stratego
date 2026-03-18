import { Hono } from "hono"
import { serveStatic } from "hono/deno"
import { getCookie } from "hono/cookie"
import { logger } from "hono/logger"
import { Game } from "./game.js";
import { loginHandler } from "./requestHanlder.js";
import { handlePossibleGames } from "./gameManager.js";



const TIMEOUT_TIME = 1000

const players = [];
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
    if (players.length < 2) {
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

  if (user === players[turnOf]) {
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
  app.use((c, next) => {
    c.set("players", players);
    c.set("listners", listners);
    return next()
  })

  app.post("/action", async (c) => {

    const user = getCookie(c, "username");
    const { action, data } = await c.req.json();
    if (user !== players[turnOf] || !(action in ACTIONS)) {
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
      if (players.length < 2) {
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

    return c.json({ board: game.getBoard(), color: players.indexOf(user) === 0 ? "R" : "G" })
  })


  const getUserDetail = (c) => {
    const sid = getCookie(c, "sid");
    const players = c.get("players");
    const playerDetail = players.find(({ id }) => sid.toString() === id.toString());

    return playerDetail;
  }

  app.post("/login", loginHandler)

  app.get("/find-match", async (c) => {
    const playerDetail = getUserDetail(c)
    const listener = c.get("listners");

    listener.push(playerDetail)

    const game = handlePossibleGames(c);
    if (game.isPlayerGotPair) {
      return c.json(game.data);
    }

    return await new Promise((res, rej) => {
      playerDetail.resolveWaiting = res;
      setTimeout(() => {
        const playerIndex = listener.findIndex(each => each === playerDetail)
        listener.splice(playerIndex, 1);
        delete playerDetail.resolveWaiting;
        rej(1);
      }, 1000)
    }).then((data) => c.json(data))
      .catch((e) => console.log({ e }) || c.text(null, 204))

  })

  app.get("*", serveStatic({ root: "public" }))

  return app
}
