const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

// Reusable function to notify users
exports.notifyUser = async (chatId, message) => {
  try {
    await bot.sendMessage(chatId, message);
  } catch (error) {
    console.error("Failed to notify user:", error);
  }
};