import React from "react";
import { CheckCircle, XCircle, MinusCircle, Info } from "lucide-react";

export function QuizReview({ quizInfo, quizState, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Quiz Review</h1>

        {quizInfo?.questions?.map((q, idx) => {
          const userAnswerRaw = quizState.answers.find(
            (a) => a.questionId === q._id
          );
          const userAnswer =
            userAnswerRaw?.answer ?? userAnswerRaw?.selectedAnswer ?? null;
          const isCorrect = userAnswerRaw?.isCorrect;

          return (
            <div
              key={q._id}
              className="mb-8 p-6 rounded-2xl bg-white/10 border border-white/20 shadow-lg hover:shadow-2xl transition"
            >
              {/* Question */}
              <h2 className="text-lg font-semibold mb-4">
                Q{idx + 1}. {q.questionText}
              </h2>

              {/* Options */}
              <div className="space-y-2">
                {q.options?.map((opt, i) => {
                  const isSelected = userAnswer === opt;
                  const isAnswer = q.correctAnswer === opt;

                  let bgClass = "bg-slate-800 border border-slate-700";
                  let icon = null;

                  if (isAnswer) {
                    bgClass = "bg-green-700/80 border-green-500";
                    icon = <CheckCircle className="w-5 h-5 text-green-300" />;
                  }
                  if (isSelected && !isAnswer) {
                    bgClass = "bg-red-700/80 border-red-500";
                    icon = <XCircle className="w-5 h-5 text-red-300" />;
                  }
                  if (isSelected && isAnswer) {
                    bgClass = "bg-green-700/90 border-green-400";
                    icon = <CheckCircle className="w-5 h-5 text-green-100" />;
                  }

                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-lg ${bgClass}`}
                    >
                      <span>{opt}</span>
                      {isSelected && (
                        <span className="ml-2 text-xs text-yellow-300 font-semibold">
                          Your Choice
                        </span>
                      )}
                      {icon}
                    </div>
                  );
                })}
              </div>

              {/* Skipped */}
              {!userAnswer && (
                <p className="text-yellow-400 mt-3 flex items-center gap-2">
                  <MinusCircle className="w-5 h-5" />
                  You skipped this question
                </p>
              )}

              {/* Explanation */}
              {q.explanation && (
                <div className="mt-5 p-4 rounded-xl bg-slate-800/60 border border-slate-600 flex gap-3">
                  <Info className="w-6 h-6 text-purple-300 mt-0.5" />
                  <p className="text-sm text-slate-200">
                    <span className="font-semibold text-purple-300">
                      Explanation:
                    </span>{" "}
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Back button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
          >
            ⬅ Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}
