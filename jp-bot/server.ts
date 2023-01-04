import { env } from "./../env";
import {
  Bot,
  Context,
  MemorySessionStorage,
  session,
  SessionFlavor,
} from "grammy";
import { hydrateReply, parseMode } from "@grammyjs/parse-mode";
import { commands } from "./commands/info";
import { callback } from "./callbacks/callback-responses";
import { updates } from "./updates/updates";

import type { ParseModeFlavor } from "@grammyjs/parse-mode";

interface SessionData {
  action: string;
  isAdmin?: boolean;
}

export type MyContext = ParseModeFlavor<Context & SessionFlavor<SessionData>>;

const bot = new Bot<MyContext>(env.JP_TOKEN || env.TEST_TOKEN);

async function runJPBot() {
  await bot.use(
    session({
      storage: new MemorySessionStorage(),
      getSessionKey: (ctx) => ctx.chat?.id.toString(),
      initial: () => ({ action: "" }),
    })
  );

  await bot.use(hydrateReply);
  await bot.api.config.use(parseMode("HTML"));

  await bot.use(async (ctx, next) => {
    if (
      !ctx.session.isAdmin &&
      ctx?.chat &&
      [env.SUPER_USER_ID, env.SUPER_J_ID].includes(ctx?.chat?.id)
    ) {
      ctx.session.isAdmin = true;
    }

    if (env.isProd || ctx?.from?.id === env.SUPER_USER_ID) {
      await next();
    } else {
      await ctx.reply("This bot is only accessible by Owner.");
    }
  });

  await bot.use(updates);
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
