const router = require("express").Router();
const {generateMotivation}=require('../controllers/helperController')

router.get("/get-motivation", generateMotivation);

module.exports = router;
