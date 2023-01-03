import { Composer, InlineKeyboard, Keyboard } from "grammy";
import { MyContext } from "../server";
import { hoursResponse } from "../commands/info";

export const callback = new Composer<MyContext>();

callback.callbackQuery("hours", async (ctx) => {
  await hoursResponse(ctx);
  await ctx.answerCallbackQuery();
});
