import bot from "../../create-bot";
import sampleGolestanSchedule from "../week-schedule/sample-golestan-schedule";
import supabase from "../../supabase";
import { CommandContext, Context, InlineKeyboard } from "grammy";
import { constructWeekSchedule } from "../../lib/golestan";
import { decode, encode } from "../../lib/json-utils";
import { makeCredentialsWith, signIn } from "../../features/auth/auth";

async function setWeekSchedule(ctx: CommandContext<Context>) {
  const golestanEncodedString = ctx.message!.text.split(" ")[1];

  if (Boolean(golestanEncodedString) !== true) {
    ctx.reply(`شکل صحیح دستور:\n/set <string>`);
    return;
  }

  try {
    const golestanSchedule = decode<typeof sampleGolestanSchedule>(
      golestanEncodedString
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
      }
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
  const credentials = encode(makeCredentialsWith(ctx.from?.id!));

  ctx.reply("خدمت شما :)", {
    reply_markup: new InlineKeyboard().webApp(
      "نمایش اپ",
      `https://pialechini.github.io/uniweek-miniapp/#/week-schedule?credentials=${credentials}`
    ),
  });
}

bot.command("set", setWeekSchedule);
bot.command("week", showWeekSchedule);
