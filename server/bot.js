require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
// const axios = require("axios");
// const FormData = require("form-data");
const User = require("./models/User");
const axios = require("axios");
const FormData = require("form-data");
// const { linkTelegramAccount } = require("./controllers/botController");
// const  linkTelegramAccount  = require("./controllers/botController");

const controller = require("./controllers/botController");
console.log("controller exports:", controller);

const { TELEGRAM_BOT_TOKEN, API_BASE_URL, BOT_SHARED_SECRET } = process.env;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

console.log("Telegram Bot started...");

bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match[1]; // The token passed after /start

  console.log("Link attempt with token:", token, "from chatId:", chatId);

  const result = await controller.linkTelegramAccount(chatId, token);
  console.log("Link result:", result);
  bot.sendMessage(chatId, result.message);
});

// Document Handler
bot.on("document", async (msg) => {
  console.log("in the document handler");

  const chatId = msg.chat.id;
  const doc = msg.document;

  console.log("Received document:", doc);
  console.log("chatId:", chatId);

  try {
    console.log("in the try block");
    // 1. Validate PDF
    if (!doc.mime_type?.includes("pdf") && !doc.file_name?.endsWith(".pdf")) {
      return bot.sendMessage(chatId, "❌ Please send a PDF file.");
    }

    console.log("1. PDF validated");

    // 1) Resolve Telegram direct file URL
    const file = await bot.getFile(doc.file_id); // has file_path
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

    console.log("2. File URL resolved:", fileUrl);
    console.log("file:", file);

    // 2) Stream it to your backend as multipart/form-data

    const fileResp = await axios.get(fileUrl, { responseType: "arraybuffer" });
    // console.log("fileResp:", fileResp.data);

    const fileBuffer = Buffer.from(fileResp.data);

    console.log("3. File downloaded as buffer");

    console.log("fileBuffer:", fileBuffer);
    // console.log("telegrmamChatId:", chatId);
    console.log("fileurl:", fileUrl);

    const form = new FormData();
    form.append("telegramChatId", String(chatId));
    form.append("pdf", fileBuffer, {
      filename: doc.file_name,
      contentType: doc.mime_type,
    });

    // form.append("pdf", fileResp.data, {
    //   filename: doc.file_name,
    //   contentType: doc.mime_type,
    // });
    // console.log("chatId:", chatId);
    // console.log("form:::", form);

    // console.log("form::::::   ", form);
    // console.log("form headers::::::   ", form.getHeaders());

    console.log("4. Sending file to backend...");
    const res = await axios.post(
      `${process.env.API_BASE_URL}/api/bot/upload-telegram`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          "x-bot-secret": process.env.BOT_SHARED_SECRET,
        },
        maxBodyLength: Infinity,
      }
    );

    // console.log("4. File sent to backend:", res.data);

    if (res.status === 200) {
      bot.sendMessage(
        chatId,
        "📚 *Your PDF has been uploaded and processed successfully!*\n\n" +
          "You can now view the pdf info in the My library section. 🚀",
        { parse_mode: "Markdown" }
      );
    }
  } catch (error) {
    // console.error("Bot error:", error);

    bot.sendMessage(chatId, "❌ Processing failed. Please try again.");
  }
});

module.exports = bot;
