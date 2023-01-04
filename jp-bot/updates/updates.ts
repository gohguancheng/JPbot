import { Composer, InlineKeyboard, Keyboard } from "grammy";
import { MyContext } from "../server";
import store from "../store";

export const updates = new Composer<MyContext>();

const updateResponse = (updates: string) => {
  return (
    "J&P Laundry is opened from:\n\n<b>10AM to 6PM</b>\n(Fri to Wed, closed on Thu)\n\n<i>*Subject to changes mentioned below</i>\n\n" +
    (updates
      ? `<b>Special Announcements</b>\n${updates}`
      : "<b>Special Announcements</b>\nNo special updates on opening hours")
  );
};

updates.use(async (ctx, next) => {
  if (
    ctx.session.isAdmin &&
    ctx.session.action === "changehours" &&
    ctx.msg &&
    !ctx.callbackQuery
  ) {
    if (ctx.msg.text?.toLowerCase() === "reset") {
      store.original = store.changes;
      store.changes = "";
    } else if (ctx.msg.text) {
      store.original = store.changes;
      store.changes = ctx.msg.text;
    }
    await ctx.reply(
      "<b>PLEASE CONFIRM</b>\n\n" + updateResponse(store.changes),
      {
        reply_markup: new InlineKeyboard()
          .text("Undo", "undo")
          .text("Confirm", "confirm"),
      }
    );
  } else {
    next();
  }
});
updates.callbackQuery("undo", async (ctx) => {
  if (ctx.session.isAdmin && ctx.session.action === "changehours") {
    store.changes = store.original;
    await ctx.editMessageText(
      "<b>NO CHANGES /hours</b>\n\n" + updateResponse(store.changes)
    );
    ctx.session.action = "";
  } else {
    ctx.editMessageText("Update expired, please try again. /changehours");
  }
  await ctx.answerCallbackQuery();
});

updates.callbackQuery("confirm", async (ctx) => {
  if (ctx.session.isAdmin && ctx.session.action === "changehours") {
    await ctx.editMessageText(
      "<b>UPDATED /hours</b>\n\n" + updateResponse(store.changes)
    );
    ctx.session.action = "";
  } else {
    ctx.editMessageText("Update expired, please try again. /changehours");
  }
  await ctx.answerCallbackQuery();
});

updates.callbackQuery("cancel", async (ctx) => {
  ctx.session.action = "";
  await ctx.editMessageText("No Updates.");
  await ctx.answerCallbackQuery();
});
