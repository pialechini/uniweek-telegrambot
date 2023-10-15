import { CommandContext, Context } from "grammy";
import bot from "../create-bot";
import { singUp } from "../features/auth/auth";

bot.command("start", async (ctx: CommandContext<Context>) => {
  await ctx.reply(ctx.message?.text!);

  if (ctx.from?.id != null) {
    const user = await singUp(ctx.from?.id, ctx.from?.username);
    ctx.reply(
      Boolean(user)
        ? "ساخت حساب کاربری موفقیت آمیز بود"
        : "خطایی هنگام ساخت حساب کاربری رخ داد"
    );
  }
});
