const multer = require("multer");

// Store in memory (Buffer) instead of writing to disk
const storage = multer.memoryStorage();

// File filter for PDFs only
function fileFilter(req, file, cb) {
  if (file.mimetype.includes("pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
}

const uploadTelegram = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit
});

module.exports = { uploadTelegram };
