import { Bot } from "grammy";

const bot = new Bot(process.env.TELEGRAM_TOKEN || "");
console.log("create bot executed");

export default bot;
