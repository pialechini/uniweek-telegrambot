import bot from "../../create-bot";
import { decode } from "../../lib/json-utils";
import {
  CommandContext,
  Context,
  Keyboard,
  NextFunction,
  session,
} from "grammy";
import sampleGolestanSchedule from "./sample-golestan-schedule";
import { constructWeekSchedule } from "../../lib/golestan";
import supabase from "../../lib/supabase";
import { signIn } from "../auth/auth";
import cache from "../../cache";

// async function fetchOperationMode(senderId: number) {
//   const user = await signIn(senderId);

//   const { data, error } = await supabase
//     .from("operation_mode")
//     .select("status")
//     .eq("user_id", user?.id)
//     .single();

//   return data?.status as types.OperationMode;
// }

async function handleSetCommand(ctx: CommandContext<Context>) {
  await ctx.reply(
    `توکن بدست آمده از گلستان رو برام ارسال کنین و در نهایت دکمه ارسال رو بزنین
    <b>توجه: امکان داره به علت طولانی بودن توکن در قالب چند پیام ارسال بشه</b>`,
    {
      reply_markup: new Keyboard().text("ارسال"),
      parse_mode: "HTML",
    }
  );

  cache.set(`user${ctx.from?.id}`, { golestanEncodedString: "" }, 0);
}

async function handleGolestanEncodedString(ctx: Context, next: NextFunction) {
  // const operation_mode = await fetchOperationMode(ctx.from?.id!);

  // if (
  // operation_mode.state === "waiting for golestan encoded string from user"
  // ) {
  // }

  const payload = cache.get(`user${ctx.from?.id}`) as any;
  console.log(payload);

  if (!payload?.golestanEncodedString) {
    await next();
    return;
  }

  console.log(`cache payload: ${payload.golestanEncodedString}`);

  cache.set(`user${ctx.from?.id}`, {
    golestanEncodedString: payload.golestanEncodedString + ctx.message?.text,
  });
}

async function handleFinish(ctx: Context, next: NextFunction) {
  const payload = cache.get(`user${ctx.from?.id}`) as any;

  if (!payload?.golestanEncodedString) {
    await next();
    return;
  }

  try {
    const golestanSchedule = decode<typeof sampleGolestanSchedule>(
      payload.golestanEncodedString
    );
    const evenWeekSchedule = constructWeekSchedule("even", golestanSchedule);
    const oddWeekSchedule = constructWeekSchedule("odd", golestanSchedule);

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
      return;
    }

    ctx.reply("مشکلی در سمت دیتابیس بوجود اومده");
  } catch (error) {
    ctx.reply("مشکلی در پردازش رشته گلستان پیش اومده");
    return;
  }
}

bot.command("set", handleSetCommand);
bot.on("message:text", handleGolestanEncodedString);
bot.on("message:text", handleFinish);
