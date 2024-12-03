import { replyButtons } from '@/bot/buttons';
import { env } from '@/providers';
import { InlineKeyboard, Keyboard } from 'grammy';

const mainMenu = new Keyboard()
  .text(replyButtons.weekSchedule)
  .row()
  .text(replyButtons.help)
  .row()
  .text(replyButtons.supportingChannel)
  .text(replyButtons.about)
  .persistent()
  .resized();

const constructMiniappLinkMenu = (id: string) => {
  return new InlineKeyboard()
    .url('Open Link', `${env.MINIAPP_URL}/assign/${id}`)
    .text('I opened the link', 'opened_miniapp_link');
};

export { mainMenu, constructMiniappLinkMenu };
