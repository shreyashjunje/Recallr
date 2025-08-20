const Quiz = require("../models/Quiz");
const { processQuizWithGemini } = require("../services/geminiService");

const generateQuiz = async (req, res) => {
  const formData = req.body;
  const file = req.file;
//   const fileBuffer = req.file.buffer;
//   console.log("File buffer:", fileBuffer);
  console.log("Received file:", file);
  console.log("Received form data:", formData);

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const quizData = await processQuizWithGemini(file, formData);

    console.log("Quiz data processed:", quizData);

     // Save in MongoDB
    const newQuiz = await Quiz.create({
      userId: req.body.userId, // If you have auth
      pdf: null, // You can save file ref if needed
      title: quizData.title,
      description: quizData.description,
      category: quizData.category,
      tags: quizData.tags,
      settings: {
        numQuestions: req.body.numQuestions,
        difficulty: req.body.difficulty,
        questionTypes: req.body.questionTypes,
        timeLimit: req.body.timeLimit,
        mode: req.body.mode,
        markingScheme: { correct: 1, wrong: req.body.markingScheme === "negative" ? -0.25 : 0 }
      },
      questions: quizData.questions,
    });

    console.log("Quiz generated successfully:", newQuiz);

     res.status(200).json({
      message: "Quiz generated successfully",
      quiz: newQuiz,
    });



  } catch (error) {
    console.error("Error generating quiz:", error);
    // Handle error appropriate
    return res.status(500).json({ error: "Failed to generate quiz" });
  }
};

module.exports = { generateQuiz };
