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
} from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;

// Mock data for demonstration
const mockQuizzes = [
  {
    id: 1,
    title: "Advanced JavaScript Concepts",
    category: "Programming",
    tags: [
      "JavaScript",
      "ES6",
      "Async/Await",
      "Promises",
      "Closures",
      "Prototypes",
      "DOM",
    ],
    difficulty: "Hard",
    numQuestions: 25,
    timeLimit: 1800,
    mode: "Exam",
    questionTypes: ["MCQ", "TrueFalse"],
    createdAt: "2024-01-15",
    studentsCompleted: 342,
    averageScore: 78,
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    category: "Computer Science",
    tags: ["Arrays", "Trees", "Graphs", "Sorting", "Searching", "Complexity"],
    difficulty: "Medium",
    numQuestions: 20,
    timeLimit: 1200,
    mode: "Practice",
    questionTypes: ["MCQ", "ShortAnswer"],
    createdAt: "2024-01-10",
    studentsCompleted: 156,
    averageScore: 85,
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals",
    category: "AI/ML",
    tags: [
      "Linear Regression",
      "Classification",
      "Neural Networks",
      "Deep Learning",
    ],
    difficulty: "Hard",
    numQuestions: 30,
    timeLimit: 2400,
    mode: "Exam",
    questionTypes: ["MCQ", "TrueFalse", "ShortAnswer"],
    createdAt: "2024-01-20",
    studentsCompleted: 89,
    averageScore: 72,
  },
  {
    id: 4,
    title: "React Hooks Deep Dive",
    category: "Programming",
    tags: ["React", "Hooks", "useState", "useEffect", "Custom Hooks"],
    difficulty: "Medium",
    numQuestions: 15,
    timeLimit: 900,
    mode: "Practice",
    questionTypes: ["MCQ", "FillBlank"],
    createdAt: "2024-01-25",
    studentsCompleted: 234,
    averageScore: 88,
  },
  {
    id: 5,
    title: "Database Design Patterns",
    category: "Database",
    tags: ["SQL", "NoSQL", "Normalization", "Indexes", "Transactions"],
    difficulty: "Easy",
    numQuestions: 12,
    timeLimit: 600,
    mode: "Practice",
    questionTypes: ["MCQ", "TrueFalse"],
    createdAt: "2024-01-18",
    studentsCompleted: 445,
    averageScore: 91,
  },
  {
    id: 6,
    title: "Cloud Computing Essentials",
    category: "Cloud",
    tags: [
      "AWS",
      "Azure",
      "Docker",
      "Kubernetes",
      "Microservices",
      "Serverless",
    ],
    difficulty: "Medium",
    numQuestions: 18,
    timeLimit: 1080,
    mode: "Exam",
    questionTypes: ["MCQ", "ShortAnswer"],
    createdAt: "2024-01-12",
    studentsCompleted: 167,
    averageScore: 79,
  },
];

const categories = [
  "All",
  "Programming",
  "Computer Science",
  "AI/ML",
  "Database",
  "Cloud",
];
const difficulties = ["All", "Easy", "Medium", "Hard", "Mixed"];
const modes = ["All", "Practice", "Exam"];

const QuizMasterHome = () => {
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
  const [quizzes, setQuizzes] = useState([]);
  const [totolQuizzes,setTotalQuizzes]=useState(0);
  const [totalCategories,setTotalCategories]=useState(0)

  const fetchAllQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("token:", token);

      const res = await axios.get(`${API_URL}/quiz/get-all-quizzes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log("quizzes-->", res.data.data);
        setQuizzes(res.data.data);
        const all=res.data.data
        const quizzestotal=await all.length;
        const uniqueCategories = new Set(all.map((quiz) => quiz.category));
        const categoriestotal = uniqueCategories.size;

        setTotalQuizzes(quizzestotal)
        setTotalCategories(categoriestotal)
        


        toast.success("all quizzes fetched successfully");
      }
    } catch (err) {
      console.log("err:", err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  const stats = [
    {
      title: "Total Quizzes",
      value: `${totolQuizzes}`,
      change: `7 this week`,
      icon: <Upload className="w-7 h-7" />,
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: "Categories",
      value: `${totalCategories}`,
      change: "",
      icon: <FolderOpen className="w-7 h-7" />,

      gradient: "from-emerald-500 to-teal-500",
      trend: "up",
    },
    {
      title: "Dummy",
      value: "89",
      change: "+7 this week",
      icon: <Award className="w-7 h-7" />,
      gradient: "from-purple-500 to-pink-500",
      trend: "up",
    },
    {
      title: "Dummy",
      value: "342",
      change: "+28 this week",
      icon: <Clock className="w-7 h-7" />,
      gradient: "from-orange-500 to-red-500",
      trend: "up",
    },
  ];

  const handleCreateQuiz = () => {
    navigate("/quizmaster/quizsettings");
  };

  const handleStudyQuiz = (quizId) => {
    console.log("quizid:",quizId)
    navigate(`/quizmaster/${quizId}`);
  };

  const toggleTags = (quizId) => {
    setExpandedTags((prev) => ({
      ...prev,
      [quizId]: !prev[quizId],
    }));
  };

  const filteredQuizzes = mockQuizzes.filter((quiz) => {
    const matchesCategory =
      filters.category === "All" || quiz.category === filters.category;
    const matchesDifficulty =
      filters.difficulty === "All" || quiz.difficulty === filters.difficulty;
    const matchesMode = filters.mode === "All" || quiz.mode === filters.mode;
    const matchesSearch =
      quiz.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      quiz.tags.some((tag) =>
        tag.toLowerCase().includes(filters.search.toLowerCase())
      );

    return matchesCategory && matchesDifficulty && matchesMode && matchesSearch;
  });

  const displayedQuizzes = showAllQuizzes
    ? filteredQuizzes
    : filteredQuizzes.slice(0, 3);

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

  const getModeIcon = (mode) => {
    return mode === "Exam" ? (
      <Award className="w-4 h-4" />
    ) : (
      <Play className="w-4 h-4" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16 ">
          <div className="flex items-center justify-center mb-8 group">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1 rounded-xl mr-2 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">QuizMaster</h1>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Smart Quiz
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              Generator
            </span>
          </h2>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your learning experience with AI-powered flashcards.
            Create, study, and master any subject efficiently.
          </p>

          <button
            onClick={handleCreateQuiz}
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
            Genearate Quiz
          </button>
        </header>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                Your Quiz Library
              </h2>
              <p className="text-gray-600">
                Discover and practice with your personalized quizzes
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

          {/* Filters Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
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
                showFilters || "lg:block"
              } ${!showFilters && "hidden lg:grid"}`}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mode
                </label>
                <select
                  value={filters.mode}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, mode: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          quiz.settings?.difficulty
                        )}`}
                      >
                        {quiz.settings?.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500">
                        {getModeIcon(quiz.mode)}
                        <span className="text-xs">{quiz.settings?.mode}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {quiz.title}
                    </h3>

                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {quiz.category}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Quiz Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                          <Target className="w-4 h-4" />
                          <span className="text-xs font-medium">Questions</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {quiz.settings?.numQuestions}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                          <Timer className="w-4 h-4" />
                          <span className="text-xs font-medium">Time</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {Math.floor(quiz.settings?.timeLimit / 60)}m
                        </p>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="flex justify-between items-center mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">
                          {/* {quiz.studentsCompleted} completed */}
                          dummy completed
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {/* {quiz.averageScore}% avg */}
                          dummy avg %
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">
                          Topics
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(expandedTags[quiz._id]
                          ? quiz.tags
                          : quiz.tags.slice(0, 3)
                        ).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {quiz.tags.length > 3 && (
                          <button
                            onClick={() => toggleTags(quiz._id)}
                            className="px-2 py-1 text-blue-600 text-xs hover:bg-blue-50 rounded-full transition-colors"
                          >
                            {expandedTags[quiz._id]
                              ? "See less"
                              : `+${quiz.tags.length - 3} more`}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleStudyQuiz(quiz._id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <Zap className="w-5 h-5" />
                      Start Studying
                    </button>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        {quiz.settings?.questionTypes.map((type, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {filteredQuizzes.length < 3 && (
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
                    Show All ({filteredQuizzes.length - 3} more)
                  </>
                )}
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredQuizzes.length === 0 && (
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
