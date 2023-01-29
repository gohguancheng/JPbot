import { Composer, InlineKeyboard, Keyboard } from "grammy";
import { MyContext } from "../server";
import { getDropOff, getDryClean, getSpecialMessage } from "./../api";

export const commands = new Composer<MyContext>();

const startKeyboard = new Keyboard()
  .placeholder("Select commands from below")
  .oneTime()
  .resized()
  .text("/address")
  .text("/share")
  .row()
  .text("/services")
  .text("/hours")
  .row()
  .text("/contact")
  .text("/about")
  .row();

const basicCommands = [
  { command: "start", description: "Start the bot" },
  { command: "share", description: "Share me" },
  { command: "address", description: "Location of shop" },
  { command: "services", description: "Services & Price List" },
  { command: "hours", description: "Opening Hours" },
  {
    command: "contact",
    description: "Contact Info",
  },
  {
    command: "about",
    description: "About Us",
  },
];

commands.command("start", async (ctx) => {
  await ctx.api.deleteMyCommands()
  await ctx.api.setMyCommands(basicCommands);

  const name = ctx.from?.first_name || ctx.from?.username;

  await ctx.reply(
    `Hello there${
      name ? ` ${name}` : ""
    },\n\nI am the JPLaundryBot.\nI can help with queries you may have about J&P Laundry.` +
      "\n\n<u>Available Commands</u>" +
      "\n/address - Locate J&P Laundry" +
      "\n/share - Get link to share me with your friends" +
      "\n/services - Learn about available services" +
      "\n/hours - Find out opening hours" +
      "\n/contact - Call us to find out more" +
      "\n/about - Learn about J&P Laundry" +
      "\n\n <i>I seek your patience and understanding for any errors as I am still under construction.</i>",
    { reply_markup: startKeyboard }
  );
});

const aboutKeyboard = new InlineKeyboard()
  .text("Location", "address")
  .text("Services", "services");

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

export const addressResponse = async (ctx: MyContext, isBtn: Boolean) => {
  if (isBtn) {
    await ctx.editMessageText(
      "J&P Laundry is located at:\n<code>150 Silat Ave, #01-40 Block 150, Singapore 160150</code>",
      {
        reply_markup: addressKeyboard,
      }
    );
  } else {
    await ctx.reply(
      "J&P Laundry is located at:\n<code>150 Silat Ave, #01-40 Block 150, Singapore 160150</code>",
      {
        reply_markup: addressKeyboard,
      }
    );
  }
};
commands.command("address", (ctx) => addressResponse(ctx, false));

export const hoursResponse = async (ctx: MyContext, isBtn: Boolean) => {
  const msg = await getSpecialMessage();
  if (isBtn) {
    await ctx.editMessageText(
      "<b>Regular Operating Hours</b>\n\nJ&P Laundry is opened from <b>10AM to 6PM</b> (Fri to Wed)\n\n<i>*Closed on Thursdays</i>"
    );
  } else {
    await ctx.reply(
      "<b>Regular Operating Hours</b>\n\nJ&P Laundry is opened from <b>10AM to 6PM</b> (Fri to Wed)\n\n<i>*Closed on Thursdays</i>"
    );
  }
  if (msg) {
    await ctx.reply(msg);
  }
};
commands.command("hours", (ctx) => hoursResponse(ctx, false));

commands.command("contact", async (ctx) => {
  await ctx.replyWithContact("+65 6278 0604", "J&P Laundry");
  await ctx.reply(
    "Please note that phone line is only active during opening hours",
    {
      reply_markup: new InlineKeyboard().text("See Opening Hours", "hours"),
    }
  );
});

commands.command("services", async (ctx) => {
  await ctx.reply("Pricing and Services Info coming soon..");
});

commands.command(
  "share",
  async (ctx) =>
    await ctx.reply(
      `<b>Copy and share the following link</b>\n\n<pre>https://t.me/JPLaundryBot</pre>\n\n<i>Introduce your friends to me (@${ctx.me.username})!</i> 😊`
    )
);
