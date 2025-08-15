const { GoogleAIFileManager } =require( "@google/generative-ai/server");
const { GoogleGenerativeAI } =require("@google/generative-ai");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

async function processWithGemini(fileUrl, customPrompt) {
  console.log("Processing PDF with Gemini:", fileUrl);
  
  try {
    // 1️⃣ Download PDF locally
    console.log("Downloading PDF from Cloudinary...");
    const pdfPath = path.join(__dirname, "temp.pdf");
    const cloudinaryResponse = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      auth: {
        username: process.env.CLOUDINARY_API_KEY,
        password: process.env.CLOUDINARY_API_SECRET
      }
    });
    fs.writeFileSync(pdfPath, cloudinaryResponse.data);

    // 2️⃣ Upload PDF to Gemini
    console.log("Uploading PDF to Gemini...");
    const uploadResult = await fileManager.uploadFile(pdfPath, {
      mimeType: "application/pdf",
      displayName: "document.pdf"
    });
    console.log("Uploaded to Gemini:", uploadResult.file.uri);

    // 3️⃣ Prepare prompt
    const defaultPrompt = `Analyze this PDF and return STRICT JSON with:
      - title (max 5 words)
      - category
      - tags (5-7 keywords)`;

    
    // 4️⃣ Send to Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    console.log("Sending request to Gemini...");

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: customPrompt || defaultPrompt },
            { fileData: { mimeType: "application/pdf", fileUri: uploadResult.file.uri } }
          ]
        }
      ]
    });

    console.log("Received response from Gemini");

    // 5️⃣ Parse JSON
    const responseText = result.response.text();
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    return JSON.parse(responseText.slice(jsonStart, jsonEnd));
    
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw new Error(`AI processing failed: ${error.message}`);
  }
}

module.exports = { processWithGemini };
