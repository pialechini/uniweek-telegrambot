import bot from "../../create-bot";
import {
  CallbackQueryContext,
  CommandContext,
  Context,
  InlineKeyboard,
} from "grammy";
import { encode } from "../../lib/json-utils";
import { makeCredentialsWith } from "../auth/auth";

function constructCredentials(senderId: number) {
  return encode(makeCredentialsWith(senderId));
}

function constructMiniAppLink(senderId: number) {
  return (
    "https://pialechini.github.io/uniweek-miniapp/#/week-schedule?credentials=" +
    constructCredentials(senderId)
  );
}

async function handleWeekCommand(ctx: CommandContext<Context>) {
  ctx.reply("انتخاب کنین", {
    reply_markup: new InlineKeyboard()
      .webApp("وب اپ رو باز کن", constructMiniAppLink(ctx.from?.id!))
      .text("لینک رو بده", "giveWebappLink"),
  });
}

async function handleGiveWebappLink(ctx: CallbackQueryContext<Context>) {
  bot.api.editMessageText(
    ctx.chat?.id!,
    ctx.callbackQuery.message?.message_id!,
    constructMiniAppLink(ctx.from?.id!)
  );

  ctx.answerCallbackQuery({
    text: "با استفاده از این لینک که در مرورگر شما باز میشه می تونین این اپ رو به صفحه خانگیتون برای دسترسی سریعتر اضافه کنین",
    cache_time: 60,
    show_alert: true,
  });
}

bot.command("week", handleWeekCommand);
bot.callbackQuery("giveWebappLink", handleGiveWebappLink);
