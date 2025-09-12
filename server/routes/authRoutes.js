const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares/auth");


const {
  registerUser,
  loginUser,
  logoutUser,
  forgotpassword,
  validateResetToken,
  resetpassword,
  changePassword,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password",forgotpassword)
router.post("/reset-password",resetpassword)
router.post("/change-password",authMiddleware,changePassword)
router.post("/validate-reset-token",validateResetToken)

// 1️⃣ Redirect to Google for login
router.get("/google", (req, res, next) => {
  console.log("✅ /google route hit");
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

//google callback url
router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("📞 Google callback received");
    next();
  },
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      
      // Set cookie or redirect with token
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
      
      console.log("✅ Google authentication successful");
      res.redirect(`http://localhost:5173/dashboard`);
    } catch (error) {
      console.error("❌ Token error:", error);
      res.redirect("http://localhost:5173/login?error=token_failed");
    }
  }
);
module.exports = router;
