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
} from "lucide-react";
import QuoteCard from "../components/dashboard/helper/QuoteCard";
import DashboardHeader from "@/components/dashboard/helper/DashboardHeader";

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
  const [todos, setTodos] = useState([
    {
      id: "1",
      text: "Review Machine Learning notes",
      completed: false,
      priority: "high",
    },
    {
      id: "2",
      text: "Complete Python assignment",
      completed: true,
      priority: "medium",
    },
    {
      id: "3",
      text: "Prepare for upcoming exam",
      completed: false,
      priority: "high",
    },
    {
      id: "4",
      text: "Read React documentation",
      completed: false,
      priority: "low",
    },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState("low");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [todoFilter, setTodoFilter] = useState("all");

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

  const stats = [
    {
      title: "PDFs Uploaded",
      value: "127",
      change: "+12 this week",
      icon: <Upload className="w-7 h-7" />,
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: "Categories",
      value: "24",
      change: "+3 new",
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

  const recentUploads = [
    {
      id: "1",
      title: "Machine Learning Fundamentals.pdf",
      date: "2 hours ago",
      progress: 85,
    },
    {
      id: "2",
      title: "Data Structures and Algorithms.pdf",
      date: "5 hours ago",
      progress: 60,
    },
    {
      id: "3",
      title: "Web Development Guide.pdf",
      date: "1 day ago",
      progress: 100,
    },
  ];

  const recentQuizzes = [
    {
      id: "1",
      title: "JavaScript Basics Quiz",
      date: "1 day ago",
      type: "JavaScript",
      score: 92,
    },
    {
      id: "2",
      title: "React Hooks Quiz",
      date: "2 days ago",
      type: "React",
      score: 88,
    },
    {
      id: "3",
      title: "Database Design Quiz",
      date: "3 days ago",
      type: "Database",
      score: 95,
    },
  ];

  const recentFlashcards = [
    {
      id: "1",
      title: "Python Functions Flashcards",
      date: "1 hour ago",
      progress: 75,
    },
    {
      id: "2",
      title: "SQL Commands Flashcards",
      date: "4 hours ago",
      progress: 90,
    },
    {
      id: "3",
      title: "Git Commands Flashcards",
      date: "1 day ago",
      progress: 100,
    },
  ];

  const recentSummaries = [
    { id: "1", title: "Neural Networks Summary", date: "30 minutes ago" },
    {
      id: "2",
      title: "Microservices Architecture Summary",
      date: "2 hours ago",
    },
    { id: "3", title: "DevOps Best Practices Summary", date: "6 hours ago" },
  ];

  const favoritePdfs = [
    { id: "1", title: "Advanced React Patterns.pdf", date: "Last week" },
    { id: "2", title: "System Design Interview.pdf", date: "2 weeks ago" },
    { id: "3", title: "Clean Code Principles.pdf", date: "1 month ago" },
  ];

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

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        priority: newTodoPriority,
      };
      setTodos([...todos, todo]);
      setNewTodo("");
      setNewTodoPriority("medium");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingTodo(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === editingTodo ? { ...todo, text: editText } : todo
      )
    );
    setEditingTodo(null);
    setEditText("");
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

  const filteredTodos = todos.filter((todo) => {
    if (todoFilter === "active") return !todo.completed;
    if (todoFilter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  const tabData = {
    uploads: {
      title: "Recent Uploads",
      icon: <Upload className="w-5 h-5" />,
      data: recentUploads,
      gradient: "from-blue-500 to-cyan-500",
    },
    quizzes: {
      title: "Recent Quizzes",
      icon: <Award className="w-5 h-5" />,
      data: recentQuizzes,
      gradient: "from-purple-500 to-pink-500",
    },
    flashcards: {
      title: "Flashcards",
      icon: <Brain className="w-5 h-5" />,
      data: recentFlashcards,
      gradient: "from-teal-500 to-green-500",
    },
    summaries: {
      title: "AI Summaries",
      icon: <FileText className="w-5 h-5" />,
      data: recentSummaries,
      gradient: "from-orange-500 to-red-500",
    },
  };

  const renderTabContent = () => {
    const currentTab = tabData[activeTab];

    return (
      <div className="space-y-3">
        {currentTab.data.map((item) => (
          <div
            key={item.id}
            className={`group p-4 bg-gradient-to-r ${
              activeTab === "uploads"
                ? "from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100"
                : activeTab === "quizzes"
                ? "from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
                : activeTab === "flashcards"
                ? "from-teal-50 to-green-50 hover:from-teal-100 hover:to-green-100"
                : "from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100"
            } rounded-xl transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-2">
                {item.score && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      activeTab === "quizzes"
                        ? "bg-purple-200 text-purple-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {item.score}%
                  </span>
                )}
                {item.type && (
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {item.type}
                  </span>
                )}
                <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{item.date}</span>
              {item.progress && (
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${currentTab.gradient} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">
                    {item.progress}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
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
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
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
                onClick={addTodo}
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
              filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    todo.completed
                      ? "bg-green-50 border-green-200 opacity-75"
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      todo.completed
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-gray-300 hover:border-green-600 hover:bg-green-50"
                    }`}
                  >
                    {todo.completed && <Check className="w-4 h-4" />}
                  </button>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      todo.priority
                    )}`}
                  >
                    {todo.priority}
                  </span>

                  {editingTodo === todo.id ? (
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
                          todo.completed
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {todo.text}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={() => startEdit(todo)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
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
              {favoritePdfs.map((pdf) => (
                <div
                  key={pdf.id}
                  className="group flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl hover:from-yellow-100 hover:to-orange-100 transition-all duration-300"
                >
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm group-hover:text-orange-700 transition-colors">
                      {pdf.title}
                    </p>
                    <p className="text-xs text-gray-500">{pdf.date}</p>
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
