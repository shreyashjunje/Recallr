const { generateSummary,getAllSummaries,getSummary } = require("../controllers/summaryController");
const summaryUpload = require("../middlewares/summaryFileUploadMiddleware");
const { authMiddleware } = require('../middlewares/auth');
const router = require("express").Router();

router.post("/generate-summary",summaryUpload.single('file'),generateSummary);
router.get("/get-all-summaries",authMiddleware,getAllSummaries)
router.get("/get-summary/:id",authMiddleware,getSummary)

module.exports=router;