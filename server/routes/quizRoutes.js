// const { create } = require("../models/User");

const { generateQuiz, getAllQuizzes, getQuiz, saveQuizResult, getQuizStats } = require("../controllers/quizController");
const quizUpload = require("../middlewares/quizUploadMiddleware");
const { authMiddleware } = require('../middlewares/auth');



const router = require("express").Router();

router.post("/generate-quiz",quizUpload.single('uploadedFile'),generateQuiz);
router.get("/get-all-quizzes",authMiddleware,getAllQuizzes)
router.get("/get-quiz/:id",authMiddleware,getQuiz)
router.post("/submit-quiz",authMiddleware,saveQuizResult)
router.get("/quiz-stats",authMiddleware,getQuizStats    )

module.exports = router;