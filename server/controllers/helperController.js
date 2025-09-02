const { default: axios } = require("axios");
const dotenv = require("dotenv");
const User = require("../models/User");
const Pdf = require("../models/Pdf");

dotenv.config();
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const generateMotivation = async (req, res) => {
  try {
    // 1. Fetch random quote (using Quotable API)
    const quoteRes = await axios.get("https://zenquotes.io/api/random");

    const quoteData = quoteRes.data;
    console.log("quoteData: ", quoteData);

    // 2. Fetch random motivational background image from Unsplash
    const imageRes = await axios.get(
      `https://api.unsplash.com/photos/random?query=motivation,nature,success&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
    );

    console.log("get");
    const imageData = imageRes.data;
    // console.log("image:",imageData)
    // console.log("Q:",quoteData[0].q);
    // console.log("a:",quoteData[0].a);

    // 3. Send combined response
    res.json({
      quote: quoteData[0].q,
      author: quoteData[0].a,
      image: imageData.urls.regular, // background image
    });
  } catch (err) {
    // console.log("error:", err);
    console.log("errr", err.message);
    res.status(500).json({ message: "sorry can not give you the motivation" });
  }
};

const addToFavourite = async (req, res) => {
  try {
    const userId = req.user?.id;
    const pdfId = req.body.pdfId;

    if (!userId) {
      return res.status(400).json({ message: "user id not found" });
    }

    if (!pdfId) {
      return res.status(400).json({ message: "pdf id not found" });
    }

    // Push only if not already favourited
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favouritePdfs: pdfId } }, // $addToSet avoids duplicates
      { new: true }
    ).populate("favouritePdfs");

    await Pdf.findByIdAndUpdate(pdfId, { isFavourite: true });

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json({
      success: true,
      message: "pdf added to favourites",
      data: user.favouritePdfs,
    });
  } catch (err) {
    console.log("error->", err);
    res.status(500).json("server error in adding pdf to favourite");
  }
};

const getFavouritesPdfs = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "user if not found" });
    }

    const user = await User.findById(userId).populate("favouritePdfs");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({
      success: true,
      message: "fav pdfs fetched successfully",
      data: user.favouritePdfs,
    });
  } catch (err) {
    console.log("error->", err);
    console.log("server error while fetching the fav pdfs");
  }
};

const removeFromFavourites = async (req, res) => {
  try {
    const userId = req.user?.id;
    const pdfId = req.body.pdfId;

    if (!userId) {
      return res.status(400).json({ message: "user id not found" });
    }

    if (!pdfId) {
      return res.status(400).json({ message: "pdf id not found" });
    }

    // Push only if not already favourited
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favouritePdfs: pdfId } }, // $addToSet avoids duplicates
      { new: true }
    ).populate("favouritePdfs");

    await Pdf.findByIdAndUpdate(pdfId, { isFavourite: false });

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json({
      success: true,
      message: "pdf removed from favourites",
      data: user.favouritePdfs,
    });
  } catch (err) {
    console.log("error->", err);
    res.status(500).json("server error in removing pdfs from favourite");
  }
};

module.exports = {
  generateMotivation,
  addToFavourite,
  getFavouritesPdfs,
  removeFromFavourites,
};
