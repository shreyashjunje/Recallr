import React from 'react';
import { Clock, BookOpen, Target, Award } from 'lucide-react';

const rules = [
  'Read each question carefully before selecting your answer',
  'You can navigate back and forth between questions',
  'Some questions may have multiple correct answers',
  'Your progress is automatically saved',
  'Submit the quiz before time runs out to save your score'
];

const pointsPerQuestion = 100;

export function QuizInfo({ quizInfo, onStartQuiz }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 flex items-center justify-center p-3 sm:p-6">
      <div className="max-w-3xl w-full">
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl">
          
          {/* Title & Category */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent break-words">
              {quizInfo.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-purple-300 mb-4 sm:mb-6">
              <span className="bg-purple-500/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                {quizInfo.category}
              </span>
              <span
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${
                  quizInfo.difficulty === 'Easy'
                    ? 'bg-green-500/20 text-green-300'
                    : quizInfo.difficulty === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {quizInfo.settings?.difficulty}
              </span>
            </div>
          </div>

          {/* Quiz Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[
              {
                icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />,
                label: "Questions",
                value: quizInfo.settings?.numQuestions,
              },
              {
                icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />,
                label: "Time Limit",
                value: `${quizInfo.settings?.timeLimit} min`,
              },
              {
                icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />,
                label: "Points per Question",
                value: pointsPerQuestion,
              },
              {
                icon: <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />,
                label: "Total Points",
                value: quizInfo.settings?.numQuestions * pointsPerQuestion,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 dark:bg-slate-700/30 rounded-2xl"
              >
                <div className="p-2 sm:p-3 bg-purple-500/20 rounded-xl">
                  {item.icon}
                </div>
                <div>
                  <p className="text-purple-300 text-xs sm:text-sm">{item.label}</p>
                  <p className="text-white text-lg sm:text-xl font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
              Quiz Rules
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3 text-purple-200">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-xs sm:text-sm font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm sm:text-base">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          <button
            onClick={onStartQuiz}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-sm sm:text-base md:text-lg py-3 sm:py-4 px-6 sm:px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
