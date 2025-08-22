const { default: axios } = require("axios");
const dotenv = require("dotenv");

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

    console.log("get")
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

module.exports = { generateMotivation };
