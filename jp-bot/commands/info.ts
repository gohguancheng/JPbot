import { Composer, InlineKeyboard, Keyboard } from "grammy";
import { MyContext } from "../server";

export const commands = new Composer<MyContext>();

const startKeyboard = new Keyboard()
  .placeholder("Select commands from below")
  .oneTime()
  .resized()
  .text("/address")
  .row()
  .text("/pricing")
  .text("/hours")
  .row()
  .text("/contact")
  .text("/about")
  .row();

commands.command("start", async (ctx) => {
  const name = ctx.from?.first_name || ctx.from?.username;
  await ctx.reply(
    `Hello there${
      name ? ` ${name}` : ""
    },\n\nI am the JPLaundryBot.\nI can help with queries you may have about J&P Laundry.` +
      "\n\n<u>Available Commands</u>" +
      "\n/address - Locate J&P Laundry" +
      "\n/pricing - Learn about available services" +
      "\n/hours - Find out opening hours" +
      "\n/contact - Call us to find out more" +
      "\n/about - Learn about J&P Laundry" +
      "\n\n <i>I seek your patience and understanding for any errors as I am still under construction.</i>",
    { reply_markup: startKeyboard }
  );
});

const aboutKeyboard = new InlineKeyboard()
  .text("Location", "address")
  .text("Services Details", "pricing");

commands.command("about", async (ctx) => {
  await ctx.reply(
    "<b>Origins</b>\nEstablished in 2014, J&P Laundry is a laundromat based in Singapore, solely operated by owner Jessica. Prior to 2014, Jessica worked as an laundromat employee for ~10 years.\n\n" +
      "<b>Services</b>\nJ&P Laundry provides:\n\n1. Drop-off Laundry Services\n2. Ironing Services\n3.Dry Cleaning Services \n\n",
    { reply_markup: aboutKeyboard }
  );
});

const addressKeyboard = new InlineKeyboard()
  .text("Opening Hours", "hours")
  .url("See Google Maps", "https://goo.gl/maps/wMbykCVjjqV2vjyG8");

export const addressResponse = async (ctx: MyContext) => {
  ctx.reply(
    "J&P Laundry is located at:\n<code>150 Silat Ave, #01-40 Block 150, Singapore 160150</code>",
    {
      reply_markup: addressKeyboard,
    }
  );
};
commands.command("address", addressResponse);

export const hoursResponse = async (ctx: MyContext) => {
  const announcement = "";
  await ctx.reply(
    "J&P Laundry is opened from:\n\n<b>10AM to 6PM</b>\n(Fri to Wed, closed on Thu)\n\n<i>*Subject to changes mentioned below</i>\n\n" +
      (announcement
        ? `<b>Special Announcements</b>\nPlease note operating hours are revised during these periods: ${announcement}`
        : "<b>Special Announcements</b>\nNo special updates on opening hours")
  );
};
commands.command("hours", hoursResponse);

commands.command("contact", async (ctx) => {
  await ctx.replyWithContact("+65 6278 0604", "J&P Laundry");
  await ctx.reply(
    "Please note that phone line is only active during opening hours",
    {
      reply_markup: new InlineKeyboard().text("See Opening Hours", "hours"),
    }
  );
});

commands.command("pricing", async (ctx) => {
  await ctx.reply("Pricing and Services Info coming soon..");
});
