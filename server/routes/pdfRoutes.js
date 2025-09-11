const express = require("express");
const router = express.Router();
// const upload = require("../middlewares/");
const { uploadTelegram } = require("../middlewares/upload");

const {
  uploadPdf,
  deletePdf,
  editPdf,
  downloadPdf,
  getAllPdfs,
  getPdfDetail,
  generateSummaryOnly,
  generateFlashCardsOnly,
  updatePdfProgress,
  getCategories,
  generateQuizOnly,
} = require("../controllers/pdfController");
const { authMiddleware } = require("../middlewares/auth");

router.post(
  "/upload-pdf",
  authMiddleware,
  uploadTelegram.single("file"),
  uploadPdf
);
router.delete("/delete-pdf", deletePdf);
router.patch("/edit-pdf", editPdf);
router.get("/pdfs", authMiddleware, getAllPdfs);
router.get("/pdfs/:id", getPdfDetail);
router.put("/:id/progress", updatePdfProgress);
router.post("/download-pdf", downloadPdf); // for fetching pdf by id
router.post("/summary-only", generateSummaryOnly);
router.post("/flashgenius-only", authMiddleware, generateFlashCardsOnly);
router.post("/quiz-only", authMiddleware, generateQuizOnly);
router.get("/get-categories", authMiddleware, getCategories);

module.exports = router;
