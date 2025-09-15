import React, { useState, useEffect } from "react";
import {
  Star,
  FileText,
  Calendar,
  Plus,
  Check,
  Trash2,
  Upload,
  FolderOpen,
  Award,
  TrendingUp,
  Target,
  Brain,
  Edit2,
  Users,
  BarChart3,
  Zap,
  Flame,
  Trophy,
  ChevronRight,
  Eye,
  Heart,
  Coffee,
  RefreshCw,
  CheckCircle,
  Blocks,
  SquareStack,
} from "lucide-react";
import QuizStatisticsCard from "../components/dashboard/helper/QuizStatisticsCard";
import DashboardHeader from "@/components/dashboard/helper/DashboardHeader";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/AdminThemeContext"; // Adjust the path as needed

const API_URL = import.meta.env.VITE_API_URL;

const motivationalQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Innovation distinguishes between a leader and a follower.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Don't watch the clock; do what it does. Keep going.",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [currentQuote, setCurrentQuote] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [studyTime, setStudyTime] = useState("");
  const [activeTab, setActiveTab] = useState("uploads");
  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState("low");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [todoFilter, setTodoFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [favpdfs, setFavpdfs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [quizStats, setQuizStats] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [totalflashcards, setTotalFlashcards] = useState([]);
  const [quizLoading, setQuizLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem(`quote-${today}`);

    if (savedQuote) {
      setCurrentQuote(savedQuote);
    } else {
      const randomQuote =
        motivationalQuotes[
          Math.floor(Math.random() * motivationalQuotes.length)
        ];
      setCurrentQuote(randomQuote);
      localStorage.setItem(`quote-${today}`, randomQuote);
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/task/get-tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status == 200) {
        const tasks = res.data.data;
        console.log("tasks:", tasks);
        setTasks(tasks);
      }
    } catch (err) {
      console.log("err=>", err.message);
    }
  };
  const fetchPdfs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const res = await axios.get(`${API_URL}/pdf/pdfs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId: userId },
      });

      if (res.status == 200) {
        console.log("res.data.pdfs::", res.data.pdfs);
        setPdfs(res.data.pdfs);
        console.log("pdfs::::", pdfs);
        const favouritePDFs = res.data.pdfs.filter(
          (pdf) => pdf.isFavourite === true
        );

        const totalflashacards = res.data.pdfs.filter(
          (pdf) => pdf.isFlashcardGenerated === true
        );
        console.log("totalflashacards::::::", totalflashacards);

        setTotalFlashcards(totalflashacards);
        setFavpdfs(favouritePDFs);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const fetchQuizStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/quiz/quiz-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log(res.data);
        setQuizStats(res.data);
      }
    } catch (err) {
      console.log("Error fetching quiz stats:", err.message);
    } finally {
      setQuizLoading(false);
    }
  };
  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/quiz/get-all-quizzes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log(res.data.data);
        setQuiz(res.data.data);
      }
    } catch (err) {
      console.log("Error fetching quiz stats:", err.message);
    } finally {
      setQuizLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchPdfs();
    fetchQuizStats();
    fetchQuiz();
  }, []);

  const addTask = async () => {
    try {
      const taskData = {
        title: newTodo,
        priority: newTodoPriority,
        status: "active",
      };
      console.log("taskdata:", taskData);
      const token = localStorage.getItem("token");

      const res = await axios.post(`${API_URL}/task/create-task`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("res->", res.data);
      setTasks([...tasks, res.data.data]); // add new task
      setNewTodo("");
      setNewTodoPriority("low");
    } catch (err) {
      console.log("err=>", err.message);
    }
  };

  function getPDFsUploadedThisWeek(pdfs) {
    const now = new Date();

    // 🗓 Start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

    // 🗓 End of week (next Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // 📂 Filter PDFs with uploadedAt in range
    const filtered = pdfs.filter((pdf) => {
      if (!pdf.uploadedAt) return false; // skip if no date

      const uploaded = new Date(pdf.uploadedAt);
      return uploaded >= startOfWeek && uploaded < endOfWeek;
    });

    return filtered;
  }

  const totalPdfs = pdfs.length;
  const uniqueCategories = new Set(pdfs.map((pdf) => pdf.category));
  const totalCategories = uniqueCategories.size;

  const pdfsThisWeek = getPDFsUploadedThisWeek(pdfs);
  const totalpdfsthisweek = pdfsThisWeek.length;

  const recentPDFs = [...pdfs]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const isQuizes = pdfs.filter((pdf) => pdf.isQuizGenerated === true);
  const recentQuizes = [...isQuizes]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const isflashcard = pdfs.filter((pdf) => pdf.isFlashcardGenerated === true);
  console.log("isflashcard", isflashcard);
  const recentFlashcard = [...isflashcard]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const isSummary = pdfs.filter((pdf) => pdf.isSummarized === true);
  const recenSummaries = [...isSummary]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const stats = [
    {
      id: 1,
      title: "PDFs Uploaded",
      value: `${totalPdfs}`,
      change: `${totalpdfsthisweek} this week`,
      icon: <Upload className="w-7 h-7" />,
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      id: 2,
      title: "Categories",
      value: `${totalCategories}`,
      change: "",
      icon: <FolderOpen className="w-7 h-7" />,
      gradient: "from-emerald-500 to-teal-500",
      trend: "up",
    },
    {
      id: 3,
      title: "Quizzes Created",
      value: `${quiz.length}`,
      change: "+7 this week",
      icon: <Blocks className="w-7 h-7" />,
      gradient: "from-purple-500 to-pink-500",
      trend: "up",
    },
    {
      id: 4,
      title: "Flashcards generated",
      value: `${totalflashcards.length}`,
      change: "+28 this week",
      icon: <SquareStack className="w-7 h-7" />,
      gradient: "from-teal-500 to-green-500",
      trend: "up",
    },
  ];

  const toggleTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const task = tasks.find((t) => t._id === id);

      const res = await axios.put(
        `${API_URL}/task/update-task/${id}`,
        { status: task.status === "completed" ? "active" : "completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(tasks.map((t) => (t._id === id ? res.data.data : t)));
    } catch (err) {
      console.log("err =>", err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/task/delete-task/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.log("err =>", err.message);
    }
  };

  const startEdit = (todo) => {
    setEditingTodo(todo._id);
    setEditText(todo.title);
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/task/update-task/${editingTodo}`,
        { title: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(tasks.map((t) => (t._id === editingTodo ? res.data.data : t)));
      setEditingTodo(null);
      setEditText("");
    } catch (err) {
      console.log("err =>", err.message);
    }
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditText("");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return isDark
          ? "bg-red-900/30 text-red-300 border-red-700"
          : "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return isDark
          ? "bg-yellow-900/30 text-yellow-300 border-yellow-700"
          : "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return isDark
          ? "bg-green-900/30 text-green-300 border-green-700"
          : "bg-green-100 text-green-700 border-green-200";
      default:
        return isDark
          ? "bg-gray-800 text-gray-300 border-gray-700"
          : "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const setReminder = () => {
    if (studyTime) {
      // Here you would typically save to backend or local storage
      alert(`Study reminder set for ${new Date(studyTime).toLocaleString()}`);
      setShowReminder(false);
      setStudyTime("");
    }
  };

  const filteredTodos = tasks.filter((t) => {
    if (todoFilter === "all") return true;
    if (todoFilter === "active") return t.status === "active";
    if (todoFilter === "completed") return t.status === "completed";
    return true;
  });

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;

  const tabData = {
    uploads: {
      title: "Recent Uploads",
      icon: <Upload className="w-5 h-5" />,
      data: recentPDFs,
      gradient: "from-blue-500 to-cyan-500",
    },
    quizzes: {
      title: "Recent Quizzes",
      icon: <Blocks className="w-5 h-5" />,
      data: recentQuizes.filter((q) => q !== undefined && q !== null), // Filter out undefined/null
      gradient: "from-purple-500 to-pink-500",
    },
    flashcards: {
      title: "Flashcards",
      icon: <SquareStack className="w-5 h-5" />,
      data: recentFlashcard.filter((f) => f !== undefined && f !== null), // Filter out undefined/null
      gradient: "from-teal-500 to-green-500",
    },
    summaries: {
      title: "AI Summaries",
      icon: <FileText className="w-5 h-5" />,
      data: recenSummaries.filter((s) => s !== undefined && s !== null), // Filter out undefined/null
      gradient: "from-orange-500 to-red-500",
    },
  };
  function timeAgo(dateString) {
    if (!dateString) return "Unknown time";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);

      if (seconds < 60) return "just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Recent";
    }
  }

  const renderTabContent = () => {
    const currentTab = tabData[activeTab];

    return (
      <div className="space-y-3">
        {currentTab?.data.length > 0 ? (
          currentTab.data.map((item) => (
            <div
              key={item._id}
              className={`group p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                isDark
                  ? activeTab === "uploads"
                    ? "bg-blue-900/20 hover:bg-blue-900/30"
                    : activeTab === "quizzes"
                    ? "bg-purple-900/20 hover:bg-purple-900/30"
                    : activeTab === "flashcards"
                    ? "bg-teal-900/20 hover:bg-teal-900/30"
                    : "bg-orange-900/20 hover:bg-orange-900/30"
                  : activeTab === "uploads"
                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100"
                  : activeTab === "quizzes"
                  ? "bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
                  : activeTab === "flashcards"
                  ? "bg-gradient-to-r from-teal-50 to-green-50 hover:from-teal-100 hover:to-green-100"
                  : "bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100"
              }`}
              onClick={() => {
                // Navigate to the appropriate page based on tab type
                if (activeTab === "uploads") {
                  navigate(`/pdf/${item._id}`);
                } else if (activeTab === "quizzes") {
                  navigate(`/quizmaster`);
                } else if (activeTab === "flashcards") {
                  navigate(`/flashgenius/get-flashcards/${item._id}`);
                } else if (activeTab === "summaries") {
                  navigate(`/summify/${item._id}`);
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className={`font-medium text-sm group-hover:text-blue-700 transition-colors truncate ${
                    isDark ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  {item.title || "Untitled"}
                </p>
                <div className="flex items-center gap-2">
                  {/* Show score for quizzes if available */}
                  {activeTab === "quizzes" && item.score !== undefined && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isDark
                          ? "bg-purple-800 text-purple-200"
                          : "bg-purple-200 text-purple-800"
                      }`}
                    >
                      {item.score}%
                    </span>
                  )}
                  {/* Show category for all items if available */}
                  {item.category && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full truncate max-w-[80px] ${
                        isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {item.category}
                    </span>
                  )}
                  <Eye
                    className={`w-4 h-4 transition-colors ${
                      isDark
                        ? "text-gray-400 group-hover:text-blue-400"
                        : "text-gray-400 group-hover:text-blue-600"
                    }`}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {item.uploadedAt ? timeAgo(item.uploadedAt) : "Recently"}
                </span>
                {/* Show progress if available */}
                {item.progress !== undefined && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-16 rounded-full h-2 ${
                        isDark ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`bg-gradient-to-r ${currentTab.gradient} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {/* {item.progress}% */}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div
              className={`p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              {activeTab === "uploads" && (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
              {activeTab === "quizzes" && (
                <Award className="w-6 h-6 text-gray-400" />
              )}
              {activeTab === "flashcards" && (
                <Brain className="w-6 h-6 text-gray-400" />
              )}
              {activeTab === "summaries" && (
                <FileText className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <p
              className={`font-medium ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              No {activeTab} yet
            </p>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {activeTab === "uploads" &&
                "Upload your first PDF to get started"}
              {activeTab === "quizzes" && "Generate a quiz from your PDFs"}
              {activeTab === "flashcards" && "Create flashcards from your PDFs"}
              {activeTab === "summaries" && "Generate summaries from your PDFs"}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Add this function to refresh data
  const refreshData = async () => {
    setRefreshing(true);
    await fetchPdfs();
    await fetchTasks();
    setRefreshing(false);
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-4 overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Motivational Quote and Study Reminder */}
        <DashboardHeader isDark={isDark} />

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={`${stat?.id}`}
              className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
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
                    {/* <TrendingUp className="w-4 h-4" />
                    {stat.change} */}
                  </div>
                </div>
                <div>
                  <p
                    className={`text-sm font-medium mb-1 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.title}
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Todo Section with Enhanced Design */}
        <div
          className={`rounded-3xl shadow-xl p-5 sm:p-8 border transition-all duration-500 hover:shadow-2xl ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl text-white shadow-lg">
                <Check className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h2
                  className={`text-lg sm:text-xl md:text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Task Management
                </h2>
                <p
                  className={`text-sm md:text-base ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Stay organized and productive
                </p>
              </div>
            </div>

            {/* Completed Badge */}
            <div
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl w-fit mx-auto sm:mx-0 ${
                isDark
                  ? "bg-gradient-to-r from-green-900/30 to-emerald-900/30"
                  : "bg-gradient-to-r from-green-50 to-emerald-50"
              }`}
            >
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs sm:text-sm font-medium text-green-700">
                {completedCount}/{totalCount} completed
              </span>
            </div>
          </div>

          {/* Task Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: "all", label: "All Tasks", count: totalCount },
              {
                key: "active",
                label: "Active",
                count: totalCount - completedCount,
              },
              { key: "completed", label: "Completed", count: completedCount },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setTodoFilter(filter.key)}
                className={`px-3 sm:px-4 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 ${
                  todoFilter === filter.key
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    : isDark
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Add Todo */}
          <div
            className={`rounded-2xl p-4 sm:p-6 mb-6 ${
              isDark
                ? "bg-gradient-to-r from-gray-700/50 to-blue-900/30"
                : "bg-gradient-to-r from-gray-50 to-blue-50"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What do you want to accomplish today?"
                className={`flex-1 p-3 sm:p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-sm sm:text-base ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200"
                }`}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
              />
              <div className="flex gap-3">
                <select
                  value={newTodoPriority}
                  onChange={(e) => setNewTodoPriority(e.target.value)}
                  className={`p-3 sm:p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm text-sm sm:text-base ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={addTask}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Todo List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div
                  className={`p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Check className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <p
                  className={`font-medium text-sm sm:text-base ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {todoFilter === "completed"
                    ? "No completed tasks yet"
                    : todoFilter === "active"
                    ? "No active tasks"
                    : "No tasks yet"}
                </p>
                <p
                  className={`text-xs sm:text-sm mt-1 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {todoFilter === "active"
                    ? "Great job! All tasks completed."
                    : "Add a task to get started"}
                </p>
              </div>
            ) : (
              filteredTodos.map((task) => (
                <div
                  key={task._id}
                  className={`group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    task.status === "completed"
                      ? isDark
                        ? "bg-green-900/20 border-green-700 opacity-75"
                        : "bg-green-50 border-green-200 opacity-75"
                      : isDark
                      ? "bg-gray-700 border-gray-600 hover:border-blue-500 hover:shadow-md"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(task._id)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      task.status === "completed"
                        ? "bg-green-600 border-green-600 text-white"
                        : isDark
                        ? "border-gray-500 hover:border-green-600 hover:bg-green-900/30"
                        : "border-gray-300 hover:border-green-600 hover:bg-green-50"
                    }`}
                  >
                    {task.status === "completed" && (
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </button>

                  {/* Priority */}
                  <span
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>

                  {/* Title + Actions */}
                  {editingTodo === task._id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                          isDark
                            ? "bg-gray-600 border-gray-500 text-white"
                            : "border-gray-300"
                        }`}
                        onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                      />
                      <button
                        onClick={saveEdit}
                        className="text-green-600 hover:text-green-800 p-2"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-600 hover:text-gray-800 p-2"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-1 font-medium text-sm sm:text-base ${
                          task.status === "completed"
                            ? "line-through text-gray-500"
                            : isDark
                            ? "text-gray-200"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex gap-2 sm:gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(task)}
                          className={`p-2 rounded-lg ${
                            isDark
                              ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                              : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          }`}
                        >
                          <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => deleteTodo(task._id)}
                          className={`p-2 rounded-lg ${
                            isDark
                              ? "text-red-400 hover:text-red-300 hover:bg-red-900/30"
                              : "text-red-600 hover:text-red-800 hover:bg-red-50"
                          }`}
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quiz Statistics Card */}
        <QuizStatisticsCard
          stats={quizStats}
          loading={quizLoading}
          isDark={isDark}
        />

        {/* Content Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Favorite PDFs */}
          <div
            className={`rounded-3xl shadow-xl p-6 border transition-all duration-500 hover:shadow-2xl ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl text-white shadow-lg">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Favorite PDFs
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Your starred content
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {favpdfs
                ?.map((pdf) => (
                  <div
                    key={pdf._id}
                    onClick={() => navigate(`/pdf/${pdf._id}`)}
                    className={`group flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                      isDark
                        ? "bg-gradient-to-r from-yellow-900/20 to-orange-900/20 hover:from-yellow-900/30 hover:to-orange-900/30"
                        : "bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100"
                    }`}
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                    <div className="flex-1">
                      <p
                        className={`font-medium text-sm group-hover:text-orange-700 transition-colors ${
                          isDark ? "text-gray-200" : "text-gray-900"
                        }`}
                      >
                        {pdf.title}
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {new Date(pdf.uploadedAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-colors ${
                        isDark
                          ? "text-gray-400 group-hover:text-orange-400"
                          : "text-gray-400 group-hover:text-orange-600"
                      }`}
                    />
                  </div>
                ))
                .slice(0, 6)}
            </div>
          </div>

          {/* Recent Activities with Tabs */}
          <div
            className={`rounded-3xl shadow-xl p-6 border transition-all duration-500 hover:shadow-2xl ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 bg-gradient-to-br ${tabData[activeTab].gradient} rounded-2xl text-white shadow-lg transition-all duration-300`}
                >
                  {tabData[activeTab].icon}
                </div>
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {tabData[activeTab].title}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Your recent activities
                  </p>
                </div>
              </div>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                title="Refresh data"
              >
                <RefreshCw
                  className={`w-5 h-5 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {/* Tab Navigation */}
            <div
              className={`flex gap-1 mb-6 p-1 rounded-2xl ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {Object.entries(tabData).map(([key, tab]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                    activeTab === key
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">
                    {tab.title.split(" ")[1] || tab.title.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
