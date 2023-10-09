import { Bot } from 'grammy';

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

export default bot;
