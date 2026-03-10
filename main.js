import { Hono } from "hono"
import { serveStatic } from "hono/deno"
import { logger } from "hono/logger"

const createApp = () => {
  const app = new Hono()
  app.use(logger())
  app.get("*", serveStatic({ root: "public" }))
  return app
}

const main = () => {
  const app = createApp()

  Deno.serve({ port: 8000 }, app.fetch)
}
main()