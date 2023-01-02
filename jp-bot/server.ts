import { env } from "./../env";
import { Bot, Context, SessionFlavor } from "grammy";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";

import type { ParseModeFlavor } from "@grammyjs/parse-mode";

interface SessionData {}

type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<ParseModeFlavor<MyContext>>(env.JP_TOKEN || env.TEST_TOKEN);

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

  await bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
  await bot.on("message", (ctx) => ctx.reply("Got another message!"));

  if (env.isDev) bot.start();
}

runJPBot();

export { bot };
