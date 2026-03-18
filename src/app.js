import { Hono } from "hono"
import { serveStatic } from "hono/deno"
import { logger } from "hono/logger"
import { findMatchHanlder, handleUpdates, loginHandler } from "./requestHanlder.js";

const players = [];
const listners = [];

export const createApp = () => {

  const gameIdHanlder = (() => {
    let id = 1000;
    return { nextId: () => id++ }
  })()

  const games = {}

  const app = new Hono()
  app.use(logger())
  app.use((c, next) => {
    c.set("players", players);
    c.set("listners", listners);
    c.set("gameIdHanlder", gameIdHanlder);
    c.set("games", games);
    return next()
  })

  app.post("/new-data", handleUpdates)

  app.get("/find-match", findMatchHanlder);

  app.post("/login", loginHandler)

  app.get("*", serveStatic({ root: "public" }))

  return app
}
