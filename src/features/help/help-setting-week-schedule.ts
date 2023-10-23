import { InlineKeyboard } from "grammy";
import bot from "../../create-bot";

const helpForSettingWeekSchedule = `توجه کنین که در این مرحله نیاز به لپتاپ یا کامپیوتر دارین و باقی قسمت های ربات بدون نیاز به لپتاپه

برای معرفی برنامه هفتگی خودتون به ربات به ترتیب این کار ها رو انجام بدین:
۱- اگه افزونه uniweek روی مرورگرتون نصب هست که هیچی برین مرحله ۲. اگه نیست، از لینک زیر دانلود و روی مرورگرتون نصب کنین
https://github.com/pialechini/uniweek-extension
۲- با کامپیوتر یا لپتاپ وارد سایت گلستان بشین
۳- گزارش ۷۸ رو بیارین بالا تا برنامه هفتگی تون قابل مشاهده باشه روی صفحه
۴- کلید های Alt+B رو از روی صفحه کلید بزنین. (اول کلید Alt رو نگه دارین و بعد همزمان کلید B رو هم بزنین)
۵- یکم صبر کنین تا یک کد تایید ۴ رقمی براتون نمایش داده بشه. اون کد رو از تلگرام روی تلفن همراه یا رایانه تون برای ربات ارسال کنین. تمام

اگه لپتاپ نداشتین دقت کنین که می تونین به یکی از دوستانتون بگین این کارهارو انجام بده و کد تایید ۴ رقمی رو برای شما بخونه. شما اون کد رو به ربات از طریق حساب تلگرام خودتون ارسال کنین. اینطوری ربات می فهمه برنامه متعلق به شماست و امکانات ربات با توجه به برنامه شما برای خودتون فعال میشه.
`;

bot.command("help", async (ctx) => {
  await ctx.reply(helpForSettingWeekSchedule, {
    reply_markup: new InlineKeyboard()
      .text("فیلم آموزش مرحله ۱", "videoTutorialForInstallingExtension")
      .text("فیلم آموزش مراحل ۲ تا ۵", "videoTutorialForSendingWeekSchedule"),
  });
  // await bot.api.sendVideo(ctx.chat.id, "", {
  // caption: "همین حرفای بالا ولی تصویری :)",
  // });
});

bot.callbackQuery("videoTutorialForInstallingExtension", async (ctx) => {
  await ctx.replyWithVideo(
    "BAACAgQAAxkBAAIDFmUr8W2e9DG92TnKYNL0_qxInlNeAALyEAACT1FgUeDK6u_Z2D2rMAQ"
  );

  ctx.answerCallbackQuery("");
});
