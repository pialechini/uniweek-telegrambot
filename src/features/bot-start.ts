import { CommandContext, Context } from "grammy";
import bot from "../create-bot";
import { signIn, singUp } from "../features/auth/auth";
import supabase from "../lib/supabase";

bot.command("start", async (ctx: CommandContext<Context>) => {
  const user = await singUp(ctx.from?.id!, ctx.from?.username);
  await signIn(ctx.from?.id!);

  const { data, status } = await supabase
    .from("identities")
    .upsert(
      { telegram_username: ctx.from?.username },
      {
        onConflict: "user_id",
      }
    )
    .select();

  if (user) {
    ctx.reply("ساخت حساب کاربری موفقیت آمیز بود");
  }

  await ctx.reply("به به! خوش آمدید");
});
