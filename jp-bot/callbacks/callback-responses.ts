import { Composer, InlineKeyboard, Keyboard } from "grammy";
import { MyContext } from "../server";
import { addressResponse, hoursResponse } from "../commands/info";

export const callback = new Composer<MyContext>();

callback.callbackQuery("hours", async (ctx) => {
  await hoursResponse(ctx);
  await ctx.answerCallbackQuery();
});

callback.callbackQuery("address", async (ctx) => {
  await addressResponse(ctx);
  await ctx.answerCallbackQuery();
});

callback.callbackQuery("services", async (ctx) => {
  await ctx.reply("Pricing and Services Info coming soon..");
  await ctx.answerCallbackQuery();
});

