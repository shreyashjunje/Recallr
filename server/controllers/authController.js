const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/sendEmail");
require("dotenv").config(); // make sure this is at the very top!
const JWT_SECRET = process.env.JWT_SECRET;
const registerUser = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword, phoneNumber } =
      req.body;
    console.log(req.body, "........");

    if (!userName || !email || !password || !confirmPassword || !phoneNumber) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json("Passwords do not match,please try again");
    }

    //check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    console.log(existingUser, "///////");

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //create new USER
    const newUser = new User({
      userName,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
      token,
    });
  } catch (err) {
    console.error("Registration error: ", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { loginId, password } = req.body;
    if (!loginId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [
        { email: loginId },
        { phoneNumber: loginId },
        { userName: loginId },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber, // Include phone number in the token
      }, // Payload: minimal info
      process.env.JWT_SECRET, // Secret key (you'll store in .env)
      { expiresIn: "1d" } // Token expiry
    );

    return res
      .status(200)
      .json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Email from forgot password:", email);
    if (!email) {
      return res.status(400).json({ message: "email not found" });
    }

    const userExist = await User.findOne({ email });
    console.log("userexist:::", userExist);

    if (!userExist) {
      return res.status(400).json({
        message: "If this email exists, we’ve sent a password reset link",
      });
    }

    console.log("hiiiiiiiiiiiiiiiiiiiii");

    const token = jwt.sign({ userId: userExist._id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    (userExist.resetPasswordToken = token),
      (userExist.resetPasswordExpires = Date.now() + 15 * 60 * 1000);
    await userExist.save();

    // construct reset link
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // send email
    const subject = "Password Reset Request";
    const text = `Click the link to reset your password: ${resetLink}`;
    const html = `
      <p>Hello ${userExist.userName || "User"},</p>
      <p>You requested to reset your password.</p>
      <p>
        <a href="${resetLink}" target="_blank">Click here to reset your password</a>
      </p>
      <p>This link will expire in 15 minutes.</p>
    `;

    await sendEmail(userExist.email, subject, text, html);

    return res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({
      success: false,
      message: "server error in forgot password",
    });
  }
};

const validateResetToken = async (req, res) => {
  const { token } = req.body;

  const user = await User.findOne({ resetPasswordToken: token });

  if (!user || user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  res.json({ message: "Token valid" });
};

const resetpassword = async (req, res) => {
  console.log("in the reset password controller")
  const { token, password } = req.body;
  console.log("token->",token)
  console.log("newpass->",password)

  const user = await User.findOne({ resetPasswordToken: token });
  console.log("user->",user)

  if (!user || user.resetPasswordExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // hash new password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  // invalidate token so it cannot be reused
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotpassword,
  resetpassword,
  validateResetToken,
};
