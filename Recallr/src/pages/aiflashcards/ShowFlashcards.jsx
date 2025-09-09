import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  BookOpen,
  Calendar,
  Tag,
  Target,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const ShowFlashcards = () => {
  const { id } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [pdf, setPdf] = useState({});
  const [flashcards, setFlashcards] = useState([]);

  const fetchFlashcards = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_URL}/flashcards/get-flashcards/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        setPdf(res.data.data);
        setFlashcards(res.data.data.flashcards);
        toast.success("Flashcards fetched successfully");
      }
    } catch (err) {
      toast.error("Failed to fetch flashcards");
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const difficultyColors = {
    Easy: "from-emerald-400 to-green-500",
    Medium: "from-amber-400 to-orange-500",
    Hard: "from-red-400 to-rose-500",
  };

  const difficultyBorders = {
    Easy: "border-emerald-200",
    Medium: "border-amber-200",
    Hard: "border-red-200",
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(
      () => setCurrentIndex((prev) => (prev + 1) % flashcards.length),
      150
    );
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(
      () => setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length),
      150
    );
  };

  const flipCard = () => setIsFlipped(!isFlipped);

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(true);
    setTimeout(() => setIsShuffled(false), 600);
  };

  const resetCards = () => {
    fetchFlashcards(); // ✅ reset to server data
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
              <BookOpen className="text-indigo-600 w-6 h-6 sm:w-7 sm:h-7" />
              {pdf.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{pdf.category}</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>{formatDate(pdf.flashcardsGeneratedAt)}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {pdf.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium border border-indigo-200"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white/50 rounded-full p-0.5 shadow-inner">
            <div
              className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-center text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </div>

        {/* Flashcard */}
        <div className="perspective-1000 mb-6 sm:mb-8">
          <div
            className={`relative w-full h-64 sm:h-80 md:h-96 transition-transform duration-700 preserve-3d cursor-pointer ${
              isFlipped ? "rotate-y-180" : ""
            } ${isShuffled ? "animate-pulse" : ""}`}
            onClick={flipCard}
          >
            {/* Front */}
            <div
              className={`absolute inset-0 backface-hidden rounded-2xl sm:rounded-3xl shadow-2xl border-2 ${
                difficultyBorders[currentCard?.difficulty]
              }`}
            >
              <div className="h-full bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r ${
                      difficultyColors[currentCard?.difficulty]
                    } shadow-lg`}
                  >
                    {currentCard?.difficulty}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    QUESTION
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <p className="text-base sm:text-lg md:text-xl font-medium text-gray-800 text-center leading-relaxed">
                    {currentCard?.question}
                  </p>
                </div>

                <div className="text-center text-xs sm:text-sm text-gray-400 font-medium">
                  Tap to reveal answer
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl sm:rounded-3xl shadow-2xl border-2 ${
                difficultyBorders[currentCard?.difficulty]
              }`}
            >
              <div className="h-full bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col">
                <div className="flex justify-between items-start mb-2 sm:mb-4">
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r ${
                      difficultyColors[currentCard?.difficulty]
                    } shadow-lg`}
                  >
                    {currentCard?.difficulty}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    ANSWER
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 text-center leading-relaxed">
                    {currentCard?.answer}
                  </p>
                </div>

                <div className="text-center text-xs sm:text-sm text-gray-400 font-medium">
                  Tap to see question
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-3 sm:gap-4">
          <button
            onClick={prevCard}
            disabled={flashcards.length <= 1}
            className="p-2 sm:p-3 bg-white/80 rounded-full shadow-lg border text-gray-600 hover:text-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={resetCards}
            className="p-2 sm:p-3 bg-white/80 rounded-full shadow-lg border text-gray-600 hover:text-green-600 transition-all"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={shuffleCards}
            disabled={flashcards.length <= 1}
            className="p-2 sm:p-3 bg-white/80 rounded-full shadow-lg border text-gray-600 hover:text-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isShuffled ? "animate-spin" : ""
              }`}
            />
          </button>

          <button
            onClick={nextCard}
            disabled={flashcards.length <= 1}
            className="p-2 sm:p-3 bg-white/80 rounded-full shadow-lg border text-gray-600 hover:text-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="bg-white/50 rounded-xl p-3 sm:p-4 border">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">
              {flashcards.filter((c) => c.difficulty === "Easy").length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Easy</div>
          </div>
          <div className="bg-white/50 rounded-xl p-3 sm:p-4 border">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-amber-600">
              {flashcards.filter((c) => c.difficulty === "Medium").length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Medium</div>
          </div>
          <div className="bg-white/50 rounded-xl p-3 sm:p-4 border">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">
              {flashcards.filter((c) => c.difficulty === "Hard").length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Hard</div>
          </div>
        </div>
      </div>

      {/* Card Flip CSS */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default ShowFlashcards;
