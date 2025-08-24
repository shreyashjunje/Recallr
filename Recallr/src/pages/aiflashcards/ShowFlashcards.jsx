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
import { useParams } from "react-router";
const API_URL = import.meta.env.VITE_API_URL;
const ShowFlashcards = () => {
  const { id } = useParams();
  
  // Sample data - replace with your actual flashcards data
  const [flashcardsData] = useState({
    title: "React Fundamentals",
    category: "Web Development",
    tags: ["JavaScript", "Frontend", "Components", "Hooks"],
    generatedAt: "2024-08-24T10:30:00Z",
    flashcards: [
      {
        question: "What is React and why is it popular?",
        answer:
          "React is a JavaScript library for building user interfaces. It's popular because it uses a component-based architecture, virtual DOM for efficient updates, and has a strong ecosystem with excellent developer tools.",
        difficulty: "Easy",
      },
      {
        question: "Explain the useState hook and provide an example",
        answer:
          "useState is a React hook that lets you add state to functional components. Example: const [count, setCount] = useState(0); It returns an array with the current state value and a setter function.",
        difficulty: "Medium",
      },
      {
        question:
          "What is the difference between useEffect and useLayoutEffect?",
        answer:
          "useEffect runs asynchronously after DOM mutations, while useLayoutEffect runs synchronously after all DOM mutations but before the browser paints. useLayoutEffect is useful for DOM measurements that affect layout.",
        difficulty: "Hard",
      },
      {
        question: "How does React's reconciliation algorithm work?",
        answer:
          "React's reconciliation compares the new virtual DOM tree with the previous one using a diffing algorithm. It identifies changes and updates only the necessary DOM nodes, making updates efficient through key-based matching and component type comparison.",
        difficulty: "Hard",
      },
      {
        question: "What are React props and how are they used?",
        answer:
          "Props (properties) are read-only data passed from parent to child components. They allow components to be dynamic and reusable. Example: <Button color='blue' onClick={handleClick}>Click me</Button>",
        difficulty: "Easy",
      },
    ],
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [pdf,setPdf]=useState({})
  const [flashcards, setFlashcards] = useState([]);

  const fetchFlashcards = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("tokne-->", token);

      console.log("iddddddd=", id);

      const res = await axios.get(
        `${API_URL}/flashcards/get-flashcards/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setPdf(res.data.data)
        setFlashcards(res.data.data.flashcards)
        toast.success("flashcards fetched successfully");
      }

      console.log("flashcards from show compo-->", res.data.data);
    } catch (err) {
      console.log("Error-->", err);
      toast.error("flashcards fetched unsuccessful");
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
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + flashcards.length) % flashcards.length
      );
    }, 150);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(true);
    setTimeout(() => setIsShuffled(false), 600);
  };

  const resetCards = () => {
    setFlashcards(flashcardsData.flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <BookOpen className="text-indigo-600" />
              {pdf.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 mb-4">
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
              {pdf.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-white/50 rounded-full p-1 shadow-inner">
            <div
              className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2 font-medium">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </div>

        {/* Flashcard */}
        <div className="perspective-1000 mb-8">
          <div
            className={`relative w-full h-80 transition-transform duration-700 preserve-3d cursor-pointer ${
              isFlipped ? "rotate-y-180" : ""
            } ${isShuffled ? "animate-pulse" : ""}`}
            onClick={flipCard}
          >
            {/* Front of card (Question) */}
            <div
              className={`absolute inset-0 backface-hidden rounded-3xl shadow-2xl border-2 ${
                difficultyBorders[currentCard?.difficulty]
              }`}
            >
              <div className="h-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
                      difficultyColors[currentCard?.difficulty]
                    } shadow-lg`}
                  >
                    {currentCard?.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    QUESTION
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xl font-medium text-gray-800 text-center leading-relaxed">
                    {currentCard?.question}
                  </p>
                </div>

                <div className="text-center text-sm text-gray-400 font-medium">
                  Click to reveal answer
                </div>
              </div>
            </div>

            {/* Back of card (Answer) */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl shadow-2xl border-2 ${
                difficultyBorders[currentCard?.difficulty]
              }`}
            >
              <div className="h-full bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm rounded-3xl p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
                      difficultyColors[currentCard?.difficulty]
                    } shadow-lg`}
                  >
                    {currentCard?.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    ANSWER
                  </span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <p className="text-lg text-gray-700 text-center leading-relaxed">
                    {currentCard?.answer}
                  </p>
                </div>

                <div className="text-center text-sm text-gray-400 font-medium">
                  Click to see question
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={prevCard}
            disabled={flashcards.length <= 1}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 text-gray-600 hover:text-indigo-600 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={resetCards}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 text-gray-600 hover:text-green-600 hover:shadow-xl transition-all duration-300 group"
          >
            <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>

          <button
            onClick={shuffleCards}
            disabled={flashcards.length <= 1}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 text-gray-600 hover:text-purple-600 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Shuffle
              className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                isShuffled ? "animate-spin" : ""
              }`}
            />
          </button>

          <button
            onClick={nextCard}
            disabled={flashcards.length <= 1}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 text-gray-600 hover:text-indigo-600 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="text-2xl font-bold text-emerald-600">
              {flashcards.filter((card) => card.difficulty === "Easy").length}
            </div>
            <div className="text-sm text-gray-600">Easy</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="text-2xl font-bold text-amber-600">
              {flashcards.filter((card) => card.difficulty === "Medium").length}
            </div>
            <div className="text-sm text-gray-600">Medium</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <div className="text-2xl font-bold text-red-600">
              {flashcards.filter((card) => card.difficulty === "Hard").length}
            </div>
            <div className="text-sm text-gray-600">Hard</div>
          </div>
        </div>
      </div>

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
