import express, { Express, Request, Response } from "express";
import * as https from "https";
import { webhookCallback } from "grammy";
import { bot as JpBot } from "./jp-bot/server";
import { env } from "./env";

const app: Express = express();
app.use(express.json());

const domain = env.DOMAIN;
const port = env.PORT || 4000;
const JP_TOKEN = env.JP_TOKEN;
const JpRoute = `api/${JP_TOKEN}/hook`;

app.get("/healthcheck", (req: Request, res: Response) => {
  res.status(200).send("OK");
});
app.post(`/${JpRoute}`, webhookCallback(JpBot, "express"));

app.listen(port, async () => {
  // setWebhook not required if webhook is set manually via https://api.telegram.org/bot<bot_token>/setWebhook?url=<webhook_url>
  if (env.isProd) {
    await JpBot.api.setWebhook(`${domain}/${JpRoute}`);
    console.log(`JP Bot listening on ${domain}/${JpRoute}:${port}`);
  } else {
    console.log(`Webhook not set on dev env. Listening on localhost:${port}`);
  }
});
