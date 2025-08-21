const { generateFlashcards } = require('../controllers/flashcardsController');
const flashcardsUpload = require('../middlewares/flashcardMiddlewares');

const router=require('express').Router();


router.post("/generate-flashcards",flashcardsUpload.single('file'),generateFlashcards)

module.exports=router;