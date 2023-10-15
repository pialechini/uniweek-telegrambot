import bot from "./create-bot";
import { singUp } from "./features/auth/auth";

console.log("commands loaded");

bot.command("start", async (ctx) => {
  ctx.reply("به به! خوش آمدید");

  console.log(ctx.message?.text);

  if (ctx.from?.id != null) {
    await singUp(ctx.from?.id, ctx.from?.username);
  }
});
