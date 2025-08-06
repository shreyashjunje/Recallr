const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

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
      { id: user._id }, // Payload: minimal info
      process.env.JWT_SECRET, // Secret key (you'll store in .env)
      { expiresIn: "7d" } // Token expiry
    );

    return res
      .status(200)
      .json({ sucess: true, message: "Login successful", token });
  } catch (err) {}
};

const logoutUser =async (req,res) => {
  try{
      res.status(200).json({ message: "Logged out successfully" });
    

  }catch(err){
    console.log("Error:",err);
    return res.status(500).json({message:"Server error"})
  }
}

module.exports = { registerUser, loginUser,logoutUser };
