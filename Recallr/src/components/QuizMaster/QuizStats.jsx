import React from "react";
import { Trophy, Heart, TrendingUp, Award, SkipForward } from "lucide-react";

export function QuizStats({
  stats,
  currentQuestion,
  totalQuestions,
  timeRemaining,
}) {
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
  

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-4">
          Quiz Stats
        </h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Timer */}
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center justify-between text-xs sm:text-sm md:text-base">
            <span className="text-slate-300">Time Remaining</span>
            <span
              className={`font-mono text-sm sm:text-lg font-semibold ${
                timeRemaining.startsWith("0") &&
                timeRemaining.split(":")[1] < "05"
                  ? "text-red-400"
                  : "text-white"
              }`}
            >
              {timeRemaining}
            </span>
          </div>
        </div>

        {/* Score */}
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-slate-300 text-xs sm:text-sm">Score</p>
              <p className="text-white text-lg sm:text-xl font-semibold">
                {stats.score}
              </p>
            </div>
          </div>
        </div>

        {/* Lives */}
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-slate-300 text-xs sm:text-sm">Lives</p>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <Heart
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      i < stats.lives
                        ? "text-red-400 fill-current"
                        : "text-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-slate-300 text-xs sm:text-sm">Progress</p>
              <p className="text-white text-sm sm:text-base font-semibold">
                {stats.progress}
              </p>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-slate-400 text-[10px] sm:text-xs mt-1">
            {Math.round(progressPercentage)}% Complete
          </p>
        </div>

        {/* Position */}
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-slate-300 text-xs sm:text-sm">Position</p>
              <p className="text-white text-lg sm:text-xl font-semibold">
                {stats.position}
              </p>
            </div>
          </div>
        </div>

        {/* Skipped Questions */}
        <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-slate-300 text-xs sm:text-sm">Skipped</p>
              <p className="text-white text-lg sm:text-xl font-semibold">
                {stats?.skipped}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
