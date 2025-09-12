const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth");
const multer = require("multer");



const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  getFullProfile,
  deleteUser,
  editUser,
  getAverageProgress,
  updateProfilePicture,
} = require("../controllers/userController");

router.get("/full-profile", authMiddleware, getFullProfile);
router.delete("/delete-user", deleteUser);
router.put("/edit-profile",authMiddleware, editUser);
router.get("/average-progress", authMiddleware, getAverageProgress);
router.put("/update-profile-picture", authMiddleware,upload.single("profilePicture"), updateProfilePicture);

module.exports = router;
