import { Composer, InlineKeyboard, Keyboard } from "grammy";
import { MyContext } from "../server";
import { getDropOff, getDryClean, getSpecialMessage } from "./../api";

export const commands = new Composer<MyContext>();

const startKeyboard = new Keyboard()
  .placeholder("Select commands from below")
  .oneTime()
  .resized()
  .text("/about")
  .text("/address")
  .row()
  .text("/contact")
  .text("/hours")
  .row()
  .text("/prices")
  .text("/share")
  .row();

commands.command("start", async (ctx) => {

  const name = ctx.from?.first_name || ctx.from?.username;

  await ctx.reply(
    `<i>Hello${
      name ? ` ${name}` : ""
    }, I am the @JPLaundryBot.\nI can help with queries you may have about J&P Laundry.</i>` +
      "\n\n<b>Available Commands</b>" +
      "\n/address - Locate J&P Laundry 📍" +
      "\n/share - Share me with your friends 📱" +
      "\n/prices - Pricing & Services 🫧" +
      "\n/hours - Operating Hours 💼" +
      "\n/contact - Call Us for further enquiries 📞" +
      "\n/about - J&P Laundry's story ☀️" +
      "\n\n<i>Use the above commands to interact with me.</i>",
    { reply_markup: startKeyboard }
  );
});

const aboutKeyboard = new InlineKeyboard()
  .text("Location", "address")
  .text("Services", "services");

commands.command("about", async (ctx) => {
  await ctx.reply(
    "☀️ <b>Origins</b>\n\nEstablished in 2014, J&P Laundry is a laundromat based in Singapore, solely operated by owner Jessica. Prior to 2014, Jessica worked as an laundromat employee for ~10 years.\n\n" +
      "🫧 <b>Services</b>\n\nJ&P Laundry provides:\n\n👕 Drop-off Laundry Services\n👔 Ironing Services\n🧥 Dry Cleaning Services \n\n",
    { reply_markup: aboutKeyboard }
  );
});

const addressKeyboard = new InlineKeyboard()
  .text("Opening Hours", "hours")
  .url("See Google Maps", "https://goo.gl/maps/wMbykCVjjqV2vjyG8");

export const addressResponse = async (ctx: MyContext, isBtn: Boolean) => {
  if (isBtn) {
    await ctx.editMessageText(
      "📍 <b>Address</b>\n\nJ&P Laundry is located at:\n<code>150 Silat Ave, #01-40 Block 150, Singapore 160150</code>",
      {
        reply_markup: addressKeyboard,
      }
    );
  } else {
    await ctx.reply(
      "📍 <b>Address</b>\n\nJ&P Laundry is located at:\n<code>150 Silat Ave, #01-40 Block 150, Singapore 160150</code>",
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
      "💼 <b>Regular Operating Hours</b>\n\nJ&P Laundry is opened from <b>10AM to 6PM</b> (Fri to Wed)\n\n<i>*Closed on Thursdays</i>"
    );
  } else {
    await ctx.reply(
      "💼 <b>Regular Operating Hours</b>\n\nJ&P Laundry is opened from <b>10AM to 6PM</b> (Fri to Wed)\n\n<i>*Closed on Thursdays</i>"
    );
  }
  if (msg) {
    await ctx.reply("📢 " + msg);
  }
};
commands.command("hours", (ctx) => hoursResponse(ctx, false));

commands.command("contact", async (ctx) => {
  await ctx.replyWithContact("+65 6278 0604", "J&P Laundry");
  await ctx.reply(
    "📞 <b>Contact Us</b> \n\nPlease note that phone line is only active during opening hours.",
    {
      reply_markup: new InlineKeyboard().text("See Opening Hours", "hours"),
    }
  );
});

commands.command("prices", async (ctx) => {
  await ctx.reply(
    "🫧 <b>Pricing and Services</b>\n\nPrice list coming soon.\nPlease call us directly for pricing enquiries. (/contact)"
  );
});

commands.command(
  "share",
  async (ctx) =>
    await ctx.reply(
      `📱 <b>Copy and share the following link</b>\n\n<pre>https://t.me/JPLaundryBot</pre>\n\n<i>Introduce your friends to me (@${ctx.me.username})!</i> 🙋‍♀️`
    )
);
