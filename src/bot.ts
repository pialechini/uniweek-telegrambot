import * as express from "express";
import bot from "./create-bot";
import { webhookCallback } from "grammy";
import "./features/bot-start";
import "./features/help/help";
import "./features/week-schedule";

bot.api.setMyCommands([
  { command: "week", description: "برنامه هفتگی" },
  { command: "set", description: "تنظیم برنامه هفتگی" },
  { command: "help", description: "راهنمای جامع" },
]);

if (process.env.NODE_ENV === "production") {
  const app = express.default();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  bot.start();
}
