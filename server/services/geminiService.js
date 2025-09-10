require("dotenv").config(); // make sure this is at the very top!

const { GoogleAIFileManager } = require("@google/generative-ai/server");
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing. Check your .env file.");
}
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

    //   // 3️⃣ Prepare prompt
    const defaultPrompt = `Analyze this PDF and return STRICT JSON with:
        - title (max 5 words)
        - category
        - tags (5-7 keywords)
        IMPORTANT: Return PURE JSON only, without any surrounding text or markdown formatting.

    `;

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
    console.log("result:::", result);

    // 5️⃣ Parse JSON
    const responseText = await result.response.text();
    console.log("responseText", responseText);
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}") + 1;
    return JSON.parse(responseText.slice(jsonStart, jsonEnd));
  } catch (error) {
    if (error.status === 503 && retries > 0) {
      console.warn(`Gemini overloaded. Retrying in ${delay / 1000}s...`);
      await new Promise((r) => setTimeout(r, delay));
      return processWithGemini(prompt, retries - 1, delay * 2); // exponential backoff
    }
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

async function processSummaryWithGemini(file, customPrompt) {
  try {
    console.log("in the gemini function to generate summary");
    // 1. Upload file to Gemini
    console.log(
      "Using Gemini Key:",
      process.env.GEMINI_API_KEY.slice(0, 6),
      "..."
    );

    const uploadResp = await fileManager.uploadFile(file.buffer, {
      mimeType: "application/pdf", // e.g. application/pdf
      displayName: file.originalname, // e.g. "React Hooks.pdf"
      inline: true,
    });

    //  const uploadResult = await fileManager.uploadFile(file.buffer, {
    //   mimeType: "application/pdf",
    //   displayName: "quiz.pdf",
    //   inline: true,
    // });

    console.log("✅ File uploaded to Gemini:", uploadResp.file);

    // 2. Base summarization rules
    const basePrompt = `
You are an AI that summarizes documents in a clean and structured way.

Read the given file and generate a structured summary in **JSON format only** (no extra text).  
Follow this structure:

{
  "title": "A short and catchy title for the document",
  "tags": ["tag1", "tag2", "tag3"], 
  "summary": [
    "Use bullet points for key insights",
    "Summarize important sections clearly",
    "Keep sentences concise and meaningful"
  ],
  "keyPoints": [
    { "point": "Use bullet points for key insights", "important": true },
    { "point": "Summarize important sections clearly", "important": false },
    { "point": "Keep sentences concise and meaningful", "important": true }
  ],
  "category": "Choose a single category that best fits (e.g., Programming, Cloud, AI, Web Development)"
}

Rules:
- The summary must be 4–6 bullet points, each capturing an important idea.
- Tags should be relevant keywords (3–5 words max each).
- Category must be a single word or short phrase.
- Do not include anything outside of the JSON object.
    `;

    // 3. Merge base + custom prompt
    const finalPrompt = `
${basePrompt}

Additional user instructions: 
${customPrompt}
    `;

    // 4. Get Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro", // or "gemini-1.5-flash" for faster responses
    });

    console.log("sending to the gemini");

    // 5. Generate content
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResp.file.mimeType,
          fileUri: uploadResp.file.uri,
        },
      },
      { text: finalPrompt },
    ]);

    console.log("getting response from the gemini");
    console.log("Response text:", result);

    // // 5️⃣ Parse JSON
    // const responseText = result.response.text();
    // const jsonStart = responseText.indexOf("{");
    // const jsonEnd = responseText.lastIndexOf("}") + 1;
    // return JSON.parse(responseText.slice(jsonStart, jsonEnd));
    const responseText = await result.response.text();
    console.log("Raw Gemini Response:", responseText);

    // Defensive check
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    // Try to extract JSON safely
    let parsedJSON;
    try {
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}") + 1;
      const jsonString = responseText.slice(jsonStart, jsonEnd);
      parsedJSON = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("❌ Failed to parse JSON:", parseErr);
      throw new Error("Gemini response was not valid JSON");
    }

    return parsedJSON;
  } catch (err) {
    console.error("❌ Error in processSummaryWithGemini:", err);
    throw err;
  }
}

async function processFlashcardsWithGemini(file, settings) {
  try {
    console.log("📌 In Gemini function to generate flashcards");

    // 1. Upload file to Gemini
    const uploadResp = await fileManager.uploadFile(file.buffer, {
      mimeType: "application/pdf",
      displayName: file.originalname,
      inline: true,
    });

    console.log("✅ File uploaded to Gemini:", uploadResp.file);

    // 2. Base instructions for flashcards
    const basePrompt = `
You are an AI that creates **educational flashcards** from documents.  

Generate output in **strict JSON format only** (no extra text).  
The structure must be:

{
  "title": "Short and clear title of the document",
  "tags": ["keyword1", "keyword2", "keyword3"],
  "category": "Choose one category (e.g., Programming, AI, Cloud)",
  "flashcards": [
    {
      "question": "Write a ${settings.questionType} type question",
      "answer": "Provide the correct answer here",
      "difficulty": "Easy | Medium | Hard"
    }
  ]
}

Rules:
- Generate exactly **${settings.numCards} flashcards**.
- Title should be 3–6 words max.
- Tags must be 3–5 short keywords (no long sentences).
- Category must be a single word or short phrase.
- Questions must be clear, concise, and based only on the document.
- Answers must be accurate and unambiguous.
- If settings.difficulty = "Mixed", assign different difficulty levels (Easy, Medium, Hard) individually to each flashcard instead of using "mixed".
- Otherwise, use the exact difficulty from settings.difficulty for all flashcards.
- Output valid JSON only, no explanations or extra text.
    `;

    // 3. Get Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

    console.log("📤 Sending request to Gemini");

    // 4. Generate flashcards
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResp.file.mimeType,
          fileUri: uploadResp.file.uri,
        },
      },
      { text: basePrompt },
    ]);

    console.log("📥 Got response from Gemini");
    console.log("direct form gemini-->", result);

    // // 5. Parse JSON safely
    // const responseText = result.response.text();
    // const jsonStart = responseText.indexOf("{");
    // const jsonEnd = responseText.lastIndexOf("}") + 1;
    // return JSON.parse(responseText.slice(jsonStart, jsonEnd));
    const responseText = await result.response.text();
    console.log("Raw Gemini Response:", responseText);

    // Defensive check
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    // Try to extract JSON safely
    let parsedJSON;
    try {
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}") + 1;
      const jsonString = responseText.slice(jsonStart, jsonEnd);
      parsedJSON = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("❌ Failed to parse JSON:", parseErr);
      throw new Error("Gemini response was not valid JSON");
    }

    return parsedJSON;
  } catch (err) {
    console.error("❌ Error in processFlashcardsWithGemini:", err);
    throw err;
  }
}

async function processSummaryWithGeminiFromUrl(
  fileUrl,
  fileName,
  customPrompt
) {
  try {
    // 1️⃣ Download PDF from Cloudinary
    const cloudinaryResponse = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      auth: {
        username: process.env.CLOUDINARY_API_KEY,
        password: process.env.CLOUDINARY_API_SECRET,
      },
    });

    // Convert ArrayBuffer → Node Buffer
    const pdfBuffer = Buffer.from(cloudinaryResponse.data);

    // (Optional) Save locally for debugging
    const pdfPath = path.join(__dirname, "temp.pdf");
    fs.writeFileSync(pdfPath, pdfBuffer);

    // 2️⃣ Upload PDF to Gemini
    console.log("Uploading PDF to Gemini...");
    const uploadResult = await fileManager.uploadFile(pdfBuffer, {
      mimeType: "application/pdf",
      displayName: fileName || "document.pdf",
    });
    console.log("✅ Uploaded to Gemini:", uploadResult);

    // 3️⃣ Prompt construction
    // 2. Base summarization rules
    const basePrompt = `
You are an AI that summarizes documents in a clean and structured way.

Read the given file and generate a structured summary in **JSON format only** (no extra text).  
Follow this structure:

{

  "summary": [
    "Use bullet points for key insights",
    "Summarize important sections clearly",
    "Keep sentences concise and meaningful"
  ],
  "keyPoints": [
    { "point": "Use bullet points for key insights", "important": true },
    { "point": "Summarize important sections clearly", "important": false },
    { "point": "Keep sentences concise and meaningful", "important": true }
  ],
}

Rules:
- The summary must be 4–6 bullet points, each capturing an important idea.
- Do not include anything outside of the JSON object.
    `;
    const finalPrompt = `
${basePrompt}

Additional user instructions: 
${customPrompt}
    `;

    // 4️⃣ Generate response
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: "application/pdf",
          fileUri: uploadResult.file.uri,
        },
      },
      { text: finalPrompt },
    ]);

    console.log("getting response from the gemini");
    console.log("Response text:", result);

    // // 5️⃣ Parse JSON
    // const responseText = result.response.text();
    // const jsonStart = responseText.indexOf("{");
    // const jsonEnd = responseText.lastIndexOf("}") + 1;
    // return JSON.parse(responseText.slice(jsonStart, jsonEnd));
    const responseText = await result.response.text();
    console.log("Raw Gemini Response:", responseText);

    // Defensive check
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    // Try to extract JSON safely
    let parsedJSON;
    try {
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}") + 1;
      const jsonString = responseText.slice(jsonStart, jsonEnd);
      parsedJSON = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("❌ Failed to parse JSON:", parseErr);
      throw new Error("Gemini response was not valid JSON");
    }

    return parsedJSON;
  } catch (err) {
    console.error("❌ Error in processSummaryWithGeminiFromUrl:", err);
    throw new Error(`AI processing failed: ${err.message}`);
  }
}

async function processFlashcardsWithGeminiFromUrl(fileUrl, settings) {
  try {
    const cloudinaryResponse = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      auth: {
        username: process.env.CLOUDINARY_API_KEY,
        password: process.env.CLOUDINARY_API_SECRET,
      },
    });

    const pdfBuffer = Buffer.from(cloudinaryResponse.data);

    const pdfPath = path.join(__dirname, "temp.pdf");
    fs.writeFileSync(pdfPath, pdfBuffer);

    console.log("Uploading PDF to Gemini...");

    const uploadResult = await fileManager.uploadFile(pdfBuffer, {
      mimeType: "application/pdf",
      displayName: "document.pdf",
    });
    console.log("✅ Uploaded to Gemini:", uploadResult);

    // 2. Base instructions for flashcards
    const basePrompt = `
You are an AI that creates **educational flashcards** from documents.  

Generate output in **strict JSON format only** (no extra text).  
The structure must be:

{
  "title": "Short and clear title of the document",
  "tags": ["keyword1", "keyword2", "keyword3"],
  "category": "Choose one category (e.g., Programming, AI, Cloud)",
  "flashcards": [
    {
      "question": "Write a ${settings.questionType} type question",
      "answer": "Provide the correct answer here",
      "difficulty": "Easy | Medium | Hard"
    }
  ]
}

Rules:
- Generate exactly **${settings.numCards} flashcards**.
- Title should be 3–6 words max.
- Tags must be 3–5 short keywords (no long sentences).
- Category must be a single word or short phrase.
- Questions must be clear, concise, and based only on the document.
- Answers must be accurate and unambiguous.
- If settings.difficulty = "Mixed", assign different difficulty levels (Easy, Medium, Hard) individually to each flashcard instead of using "mixed".
- Otherwise, use the exact difficulty from settings.difficulty for all flashcards.
- Output valid JSON only, no explanations or extra text.
    `;
    // 3. Get Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
    });

    console.log("📤 Sending request to Gemini");

    // 4. Generate flashcards
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResult.file.mimeType,
          fileUri: uploadResult.file.uri,
        },
      },
      { text: basePrompt },
    ]);

    console.log("📥 Got response from Gemini");
    console.log("direct form gemini-->", result);

    const responseText = await result.response.text();
    console.log("Raw Gemini Response:", responseText);

    // Defensive check
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    // Try to extract JSON safely
    let parsedJSON;
    try {
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}") + 1;
      const jsonString = responseText.slice(jsonStart, jsonEnd);
      parsedJSON = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("❌ Failed to parse JSON:", parseErr);
      throw new Error("Gemini response was not valid JSON");
    }

    return parsedJSON;
  } catch (err) {
    console.error("❌ Error in processSummaryWithGeminiFromUrl:", err);
    throw new Error(`AI processing failed: ${err.message}`);
  }
}

async function processQuizWithGeminiFromUrl(fileUrl, fileName, settings) {
  try {
    // 1️⃣ Download PDF from Cloudinary
    console.log("in the gemini function settings:::", settings);
    const cloudinaryResponse = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      auth: {
        username: process.env.CLOUDINARY_API_KEY,
        password: process.env.CLOUDINARY_API_SECRET,
      },
    });

    // Convert ArrayBuffer → Node Buffer
    const pdfBuffer = Buffer.from(cloudinaryResponse.data);

    // (Optional) Save locally for debugging
    const pdfPath = path.join(__dirname, "temp.pdf");
    fs.writeFileSync(pdfPath, pdfBuffer);

    // 2️⃣ Upload PDF to Gemini
    console.log("Uploading PDF to Gemini...");
    const uploadResult = await fileManager.uploadFile(pdfBuffer, {
      mimeType: "application/pdf",
      displayName: fileName || "document.pdf",
    });
    console.log("✅ Uploaded to Gemini:", uploadResult);

    // 3️⃣ Safely handle questionTypes to avoid the TypeError
    const questionTypes = Array.isArray(settings.questionTypes)
      ? settings.questionTypes
      : typeof settings.questionTypes === "string"
      ? [settings.questionTypes]
      : [];

    const questionTypesString = questionTypes.join(", ");

    // 🔹 Enhanced prompt with explicit formatting instructions
    const customPrompt = `
You are an AI that generates QUIZZES in STRICT JSON format only.

Generate a quiz based on the uploaded PDF using the following settings:
- Number of questions: ${settings.numQuestions}
- Difficulty: ${settings.difficulty}
- Question types: ${questionTypesString}

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

    // 4️⃣ Generate response
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: "application/pdf",
          fileUri: uploadResult.file.uri,
        },
      },
      { text: customPrompt },
    ]);

    console.log("getting response from the gemini");
    console.log("Response text:", result);

    const responseText = await result.response.text();
    console.log("Raw Gemini Response:", responseText);

    // Defensive check
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    // Try to extract JSON safely
    let parsedJSON;
    try {
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}") + 1;
      const jsonString = responseText.slice(jsonStart, jsonEnd);
      parsedJSON = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("❌ Failed to parse JSON:", parseErr);
      throw new Error("Gemini response was not valid JSON");
    }

    return parsedJSON;
  } catch (err) {
    console.error("❌ Error in processSummaryWithGeminiFromUrl:", err);
    throw new Error(`AI processing failed: ${err.message}`);
  }
}

module.exports = {
  processWithGemini,
  processQuizWithGemini,
  processSummaryWithGemini,
  processFlashcardsWithGemini,
  processSummaryWithGeminiFromUrl,
  processFlashcardsWithGeminiFromUrl,
  processQuizWithGeminiFromUrl,
};
