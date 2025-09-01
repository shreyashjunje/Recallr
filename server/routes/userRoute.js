const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth");

const {
  getFullProfile,
  deleteUser,
  editUser,
  getAverageProgress,
} = require("../controllers/userController");
router.get("/full-profile", getFullProfile);
router.delete("/delete-user", deleteUser);
router.patch("/edit-profile", editUser);
router.get("/average-progress", authMiddleware, getAverageProgress);

module.exports = router;
