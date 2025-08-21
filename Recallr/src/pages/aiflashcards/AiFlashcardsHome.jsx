import React, { useState, useEffect } from "react";
import {
  Zap,
  Brain,
  BarChart3,
  Clock,
  Plus,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";

const FlashcardHome = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const sampleSets = [
    {
      id: 1,
      title: "JavaScript ES6 Features",
      count: 28,
      date: "2 days ago",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "React Hooks Deep Dive",
      count: 35,
      date: "5 days ago",
      color: "bg-indigo-500",
    },
    {
      id: 3,
      title: "TypeScript Fundamentals",
      count: 42,
      date: "1 week ago",
      color: "bg-cyan-500",
    },
    {
      id: 4,
      title: "Node.js Architecture",
      count: 31,
      date: "2 weeks ago",
      color: "bg-blue-600",
    },
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Generation",
      description:
        "Transform any content into optimized flashcards using advanced AI algorithms",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Generate comprehensive flashcard sets in seconds, not hours",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Smart Analytics",
      description:
        "Track your learning progress with detailed insights and performance metrics",
    },
  ];

  const generateFlashcards = async () => {
    // setIsGenerating(true);

    navigate("/flashcards/settings");

    // // Simulate API call
    // await new Promise(resolve => setTimeout(resolve, 1500));

    // const topics = ["Machine Learning Basics", "Database Design", "API Development", "System Design", "Web Security"];
    // const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    // const colors = ["bg-blue-500", "bg-indigo-500", "bg-cyan-500", "bg-blue-600"];

    // const newCard = {
    //   id: Date.now(),
    //   title: randomTopic,
    //   count: Math.floor(Math.random() * 30) + 15,
    //   date: "Just now",
    //   color: colors[Math.floor(Math.random() * colors.length)]
    // };

    // setFlashcards(prev => [newCard, ...prev]);
    // setIsGenerating(false);
  };

  const loadSampleData = () => {
    setFlashcards(sampleSets);
  };

  useEffect(() => {
    // Auto-load sample data after a delay for demo
    const timer = setTimeout(() => {
      if (flashcards.length === 0) {
        loadSampleData();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [flashcards.length]);

  return (
    
    <div className="min-h-screen bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-8 group">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">FlashGenius</h1>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Smart Flashcard
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {" "}
              Generator
            </span>
          </h2>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your learning experience with AI-powered flashcards.
            Create, study, and master any subject efficiently.
          </p>

          <button
            onClick={generateFlashcards}
            disabled={isGenerating}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Generate Flashcards
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </header>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:transform hover:-translate-y-2 group"
            >
              <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        {/* Past Flashcards */}
        <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-500" />
              Recent Flashcard Sets
            </h3>
            {flashcards.length === 0 && (
              <button
                onClick={loadSampleData}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Load Sample Data
              </button>
            )}
          </div>

          {flashcards.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-xl font-medium text-slate-500 mb-2">
                No flashcards yet
              </h4>
              <p className="text-slate-500">
                Create your first set to get started with smart learning
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcards.map((card, index) => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:transform hover:-translate-y-1 cursor-pointer group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.5s ease-out forwards",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-3 h-3 ${card.color} rounded-full`}></div>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                      {card.count} cards
                    </span>
                  </div>

                  <h4 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h4>

                  <p className="text-sm text-slate-500">{card.date}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-slate-500 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Ready to boost your learning?</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              rgba(59, 130, 246, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
};

export default FlashcardHome;
