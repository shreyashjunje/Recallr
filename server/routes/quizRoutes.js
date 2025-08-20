// const { create } = require("../models/User");

const { generateQuiz } = require("../controllers/quizController");
const quizUpload = require("../middlewares/quizUploadMiddleware");


const router = require("express").Router();

router.post("/generate-quiz",quizUpload.single('uploadedFile'),generateQuiz);

module.exports = router;