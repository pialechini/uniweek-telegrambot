import { replyButtons } from '@/bot/buttons';
import errors from '@/bot/errors';
import { constructMiniappLinkMenu, mainMenu } from '@/bot/keyboards';
import messages from '@/bot/messages';
import { createUser, findIdentity } from '@/db/user';
import { env } from '@/providers';
import { Bot } from 'grammy';

function setupBot() {
  bot = new Bot(env.TELEGRAM_TOKEN);

  bot.command('start', (ctx) => {
    ctx.reply(messages.greeting, {
      reply_markup: mainMenu,
    });
  });

  bot.hears(replyButtons.about, (ctx) => ctx.reply(messages.about));
  bot.hears(replyButtons.help, (ctx) => ctx.reply(messages.help));
  bot.hears(replyButtons.supportingChannel, (ctx) =>
    ctx.reply(messages.supportingChannel),
  );

  bot.hears(replyButtons.weekSchedule, async (ctx) => {
    const telegramId = ctx.from?.id;

    if (!telegramId) {
      return;
    }

    let identity = await findIdentity(telegramId);

    if (!identity) {
      identity = await createUser(telegramId);
    }

    if (!identity) {
      console.error('something wrong with DB');
      ctx.reply(errors.database.general);
      return;
    }

    ctx.reply(messages.uniweekLink.menuText, {
      reply_markup: constructMiniappLinkMenu(identity.token),
    });
  });

  bot.on('callback_query:data', async (ctx) => {
    if (ctx.callbackQuery.data === 'opened_miniapp_link') {
      await ctx.editMessageText(messages.uniweekLink.assigned);
      await ctx.answerCallbackQuery();
    }
  });

  bot.on('message', (ctx) => ctx.reply('Got another message!'));
}

let bot: Bot;

export { setupBot, bot };
