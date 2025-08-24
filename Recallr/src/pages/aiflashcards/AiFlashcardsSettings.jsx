import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Check, Library, Sparkles, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;


const FlashcardsSettings = ({ onClose = false }) => {
  const [sourceType, setSourceType] = useState("upload");
  const [numCards, setNumCards] = useState(5);
  const [questionType, setQuestionType] = useState("Q/A");
  const [difficulty, setDifficulty] = useState("Mixed");
  const [file, setFile] = useState(null); // ✅ store file

  const navigate = useNavigate();

  const questionTypes = ["Q/A", "Fill in the blanks", "True/False"];
  const difficulties = [
    { name: "Easy", color: "from-green-400 to-green-600" },
    { name: "Medium", color: "from-yellow-400 to-orange-500" },
    { name: "Hard", color: "from-red-400 to-red-600" },
    { name: "Mixed", color: "from-purple-400 to-pink-600" },
  ];

  const handleGenerate = async () => {
    if (sourceType === "upload" && !file) {
      alert("Please select a PDF file before generating.");
      return;
    }

    try {
      // ✅ Prepare FormData
      const token = localStorage.getItem("token");
      if (!token) return;

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("userId", userId);
      formData.append("sourceType", sourceType);
      formData.append("numCards", numCards);
      formData.append("questionType", questionType);
      formData.append("difficulty", difficulty);
      // console.log("");
      //   console.log("formdata: ", formData.file);

      // ✅ Debug FormData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      //   console.log("formdata:",formData)

      // ✅ Send to backend
      

      const res = await axios.post(
        `${API_URL}/flashcards/generate-flashcards`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );



      console.log("res from flashcards:", res.data);

      if(res.status===200){
        // navigate("/")
        toast.success("Flashcards Generated successfully")
      }

      const data = await res.json();
      console.log("Backend response:", data);

      if (onGenerate) {
        onGenerate(data); // pass data back if needed
      }

      handleClose();
    } catch (err) {
      console.error("Error generating flashcards:", err);
      alert("Something went wrong! Check console for details.");
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose(); // modal usage
    } else {
      navigate(-1); // page usage (go back)
    }
  };

  return (
    <AnimatePresence>
      {
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.3 }}
          className={`${
            onClose ? "fixed inset-0 z-50 bg-white" : "p-6"
          } overflow-y-auto`}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800">
              Generate Flashcards
            </h2>
            <button
              onClick={handleClose}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          {/* Content */}
          <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
            <p className="text-slate-600 text-lg text-center">
              Configure your AI-powered flashcard generation
            </p>

            {/* Source Type */}
            <div>
              <label className="block text-slate-700 font-semibold mb-4">
                Source
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Upload Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSourceType("upload")}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    sourceType === "upload"
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <Upload className="mx-auto mb-3 text-blue-500" size={32} />
                  <div className="text-slate-800 font-medium">Upload File</div>
                  <div className="text-slate-600 text-sm mt-1">
                    From your device
                  </div>
                  {sourceType === "upload" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Check size={14} className="text-white" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Library Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSourceType("library")}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    sourceType === "library"
                      ? "border-purple-400 bg-purple-50"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <Library className="mx-auto mb-3 text-purple-500" size={32} />
                  <div className="text-slate-800 font-medium">My Library</div>
                  <div className="text-slate-600 text-sm mt-1">
                    Saved content
                  </div>
                  {sourceType === "library" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <Check size={14} className="text-white" />
                    </motion.div>
                  )}
                </motion.button>
              </div>

              {/* File Picker */}
              {sourceType === "upload" && (
                <div className="mt-6">
                  <label className="block text-slate-600 mb-2">
                    Choose a PDF file:
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="block w-full text-slate-700 border border-slate-300 rounded-lg p-2"
                  />
                  {file && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Slider */}
            <div>
              <label className="block text-slate-700 font-semibold mb-4">
                Number of Flashcards:{" "}
                <span className="text-blue-500">{numCards}</span>
              </label>
              <input
                type="range"
                min="1"
                max="15"
                value={numCards}
                onChange={(e) => setNumCards(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-slate-500 text-sm mt-2">
                <span>1</span>
                <span>15</span>
              </div>
            </div>

            {/* Question Types */}
            <div>
              <label className="block text-slate-700 font-semibold mb-4">
                Question Type
              </label>
              <div className="flex flex-wrap gap-3">
                {questionTypes.map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuestionType(type)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      questionType === type
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-slate-700 font-semibold mb-4">
                Difficulty
              </label>
              <div className="grid grid-cols-2 gap-3">
                {difficulties.map((diff) => (
                  <motion.button
                    key={diff.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDifficulty(diff.name)}
                    className={`p-4 rounded-xl font-medium transition-all duration-300 ${
                      difficulty === diff.name
                        ? `bg-gradient-to-r ${diff.color} text-white shadow-md`
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {diff.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2 text-lg">
                <Sparkles size={20} />
                Generate Flashcards
              </span>
            </motion.button>
          </div>
        </motion.div>
      }
    </AnimatePresence>
  );
};

export default FlashcardsSettings;
