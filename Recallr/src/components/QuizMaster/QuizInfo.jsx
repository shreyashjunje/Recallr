import React from 'react';
// import { QuizInfo as QuizInfoType } from '../../types/quiz';
import { Clock, BookOpen, Target, Award } from 'lucide-react';

// interface QuizInfoProps {
//   quizInfo: QuizInfoType;
//   onStartQuiz: () => void;
// }


const rules= [
    'Read each question carefully before selecting your answer',
    'You can navigate back and forth between questions',
    'Some questions may have multiple correct answers',
    'Your progress is automatically saved',
    'Submit the quiz before time runs out to save your score'
  ]

const pointsPerQuestion=100;

export function QuizInfo({ quizInfo, onStartQuiz }) {

    console.log("quizINfo:++++",quizInfo)




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {quizInfo.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-purple-300 mb-6">
              <span className="bg-purple-500/20 px-4 py-2 rounded-full text-sm font-medium">
                {quizInfo.category}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                quizInfo.difficulty === 'Easy' 
                  ? 'bg-green-500/20 text-green-300' 
                  : quizInfo.difficulty === 'Medium' 
                  ? 'bg-yellow-500/20 text-yellow-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {quizInfo.settings?.difficulty}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-4 p-4 bg-white/5 dark:bg-slate-700/30 rounded-2xl">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-300 text-sm">Questions</p>
                <p className="text-white text-xl font-semibold">{quizInfo.settings?.numQuestions}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 dark:bg-slate-700/30 rounded-2xl">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-300 text-sm">Time Limit</p>
                <p className="text-white text-xl font-semibold">{quizInfo.settings?.timeLimit} min</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 dark:bg-slate-700/30 rounded-2xl">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-300 text-sm">Points per Question</p>
                <p className="text-white text-xl font-semibold">{pointsPerQuestion}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 dark:bg-slate-700/30 rounded-2xl">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-300 text-sm">Total Points</p>
                <p className="text-white text-xl font-semibold">{quizInfo.settings?.numQuestions * pointsPerQuestion}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Quiz Rules</h3>
            <ul className="space-y-3">
              {rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3 text-purple-200">
                  <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-sm font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onStartQuiz}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/25"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}