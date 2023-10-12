import bot from "../../create-bot";
import sampleGolestanSchedule from "../week-schedule/sample-golestan-schedule";
import supabase from "../../supabase";
import {
  CallbackQueryContext,
  CommandContext,
  Context,
  InlineKeyboard,
} from "grammy";
import { constructWeekSchedule } from "../../lib/golestan";
import { decode, encode } from "../../lib/json-utils";
import { makeCredentialsWith, signIn } from "../../features/auth/auth";

function constructCredentials(senderId: number) {
  return encode(makeCredentialsWith(senderId));
}

function constructMiniAppLink(senderId: number) {
  return (
    "https://pialechini.github.io/uniweek-miniapp/#/week-schedule?credentials=" +
    constructCredentials(senderId)
  );
}

async function setWeekSchedule(ctx: CommandContext<Context>) {
  const golestanEncodedString = ctx.message!.text.split(" ")[1];

  if (Boolean(golestanEncodedString) !== true) {
    ctx.reply("شکل صحیح دستور:\n/set <string>");
    return;
  }

  try {
    const golestanSchedule = decode<typeof sampleGolestanSchedule>(
      golestanEncodedString,
    );
    const evenWeekSchedule = constructWeekSchedule("even", golestanSchedule);
    const oddWeekSchedule = constructWeekSchedule("odd", golestanSchedule);

    await signIn(ctx.chat.id);

    // Update or insert week schedules to database
    const { status, data, error } = await supabase.from("week_schedule").upsert(
      {
        even_week_schedule: JSON.stringify(evenWeekSchedule),
        odd_week_schedule: JSON.stringify(oddWeekSchedule),
      },
      {
        onConflict: "user_id",
      },
    );

    if (status === 201) {
      ctx.reply("برنامه با موفقیت بروزرسانی شد");
      return;
    }

    ctx.reply("مشکلی در سمت دیتابیس بوجود اومده");
  } catch (error) {
    ctx.reply("مشکلی در پردازش رشته گلستان پیش اومده");
    return;
  }
}

async function showWeekSchedule(ctx: CommandContext<Context>) {
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
    constructMiniAppLink(ctx.from?.id!),
  );

  ctx.answerCallbackQuery({
    text: "با استفاده از این لینک که در مرورگر شما باز میشه می تونین این اپ رو به صفحه خانگیتون برای دسترسی سریعتر اضافه کنین",
    cache_time: 60,
    show_alert: true,
  });
}

bot.command("set", setWeekSchedule);
bot.command("week", showWeekSchedule);
bot.callbackQuery("giveWebappLink", handleGiveWebappLink);
