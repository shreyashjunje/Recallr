import React, { useState, useEffect } from "react";
import { ChevronLeft, RotateCcw, Shuffle } from "lucide-react";

// interface Flashcard {
//   question: string;
//   answer: string;
//   difficulty: string;
// }

// interface FlashcardDeckProps {
//   title: string;
//   category: string;
//   tags: string[];
//   generatedAt: string;
//   flashcards: Flashcard[];
// }

const DisplayFlashcards = ({
  title,
  category,
  tags,
  generatedAt,
  flashcards,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([]);

  useEffect(() => {
    setShuffledIndices(Array.from({ length: flashcards.length }, (_, i) => i));
  }, [flashcards.length]);

  const currentCard =
    flashcards[isShuffled ? shuffledIndices[currentIndex] : currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    if (!isShuffled) {
      const shuffled = [...Array(flashcards.length).keys()].sort(
        () => Math.random() - 0.5
      );
      setShuffledIndices(shuffled);
    } else {
      setShuffledIndices(
        Array.from({ length: flashcards.length }, (_, i) => i)
      );
    }
    setIsShuffled(!isShuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(false);
    setShuffledIndices(Array.from({ length: flashcards.length }, (_, i) => i));
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-t-3xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleShuffle}
                className={`p-2 rounded-full transition-colors ${
                  isShuffled ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button
                onClick={resetSession}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-left">
            <h1 className="text-xl font-bold mb-1">{title}</h1>
            <p className="text-white/80 text-sm">{category}</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-b-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Card Content */}
            <div
              className="relative h-80 cursor-pointer perspective-1000 mb-6"
              onClick={handleFlip}
            >
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front Side (Question) */}
                <div className="absolute inset-0 w-full h-full backface-hidden">
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-8 select-none">
                      {currentCard.question.length > 50 ? "📚" : "🤔"}
                    </div>
                    <p className="text-lg text-gray-800 leading-relaxed font-medium px-4">
                      {currentCard.question}
                    </p>
                    <p className="text-gray-400 text-sm mt-6 italic">
                      {currentCard.difficulty}
                    </p>
                  </div>
                </div>

                {/* Back Side (Answer) */}
                <div className="absolute inset-0 w-full h-full rotate-y-180 backface-hidden">
                  <div className="h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
                    <div className="text-6xl mb-8 select-none">✨</div>
                    <p className="text-lg text-gray-800 leading-relaxed font-medium px-4">
                      {currentCard.answer}
                    </p>
                    <p className="text-gray-400 text-sm mt-6 italic">
                      {currentCard.difficulty}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  {currentIndex + 1}/{flashcards.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Flip Card Button */}
            <button
              onClick={handleFlip}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {isFlipped ? "SHOW QUESTION" : "FLIP CARD"}
            </button>

            {/* Navigation */}
            <div className="flex justify-between mt-4 gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === flashcards.length - 1}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayFlashcards;
