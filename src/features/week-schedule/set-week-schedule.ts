import bot from "../../create-bot";
import { decode } from "../../lib/json-utils";
import { CommandContext, Context, Keyboard, NextFunction } from "grammy";
import sampleGolestanSchedule from "./sample-golestan-schedule";
import { constructWeekSchedule } from "../../lib/golestan";
import supabase from "../../lib/supabase";
import { signIn } from "../auth/auth";
import { CacheFor } from "@/lib/cache";

const { remember, retreive, forget } = new CacheFor<string>(
  "golestanEncodedString"
);

async function handleSetCommand(ctx: CommandContext<Context>) {
  await ctx.reply(
    `توکن بدست آمده از گلستان رو برام ارسال کنین و در نهایت دکمه ارسال رو بزنین
    <b>توجه: امکان داره به علت طولانی بودن توکن در قالب چند پیام ارسال بشه</b>`,
    {
      reply_markup: new Keyboard().text("ارسال"),
      parse_mode: "HTML",
    }
  );

  remember(ctx.from?.id!, "");
}

async function handleFinish(ctx: Context, next: NextFunction) {
  const golestanEncodedString = retreive(ctx.chat?.id!);

  if (ctx.message?.text !== "ارسال" || golestanEncodedString === undefined) {
    await next();
    return;
  }

  try {
    const golestanSchedule = decode<typeof sampleGolestanSchedule>(
      golestanEncodedString
    );
    const evenWeekSchedule = constructWeekSchedule("even", golestanSchedule);
    const oddWeekSchedule = constructWeekSchedule("odd", golestanSchedule);
    forget(ctx.from?.id!);

    await signIn(ctx.from?.id!);

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

      forget(ctx.from?.id!);
      return;
    }

    ctx.reply("مشکلی در سمت دیتابیس بوجود اومده");
  } catch (error) {
    ctx.reply("مشکلی در پردازش رشته گلستان پیش اومده");
    return;
  }
}

async function handleGolestanEncodedString(ctx: Context, next: NextFunction) {
  const golestanEncodedString = retreive(ctx.from?.id!);

  if (golestanEncodedString === undefined) {
    await next();
    return;
  }

  remember(ctx.from?.id!, golestanEncodedString + ctx.message?.text);
}

bot.command("set", handleSetCommand);
bot.on("message:text", handleFinish);
bot.on("message:text", handleGolestanEncodedString);
