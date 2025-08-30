const express=require('express');
const router=express.Router();
const upload = require("../middlewares/uploadMiddleware");


const {uploadPdf,deletePdf,editPdf,downloadPdf, getAllPdfs, getPdfDetail, generateSummaryOnly, generateFlashCardsOnly} = require('../controllers/pdfController');
const { authMiddleware } = require('../middlewares/auth');

router.post("/upload-pdf",upload.single('file'),uploadPdf);
router.delete("/delete-pdf",deletePdf)
router.patch("/edit-pdf",editPdf)
router.get("/pdfs",authMiddleware,getAllPdfs)
router.get("/pdfs/:id",getPdfDetail)
router.post("/download-pdf",downloadPdf) // for fetching pdf by id
router.post("/summary-only",generateSummaryOnly)
router.post("/flashcards-only",generateFlashCardsOnly)

module.exports = router;




















