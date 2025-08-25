import React from "react";
import { Check, X } from "lucide-react";

export function QuestionRenderer({
  question,
  userAnswer,
  onAnswerChange,
  questionTypes,
}) {
  const handleMCQChange = (option, isMultiple) => {
    const currentAnswers = Array.isArray(userAnswer?.answer)
      ? userAnswer.answer
      : [];
    if (isMultiple) {
      if (currentAnswers.includes(option)) {
        onAnswerChange(currentAnswers.filter((ans) => ans !== option));
      } else {
        onAnswerChange([...currentAnswers, option]);
      }
    } else {
      onAnswerChange(option);
    }
  };

  const handleTrueFalseChange = (value) => {
    onAnswerChange(value.toString());
  };

  const handleTextChange = (value) => {
    onAnswerChange(value);
  };

  const renderMCQ = () => (
    <div className="space-y-3">
    
      {question.options?.map((option, index) => {
        const isSelected = question.multipleSelect
          ? Array.isArray(userAnswer?.answer) &&
            userAnswer.answer.includes(option)
          : userAnswer?.answer === option;

        console.log("question options:::", question?.options);

        return (
          <button
            key={index}
            onClick={() =>
              handleMCQChange(option, question.multipleSelect || false)
            }
            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? "border-purple-500 bg-purple-500/10 text-white"
                : "border-slate-600/50 hover:border-purple-500/50 bg-slate-800/30 text-slate-300 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-sm font-medium text-purple-300">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {question.multipleSelect && isSelected && (
                <Check className="w-5 h-5 text-purple-400" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderTrueFalse = () => (
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => handleTrueFalseChange(true)}
        className={`flex items-center gap-3 px-8 py-4 rounded-xl border-2 transition-all duration-200 ${
          userAnswer?.answer === "true"
            ? "border-green-500 bg-green-500/10 text-white"
            : "border-slate-600/50 hover:border-green-500/50 bg-slate-800/30 text-slate-300 hover:text-white"
        }`}
      >
        <Check className="w-6 h-6" />
        <span className="font-medium">True</span>
      </button>
      <button
        onClick={() => handleTrueFalseChange(false)}
        className={`flex items-center gap-3 px-8 py-4 rounded-xl border-2 transition-all duration-200 ${
          userAnswer?.answer === "false"
            ? "border-red-500 bg-red-500/10 text-white"
            : "border-slate-600/50 hover:border-red-500/50 bg-slate-800/30 text-slate-300 hover:text-white"
        }`}
      >
        <X className="w-6 h-6" />
        <span className="font-medium">False</span>
      </button>
    </div>
  );

  const renderFillBlank = () => (
    <input
      type="text"
      value={typeof userAnswer?.answer === "string" ? userAnswer.answer : ""}
      onChange={(e) => handleTextChange(e.target.value)}
      placeholder="Type your answer here..."
      className="w-full p-4 bg-slate-800/30 border-2 border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors duration-200"
    />
  );

  const renderShortAnswer = () => {
    const currentAnswer =
      typeof userAnswer?.answer === "string" ? userAnswer.answer : "";
    const wordCount = currentAnswer.trim()
      ? currentAnswer.trim().split(/\s+/).length
      : 0;
    const isOverLimit = question.wordLimit && wordCount > question.wordLimit;

    return (
      <div className="space-y-2">
        <textarea
          value={currentAnswer}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Type your detailed answer here..."
          rows={4}
          className="w-full p-4 bg-slate-800/30 border-2 border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none transition-colors duration-200 resize-none"
        />
        {question.wordLimit && (
          <div
            className={`text-right text-sm ${
              isOverLimit ? "text-red-400" : "text-slate-400"
            }`}
          >
            {wordCount} / {question.wordLimit} words
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-4">
          <span>{question.points} points</span>
        </div>
        <h2 className="text-2xl font-semibold text-white leading-relaxed">
          {question.questionText}
        </h2>
      </div>

      <div className="mt-8 space-y-6">
        {Array.isArray(questionTypes) &&
          questionTypes.map((type, index) => (
            <div key={index}>
              {type === "MCQ" && renderMCQ()}
              {type === "TrueFalse" && renderTrueFalse()}
              {type === "FillBlank" && renderFillBlank()}
              {type === "ShortAnswer" && renderShortAnswer()}
            </div>
          ))}
      </div>
    </div>
  );
}
