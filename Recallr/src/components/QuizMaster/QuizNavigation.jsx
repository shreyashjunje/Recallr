import React from "react";
import { ChevronLeft, ChevronRight, Grid3X3, SkipForward, CheckCircle } from "lucide-react";

export function QuizNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSkip,
  onQuestionSelect,
  answeredQuestions,
  showQuestionGrid,
  onToggleQuestionGrid,
  onSubmitQuiz,
}) {
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="space-y-4 w-full">
      {/* Question Grid Toggle */}
      <div className="flex justify-center">
        <button
          onClick={onToggleQuestionGrid}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-700/50 hover:bg-slate-700 
                     text-slate-300 hover:text-white rounded-xl transition-colors duration-200 
                     text-xs sm:text-sm md:text-base"
        >
          <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Question Grid</span>
        </button>
      </div>

      {/* Question Grid */}
      {showQuestionGrid && (
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
          <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <button
                key={i}
                onClick={() => onQuestionSelect(i)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg 
                            text-xs sm:text-sm font-medium transition-all duration-200
                  ${
                    i === currentQuestion
                      ? "bg-purple-600 text-white"
                      : answeredQuestions.has(i)
                      ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                      : "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600/20 border border-green-400 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-700 rounded"></div>
              <span>Unanswered</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <button
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 w-full sm:w-auto justify-center px-3 sm:px-4 py-2 
                     bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white 
                     rounded-xl transition-colors duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     text-sm sm:text-base"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Previous</span>
        </button>

        {!isLastQuestion && (
          <button
            onClick={onSkip}
            className="flex items-center gap-2 w-full sm:w-auto justify-center px-3 sm:px-4 py-2 
                       bg-yellow-600/20 hover:bg-yellow-600/30 
                       text-yellow-400 hover:text-yellow-300 
                       rounded-xl transition-colors duration-200 
                       text-sm sm:text-base"
          >
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Skip</span>
          </button>
        )}

        {isLastQuestion ? (
          <button
            onClick={onSubmitQuiz}
            className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 sm:px-6 py-2 
                       bg-gradient-to-r from-green-600 to-emerald-600 
                       hover:from-green-700 hover:to-emerald-700 
                       text-white rounded-xl transition-all duration-200 
                       text-sm sm:text-base"
          >
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Submit Quiz</span>
          </button>
        ) : (
          <button
            onClick={onNext}
            className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 sm:px-6 py-2 
                       bg-gradient-to-r from-purple-600 to-pink-600 
                       hover:from-purple-700 hover:to-pink-700 
                       text-white rounded-xl transition-all duration-200 
                       text-sm sm:text-base"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
