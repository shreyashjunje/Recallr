import React, { useEffect, useState } from "react";
import {
  FileText,
  Heart,
  Download,
  Share2,
  RefreshCw,
  Trash2,
  Calendar,
  User,
  HardDrive,
  BookOpen,
  Eye,
  Clock,
  Copy,
  FileDown,
  Brain,
  Target,
  CheckCircle,
  XCircle,
  Play,
  BarChart3,
  Tag,
  Folder,
  Info,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const mockPDFData = {
  id: "1",
  title: "Introduction to Machine Learning and Artificial Intelligence",
  category: "Science",
  tags: [
    "AI",
    "Machine Learning",
    "Technology",
    "Computer Science",
    "Research",
  ],
  description:
    "A comprehensive guide covering the fundamentals of machine learning algorithms, neural networks, and their practical applications in modern technology.",
  uploadedAt: "2024-12-10T10:30:00Z",
  uploadedBy: "Dr. Sarah Johnson",
  fileSize: "15.7 MB",
  pagesCount: 247,
  accessCount: 23,
  lastOpenedAt: "2024-12-15T14:22:00Z",
  isFavorite: true,
  hasSummary: true,
  hasFlashcards: true,
  hasQuiz: false,
  progress: {
    completedPercentage: 68,
    currentPage: 168,
    timeSpent: "4h 32m",
  },
  summary:
    "This comprehensive document introduces fundamental concepts in machine learning and artificial intelligence, covering supervised and unsupervised learning, neural networks, deep learning architectures, and their real-world applications across various industries.",
  flashcardsCount: 45,
  quizQuestionsCount: 0,
};

const PDFDetailsPage = () => {
  const { id } = useParams();
  const [pdfData, setPdfData] = useState(mockPDFData);
  const [isGenerating, setIsGenerating] = useState(null);
  const [expandedSummary, setExpandedSummary] = useState(false);
  const [pdf, setPdf] = useState({});
  const navigate = useNavigate();

  const fetchPdfDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/pdf/pdfs/${id}`);
      console.log("pdf details:", res.data.data);
      if (res.status === 200) {
        setPdf(res.data?.data);
        toast.success("pdf details fetched successfully");
      }
    } catch (err) {
      console.log("Error:", err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchPdfDetails();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleFavorite = () => {
    setPdfData((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const handleGenerate = async (type) => {
    try {
      setIsGenerating(type);

      let response;

      if (type === "summary") {
        response = await axios.post(`${API_URL}/pdf/summary-only`, {
          pdfId: pdf._id,
          fileUrl: pdf.cloudinaryUrl,
          fileName: pdf.originalName,
          customPrompt: "Summarize this for quick revision",
        });
      } else if (type === "flashcards") {
        // response = await axios.post("/api/pdf/flashgenius-only", {
        //   pdfId: pdfData._id,
        //   fileUrl: pdfData.cloudinaryUrl,
        // });
      } else if (type === "quiz") {
        response = await axios.post("/api/pdf/quiz-only", {
          pdfId: pdfData._id,
          fileUrl: pdfData.cloudinaryUrl,
        });
      }

      // Update UI state after backend finishes
      setPdfData((prev) => ({
        ...prev,
        [type === "summary"
          ? "hasSummary"
          : type === "flashcards"
          ? "hasFlashcards"
          : "hasQuiz"]: true,

        ...(type === "flashcards" && {
          flashcardsCount: response.data.flashcards?.length || 0,
        }),
        ...(type === "quiz" && {
          quizQuestionsCount: response.data.quiz?.length || 0,
        }),
      }));
    } catch (err) {
      console.error("❌ Error generating:", type, err);
      // optionally toast error
    } finally {
      setIsGenerating(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  const handleRead = async (pdf) => {
    navigate("/view", { state: { url: pdf.cloudinaryUrl } });
  };

  const handleStudyFlashcards = (id) => {
    console.log("idd----of flashcard:", id);
    navigate(`/flashgenius/get-flashcards/${id}`);
  };

  const handleStudySummary = (summaryId) => {
    console.log("summaryId:", summaryId);
    navigate(`/summify/${summaryId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
            {/* PDF Preview */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="w-32 h-44 sm:w-40 sm:h-56 md:w-48 md:h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center group hover:from-blue-200 hover:to-indigo-200 transition-all duration-300">
                <FileText
                  size={48}
                  className="text-blue-500 group-hover:text-blue-600 transition-colors"
                />
              </div>
            </div>

            {/* PDF Information */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-grow">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {pdf.title}
                  </h1>
                  <div className="flex items-center gap-2 sm:gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Folder size={14} className="text-gray-500" />
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs sm:text-sm rounded-full font-medium">
                        {pdf.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 self-center sm:self-auto">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
                      pdf.isFavorite
                        ? "bg-red-500 text-white shadow-lg hover:bg-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={pdf.isFavorite ? "fill-current" : ""}
                    />
                  </button>
                  <button className="p-2 sm:p-3 bg-gray-100 text-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-200">
                    <Download size={16} />
                  </button>
                  <button className="p-2 sm:p-3 bg-gray-100 text-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-200 transition-all duration-200">
                    <Share2 size={16} />
                  </button>
                  <button className="p-2 sm:p-3 bg-emerald-500 text-white rounded-lg sm:rounded-xl hover:bg-emerald-600 transition-all duration-200 shadow-lg">
                    <RefreshCw size={16} />
                  </button>
                  <button className="p-2 sm:p-3 bg-red-500 text-white rounded-lg sm:rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pdf.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 text-xs sm:text-sm rounded-md font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Tag size={10} className="inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Info
                    size={16}
                    className="text-blue-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {pdf.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - File Details & Progress */}
          <div className="space-y-4 sm:space-y-6">
            {/* File Metadata */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <HardDrive size={18} className="text-blue-500" />
                File Details
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} />
                    <span className="text-sm sm:text-base">Uploaded At</span>
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                    {formatDate(pdf.uploadedAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={14} />
                    <span className="text-sm sm:text-base">Uploaded By</span>
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                    {pdf.user?.userName}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen size={14} />
                    <span className="text-sm sm:text-base">Pages</span>
                  </div>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                    {pdf?.totalPages}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <BarChart3 size={18} className="text-emerald-500" />
                Reading Progress
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm sm:text-base">Overall Progress</span>
                    <span className="font-bold text-emerald-600 text-sm sm:text-base">
                      {pdf.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${pdf.progress}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Current Page */}
                <div className="bg-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-700 font-medium text-sm sm:text-base">
                      Current Page
                    </span>
                    <span className="text-emerald-800 font-bold text-base sm:text-lg">
                      {pdf.currentPage} / {pdf.totalPages}
                    </span>
                  </div>
                </div>

                {/* Continue Reading Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRead(pdf);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Play size={16} />
                  Continue Reading
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - AI Features */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Summary Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Brain size={18} className="text-purple-500" />
                  AI Summary
                </h2>
                {pdf.isSummarized ? (
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => copyToClipboard(pdf.summary || "")}
                      className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                      title="Copy Summary"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                      title="Download as PDF"
                    >
                      <FileDown size={14} />
                    </button>
                  </div>
                ) : null}
              </div>

              {pdf.isSummarized ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 mb-3 sm:mb-4">
                    <CheckCircle size={16} />
                    <span className="font-medium text-sm sm:text-base">Summary Available</span>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100">
                    <p
                      className={`text-gray-700 text-sm sm:text-base leading-relaxed ${
                        expandedSummary ? "" : "line-clamp-3"
                      }`}
                    >
                      {pdf.summary}
                    </p>
                    <button
                      onClick={() => setExpandedSummary(!expandedSummary)}
                      className="text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors text-sm sm:text-base"
                    >
                      {expandedSummary ? "Show Less" : "Read More"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <XCircle size={40} className="text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">No summary generated yet</p>
                  <button
                    onClick={() => handleGenerate("summary")}
                    disabled={isGenerating === "summary"}
                    className="bg-purple-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto text-sm sm:text-base"
                  >
                    {isGenerating === "summary" ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain size={16} />
                        Generate Summary
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Flashcards & Quiz Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Flashcards */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Target size={16} className="text-orange-500" />
                  Flashcards
                </h3>

                {pdf.isFlashcardGenerated ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 mb-3 sm:mb-4">
                      <CheckCircle size={16} />
                      <span className="font-medium text-sm sm:text-base">Ready to Study</span>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-100">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                          {pdf.flashcards?.length}
                        </div>
                        <div className="text-orange-700 font-medium text-sm sm:text-base">
                          Cards Available
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStudyFlashcards(pdf._id)}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      Start Studying
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-6">
                    <XCircle size={36} className="text-gray-400 mx-auto mb-2 sm:mb-3" />
                    <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">No flashcards created</p>
                    <button
                      onClick={() => handleGenerate("flashcards")}
                      disabled={isGenerating === "flashcards"}
                      className="bg-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto text-sm sm:text-base"
                    >
                      {isGenerating === "flashcards" ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Target size={14} />
                          Generate Flashcards
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Quiz */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Brain size={16} className="text-indigo-500" />
                  Quiz
                </h3>

                {pdf.isQuizGenerated ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 mb-3 sm:mb-4">
                      <CheckCircle size={16} />
                      <span className="font-medium text-sm sm:text-base">Quiz Ready</span>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-indigo-100">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">
                          {pdf.quizzes?.length}
                        </div>
                        <div className="text-indigo-700 font-medium text-sm sm:text-base">
                          Questions
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base">
                      Take Quiz
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-6">
                    <XCircle size={36} className="text-gray-400 mx-auto mb-2 sm:mb-3" />
                    <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">No quiz available</p>
                    <button
                      onClick={() => handleGenerate("quiz")}
                      disabled={isGenerating === "quiz"}
                      className="bg-indigo-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl hover:bg-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto text-sm sm:text-base"
                    >
                      {isGenerating === "quiz" ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Brain size={14} />
                          Generate Quiz
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Learning Statistics */}
          <div className="lg:col-span-3 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-500" />
              Learning Stats
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                  {pdf.isSummarized ? "✓" : "—"}
                </div>
                <div className="text-blue-700 text-xs sm:text-sm font-medium">Summary</div>
              </div>

              <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg sm:rounded-xl">
                <div className="text-xl sm:text-2xl font-bold text-orange-600 mb-1">
                  {pdf.isFlashcardGenerated ? "✓" : "—"}
                </div>
                <div className="text-orange-700 text-xs sm:text-sm font-medium">
                  Flashcards
                </div>
              </div>

              <div className="text-center p-3 sm:p-4 bg-indigo-50 rounded-lg sm:rounded-xl">
                <div className="text-xl sm:text-2xl font-bold text-indigo-600 mb-1">
                  {pdf.isQuizGenerated ? "✓" : "—"}
                </div>
                <div className="text-indigo-700 text-xs sm:text-sm font-medium">
                  Quiz Questions
                </div>
              </div>

              <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-lg sm:rounded-xl">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1">
                  {pdfData.progress?.timeSpent || "0h 0m"}
                </div>
                <div className="text-emerald-700 text-xs sm:text-sm font-medium">
                  Time Spent
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - AI Learning Features */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 h-full">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Brain size={18} className="text-purple-500" />
                AI Learning Features
              </h2>

              <div className="grid gap-4 sm:gap-6">
                {/* Feature Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                      pdf.isSummarized
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {pdf.isSummarized ? (
                        <CheckCircle size={18} className="text-emerald-600" />
                      ) : (
                        <XCircle size={18} className="text-gray-400" />
                      )}
                      <span
                        className={`font-medium text-sm sm:text-base ${
                          pdf.isSummarized ? "text-emerald-700" : "text-gray-500"
                        }`}
                      >
                        Summary
                      </span>
                    </div>
                    <p
                      className={`text-xs sm:text-sm ${
                        pdf.isSummarized ? "text-emerald-600" : "text-gray-400"
                      }`}
                    >
                      {pdf.isSummarized ? "Available" : "Not Generated"}
                    </p>
                  </div>

                  <div
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                      pdf.isFlashcardGenerated
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {pdf.isFlashcardGenerated ? (
                        <CheckCircle size={18} className="text-emerald-600" />
                      ) : (
                        <XCircle size={18} className="text-gray-400" />
                      )}
                      <span
                        className={`font-medium text-sm sm:text-base ${
                          pdf.isFlashcardGenerated
                            ? "text-emerald-700"
                            : "text-gray-500"
                        }`}
                      >
                        Flashcards
                      </span>
                    </div>
                    <p
                      className={`text-xs sm:text-sm ${
                        pdf.isFlashcardGenerated
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }`}
                    >
                      {pdf.isFlashcardGenerated
                        ? `${pdf.flashcards?.length || 0} Cards`
                        : "Not Generated"}
                    </p>
                  </div>

                  <div
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                      pdf.isQuizGenerated
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {pdf.isQuizGenerated ? (
                        <CheckCircle size={18} className="text-emerald-600" />
                      ) : (
                        <XCircle size={18} className="text-gray-400" />
                      )}
                      <span
                        className={`font-medium text-sm sm:text-base ${
                          pdf.isQuizGenerated
                            ? "text-emerald-700"
                            : "text-gray-500"
                        }`}
                      >
                        Quiz
                      </span>
                    </div>
                    <p
                      className={`text-xs sm:text-sm ${
                        pdf.isQuizGenerated
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }`}
                    >
                      {pdf.isQuizGenerated
                        ? `${pdf.quizzes?.length || 0} Questions`
                        : "Not Generated"}
                    </p>
                  </div>
                </div>

                {/* Learning Actions */}
                {(pdf?.isSummarized ||
                  pdf?.isFlashcardGenerated ||
                  pdf?.isQuizGenerated) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    {pdf?.isFlashcardGenerated && (
                      <button
                        onClick={() => handleStudyFlashcards(pdf._id)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        <Target size={16} />
                        Study Flashcards
                      </button>
                    )}

                    {pdf?.isQuizGenerated && (
                      <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base">
                        <Brain size={16} />
                        Take Quiz
                      </button>
                    )}

                    {pdf?.isSummarized && (
                      <button
                        onClick={() => handleStudySummary(pdf._id)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-green-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                      >
                        <Brain size={16} />
                        Read Summary
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFDetailsPage;