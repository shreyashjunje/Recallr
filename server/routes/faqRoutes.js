const express = require("express");
const { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } = require("../controllers/faqController");
const router = express.Router();
const { protect, admin } = require("../middlewares/auth");

router.get("/get-all-faqs", getAllFAQs);
router.post("/create-faq", protect, admin, createFAQ);
router.put("/update-faq/:id", protect, admin, updateFAQ);
router.delete("/delete-faq/:id", protect, admin, deleteFAQ);

module.exports = router;
