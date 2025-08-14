const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const User = require("./models/User");
const dotenv = require("dotenv");

// Load env
dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
console.log("TELEGRAM_BOT_TOKEN:", token);
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN is not set in .env file");
}

// // Connect MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log("Mongo Error:", err));

// Create bot (polling mode)
const bot = new TelegramBot(token, { polling: true });

// Handle /start with optional token
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match[1]; // token from URL if exists

  if (!token) {
    return bot.sendMessage(chatId, "Hi! Please connect your account from the website first.");
  }

  // Find user with matching token
  const user = await User.findOne({
    "telegramLinkToken.token": token,
    "telegramLinkToken.expiresAt": { $gt: new Date() }
  });

  if (!user) {
    return bot.sendMessage(chatId, "❌ Invalid or expired link. Please try again from the website.");
  }

  // Save chatId and remove token
  user.telegramChatId = chatId;
  user.telegramLinkToken = undefined;
  await user.save();

  bot.sendMessage(chatId, `✅ Your account is now linked! You can send PDFs anytime.`);
});

module.exports = bot;
