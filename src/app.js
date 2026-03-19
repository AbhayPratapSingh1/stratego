import { Hono } from "hono"
import { serveStatic } from "hono/deno"
import { logger } from "hono/logger"
import { findMatchHanlder, handleGetSetupPieces, handleSetPieces, handleUpdates, loginHandler } from "./requestHanlder.js";

const players = [];
const listners = [];

export const createApp = () => {

  const gameIdHanlder = (() => {
    let id = 1000;
    return { nextId: () => id++ }
  })()

  const games = {}

  const app = new Hono()

  app.use(logger());

  app.use((c, next) => {
    c.set("players", players);
    c.set("listners", listners);
    c.set("gameIdHanlder", gameIdHanlder);
    c.set("games", games);
    return next()
  })


  app.post("/set-pieces", handleSetPieces)
  app.post("/new-data", handleUpdates)
  app.post("/login", loginHandler)

  app.get("/setup-pieces", handleGetSetupPieces);
  app.get("/find-match", findMatchHanlder);

  app.get("*", serveStatic({ root: "public" }))

  return app
}
