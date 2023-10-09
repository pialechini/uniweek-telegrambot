import bot from './create-bot';
import { signIn, singUp } from './features/auth/auth';

bot.command("start", async (ctx) => {
  ctx.reply("به به! خوش آمدید");
  const user = await singUp(ctx.from?.id!, ctx.from?.username);
});
