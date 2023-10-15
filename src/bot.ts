import * as express from "express";
import bot from "./create-bot";
import { CommandContext, Context, webhookCallback } from "grammy";
// import "./features/week-schedule";
import "./commands";
import "./cache";
import { singUp } from "./features/auth/auth";

bot.on("message:text", async (ctx) => {
  ctx.reply("handler1");
});

bot.on("message:text", async (ctx) => {
  ctx.reply("handler2");
});

bot.api.setMyCommands([
  { command: "week", description: "برنامه هفتگی" },
  { command: "set", description: "تنظیم برنامه هفتگی" },
  { command: "help", description: "راهنمای جامع" },
  { command: "start", description: "شروع" },
]);

// Start the server
if (process.env.NODE_ENV === "production") {
  // Use Webhooks for the production server
  const app = express.default();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  // Use Long Polling for development
  bot.start();
}
