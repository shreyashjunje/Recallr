
const multer = require("multer");

// Use memory storage (keeps file in buffer instead of disk/cloudinary)
const flashcardsUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // optional: limit file size (10MB)
});

module.exports = flashcardsUpload;
