import React from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router";

const QuizMasterHome = () => {
  const navigate = useNavigate();
  const handleCreateQuiz = () => {
    navigate("/quizmaster/quizsettings");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to <span className="text-yellow-300">QuizMaster AI</span>
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Transform your PDFs into personalized learning experiences with AI
            </p>
            <button
              onClick={handleCreateQuiz}
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
            >
              <Brain className="w-5 h-5" />
              Create Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-6 -mt-6">
        <div className="bg-white rounded-xl  shadow-sm p-1 flex flex-row justify-center gap-1 mx-auto">
          {[
            { icon: <BarChart3 className="w-4 h-4" />, label: "Overview" },
            { icon: <BookOpen className="w-4 h-4" />, label: "PDF Library" },
            { icon: <Target className="w-4 h-4" />, label: "My Quizzes" },
            { icon: <TrendingUp className="w-4 h-4" />, label: "Analytics" },
            { icon: <History className="w-4 h-4" />, label: "History" },
          ].map((item, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                index === 0
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Quick Actions
            </h2>
            <div className="space-y-4">
              <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors flex items-center gap-3">
                <Brain className="w-5 h-5" />
                Generate New Quiz
              </button>
              <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg transition-colors flex items-center gap-3">
                <Upload className="w-5 h-5" />
                Upload PDF
              </button>
              <button className="w-full p-4 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors flex items-center gap-3">
                <BarChart3 className="w-5 h-5" />
                View Performance
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Your Progress
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Quizzes</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-orange-600 mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Avg Score</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">85%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-green-600 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Study Time</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">24h</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="text-teal-600 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Activity
            </h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No quiz attempts yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start by creating your first quiz!
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Recent Quizzes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Quizzes
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {[
              {
                title: "Machine Learning Basics",
                date: "2024-01-15",
                score: 92,
                color: "teal",
              },
              {
                title: "Data Structures",
                date: "2024-01-14",
                score: 78,
                color: "orange",
              },
              {
                title: "React Fundamentals",
                date: "2024-01-13",
                score: null,
                status: "In Progress",
              },
            ].map((quiz, index) => (
              <div
                key={index}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{quiz.title}</h3>
                  <p className="text-sm text-gray-500">{quiz.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  {quiz.score ? (
                    <span
                      className={`px-3 py-1 bg-${quiz.color}-100 text-${quiz.color}-700 rounded-full text-sm font-medium`}
                    >
                      {quiz.score}%
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      {quiz.status}
                    </span>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizMasterHome;
