import React from "react";
import {
  Clock,
  BookOpen,
  Tag,
  Target,
  Hash,
  Play,
  Users,
  Award,
} from "lucide-react";
import { useLocation } from "react-router";

const QuizInfoPage = () => {
  // Sample quiz data - replace with props or API data
  const quizData = {
    title: "Advanced JavaScript Concepts",
    description:
      "Test your knowledge of advanced JavaScript topics including closures, prototypes, async/await, and modern ES6+ features. This comprehensive quiz covers both theoretical concepts and practical applications.",
    category: "Programming",
    tags: ["JavaScript", "ES6", "Programming", "Web Development"],
    numberOfQuestions: 25,
    level: "Advanced",
    questionType: "Mixed (MCQ & True/False)",
    timeLimit: 45,
    estimatedDuration: "30-45 minutes",
  };

  const location = useLocation();
  const {
    title,
    description,
    category,
    tags,
    numberOfQuestions,
    level,
    questionType,
    timeLimit,
    estimatedDuration,
  } = location.state?.quiz || quizData; // Use passed quiz data or fallback

  const handleStartQuiz = () => {
    console.log("Starting quiz...");
  };

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "intermediate":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "advanced":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Quiz Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="border-b border-gray-100 px-8 py-12">
            {/* Category */}
            <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full mb-6">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-sm font-medium text-indigo-700">
                {quizData.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {title}
            </h1>

            {/* Level Badge */}
            <div className="inline-flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(
                  quizData.level
                )}`}
              >
                {quizData.level}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="px-8 py-8 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                <BookOpen className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  About this Quiz
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {quizData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Quiz Details */}
          <div className="px-8 py-8 border-b border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Hash className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {quizData.numberOfQuestions}
                </p>
                <p className="text-sm text-gray-500">Questions</p>
              </div>

              <div className="text-center">
                <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {quizData.timeLimit}m
                </p>
                <p className="text-sm text-gray-500">Time Limit</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">Mixed</p>
                <p className="text-sm text-gray-500">Question Types</p>
              </div>

              <div className="text-center">
                <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {quizData.level}
                </p>
                <p className="text-sm text-gray-500">Difficulty</p>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Topics</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quizData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Instructions
            </h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>
                • Read each question carefully before selecting your answer
              </li>
              <li>• You can navigate between questions and change answers</li>
              <li>• Your progress is saved automatically</li>
              <li>• Submit before time expires to save your results</li>
            </ul>
          </div>

          {/* Action Section */}
          <div className="px-8 py-8 text-center">
            <button
              onClick={handleStartQuiz}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <Play className="w-5 h-5" />
              Start Quiz
            </button>
            <p className="text-gray-500 text-sm mt-4">
              Good luck! Take your time and think carefully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInfoPage;
