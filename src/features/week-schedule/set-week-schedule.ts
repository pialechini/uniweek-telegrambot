import bot from "../../create-bot";
import supabase from "../../lib/supabase";
import { signIn } from "../auth/auth";
import { CacheContext } from "../../lib/cache";
import app from "../../create-app";
import * as types from "../../types/types";

const EXPIRE_TIME = 60;

const pendingWeekSchedules = new CacheContext<types.WeekSchedules>(
  "pendingWeekSchedules"
);

function generateVerificationCode() {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
}

app.use("/setWeekSchedule", (req, res) => {
  const weekSchedules = req.body;
  let verificationCode;

  do {
    verificationCode = generateVerificationCode();
  } while (pendingWeekSchedules.has(verificationCode));

  pendingWeekSchedules.remember(verificationCode, weekSchedules);

  res.send({
    verificationCode,
    expire: EXPIRE_TIME,
  });
});

// ok
bot.on("message", async (ctx) => {
  const verificationCode = ctx.message.text!;

  if (
    !/\d{4}/.test(verificationCode) ||
    pendingWeekSchedules.retreive(verificationCode) === undefined
  ) {
    return;
  }

  const message = await ctx.reply("درحال ثبت برنامه");
  bot.api.sendChatAction(ctx.chat.id, "upload_document");

  const { evenWeekSchedule, oddWeekSchedule } =
    pendingWeekSchedules.retreive(verificationCode)!;

  let response = "";

  try {
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

    await supabase.from("identities").upsert(
      {
        real_name: "name",
        academic_orientation: "academicOrientation",
      },
      {
        onConflict: "user_id",
      }
    );

    if (status1 === 201) {
      response = "برنامه با موفقیت بروزرسانی شد";
    } else {
      response = "مشکلی در سمت دیتابیس بوجود اومده";
    }
  } catch (error) {
    response = "مشکلی در پردازش رشته گلستان پیش اومده";
  } finally {
    pendingWeekSchedules.forget(verificationCode);
    bot.api.editMessageText(ctx.chat.id, message.message_id, response);
  }
});
