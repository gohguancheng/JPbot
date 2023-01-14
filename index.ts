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
  res.sendStatus(200);
});
app.post(`/${JpRoute}`, webhookCallback(JpBot, "express"));

app.listen(port, async () => {
  // setWebhook not required if webhook is set manually via https://api.telegram.org/bot<bot_token>/setWebhook?url=<webhook_url>
  if (env.isProd) {
    await JpBot.api
      .setWebhook(`${domain}/${JpRoute}`)
      .catch((err) => console.log(err));
    console.log(`JP Bot listening on ${domain}/${JpRoute}:${port}`);

    setInterval(async () => {
      try {
        await https.get(`${domain}/healthcheck`);
        console.log("ping!");
      } catch (err) {
        console.log(err);
      }
    }, 5 * 60 * 1000); // every 5 minutes -> remove for AWS
  } else {
    console.log(`Webhook not set on dev env. Listening on localhost:${port}`);
  }
});
