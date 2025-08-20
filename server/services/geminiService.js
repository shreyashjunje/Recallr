const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");
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
    console.log("PDF will be saved to:", pdfPath);
    const cloudinaryResponse = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      auth: {
        username: process.env.CLOUDINARY_API_KEY,
        password: process.env.CLOUDINARY_API_SECRET,
      },
    });
    console.log("PDF downloaded, saving to disk...");
    fs.writeFileSync(pdfPath, cloudinaryResponse.data);
    console.log("PDF downloaded successfully, saving to disk...");

    // 2️⃣ Upload PDF to Gemini
    console.log("Uploading PDF to Gemini...");
    const uploadResult = await fileManager.uploadFile(pdfPath, {
      mimeType: "application/pdf",
      displayName: "document.pdf",
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
            {
              fileData: {
                mimeType: "application/pdf",
                fileUri: uploadResult.file.uri,
              },
            },
          ],
        },
      ],
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

async function processQuizWithGemini(file, settings) {
  console.log("Processing quiz with Gemini...");
  try {
    // 🔹 Convert buffer to Base64
    const fileBase64 = file.buffer.toString("base64");

    // 🔹 Upload PDF to Gemini directly from memory
    const uploadResult = await fileManager.uploadFile(file.buffer, {
      mimeType: "application/pdf",
      displayName: "quiz.pdf",
      inline: true,
    });

    // 🔹 Enhanced prompt with explicit formatting instructions
    const customPrompt = `
You are an AI that generates QUIZZES in STRICT JSON format only.

Generate a quiz based on the uploaded PDF using the following settings:
- Number of questions: ${settings.numQuestions}
- Difficulty: ${settings.difficulty}
- Question types: ${settings.questionTypes.join(", ")}

Return ONLY a JSON object with this schema - NO additional text, NO markdown, NO code blocks, NO explanations:

{
  "title": "string (max 5 words)",
  "description": "string (short summary of quiz)",
  "category": "string",
  "tags": ["string"],
  "questions": [
    {
      "type": "MCQ | TrueFalse | FillBlank | ShortAnswer",
      "questionText": "string",
      "options": ["string"],   // only for MCQ
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}

IMPORTANT: Return PURE JSON only, without any surrounding text or markdown formatting.
`;

    // 🔹 Call Gemini model with configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            category: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  questionText: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correctAnswer: { type: "string" },
                  explanation: { type: "string" },
                },
                required: [
                  "type",
                  "questionText",
                  "correctAnswer",
                  "explanation",
                ],
              },
            },
          },
          required: ["title", "description", "category", "tags", "questions"],
        },
      },
    });

    console.log("Sending request to Gemini...");
    const result = await model.generateContent([
      { text: customPrompt },
      {
        fileData: {
          mimeType: "application/pdf",
          fileUri: uploadResult.file.uri,
        },
      },
    ]);

    console.log("Received response from Gemini");
    console.log("Response text:", result);

    // 5️⃣ Parse JSON
    const responseText = result.response.text();
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    return JSON.parse(responseText.slice(jsonStart, jsonEnd));


    
  } catch (error) {
    console.error("❌ Gemini Processing Error:", error);
    throw new Error("Failed to process quiz with Gemini: " + error.message);
  }
}

module.exports = { processWithGemini, processQuizWithGemini };
