import bot from "../../create-bot";
import { decode } from "../../lib/json-utils";
import { CommandContext, Context, Keyboard, NextFunction } from "grammy";
import sampleGolestanSchedule from "./sample-golestan-schedule";
import { constructWeekSchedule } from "../../lib/golestan";
import supabase from "../../lib/supabase";
import { signIn } from "../auth/auth";
import { CacheContext } from "../../lib/cache";

const cache = new CacheContext<string>("golestanEncodedString");

async function handleSetCommand(ctx: CommandContext<Context>) {
  await ctx.reply(
    `توکن بدست آمده از گلستان رو برام ارسال کنین و در نهایت دکمه ارسال رو بزنین
    <b>توجه: امکان داره به علت طولانی بودن توکن در قالب چند پیام ارسال بشه</b>`,
    {
      reply_markup: new Keyboard().text("ارسال").resized(),
      parse_mode: "HTML",
    }
  );

  cache.remember(ctx.from?.id!, "");
}

async function handleFinish(ctx: Context, next: NextFunction) {
  const golestanEncodedString = cache.retreive(ctx.chat?.id!);

  if (ctx.message?.text !== "ارسال" || golestanEncodedString === undefined) {
    await next();
    return;
  }

  let response = "";

  try {
    const golestanPayload = decode<typeof sampleGolestanSchedule>(
      golestanEncodedString
    );
    const evenWeekSchedule = constructWeekSchedule(
      "even",
      golestanPayload.schedule
    );
    const oddWeekSchedule = constructWeekSchedule(
      "odd",
      golestanPayload.schedule
    );
    cache.forget(ctx.from?.id!);

    await signIn(ctx.from?.id!);

    const { status: status1 } = await supabase.from("week_schedule").upsert(
      {
        even_week_schedule: JSON.stringify(evenWeekSchedule),
        odd_week_schedule: JSON.stringify(oddWeekSchedule),
      },
      {
        onConflict: "user_id",
      }
    );

    const { status: status2 } = await supabase
      .from("identities")
      .upsert(
        {
          real_name: golestanPayload.name,
          academic_orientation: golestanPayload.academicOrientation,
        },
        {
          onConflict: "user_id",
        }
      )
      .select();

    if (status1 === 201 && status2 === 201) {
      response = "برنامه با موفقیت بروزرسانی شد";
    } else {
      response = "مشکلی در سمت دیتابیس بوجود اومده";
    }
  } catch (error) {
    response = "مشکلی در پردازش رشته گلستان پیش اومده";
  } finally {
    cache.forget(ctx.from?.id!);
    ctx.reply(response, {
      reply_markup: { remove_keyboard: true },
    });
  }
}

async function handleGolestanEncodedString(ctx: Context, next: NextFunction) {
  const golestanEncodedString = cache.retreive(ctx.from?.id!);

  if (golestanEncodedString === undefined) {
    await next();
    return;
  }

  cache.remember(ctx.from?.id!, golestanEncodedString + ctx.message?.text);
}

bot.command("set", handleSetCommand);
bot.on("message:text", handleFinish);
bot.on("message:text", handleGolestanEncodedString);
