const { generateSummary } = require("../controllers/summaryController");
const summaryUpload = require("../middlewares/summaryFileUploadMiddleware");

const router = require("express").Router();

router.post("/generate-summary",summaryUpload.single('file'),generateSummary);

module.exports=router;