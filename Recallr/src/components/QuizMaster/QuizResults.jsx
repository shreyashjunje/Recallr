  import React, { useEffect } from 'react';
  import { Trophy, Target, Clock, Award, RefreshCw, Home } from 'lucide-react';

  export function QuizResults({ quizState, totalQuestions, onRestart, onHome }) {

    useEffect(() => {
      console.log("quizState-->", quizState);
      console.log("quizState.score-->", quizState.score);
      console.log("quizState.answers-->", quizState.answers);
      console.log("quizState.isCompleted-->", quizState.isCompleted);
      console.log("totalQuestions-->", totalQuestions);
      console.log("Calculated percentage-->", Math.round((quizState.score / (totalQuestions * 100)) * 100));
    }, [quizState, totalQuestions]);

    // Add a fallback for when quizState is not properly populated
    if (!quizState || !quizState.answers) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Loading Results...</h1>
              <p className="text-purple-300">Please wait while we calculate your results</p>
            </div>
          </div>
        </div>
      );
    }

    const percentage = Math.round((quizState.score / (totalQuestions * 100)) * 100);
    const timeTaken = Math.floor((Date.now() - quizState.startTime) / 1000 / 60);
    
    const getGrade = (percentage) => {
      if (percentage >= 90) return { grade: 'A+', color: 'text-green-400', bg: 'bg-green-500/20' };
      if (percentage >= 80) return { grade: 'A', color: 'text-green-400', bg: 'bg-green-500/20' };
      if (percentage >= 70) return { grade: 'B', color: 'text-blue-400', bg: 'bg-blue-500/20' };
      if (percentage >= 60) return { grade: 'C', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      return { grade: 'F', color: 'text-red-400', bg: 'bg-red-500/20' };
    };

    const gradeInfo = getGrade(percentage);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
            <div className="mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${gradeInfo.bg} mb-4`}>
                <span className={`text-4xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h1>
              <p className="text-purple-300 text-lg">Great job completing the quiz</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Trophy className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-purple-300 text-sm">Final Score</p>
                  <p className="text-white text-3xl font-bold">{quizState.score}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-blue-300 text-sm">Accuracy</p>
                  <p className="text-white text-3xl font-bold">{percentage}%</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <Award className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-green-300 text-sm">Questions Answered</p>
                  <p className="text-white text-3xl font-bold">{quizState.answers.length}/{totalQuestions}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 bg-white/5 rounded-2xl">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-left">
                  <p className="text-yellow-300 text-sm">Time Taken</p>
                  <p className="text-white text-3xl font-bold">{timeTaken}m</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={onRestart}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors duration-200"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={onHome}
                className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }