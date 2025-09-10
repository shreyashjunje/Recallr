const TelegramBot = require("node-telegram-bot-api");
const { linkTelegramAccount } = require("./controllers/telegramController");

// const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const bot = require("../bot");

bot.onText(/^\/start(?:\s+(\S+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match[1]; // the token after /start

  // Send greeting
  bot.sendMessage(
    chatId,
    `👋 Hello *${msg.from.first_name || "there"}*!  
Welcome to Recallr Bot!  
Use this bot to receive reminders and updates from our platform.`,
    { parse_mode: "Markdown" }
  );

  if (!token) {
    bot.sendMessage(
      chatId,
      "👋 Hello! Please start linking from your account in the website."
    );
    return;
  }

  const result = await linkTelegramAccount(chatId, token);
  bot.sendMessage(chatId, result.message);
});

module.exports = bot;
