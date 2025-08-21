// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("cloudinary").v2;

// // Quiz PDF storage (separate folder)
// const quizStorage = new CloudinaryStorage({
//   cloudinary,
//   params:async (req, file) => {
//      if (file.mimetype === "application/pdf") {
//       return {
//         folder: "recallr_quiz_files",
//         resource_type: "raw", // important for PDFs
//         type: "upload",
//         use_filename: true,
//         unique_filename: false,
//         format: "pdf",
//       };
//     }

//     // For images
//     return {
//       folder: "recallr_quiz_files",
//       allowed_formats: ["jpg", "png", "jpeg", "svg", "webp"],
//       type: "upload",

//       resource_type: "image",
//       use_filename: true,
//       unique_filename: false,
//     };
//   },
// });

// const quizUpload = multer({ storage: quizStorage });

// module.exports = quizUpload;

const multer = require("multer");

// Use memory storage (keeps file in buffer instead of disk/cloudinary)
const summaryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // optional: limit file size (10MB)
});

module.exports = summaryUpload;
