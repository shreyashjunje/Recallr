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

        return (
          <button
            key={index}
            onClick={() =>
              handleMCQChange(option, question.multipleSelect || false)
            }
            className={`w-full p-3 sm:p-4 text-left rounded-xl border-2 transition-all duration-200 text-sm sm:text-base ${
              isSelected
                ? "border-purple-500 bg-purple-500/10 text-white"
                : "border-slate-600/50 hover:border-purple-500/50 bg-slate-800/30 text-slate-300 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-xs sm:text-sm font-medium text-purple-300">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">{option}</span>
              {question.multipleSelect && isSelected && (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderTrueFalse = () => (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      <button
        onClick={() => handleTrueFalseChange(true)}
        className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base ${
          userAnswer?.answer === "true"
            ? "border-green-500 bg-green-500/10 text-white"
            : "border-slate-600/50 hover:border-green-500/50 bg-slate-800/30 text-slate-300 hover:text-white"
        }`}
      >
        <Check className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="font-medium">True</span>
      </button>
      <button
        onClick={() => handleTrueFalseChange(false)}
        className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base ${
          userAnswer?.answer === "false"
            ? "border-red-500 bg-red-500/10 text-white"
            : "border-slate-600/50 hover:border-red-500/50 bg-slate-800/30 text-slate-300 hover:text-white"
        }`}
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
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
      className="w-full p-3 sm:p-4 bg-slate-800/30 border-2 border-slate-600/50 rounded-xl 
                 text-sm sm:text-base text-white placeholder-slate-400 
                 focus:border-purple-500 focus:outline-none transition-colors duration-200"
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
          className="w-full p-3 sm:p-4 bg-slate-800/30 border-2 border-slate-600/50 rounded-xl 
                     text-sm sm:text-base text-white placeholder-slate-400 
                     focus:border-purple-500 focus:outline-none transition-colors duration-200 resize-none"
        />
        {question.wordLimit && (
          <div
            className={`text-right text-xs sm:text-sm ${
              isOverLimit ? "text-red-400" : "text-slate-400"
            }`}
          >
            {wordCount} / {question.wordLimit} words
          </div>
        )}
      </div>
    );
  };

  // Decide what to render
  const renderQuestionContent = () => {
    switch (question?.type) {
      case "MCQ":
        return renderMCQ();
      case "TrueFalse":
        return renderTrueFalse();
      case "FillBlank":
        return renderFillBlank();
      case "ShortAnswer":
        return renderShortAnswer();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 
                        bg-purple-500/20 rounded-full text-purple-300 
                        text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          <span>{question?.points} points</span>
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-relaxed">
          {question?.questionText}
        </h2>
      </div>

      {/* Question Content */}
      <div className="mt-6 sm:mt-8 space-y-6">{renderQuestionContent()}</div>
    </div>
  );
}
