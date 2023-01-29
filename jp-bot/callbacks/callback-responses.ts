import { Composer, InlineKeyboard, Keyboard } from "grammy";
import { MyContext } from "../server";
import { addressResponse, hoursResponse } from "../commands/info";

export const callback = new Composer<MyContext>();

callback.callbackQuery("hours", async (ctx) => {
  await hoursResponse(ctx, true);
  await ctx.answerCallbackQuery();
});

callback.callbackQuery("address", async (ctx) => {
  await addressResponse(ctx, true);
  await ctx.answerCallbackQuery();
});

callback.callbackQuery("services", async (ctx) => {
  await ctx.editMessageText("Pricing and Services Info coming soon..");
  await ctx.answerCallbackQuery();
});
