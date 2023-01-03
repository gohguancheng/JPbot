import { env } from "./../env";
import { Bot, Context, SessionFlavor } from "grammy";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { commands } from "./commands/info";
import { callback } from "./callbacks/callback-responses";

import type { ParseModeFlavor } from "@grammyjs/parse-mode";

interface SessionData {}

export type MyContext = ParseModeFlavor<Context & SessionFlavor<SessionData>>;

const bot = new Bot<MyContext>(env.JP_TOKEN || env.TEST_TOKEN);

async function runJPBot() {
  await bot.use(hydrateReply);
  await bot.api.config.use(parseMode("HTML"));

  await bot.use(async (ctx, next) => {
    if (env.isProd || ctx?.from?.id === env.SUPER_USER_ID) {
      await next();
    } else {
      await ctx.reply("This bot is only accessible by Owner.");
    }
  });

  await bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "address", description: "Locate shop" },
    { command: "pricing", description: "Learn about services and price list" },
    { command: "hours", description: "See updated operating hours" },
    {
      command: "contact",
      description: "Speak to us during opening hours",
    },
    {
      command: "about",
      description: "Learn about J&P Laundry",
    },
  ]);

  await bot.use(commands);
  await bot.use(callback);

  await bot.on("message:text", (ctx) =>
    ctx.reply(
      "Apologies! I only understand commands at the moment. e.g. /start"
    )
  );

  if (env.isDev) bot.start();
}

runJPBot();

export { bot };
