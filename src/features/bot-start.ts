import { CommandContext, Context } from "grammy";
import bot from "../create-bot";
import { singUp } from "../features/auth/auth";

bot.command("start", async (ctx: CommandContext<Context>) => {
  ctx.reply(ctx.message?.text!);

  if (ctx.from?.id != null) {
    await singUp(ctx.from?.id, ctx.from?.username);
  }
});
