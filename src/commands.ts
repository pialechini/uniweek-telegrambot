import { CommandContext, Context } from "grammy";
import bot from "./create-bot";
import { singUp } from "./features/auth/auth";

console.log("commands loaded");

bot.command("start", async (ctx: CommandContext<Context>) => {
  bot.api.sendMessage(ctx.chat.id, ctx.message?.text ?? "some text");

  console.log(ctx.message?.text);

  if (ctx.from?.id != null) {
    await singUp(ctx.from?.id, ctx.from?.username);
  }
});
