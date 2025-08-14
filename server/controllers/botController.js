const crypto = require("crypto");
const User = require("../models/User");
require("dotenv").config();


const generateTelegramLink = async (req, res) => {
  try {
    console.log("reached the backedn controller...");
    const userId = req.user.id; // Assuming you have auth middleware
    // console.log("userId:", userId);

    // Create token
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    // console.log("token generated:", token, "expires at:", expiresAt);

    // Save token in user
    await User.findByIdAndUpdate(userId, {
      telegramLinkToken: { token, expiresAt },
    });

    // Create link
    const botUsername = process.env.TELEGRAM_BOT_USERNAME;
    // console.log("botUsername:", botUsername);
    const link = `https://t.me/${botUsername}?start=${token}`;
     console.log("Generated link:", link);


    // res.json({ link });
    res.status(200).json({
      success: true,
      message: "Telegram link generated successfully",
      link,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate link" });
  }
};


// Called from bot when /start <token> is used
const linkTelegramAccount = async (chatId, token) => {
  try {
    const user = await User.findOne({ telegramLinkToken: token });
    if (!user) {
      return { success: false, message: "Invalid or expired token." };
    }

    // Link the Telegram account
    user.telegramChatId = chatId;
    user.telegramLinkToken = null;
    user.telegramLinkedAt = new Date();
    await user.save();

    return { success: true, message: "✅ Your Telegram is now linked!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "❌ Something went wrong." };
  }
};


module.exports = {
  generateTelegramLink,
  linkTelegramAccount
};
