const { createWorker } = require("tesseract.js");
const { fromPath } = require("pdf2pic"); // Converts PDF pages to images

let worker;

async function initWorker() {
  worker = await createWorker({
    logger: (m) => {
      // Only pass plain JSON-serializable data
      console.log(m);
    },
  });
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
}

initWorker();

async function extractTextFromPDF(pdfPath) {
  let finalText = "";

  // Convert each PDF page to image
  const convert = fromPath(pdfPath, {
    density: 300, // DPI
    saveFilename: "temp_page",
    savePath: "./temp",
    format: "png",
    width: 2000,
    height: 2000,
  });

  // Get total pages first (via metadata)
  const totalPages = 3; // You can detect this dynamically

  for (let i = 1; i <= totalPages; i++) {
    const pageImage = await convert(i);
    const { data } = await worker.recognize(pageImage.path);
    finalText += data.text + "\n";
  }

  return finalText;
}

process.on("exit", async () => {
  if (worker) await worker.terminate();
});

module.exports = { extractTextFromPDF };
