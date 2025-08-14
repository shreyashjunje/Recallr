const express = require("express");
const { generateTelegramLink } = require("../controllers/botController");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.post("/link", authMiddleware, generateTelegramLink);

module.exports = router;
