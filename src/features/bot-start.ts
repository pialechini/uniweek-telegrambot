import { CommandContext, Context } from "grammy";
import bot from "../create-bot";
import { singUp } from "../features/auth/auth";

bot.command("start", async (ctx: CommandContext<Context>) => {
  const user = await singUp(ctx.from?.id!, ctx.from?.username);

  if (user) {
    ctx.reply("ساخت حساب کاربری موفقیت آمیز بود");
  }
});
