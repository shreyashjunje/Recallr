const express = require("express");
const { generateTelegramLink,uploadTelegramPDF } = require("../controllers/botController");
const { authMiddleware } = require("../middlewares/auth");
const multer = require('multer');
const upload = require("../middlewares/uploadMiddleware");
const { uploadTelegram } = require("../middlewares/upload");



const router = express.Router();

router.post("/link", authMiddleware, generateTelegramLink);

router.post("/upload-telegram", uploadTelegram.single('pdf'),uploadTelegramPDF);


module.exports = router;
