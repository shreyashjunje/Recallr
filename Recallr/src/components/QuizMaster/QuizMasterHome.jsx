import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Upload,
  Brain,
  BarChart3,
  History,
  Eye,
  RotateCcw,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Play,
  Tag,
  Calendar,
  Users,
  Star,
  Timer,
  Award,
  Zap,
  FolderOpen,
  ClipboardList,
  FileQuestion,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useTheme } from "@/context/AdminThemeContext";

const API_URL = import.meta.env.VITE_API_URL;

const QuizMasterHome = () => {
  const navigate = useNavigate();
  const [expandedTags, setExpandedTags] = useState({});
  const [filters, setFilters] = useState({
    category: "All",
    difficulty: "All",
    mode: "All",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [pdfs, setPdfs] = useState([]);
  const { isDark, toggleTheme } = useTheme(); // Get theme state and toggle function

  const categories = [
    "All",
    "Programming",
    "Computer Science",
    "AI/ML",
    "Database",
    "Cloud",
  ];
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const modes = ["All", "Practice", "Exam"];

  const fetchAllQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/quiz/get-all-quizzes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setQuizzes(res.data.data);
        const all = res.data.data;
        console.log("all:", all);
        setTotalQuizzes(all.length);

        const uniqueCategories = new Set(all.map((quiz) => quiz.category));
        setTotalCategories(uniqueCategories.size);

        toast.success("All quizzes fetched successfully");
      }
    } catch (err) {
      console.log("err:", err);
      toast.error(err.message);
    }
  };

  const fetchPdfs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const userID = decodedToken.id;
    try {
      const res = await axios.get(`${API_URL}/pdf/pdfs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId: userID },
      });

      if (res.status === 200) {
        setPdfs(res.data.pdfs);
      }
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  useEffect(() => {
    fetchAllQuizzes();
    fetchPdfs();
  }, []);

  const stats = [
    {
      title: "Total Pdfs",
      value: `${pdfs.length}`,
      change: "+7 this week",
      icon: <Upload className="w-7 h-7" />,
      gradient: "from-purple-500 to-pink-500",
      trend: "up",
    },
    {
      title: "Total Quizzes",
      value: `${totalQuizzes}`,
      change: `7 this week`,
      icon: <FileQuestion className="w-7 h-7" />,
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: "Categories",
      value: `${totalCategories}`,
      change: `7 this week`,
      icon: <FolderOpen className="w-7 h-7" />,
      gradient: "from-emerald-500 to-teal-500",
      trend: "up",
    },
  ];

  const handleCreateQuiz = () => {
    navigate("/quizmaster/quizsettings");
  };

  const handleStudyQuiz = (quizId) => {
    navigate(`/quizmaster/${quizId}`);
  };

  const toggleTags = (quizId) => {
    setExpandedTags((prev) => ({
      ...prev,
      [quizId]: !prev[quizId],
    }));
  };

  // Filter quizzes based on selected filters and search term
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesCategory =
      filters.category === "All" ||
      quiz.category === filters.category ||
      (filters.category === "Programming" && quiz.category === "Programming") ||
      (filters.category === "Computer Science" &&
        quiz.category === "Computer Science") ||
      (filters.category === "AI/ML" && quiz.category === "AI/ML") ||
      (filters.category === "Database" && quiz.category === "Database") ||
      (filters.category === "Cloud" && quiz.category === "Cloud");

    const matchesDifficulty =
      filters.difficulty === "All" ||
      quiz.settings?.difficulty === filters.difficulty;

    const matchesMode =
      filters.mode === "All" || quiz.settings?.mode === filters.mode;

    const matchesSearch =
      filters.search === "" ||
      quiz.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (quiz.tags &&
        quiz.tags.some((tag) =>
          tag.toLowerCase().includes(filters.search.toLowerCase())
        ));

    return matchesCategory && matchesDifficulty && matchesMode && matchesSearch;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getModeIcon = (mode) => {
    return mode === "Exam" ? (
      <Award className="w-4 h-4" />
    ) : (
      <Play className="w-4 h-4" />
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-purple-600 bg-purple-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16 ">
          <div className="flex items-center justify-center mb-8 group">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-700 p-1 rounded-xl mr-2 group-hover:scale-110 transition-transform duration-300">
              <ClipboardList className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              QuizMaster
            </h1>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Smart Quiz
            <span className="bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">
              {" "}
              Generator
            </span>
          </h2>

          <p className="text-xl text-slate-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Practice smarter with personalized questions designed to test your
            understanding.
          </p>

          <button
            onClick={handleCreateQuiz}
            className="bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
          >
            Generate Quiz
          </button>
        </header>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-2 md:px-4 lg:px-6 py-12">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Your Quiz Library
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Discover and practice with your personalized quizzes
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quizzes, topics, or tags..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Filters
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden text-blue-600 hover:text-blue-700 transition-colors"
              >
                {showFilters ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
                showFilters ? "block" : "hidden lg:grid"
              }`}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mode
                </label>
                <select
                  value={filters.mode}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, mode: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {modes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredQuizzes.map((quiz, index) => (
              <div
                key={quiz._id}
                className="group relative rounded-2xl sm:rounded-3xl shadow-md transition-all duration-500 ease-out 
                 p-4 sm:p-6 flex flex-col justify-between 
                 transform hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  backgroundColor: [
                    "#FFE5D9", // soft peach
                    "#DFF7E3", // mint green
                    "#E5E0FF", // lavender
                    "#FDE2E4", // pink
                    "#E0F7FA", // teal
                    "#FFF5E1", // cream
                  ][index % 6],
                }}
              >
                {/* Card Header */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <span
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-white/70  shadow-sm ${getDifficultyColor(
                        quiz.settings?.difficulty
                      )}`}
                    >
                      {quiz.settings?.difficulty || "Mixed"}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-gray-800 px-2 py-0.5 sm:py-1 rounded-full shadow-sm">
                      {getModeIcon(quiz.settings?.mode)}
                      <span className="text-[10px] sm:text-xs">
                        {quiz.settings?.mode || "Practice"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-800 mb-1 sm:mb-2 group-hover:text-gray-800 transition-colors h-[50px] sm:h-[60px]">
                    {quiz.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-700 flex items-center gap-1 sm:gap-2">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                    {quiz.category || "General"}
                  </p>
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-grow">
                  {/* Quiz Stats */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="text-center p-2 sm:p-3 bg-white/70 rounded-lg sm:rounded-xl shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-orange-500 mb-0.5 sm:mb-1">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-medium">
                          Questions
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-gray-900">
                        {quiz.settings?.numQuestions || 10}
                      </p>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white/70  rounded-lg sm:rounded-xl shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-green-600 mb-0.5 sm:mb-1">
                        <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-[10px] sm:text-xs font-medium">
                          Time
                        </span>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-gray-900 ">
                        {quiz.settings?.timeLimit}m
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4 sm:mb-6 h-[70px] sm:h-[80px]">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 ">
                        Topics
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {quiz.tags && quiz.tags.length > 0 ? (
                        <>
                          {(expandedTags[quiz._id]
                            ? quiz.tags
                            : quiz.tags.slice(0, 3)
                          ).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/70  text-gray-800 text-[10px] sm:text-xs rounded-full font-medium shadow-sm"
                            >
                              {tag}
                            </span>
                          ))}
                          {quiz.tags.length > 3 && (
                            <button
                              onClick={() => toggleTags(quiz._id)}
                              className="px-2 py-0.5 text-[10px] sm:text-xs text-gray-700  bg-white/60 hover:bg-white dark:hover:bg-gray-800 rounded-full"
                            >
                              {expandedTags[quiz._id]
                                ? "See less"
                                : `+${quiz.tags.length - 3} more`}
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          No tags available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleStudyQuiz(quiz._id)}
                    className="w-full mb-3 sm:mb-4 bg-black text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 group-hover:opacity-100 transform translate-y-1 sm:translate-y-2 group-hover:translate-y-0 hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                  >
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                    Start Studying
                  </button>
                </div>

                {/* Card Footer */}
                <div className="pt-3 sm:pt-4">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-600 dark:text-white">
                    <span className="font-medium bg-white/70 dark:bg-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
                      {formatDate(quiz.createdAt)}
                    </span>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                      {quiz.settings?.questionTypes &&
                        quiz.settings.questionTypes.map((type, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-white/70 dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-sm text-[10px] sm:text-xs"
                          >
                            {type}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredQuizzes.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No quizzes found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Try adjusting your filters or create a new quiz
              </p>
              <button
                onClick={handleCreateQuiz}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create Your First Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizMasterHome;
