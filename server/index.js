const express = require("express");
const app = express();
const connectDb = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const userRoutes = require("./routes/userRoute");
const botRoutes = require("./routes/botRoutes");
const quizRoutes = require("./routes/quizRoutes");
const summaryRoutes= require("./routes/summaryRoutes")
const flashcardsRoutes= require("./routes/flashcardsRoutes")
const helperRoutes= require("./routes/helperRoutes")
const bot =require("./bot")
require("dotenv").config();
require("./config/passport");

let cors = require("cors");




connectDb();


app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    credentials: true,
  })
);

app.use(express.json());

// Session (required for Passport)
app.use(session({ secret: "yoursecret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/user", userRoutes)
app.use("/api/bot", botRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/summary",summaryRoutes);
app.use("/api/flashcards",flashcardsRoutes);
app.use("/api/helper",helperRoutes)


app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
