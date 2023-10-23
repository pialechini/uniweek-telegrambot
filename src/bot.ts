import app from "./create-app";
import bot from "./create-bot";
import { webhookCallback } from "grammy";
import "./features/command-start";
import "./features/help";
import "./features/week-schedule";

bot.api.setMyCommands([
  { command: "week", description: "برنامه هفتگی" },
  { command: "help", description: "راهنمای جامع" },
]);

app.use(
  "/bot6333079771:AAFqCU2vMP7s95JHfzej_vUQ9ScR59uuZHQ",
  webhookCallback(bot, "express")
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot listening on port ${PORT}`);
});
