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
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;
import logo from "../../assets/logoR.png";
import { jwtDecode } from "jwt-decode";

// // Mock data for demonstration
// const mockQuizzes = [
//   {
//     id: 1,
//     title: "Advanced JavaScript Concepts",
//     category: "Programming",
//     tags: [
//       "JavaScript",
//       "ES6",
//       "Async/Await",
//       "Promises",
//       "Closures",
//       "Prototypes",
//       "DOM",
//     ],
//     difficulty: "Hard",
//     numQuestions: 25,
//     timeLimit: 1800,
//     mode: "Exam",
//     questionTypes: ["MCQ", "TrueFalse"],
//     createdAt: "2024-01-15",
//     studentsCompleted: 342,
//     averageScore: 78,
//   },
//   {
//     id: 2,
//     title: "Data Structures & Algorithms",
//     category: "Computer Science",
//     tags: ["Arrays", "Trees", "Graphs", "Sorting", "Searching", "Complexity"],
//     difficulty: "Medium",
//     numQuestions: 20,
//     timeLimit: 1200,
//     mode: "Practice",
//     questionTypes: ["MCQ", "ShortAnswer"],
//     createdAt: "2024-01-10",
//     studentsCompleted: 156,
//     averageScore: 85,
//   },
//   {
//     id: 3,
//     title: "Machine Learning Fundamentals",
//     category: "AI/ML",
//     tags: [
//       "Linear Regression",
//       "Classification",
//       "Neural Networks",
//       "Deep Learning",
//     ],
//     difficulty: "Hard",
//     numQuestions: 30,
//     timeLimit: 2400,
//     mode: "Exam",
//     questionTypes: ["MCQ", "TrueFalse", "ShortAnswer"],
//     createdAt: "2024-01-20",
//     studentsCompleted: 89,
//     averageScore: 72,
//   },
//   {
//     id: 4,
//     title: "React Hooks Deep Dive",
//     category: "Programming",
//     tags: ["React", "Hooks", "useState", "useEffect", "Custom Hooks"],
//     difficulty: "Medium",
//     numQuestions: 15,
//     timeLimit: 900,
//     mode: "Practice",
//     questionTypes: ["MCQ", "FillBlank"],
//     createdAt: "2024-01-25",
//     studentsCompleted: 234,
//     averageScore: 88,
//   },
//   {
//     id: 5,
//     title: "Database Design Patterns",
//     category: "Database",
//     tags: ["SQL", "NoSQL", "Normalization", "Indexes", "Transactions"],
//     difficulty: "Easy",
//     numQuestions: 12,
//     timeLimit: 600,
//     mode: "Practice",
//     questionTypes: ["MCQ", "TrueFalse"],
//     createdAt: "2024-01-18",
//     studentsCompleted: 445,
//     averageScore: 91,
//   },
//   {
//     id: 6,
//     title: "Cloud Computing Essentials",
//     category: "Cloud",
//     tags: [
//       "AWS",
//       "Azure",
//       "Docker",
//       "Kubernetes",
//       "Microservices",
//       "Serverless",
//     ],
//     difficulty: "Medium",
//     numQuestions: 18,
//     timeLimit: 1080,
//     mode: "Exam",
//     questionTypes: ["MCQ", "ShortAnswer"],
//     createdAt: "2024-01-12",
//     studentsCompleted: 167,
//     averageScore: 79,
//   },
// ];

// const categories = [
//   "All",
//   "Programming",
//   "Computer Science",
//   "AI/ML",
//   "Database",
//   "Cloud",
// ];
// const difficulties = ["All", "Easy", "Medium", "Hard", "Mixed"];
// const modes = ["All", "Practice", "Exam"];

const SummaryHome = () => {
  const navigate = useNavigate();
  const [showAllQuizzes, setShowAllQuizzes] = useState(false);
  const [expandedTags, setExpandedTags] = useState({});
  const [filters, setFilters] = useState({
    category: "All",
    difficulty: "All",
    mode: "All",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [totolSummaries, setTotalSummaries] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllSummaries = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("token:", token);

      const res = await axios.get(`${API_URL}/summary/get-all-summaries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log("summaries-->", res.data.data);
        setSummaries(res.data.data);
        const all = res.data.data;
        const summariestotal = await all.length;
        const uniqueCategories = new Set(
          all.map((summary) => summary.category)
        );
        console.log("uniqueCategories", uniqueCategories);
        const categoriestotal = uniqueCategories.size;
        console.log("summariestotal", summariestotal);
        console.log("categoriestotal", categoriestotal);

        setTotalSummaries(summariestotal);
        setTotalCategories(categoriestotal);

        toast.success("all summaries fetched successfully");
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
      setLoading(true);
      const res = await axios.get(`${API_URL}/pdf/pdfs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId: userID },
      });

      if (res.status === 200) {
        setPdfs(res.data.pdfs);
        console.log("Fetched PDFs:", res.data.pdfs);
      }
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSummaries();
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
      title: "Total Summaries",
      value: `${totolSummaries}`,
      change: `+7 this week`,
      icon: <Sparkles className="w-7 h-7" />,
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: "Categories",
      value: `${totalCategories}`,
      change: `+7 this week`,
      icon: <FolderOpen className="w-7 h-7" />,

      gradient: "from-emerald-500 to-teal-500",
      trend: "up",
    },

    // {
    //   title: "Dummy",
    //   value: "342",
    //   change: "+28 this week",
    //   icon: <Clock className="w-7 h-7" />,
    //   gradient: "from-orange-500 to-red-500",
    //   trend: "up",
    // },
  ];

  const handleCreateSummary = () => {
    navigate("/ai-summaries/generate-summary");
  };

  const handleStudySummary = (summaryId) => {
    console.log("summaryId:", summaryId);
    navigate(`/ai-summaries/${summaryId}`);
  };

  const toggleTags = (summaryId) => {
    setExpandedTags((prev) => ({
      ...prev,
      [summaryId]: !prev[summaryId],
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  //   const filteredQuizzes = mockQuizzes.filter((quiz) => {
  //     const matchesCategory =
  //       filters.category === "All" || quiz.category === filters.category;
  //     const matchesDifficulty =
  //       filters.difficulty === "All" || quiz.difficulty === filters.difficulty;
  //     const matchesMode = filters.mode === "All" || quiz.mode === filters.mode;
  //     const matchesSearch =
  //       quiz.title.toLowerCase().includes(filters.search.toLowerCase()) ||
  //       quiz.tags.some((tag) =>
  //         tag.toLowerCase().includes(filters.search.toLowerCase())
  //       );

  //     return matchesCategory && matchesDifficulty && matchesMode && matchesSearch;
  //   });

  //   const displayedQuizzes = showAllQuizzes
  //     ? filteredQuizzes
  //     : filteredQuizzes.slice(0, 3);

  //   const getDifficultyColor = (difficulty) => {
  //     switch (difficulty) {
  //       case "Easy":
  //         return "text-green-600 bg-green-100";
  //       case "Medium":
  //         return "text-yellow-600 bg-yellow-100";
  //       case "Hard":
  //         return "text-red-600 bg-red-100";
  //       default:
  //         return "text-purple-600 bg-purple-100";
  //     }
  //   };

  //   const getModeIcon = (mode) => {
  //     return mode === "Exam" ? (
  //       <Award className="w-4 h-4" />
  //     ) : (
  //       <Play className="w-4 h-4" />
  //     );
  //   };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16 ">
          <div className="flex items-center justify-center mb-8 group">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1 rounded-xl mr-2 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-white" />
              {/* <img src={logo} alt="" className="w-8 h-8 text-white" /> */}
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Summify</h1>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Smart Summary
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              Generator
            </span>
          </h2>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your documents into concise, insightful summaries with the
            power of AI
          </p>

          <button
            onClick={handleCreateSummary}
            // disabled={isGenerating}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
          >
            {/* {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Generate Flashcards
                <ArrowRight className="w-5 h-5" />
              </>
            )} */}
            Genearate Summary
          </button>
        </header>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
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
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Quick Recaps
              </h2>
              <p className="text-gray-600">
                Review core concepts in seconds before exams
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quizzes, topics, or tags..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {summaries.map((summary, idx) => (
    <div
      key={summary._id}
      className={`relative rounded-3xl shadow-md transition-all duration-500 ease-out p-6 flex flex-col justify-between transform hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl`}
      style={{
        backgroundColor: [
          "#FFE5D9", // soft peach
          "#DFF7E3", // mint green
          "#E5E0FF", // lavender
          "#FDE2E4", // pink
          "#E0F7FA", // teal
          "#FFF5E1", // cream
        ][idx % 6],
      }}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start mb-6">
        <span className="text-xs font-medium bg-white/70 px-3 py-1 rounded-full shadow-sm">
          {formatDate(summary.uploadedAt)}
        </span>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md group-hover:rotate-12 transition-transform duration-300">
          <BookOpen className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
        {summary.title}
      </h3>

      {/* Category */}
      <p className="text-sm text-gray-700 font-medium mb-4">
        {summary.category}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(expandedTags[summary._id]
          ? summary.tags
          : summary.tags.slice(0, 3)
        ).map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium bg-white/70 text-gray-800 rounded-full shadow-sm transition-transform duration-300 hover:scale-105"
          >
            {tag}
          </span>
        ))}
        {summary.tags.length > 3 && (
          <button
            onClick={() => toggleTags(summary._id)}
            className="px-2 py-1 text-xs text-gray-700 bg-white/60 hover:bg-white rounded-full transition-transform duration-300 hover:scale-105"
          >
            {expandedTags[summary._id]
              ? "See less"
              : `+${summary.tags.length - 3} more`}
          </button>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">
          📘 Study Material
        </span>
        <button
          onClick={() => handleStudySummary(summary._id)}
          className="px-4 py-2 text-sm font-semibold rounded-full bg-black text-white transition-all duration-300 hover:bg-gray-800 transform hover:scale-105 hover:shadow-lg"
        >
          Study
        </button>
      </div>
    </div>
  ))}
</div>

          {/* Show More Button */}
          {summaries.length < 3 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllQuizzes(!showAllQuizzes)}
                className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mx-auto shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {showAllQuizzes ? (
                  <>
                    <ChevronUp className="w-5 h-5" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5" />
                    Show All ({summaries.length - 3} more)
                  </>
                )}
              </button>
            </div>
          )}

          {/* Empty State */}
          {summaries.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No quizzes found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or create a new quiz
              </p>
              <button
                onClick={handleCreateSummary}
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

export default SummaryHome;
