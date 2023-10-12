import bot from "./create-bot";
import { singUp } from "./features/auth/auth";

bot.command("start", async (ctx) => {
  await ctx.reply("به به! خوش آمدید");

  // if (ctx.from?.id != null) {
  await singUp(ctx.from?.id, ctx.from?.username);
  // }
});
