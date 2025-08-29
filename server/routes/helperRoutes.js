const router = require("express").Router();
const {generateMotivation, addToFavourite, getFavouritesPdfs, removeFromFavourites}=require('../controllers/helperController')
const { authMiddleware } = require('../middlewares/auth');

router.get("/get-motivation", generateMotivation);
router.post("/add-to-favourite",authMiddleware,addToFavourite)
router.get("/get-favourite-pdfs",authMiddleware,getFavouritesPdfs)
router.delete("/remove-from-favourite",authMiddleware,removeFromFavourites)

module.exports = router;
    