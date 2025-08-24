const { generateFlashcards, getAllFlashcards, getFlashacards } = require('../controllers/flashcardsController');
const { authMiddleware } = require('../middlewares/auth');
const flashcardsUpload = require('../middlewares/flashcardMiddlewares');

const router=require('express').Router();


router.post("/generate-flashcards",flashcardsUpload.single('file'),generateFlashcards)
router.get("/get-all-flashcards",authMiddleware,getAllFlashcards);
router.get("/get-flashcards/:id",authMiddleware,getFlashacards)

module.exports=router;