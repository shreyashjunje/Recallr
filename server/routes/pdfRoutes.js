const express=require('express');
const router=express.Router();
const upload = require("../middlewares/uploadMiddleware");


const {uploadPdf} = require('../controllers/pdfController')

router.post("/upload-pdf",upload.single('file'),uploadPdf);

module.exports = router;




















