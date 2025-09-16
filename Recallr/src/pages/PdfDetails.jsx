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
  Star,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "@/context/AdminThemeContext";

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
  const { user } = useAuth();
  const [pdfData, setPdfData] = useState(mockPDFData);
  const [isGenerating, setIsGenerating] = useState(null);
  const [expandedSummary, setExpandedSummary] = useState(false);
  const [pdf, setPdf] = useState({});
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(pdf.isFavourite);

  const [pdfToDelete, setPdfToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isDark, toggleTheme } = useTheme(); // Get theme state and toggle function

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

 
  const handleGenerate = async (type) => {
    try {
      setIsGenerating(type);
      const token = localStorage.getItem("token");
      if (!token) return;

      let response;

      if (type === "summary") {
        response = await axios.post(`${API_URL}/pdf/summary-only`, {
          pdfId: pdf._id,
          fileUrl: pdf.cloudinaryUrl,
          fileName: pdf.originalName,
          customPrompt: "Summarize this for quick revision",
        });
      } else if (type === "flashcards") {
        response = await axios.post(
          `${API_URL}/pdf/flashgenius-only`,
          {
            pdfId: pdf._id,
            fileUrl: pdf.cloudinaryUrl,
            userId: user._id,
            numCards: 5,
            questionType: "Q/A",
            difficulty: "Mixed",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (type === "quiz") {
        response = await axios.post(
          `${API_URL}/pdf/quiz-only`,
          {
            pdfId: pdf._id,
            fileUrl: pdf.cloudinaryUrl,
            fileName: pdf.title || "document.pdf",
            userId: user._id, // decoded from JWT or stored in state

            // Quiz settings
            numQuestions: 5,
            difficulty: "Mixed",
            questionTypes: ["MCQ"],
            timeLimit: 30,
            timeLimitType: "overall",
            mode: "Practice",
            markingScheme: "normal",
            shuffleQuestions: true,
            shuffleOptions: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // ✅ Update single pdf state
      setPdf((prev) => ({
        ...prev,
        ...(type === "summary" && {
          isSummarized: true,
          summary: response.data.summary,
        }),
        ...(type === "flashcards" && {
          isFlashcardGenerated: true,
          flashcards: response.data.flashcards || [],
        }),
        ...(type === "quiz" && {
          isQuizGenerated: true,
          quizzes: response.data.quiz || [],
        }),
      }));
    } catch (err) {
      console.error("❌ Error generating:", type, err);
      toast.error("Failed to generate " + type);
    } finally {
      setIsGenerating(null);
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchPdfDetails();
      toast.success("PDF details refreshed");
    } catch (error) {
      console.error("Error refreshing PDF:", error);
      toast.error("Failed to refresh PDF details");
    } finally {
      setIsRefreshing(false);
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

  const handledownload = async (pdf) => {
    const pdfName =
      pdf.originalName && pdf.originalName.trim() !== ""
        ? pdf.originalName
        : "myfile.pdf";

    try {
      const response = await fetch(pdf.cloudinaryUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = pdfName; // force your filename
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Optimistic update
    setIsFav((prev) => !prev);

    try {
      const endpoint = isFav
        ? `${API_URL}/helper/remove-from-favourite`
        : `${API_URL}/helper/add-to-favourite`;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isFav) {
        await axios.delete(endpoint, { ...config, data: { pdfId: pdf._id } });
      } else {
        await axios.post(endpoint, { pdfId: pdf._id }, config);
      }
    } catch (error) {
      console.error(error);
      // rollback if API fails
      setIsFav((prev) => !prev);
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!pdfToDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userID = decodedToken.id;

    // Optimistic update
    // const oldPDFs = [...PDFS];
    // setPDFS((prev) => prev.filter((p) => p._id !== pdfToDelete._id));
    setShowDeleteConfirm(false);
    setPdfToDelete(null);

    try {
      const res = await axios.delete(`${API_URL}/pdf/delete-pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: userID, pdfId: pdfToDelete._id },
      });

      if (res.status === 200) {
        navigate("/library");
      }
    } catch (error) {
      console.error("Error deleting PDF:", error);
      // setPDFS(oldPDFs); // rollback if deletion failed
      toast.error("Failed to delete PDF");
    }
  };

  useEffect(() => {
    setIsFav(pdf.isFavourite);
  }, [pdf.isFavourite]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-slate-50 to-blue-50"
      } p-4 sm:p-6`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div
          className={`rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 transition-colors duration-300 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
            {/* PDF Preview */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div
                className={`w-24 h-32 sm:w-28 sm:h-40 md:w-32 md:h-44 rounded-lg sm:rounded-xl border-2 border-dashed flex items-center justify-center group transition-all duration-300 ${
                  isDark
                    ? "bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-700 hover:from-blue-800/50 hover:to-indigo-800/50"
                    : "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200 hover:from-blue-200 hover:to-indigo-200"
                }`}
              >
                <FileText
                  size={36}
                  className={`transition-colors ${
                    isDark
                      ? "text-blue-400 group-hover:text-blue-300"
                      : "text-blue-500 group-hover:text-blue-600"
                  }`}
                />
              </div>
            </div>

            {/* PDF Information */}
            <div className="flex-grow">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-grow">
                  <h1
                    className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2 leading-tight transition-colors duration-300 ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {pdf.title}
                  </h1>
                  <div className="flex items-center gap-2 sm:gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Folder
                        size={14}
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                      />
                      <span
                        className={`px-2 py-1 text-xs sm:text-sm rounded-full font-medium transition-colors duration-300 ${
                          isDark
                            ? "bg-blue-900/30 text-blue-300"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {pdf.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 self-center sm:self-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(pdf);
                    }}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
                      isFav
                        ? "bg-red-500 text-white shadow-lg hover:bg-red-600"
                        : isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {isFav ? (
                      <Heart className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <Heart className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handledownload(pdf);
                    }}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 ${
                      isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Download size={16} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefresh();
                    }}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-emerald-600 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-emerald-500 text-white"
                    }`}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <RefreshCw size={16} />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPdfToDelete(pdf);
                      setShowDeleteConfirm(true);
                      setSelectedPdf(null);
                    }}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg ${
                      isDark
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pdf.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs sm:text-sm rounded-md font-medium transition-colors duration-300 cursor-pointer ${
                      isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Tag size={10} className="inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - File Details & Progress */}
          <div className="space-y-4 sm:space-y-6">
            {/* File Metadata */}
            <div
              className={`rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <h2
                className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2 transition-colors duration-300 ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <HardDrive size={18} className="text-blue-500" />
                File Details
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div
                  className={`flex justify-between items-center py-2 sm:py-3 border-b transition-colors duration-300 ${
                    isDark ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-sm sm:text-base transition-colors duration-300 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Calendar size={14} />
                    <span>Uploaded At</span>
                  </div>
                  <span
                    className={`font-medium text-sm sm:text-base transition-colors duration-300 ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {formatDate(pdf.uploadedAt)}
                  </span>
                </div>

                <div
                  className={`flex justify-between items-center py-2 sm:py-3 border-b transition-colors duration-300 ${
                    isDark ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-sm sm:text-base transition-colors duration-300 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <User size={14} />
                    <span>Uploaded By</span>
                  </div>
                  <span
                    className={`font-medium text-sm sm:text-base transition-colors duration-300 ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {pdf.user?.userName}
                  </span>
                </div>

                <div
                  className={`flex justify-between items-center py-2 sm:py-3 border-b transition-colors duration-300 ${
                    isDark ? "border-gray-700" : "border-gray-100"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-sm sm:text-base transition-colors duration-300 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <BookOpen size={14} />
                    <span>Pages</span>
                  </div>
                  <span
                    className={`font-medium text-sm sm:text-base transition-colors duration-300 ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {pdf?.totalPages}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div
              className={`rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <h2
                className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2 transition-colors duration-300 ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <BarChart3 size={18} className="text-emerald-500" />
                Reading Progress
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-sm sm:text-base transition-colors duration-300 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Overall Progress
                    </span>
                    <span className="font-bold text-emerald-600 text-sm sm:text-base">
                      {pdf.progress}%
                    </span>
                  </div>
                  <div
                    className={`w-full rounded-full h-2 sm:h-3 overflow-hidden transition-colors duration-300 ${
                      isDark ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${pdf.progress}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Current Page */}
                <div
                  className={`rounded-lg sm:rounded-xl p-3 sm:p-4 transition-colors duration-300 ${
                    isDark
                      ? "bg-emerald-900/30 text-emerald-300"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm sm:text-base">
                      Current Page
                    </span>
                    <span className="font-bold text-base sm:text-lg">
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
            <div
              className={`rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                <h2
                  className={`text-lg sm:text-xl font-semibold flex items-center gap-2 transition-colors duration-300 ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <Brain size={18} className="text-purple-500" />
                  AI Summary
                </h2>
                {pdf.isSummarized ? (
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => copyToClipboard(pdf.summary || "")}
                      className={`p-2 rounded-md transition-colors duration-300 ${
                        isDark
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title="Copy Summary"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      className={`p-2 rounded-md transition-colors duration-300 ${
                        isDark
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
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
                    <span className="font-medium text-sm sm:text-base">
                      Summary Available
                    </span>
                  </div>

                  <div
                    className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-colors duration-300 ${
                      isDark
                        ? "bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700"
                        : "bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100"
                    }`}
                  >
                    <p
                      className={`text-sm sm:text-base leading-relaxed transition-colors duration-300 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } ${expandedSummary ? "" : "line-clamp-3"}`}
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
                  <XCircle
                    size={40}
                    className={`mx-auto mb-3 sm:mb-4 transition-colors duration-300 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`mb-3 sm:mb-4 text-sm sm:text-base transition-colors duration-300 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No summary generated yet
                  </p>
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
              <div
                className={`rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <h3
                  className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 transition-colors duration-300 ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <Target size={16} className="text-orange-500" />
                  Flashcards
                </h3>

                {pdf.isFlashcardGenerated ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 mb-3 sm:mb-4">
                      <CheckCircle size={16} />
                      <span className="font-medium text-sm sm:text-base">
                        Ready to Study
                      </span>
                    </div>

                    <div
                      className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-colors duration-300 ${
                        isDark
                          ? "bg-gradient-to-br from-orange-900/30 to-yellow-900/30 border-orange-700"
                          : "bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-100"
                      }`}
                    >
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
                    <XCircle
                      size={36}
                      className={`mx-auto mb-2 sm:mb-3 transition-colors duration-300 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`mb-3 sm:mb-4 text-sm sm:text-base transition-colors duration-300 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No flashcards created
                    </p>
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
              <div
                className={`rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <h3
                  className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 transition-colors duration-300 ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <Brain size={16} className="text-indigo-500" />
                  Quiz
                </h3>

                {pdf.isQuizGenerated ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 mb-3 sm:mb-4">
                      <CheckCircle size={16} />
                      <span className="font-medium text-sm sm:text-base">
                        Quiz Ready
                      </span>
                    </div>

                    <div
                      className={`rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-colors duration-300 ${
                        isDark
                          ? "bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-700"
                          : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100"
                      }`}
                    >
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
                    <XCircle
                      size={36}
                      className={`mx-auto mb-2 sm:mb-3 transition-colors duration-300 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <p
                      className={`mb-3 sm:mb-4 text-sm sm:text-base transition-colors duration-300 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No quiz available
                    </p>
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
          <div
            className={`lg:col-span-3 rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <h3
              className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 transition-colors duration-300 ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              <BarChart3 size={16} className="text-blue-500" />
              Learning Stats
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  value: pdf.isSummarized ? "✓" : "—",
                  label: "Summary",
                  bg: isDark ? "bg-blue-900/30" : "bg-blue-50",
                  text: isDark ? "text-blue-300" : "text-blue-700",
                },
                {
                  value: pdf.isFlashcardGenerated ? "✓" : "—",
                  label: "Flashcards",
                  bg: isDark ? "bg-orange-900/30" : "bg-orange-50",
                  text: isDark ? "text-orange-300" : "text-orange-700",
                },
                {
                  value: pdf.isQuizGenerated ? "✓" : "—",
                  label: "Quiz Questions",
                  bg: isDark ? "bg-indigo-900/30" : "bg-indigo-50",
                  text: isDark ? "text-indigo-300" : "text-indigo-700",
                },
                {
                  value: pdf.progress?.timeSpent || "0h 0m",
                  label: "Time Spent",
                  bg: isDark ? "bg-emerald-900/30" : "bg-emerald-50",
                  text: isDark ? "text-emerald-300" : "text-emerald-700",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors duration-300 ${stat.bg}`}
                >
                  <div
                    className={`text-xl sm:text-2xl font-bold mb-1 ${stat.text}`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-medium ${stat.text}`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - AI Learning Features */}
          <div className="lg:col-span-3">
            <div
              className={`rounded-xl sm:rounded-2xl shadow-sm border p-4 sm:p-6 h-full transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              <h2
                className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2 transition-colors duration-300 ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <Brain size={18} className="text-purple-500" />
                AI Learning Features
              </h2>

              <div className="grid gap-4 sm:gap-6">
                {/* Feature Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    {
                      available: pdf.isSummarized,
                      label: "Summary",
                      darkBorder: "border-emerald-700",
                      lightBorder: "border-emerald-200",
                      darkBg: "bg-emerald-900/20",
                      lightBg: "bg-emerald-50",
                    },
                    {
                      available: pdf.isFlashcardGenerated,
                      label: "Flashcards",
                      darkBorder: "border-emerald-700",
                      lightBorder: "border-emerald-200",
                      darkBg: "bg-emerald-900/20",
                      lightBg: "bg-emerald-50",
                    },
                    {
                      available: pdf.isQuizGenerated,
                      label: "Quiz",
                      darkBorder: "border-emerald-700",
                      lightBorder: "border-emerald-200",
                      darkBg: "bg-emerald-900/20",
                      lightBg: "bg-emerald-50",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                        feature.available
                          ? isDark
                            ? `border-emerald-700 ${feature.darkBg}`
                            : `border-emerald-200 ${feature.lightBg}`
                          : isDark
                          ? "border-gray-700 bg-gray-700/20"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {feature.available ? (
                          <CheckCircle size={18} className="text-emerald-600" />
                        ) : (
                          <XCircle
                            size={18}
                            className={
                              isDark ? "text-gray-500" : "text-gray-400"
                            }
                          />
                        )}
                        <span
                          className={`font-medium text-sm sm:text-base ${
                            feature.available
                              ? isDark
                                ? "text-emerald-300"
                                : "text-emerald-700"
                              : isDark
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {feature.label}
                        </span>
                      </div>
                      <p
                        className={`text-xs sm:text-sm ${
                          feature.available
                            ? isDark
                              ? "text-emerald-400"
                              : "text-emerald-600"
                            : isDark
                            ? "text-gray-500"
                            : "text-gray-400"
                        }`}
                      >
                        {feature.available ? "Available" : "Not Generated"}
                      </p>
                    </div>
                  ))}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className={`rounded-2xl shadow-xl w-full max-w-md transition-colors duration-300 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${
                  isDark ? "bg-red-900/30" : "bg-red-100"
                }`}
              >
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3
                className={`text-xl font-semibold text-center mb-2 transition-colors duration-300 ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Delete PDF?
              </h3>
              <p
                className={`text-center mb-6 transition-colors duration-300 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Are you sure you want to delete "{pdfToDelete?.title}"? This
                action cannot be undone.
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`px-6 py-2 border rounded-lg transition-colors duration-300 ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFDetailsPage;
