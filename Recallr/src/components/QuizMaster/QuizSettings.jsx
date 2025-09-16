import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Settings, Brain, Clock, Target } from "lucide-react";
import { useQuiz } from "../../context/QuizContext";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = import.meta.env.VITE_API_URL;

const QuizSetup = () => {
  const navigate = useNavigate();
  const { pdfs, generateQuiz } = useQuiz();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    source: "library", // 'library' or 'upload'
    selectedPDF: "",
    uploadedFile: null,
    numQuestions: 10,
    difficulty: "Medium",
    questionTypes: ["MCQ"],
    timeLimit: 30,
    timeLimitType: "overall", // 'overall' or 'per-question'
    mode: "Practice", // 'practice' or 'exam'
    markingScheme: "normal", // 'normal' or 'negative'
    shuffleQuestions: true,
    shuffleOptions: true,
  });
  const [generating, setGenerating] = useState(false);
  const [userPdfs, setUserPdfs] = useState([]);
  const [loadingPdfs, setLoadingPdfs] = useState(false);

  // Fetch user's PDF library when component mounts
  useEffect(() => {
    if (formData.source === "library") {
      fetchUserPdfs();
    }
  }, [formData.source]);

  const fetchUserPdfs = async () => {
    try {
      setLoadingPdfs(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await axios.get(`${API_URL}/pdf/pdfs/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserPdfs(response.data.pdfs);
    } catch (error) {
      console.error("Error fetching user PDFs:", error);
      toast.error("Failed to load your PDF library");
    } finally {
      setLoadingPdfs(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear the other source when switching
    if (field === "source") {
      if (value === "library") {
        setFormData((prev) => ({ ...prev, uploadedFile: null }));
      } else {
        setFormData((prev) => ({ ...prev, selectedPDF: "" }));
      }
    }
  };

  const handleQuestionTypeChange = (type, checked) => {
    setFormData((prev) => ({
      ...prev,
      questionTypes: checked
        ? [...prev.questionTypes, type]
        : prev.questionTypes.filter((t) => t !== type),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({
        ...prev,
        uploadedFile: file,
        selectedPDF: "", // Clear library selection
      }));
    } else {
      toast.error("Please select a PDF file");
      e.target.value = "";
    }
  };

  const handleGenerate = async () => {
    if (!canProceed()) {
      toast.error("Please complete all required fields");
      return;
    }

    setGenerating(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to generate quiz");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const fd = new FormData();
      fd.append("userId", userId);
      fd.append("source", formData.source);
      fd.append("numQuestions", formData.numQuestions);
      fd.append("difficulty", formData.difficulty);
      fd.append("timeLimit", formData.timeLimit);
      fd.append("timeLimitType", formData.timeLimitType);
      fd.append("mode", formData.mode);
      fd.append("markingScheme", formData.markingScheme);
      fd.append("shuffleQuestions", formData.shuffleQuestions);
      fd.append("shuffleOptions", formData.shuffleOptions);

      // Add source-specific data
      if (formData.source === "upload") {
        if (formData.uploadedFile) {
          fd.append("uploadedFile", formData.uploadedFile);
        }
      } else if (formData.source === "library") {
        fd.append("pdfId", formData.selectedPDF);
      }

      // Add question types as array
      formData.questionTypes.forEach((q) => fd.append("questionTypes", q));

      const res = await axios.post(`${API_URL}/quiz/generate-quiz`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log("Quiz generated successfully:", res.data);
        toast.success("Quiz generated successfully!");

        // If using context, update it
        if (generateQuiz) {
          generateQuiz(res.data);
        }

        navigate("/quizmaster");
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to generate quiz";
      toast.error(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const canProceed = () => {
    if (formData.source === "library" && !formData.selectedPDF) return false;
    if (formData.source === "upload" && !formData.uploadedFile) return false;
    if (formData.questionTypes.length === 0) return false;
    if (formData.timeLimit < 1) return false;

    return true;
  };

  const stepTitles = ["Choose Source", "Quiz Settings", "Advanced Options"];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Create New Quiz
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Generate personalized quizzes from your PDF documents
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {stepTitles.map((title, index) => (
            <React.Fragment key={index}>
              <div
                className={`flex items-center space-x-2 ${
                  step > index + 1
                    ? "text-green-600"
                    : step === index + 1
                    ? "text-blue-600"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step > index + 1
                      ? "bg-green-600 text-white"
                      : step === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {step > index + 1 ? "✓" : index + 1}
                </div>
                <span className="font-medium">{title}</span>
              </div>
              {index < stepTitles.length - 1 && (
                <div
                  className={`w-16 h-0.5 ${
                    step > index + 1
                      ? "bg-green-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Step 1: Choose Source */}
        {step === 1 && (
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              Choose PDF Source
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* My Library Option */}
              <div
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.source === "library"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => handleInputChange("source", "library")}
              >
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="source"
                    value="library"
                    checked={formData.source === "library"}
                    onChange={(e) =>
                      handleInputChange("source", e.target.value)
                    }
                    className="mr-3"
                  />
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    My Library
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Choose from your uploaded PDFs
                </p>

                {formData.source === "library" && (
                  <div>
                    {loadingPdfs ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                          Loading PDFs...
                        </p>
                      </div>
                    ) : userPdfs.length > 0 ? (
                      <select
                        value={formData.selectedPDF}
                        onChange={(e) =>
                          handleInputChange("selectedPDF", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                      >
                        <option value="">Select a PDF...</option>
                        {userPdfs.map((pdf) => (
                          <option key={pdf._id} value={pdf._id}>
                            {pdf.title || pdf.originalName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <p>No PDFs found in your library</p>
                        <button
                          onClick={fetchUserPdfs}
                          className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 mt-2"
                        >
                          Refresh
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Upload New Option */}
              <div
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.source === "upload"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => handleInputChange("source", "upload")}
              >
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="source"
                    value="upload"
                    checked={formData.source === "upload"}
                    onChange={(e) =>
                      handleInputChange("source", e.target.value)
                    }
                    className="mr-3"
                  />
                  <Upload className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Upload New PDF
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Upload a new document for this quiz
                </p>

                {formData.source === "upload" && (
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="upload-input"
                    />
                    <label
                      htmlFor="upload-input"
                      className={`block w-full p-3 border ${
                        formData.uploadedFile
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-dashed border-gray-300 dark:border-gray-600"
                      } rounded-lg text-center cursor-pointer hover:border-purple-500 transition-colors duration-200`}
                    >
                      {formData.uploadedFile ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {formData.uploadedFile.name}
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          Click to upload PDF
                        </span>
                      )}
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Selected PDF Info */}
            {formData.source === "library" && formData.selectedPDF && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-blue-700 dark:text-blue-300">
                  Selected:{" "}
                  {userPdfs.find((p) => p._id === formData.selectedPDF)?.title}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2, Step 3 & Navigation Buttons */}
        {/* ⬇️ Apply the same `dark:` classes pattern to remaining steps */}
        {/* Example: text-gray-900 → dark:text-white, bg-gray-50 → dark:bg-gray-800, border-gray-200 → dark:border-gray-700 */}

        {/* Step 2: Quiz Settings */}
        {step === 2 && (
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
              <Settings className="h-6 w-6 mr-2 text-blue-600" />
              Quiz Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Number of Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={formData.numQuestions}
                    onChange={(e) =>
                      handleInputChange(
                        "numQuestions",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span>5</span>
                    <span className="font-medium text-blue-600">
                      {formData.numQuestions}
                    </span>
                    <span>50</span>
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["Easy", "Medium", "Hard", "Mixed"].map((diff) => (
                      <label
                        key={diff}
                        className="flex items-center cursor-pointer text-gray-800 dark:text-gray-200"
                      >
                        <input
                          type="radio"
                          name="difficulty"
                          value={diff}
                          checked={formData.difficulty === diff}
                          onChange={(e) =>
                            handleInputChange("difficulty", e.target.value)
                          }
                          className="mr-2"
                        />
                        <span className="capitalize">{diff}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={formData.timeLimit}
                    onChange={(e) =>
                      handleInputChange("timeLimit", parseInt(e.target.value))
                    }
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                  />
                  <div className="mt-2 space-y-1">
                    <label className="flex items-center cursor-pointer text-gray-800 dark:text-gray-200">
                      <input
                        type="radio"
                        name="timeLimitType"
                        value="overall"
                        checked={formData.timeLimitType === "overall"}
                        onChange={(e) =>
                          handleInputChange("timeLimitType", e.target.value)
                        }
                        className="mr-2"
                      />
                      <span>Overall quiz time</span>
                    </label>
                    <label className="flex items-center cursor-pointer text-gray-800 dark:text-gray-200">
                      <input
                        type="radio"
                        name="timeLimitType"
                        value="per-question"
                        checked={formData.timeLimitType === "per-question"}
                        onChange={(e) =>
                          handleInputChange("timeLimitType", e.target.value)
                        }
                        className="mr-2"
                      />
                      <span>Per question</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Question Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Question Types
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "MCQ", label: "Multiple Choice" },
                      { id: "TrueFalse", label: "True/False" },
                      { id: "FillBlank", label: "Fill in the Blank" },
                      { id: "ShortAnswer", label: "Short Answer" },
                    ].map((type) => (
                      <label
                        key={type.id}
                        className="flex items-center cursor-pointer text-gray-800 dark:text-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={formData.questionTypes.includes(type.id)}
                          onChange={(e) =>
                            handleQuestionTypeChange(type.id, e.target.checked)
                          }
                          className="mr-2"
                        />
                        <span>{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Quiz Mode
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      <input
                        type="radio"
                        name="mode"
                        value="Practice"
                        checked={formData.mode === "Practice"}
                        onChange={(e) =>
                          handleInputChange("mode", e.target.value)
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Practice Mode</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Instant feedback after each question
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                      <input
                        type="radio"
                        name="mode"
                        value="Exam"
                        checked={formData.mode === "Exam"}
                        onChange={(e) =>
                          handleInputChange("mode", e.target.value)
                        }
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">Exam Mode</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Results shown at the end
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Advanced Options */}
        {step === 3 && (
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900 dark:text-white">
              <Target className="h-6 w-6 mr-2 text-blue-600" />
              Advanced Options
            </h2>

            <div className="space-y-8">
              {/* Marking Scheme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Marking Scheme
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center cursor-pointer p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                    <input
                      type="radio"
                      name="markingScheme"
                      value="normal"
                      checked={formData.markingScheme === "normal"}
                      onChange={(e) =>
                        handleInputChange("markingScheme", e.target.value)
                      }
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Normal (+1, 0)</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        +1 for correct, 0 for wrong
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center cursor-pointer p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
                    <input
                      type="radio"
                      name="markingScheme"
                      value="negative"
                      checked={formData.markingScheme === "negative"}
                      onChange={(e) =>
                        handleInputChange("markingScheme", e.target.value)
                      }
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">
                        Negative Marking (+1, -0.25)
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        +1 for correct, -0.25 for wrong
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Additional Options
                </label>
                <div className="space-y-3 text-gray-800 dark:text-gray-200">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shuffleQuestions}
                      onChange={(e) =>
                        handleInputChange("shuffleQuestions", e.target.checked)
                      }
                      className="mr-3"
                    />
                    <span>Shuffle questions order</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shuffleOptions}
                      onChange={(e) =>
                        handleInputChange("shuffleOptions", e.target.checked)
                      }
                      className="mr-3"
                    />
                    <span>Shuffle answer options</span>
                  </label>
                </div>
              </div>

              {/* Quiz Preview */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  Quiz Preview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-800 dark:text-gray-200">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Questions:
                    </span>
                    <span className="ml-2 font-medium">
                      {formData.numQuestions}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Difficulty:
                    </span>
                    <span className="ml-2 font-medium capitalize">
                      {formData.difficulty}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Time:
                    </span>
                    <span className="ml-2 font-medium">
                      {formData.timeLimit} min
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Mode:
                    </span>
                    <span className="ml-2 font-medium capitalize">
                      {formData.mode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={generating || !canProceed()}
              className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5 mr-2" />
                  Generate Quiz
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSetup;
