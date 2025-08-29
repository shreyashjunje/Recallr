import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
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
  Bell,
  Play,
  Users,
  BarChart3,
  Zap,
  Flame,
  Trophy,
  BookMarked,
  Activity,
  Sparkles,
  ChevronRight,
  Eye,
  Download,
  Share2,
  Heart,
  Timer,
  Coffee,
  RefreshCw,
} from "lucide-react";
import QuoteCard from "../components/dashboard/helper/QuoteCard";
import DashboardHeader from "@/components/dashboard/helper/DashboardHeader";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
const API_URL = import.meta.env.VITE_API_URL;

// interface TodoItem {
//   id: string;
//   text: string;
//   completed: boolean;
//   priority: 'low' | 'medium' | 'high';
// }

// interface StatCard {
//   title: string;
//   value: string;
//   change: string;
//   icon: React.ReactNode;
//   gradient: string;
//   trend: 'up' | 'down';
// }

// interface ContentItem {
//   id: string;
//   title: string;
//   date: string;
//   type?: string;
//   progress?: number;
//   score?: number;
// }

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
  const [currentQuote, setCurrentQuote] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [studyTime, setStudyTime] = useState("");
  const [activeTab, setActiveTab] = useState("uploads");

  const navigate = useNavigate();

  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState("low");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [todoFilter, setTodoFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [pdfs, setPdfs] = useState([]);

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
        setPdfs(res.data.pdfs);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchPdfs();
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

  const favouritePDFs = pdfs.filter((pdf) => pdf.isFavourite === true);
  const recentPDFs = [...pdfs]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const isQuizes = pdfs.filter((pdf) => pdf.isQuizGenerated === true);
  const recentQuizes = [...isQuizes]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const isflashcard = pdfs.filter((pdf) => pdf.isFlashcardGenerated === true);
  const recentFlashcard = [...isflashcard]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const isSummary = pdfs.filter((pdf) => pdf.isSummarized === true);
  const recenSummaries = [...isSummary]
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .slice(0, 3);

  const stats = [
    {
      title: "PDFs Uploaded",
      value: `${totalPdfs}`,
      change: `${totalpdfsthisweek} this week`,
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
      title: "Quizzes Created",
      value: "89",
      change: "+7 this week",
      icon: <Award className="w-7 h-7" />,
      gradient: "from-purple-500 to-pink-500",
      trend: "up",
    },
    {
      title: "Study Hours",
      value: "342",
      change: "+28 this week",
      icon: <Clock className="w-7 h-7" />,
      gradient: "from-orange-500 to-red-500",
      trend: "up",
    },
  ];

  // Add this state variable

  const upcomingEvents = [
    {
      id: "1",
      title: "JavaScript Exam",
      date: "Tomorrow 10:00 AM",
      type: "exam",
    },
    {
      id: "2",
      title: "Project Presentation",
      date: "Dec 15, 2:00 PM",
      type: "presentation",
    },
    {
      id: "3",
      title: "Study Group Meeting",
      date: "Dec 16, 4:00 PM",
      type: "meeting",
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
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case "exam":
        return <Trophy className="w-4 h-4" />;
      case "presentation":
        return <Users className="w-4 h-4" />;
      case "meeting":
        return <Coffee className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
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

  // const tabData = {
  //   uploads: {
  //     title: "Recent Uploads",
  //     icon: <Upload className="w-5 h-5" />,
  //     data: recentPDFs,
  //     gradient: "from-blue-500 to-cyan-500",
  //   },
  //   quizzes: {
  //     title: "Recent Quizzes",
  //     icon: <Award className="w-5 h-5" />,
  //     data: recentQuizes,
  //     gradient: "from-purple-500 to-pink-500",
  //   },
  //   flashcards: {
  //     title: "Flashcards",
  //     icon: <Brain className="w-5 h-5" />,
  //     data: recentFlashcard,
  //     gradient: "from-teal-500 to-green-500",
  //   },
  //   summaries: {
  //     title: "AI Summaries",
  //     icon: <FileText className="w-5 h-5" />,
  //     data: recenSummaries,
  //     gradient: "from-orange-500 to-red-500",
  //   },
  // };
  const tabData = {
    uploads: {
      title: "Recent Uploads",
      icon: <Upload className="w-5 h-5" />,
      data: recentPDFs,
      gradient: "from-blue-500 to-cyan-500",
    },
    quizzes: {
      title: "Recent Quizzes",
      icon: <Award className="w-5 h-5" />,
      data: recentQuizes.filter((q) => q !== undefined && q !== null), // Filter out undefined/null
      gradient: "from-purple-500 to-pink-500",
    },
    flashcards: {
      title: "Flashcards",
      icon: <Brain className="w-5 h-5" />,
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

  // const renderTabContent = () => {
  //   const currentTab = tabData[activeTab];
  //   console.log("currentTAB:::",currentTab)
  //   console.log("in the tab quiz-->", currentTab.data);

  //   return (
  //     <div className="space-y-3">
  //       {currentTab?.data.map((item) => (
  //         <div
  //           key={item._id}
  //           className={`group p-4 bg-gradient-to-r ${
  //             activeTab === "uploads"
  //               ? "from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100"
  //               : activeTab === "quizzes"
  //               ? "from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
  //               : activeTab === "flashcards"
  //               ? "from-teal-50 to-green-50 hover:from-teal-100 hover:to-green-100"
  //               : "from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100"
  //           } rounded-xl transition-all duration-300`}
  //         >
  //           <div className="flex items-center justify-between mb-2">
  //             <p className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
  //               {item.title}
  //             </p>
  //             <div className="flex items-center gap-2">
  //               {item.score && (
  //                 <span
  //                   className={`text-xs px-2 py-1 rounded-full font-medium ${
  //                     activeTab === "quizzes"
  //                       ? "bg-purple-200 text-purple-800"
  //                       : "bg-blue-200 text-blue-800"
  //                   }`}
  //                 >
  //                   {item.score}%
  //                 </span>
  //               )}
  //               {item.type && (
  //                 <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
  //                   {/* {console.log(item.type)} */}
  //                   {item.type}
  //                 </span>
  //               )}
  //               <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
  //             </div>
  //           </div>
  //           <div className="flex items-center justify-between">
  //             <span className="text-xs text-gray-500">
  //               {timeAgo(item.uploadedAt)}
  //             </span>
  //             {/* {item.progress && (
  //               <div className="flex items-center gap-2">
  //                 <div className="w-16 bg-gray-200 rounded-full h-2">
  //                   <div
  //                     className={`bg-gradient-to-r ${currentTab.gradient} h-2 rounded-full transition-all duration-500`}
  //                     style={{ width: `${item.progress}%` }}
  //                   ></div>
  //                 </div>
  //                 <span className="text-xs text-gray-600">
  //                   {item.progress}%
  //                 </span>
  //               </div>
  //             )} */}
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };
  const renderTabContent = () => {
    const currentTab = tabData[activeTab];

    return (
      <div className="space-y-3">
        {currentTab?.data.length > 0 ? (
          currentTab.data.map((item) => (
            <div
              key={item._id}
              className={`group p-4 bg-gradient-to-r ${
                activeTab === "uploads"
                  ? "from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100"
                  : activeTab === "quizzes"
                  ? "from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
                  : activeTab === "flashcards"
                  ? "from-teal-50 to-green-50 hover:from-teal-100 hover:to-green-100"
                  : "from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100"
              } rounded-xl transition-all duration-300 cursor-pointer`}
              onClick={() => {
                // Navigate to the appropriate page based on tab type
                if (activeTab === "uploads") {
                  navigate(`/pdf/${item._id}`);
                } else if (activeTab === "quizzes") {
                  navigate(`/quiz/${item._id}`);
                } else if (activeTab === "flashcards") {
                  navigate(`/flashcard/${item._id}`);
                } else if (activeTab === "summaries") {
                  navigate(`/summary/${item._id}`);
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors truncate">
                  {item.title || "Untitled"}
                </p>
                <div className="flex items-center gap-2">
                  {/* Show score for quizzes if available */}
                  {activeTab === "quizzes" && item.score !== undefined && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-200 text-purple-800">
                      {item.score}%
                    </span>
                  )}
                  {/* Show category for all items if available */}
                  {item.category && (
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full truncate max-w-[80px]">
                      {item.category}
                    </span>
                  )}
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {item.uploadedAt ? timeAgo(item.uploadedAt) : "Recently"}
                </span>
                {/* Show progress if available */}
                {item.progress !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${currentTab.gradient} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                      {/* {item.progress}% */}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
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
            <p className="text-gray-500 font-medium">No {activeTab} yet</p>
            <p className="text-gray-400 text-sm mt-1">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Motivational Quote and Study Reminder */}
        <DashboardHeader />

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

        {/* Todo Section with Enhanced Design */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl text-white shadow-lg">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Task Management
                  </h2>
                  <p className="text-gray-600">Stay organized and productive</p>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">
                    {completedCount}/{totalCount} completed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Task Filter Tabs */}
          <div className="flex gap-2 mb-6">
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
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                  todoFilter === filter.key
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Add Todo */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="What do you want to accomplish today?"
                className="flex-1 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                onKeyPress={(e) => e.key === "Enter" && addTask()}
              />
              <select
                value={newTodoPriority}
                onChange={(e) => setNewTodoPriority(e.target.value)}
                className="p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                onClick={addTask}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="space-y-4">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Check className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  {todoFilter === "completed"
                    ? "No completed tasks yet"
                    : todoFilter === "active"
                    ? "No active tasks"
                    : "No tasks yet"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {todoFilter === "active"
                    ? "Great job! All tasks completed."
                    : "Add a task to get started"}
                </p>
              </div>
            ) : (
              filteredTodos.map((task) => (
                <div
                  key={task._id}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    task.status === "completed"
                      ? "bg-green-50 border-green-200 opacity-75"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(task._id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      task.status === "completed"
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-gray-300 hover:border-green-600 hover:bg-green-50"
                    }`}
                  >
                    {task.status === "completed" && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>

                  {editingTodo === task._id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        className={`flex-1 font-medium ${
                          task.status === "completed"
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={() => startEdit(task)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTodo(task._id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Content Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Favorite PDFs */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl text-white shadow-lg">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Favorite PDFs
                </h3>
                <p className="text-gray-600 text-sm">Your starred content</p>
              </div>
            </div>
            <div className="space-y-3">
              {favouritePDFs?.map((pdf) => (
                <div
                  key={pdf._id}
                  className="group flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl hover:from-yellow-100 hover:to-orange-100 transition-all duration-300"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm group-hover:text-orange-700 transition-colors">
                      {pdf.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(pdf.uploadedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities with Tabs */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 bg-gradient-to-br ${tabData[activeTab].gradient} rounded-2xl text-white shadow-lg transition-all duration-300`}
                >
                  {tabData[activeTab].icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {tabData[activeTab].title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Your recent activities
                  </p>
                </div>
              </div>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-600 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-2xl">
              {Object.entries(tabData).map(([key, tab]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                    activeTab === key
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
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

        {/* Upcoming Events */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl text-white shadow-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Upcoming Events
              </h3>
              <p className="text-gray-600 text-sm">Your schedule</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="group flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-300"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm group-hover:text-indigo-700 transition-colors">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Performance Analytics
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">Study Streak</span>
              </div>
              <span className="font-bold text-orange-600">12 days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Avg. Score</span>
              </div>
              <span className="font-bold text-green-600">91.5%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">This Week</span>
              </div>
              <span className="font-bold text-blue-600">+18%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
