import React, { useState, useEffect } from "react";
import {
  Zap,
  Brain,
  BarChart3,
  Clock,
  Plus,
  BookOpen,
  ArrowRight,
  Filter,
  Search,
  Play,
  Star,
  Calendar,
  ChevronDown,
  X,
  Upload,
  FolderOpen,
  Award,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";
const API_URL = import.meta.env.VITE_API_URL;

const FlashcardHome = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [allFlashcards, setAllFlashcards] = useState([]);
  const [totalFlashCards, setTotalFlashCards] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  const navigate=useNavigate()

  const fetchAllFlashcards = async (req, res) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/flashcards/get-all-flashcards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        const all = res.data.data;
        setAllFlashcards(all);
        const totalFlashcards = await all.length;
        const uniqueCategories = new Set(all.map((flashcard) => flashcard.category));
        const totalCategories = uniqueCategories.size;

        setTotalCategories(totalCategories);
        setTotalFlashCards(totalFlashcards);
        console.log("total count flashcards-->", totalFlashcards);
        console.log("total totalCategories-->", totalCategories);
        toast.success("All flashcards fetched successfully");
      }

      console.log("all flascards fetch-->", res.data.data);
    } catch (err) {
      console.log("err", err);
      toast.error("All Flashcards fetch unsuccessful");
    }
  };

  useEffect(() => {
    fetchAllFlashcards();
  }, []);

  const stats = [
    {
      title: "Total Flashcards",
      value: `${totalFlashCards}`,
      change: `7 this week`,
      icon: <Upload className="w-7 h-7" />,
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: "Total Categories",
      value: `${totalCategories}`,
      change: "",
      icon: <FolderOpen className="w-7 h-7" />,
      gradient: "from-emerald-500 to-teal-500",
      trend: "up",
    },
    {
      title: "Reviewed Flashcards",
      value: "5",
      change: "+7 this week",
      icon: <Award className="w-7 h-7" />,
      gradient: "from-purple-500 to-pink-500",
      trend: "up",
    },
    // {
    //   title: "Study Hours",
    //   value: "342",
    //   change: "+28 this week",
    //   icon: <Clock className="w-7 h-7" />,
    //   gradient: "from-orange-500 to-red-500",
    //   trend: "up",
    // },
  ];

  // Enhanced dummy data with more variety
  const sampleSets = [
    {
      id: 1,
      title: "JavaScript ES6 Features",
      count: 28,
      date: "2 days ago",
      color: "bg-blue-500",
      category: "Programming",
      difficulty: "Intermediate",
      type: "Multiple Choice",
      progress: 75,
      starred: true,
      description:
        "Modern JavaScript features including arrow functions, destructuring, and modules",
    },
    {
      id: 2,
      title: "React Hooks Deep Dive",
      count: 35,
      date: "5 days ago",
      color: "bg-indigo-500",
      category: "Programming",
      difficulty: "Advanced",
      type: "Code Review",
      progress: 60,
      starred: false,
      description:
        "Comprehensive guide to React hooks including useState, useEffect, and custom hooks",
    },
    {
      id: 3,
      title: "TypeScript Fundamentals",
      count: 42,
      date: "1 week ago",
      color: "bg-cyan-500",
      category: "Programming",
      difficulty: "Beginner",
      type: "Definition",
      progress: 90,
      starred: true,
      description:
        "Essential TypeScript concepts for building type-safe applications",
    },
    {
      id: 4,
      title: "Data Structures & Algorithms",
      count: 56,
      date: "2 weeks ago",
      color: "bg-purple-500",
      category: "Computer Science",
      difficulty: "Advanced",
      type: "Problem Solving",
      progress: 45,
      starred: false,
      description:
        "Core algorithms and data structures for technical interviews",
    },
    {
      id: 5,
      title: "System Design Basics",
      count: 31,
      date: "3 weeks ago",
      color: "bg-green-500",
      category: "Architecture",
      difficulty: "Intermediate",
      type: "Case Study",
      progress: 30,
      starred: true,
      description: "Fundamental concepts for designing scalable systems",
    },
    {
      id: 6,
      title: "Database Optimization",
      count: 24,
      date: "1 month ago",
      color: "bg-orange-500",
      category: "Database",
      difficulty: "Advanced",
      type: "Multiple Choice",
      progress: 85,
      starred: false,
      description: "Advanced techniques for optimizing database performance",
    },
    {
      id: 7,
      title: "Web Security Fundamentals",
      count: 38,
      date: "1 month ago",
      color: "bg-red-500",
      category: "Security",
      difficulty: "Intermediate",
      type: "Scenario",
      progress: 70,
      starred: true,
      description: "Essential security practices for web applications",
    },
    {
      id: 8,
      title: "Machine Learning Basics",
      count: 45,
      date: "2 months ago",
      color: "bg-pink-500",
      category: "AI/ML",
      difficulty: "Beginner",
      type: "Definition",
      progress: 55,
      starred: false,
      description: "Introduction to machine learning concepts and algorithms",
    },
  ];

  const categories = [
    "All",
    "Programming",
    "Computer Science",
    "Architecture",
    "Database",
    "Security",
    "AI/ML",
  ];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];
  const types = [
    "All",
    "Multiple Choice",
    "Definition",
    "Code Review",
    "Problem Solving",
    "Case Study",
    "Scenario",
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

  // Filter flashcards based on search and filters
  useEffect(() => {
    let filtered = flashcards.filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || card.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "All" || card.difficulty === selectedDifficulty;
      const matchesType = selectedType === "All" || card.type === selectedType;

      return (
        matchesSearch && matchesCategory && matchesDifficulty && matchesType
      );
    });

    setFilteredFlashcards(filtered);
  }, [
    flashcards,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedType,
  ]);

  const generateFlashcards = async () => {
    // setIsGenerating(true);

    // // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1500));

    // const topics = [
    //   "Advanced React Patterns",
    //   "GraphQL Fundamentals",
    //   "Microservices Design",
    //   "DevOps Essentials",
    // ];
    // const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    // const colors = [
    //   "bg-blue-500",
    //   "bg-indigo-500",
    //   "bg-cyan-500",
    //   "bg-purple-500",
    //   "bg-green-500",
    // ];

    // const newCard = {
    //   id: Date.now(),
    //   title: randomTopic,
    //   count: Math.floor(Math.random() * 30) + 15,
    //   date: "Just now",
    //   color: colors[Math.floor(Math.random() * colors.length)],
    //   category: "Programming",
    //   difficulty: "Intermediate",
    //   type: "Multiple Choice",
    //   progress: 0,
    //   starred: false,
    //   description: "Newly generated flashcard set",
    // };

    // setFlashcards((prev) => [newCard, ...prev]);
    // setIsGenerating(false);

    navigate("settings")


  };

  const loadSampleData = () => {
    setFlashcards(sampleSets);
  };

  const toggleStar = (id) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, starred: !card.starred } : card
      )
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
    setSelectedType("All");
  };

  const totalFlashcards = flashcards.reduce((sum, card) => sum + card.count, 0);
  const activeFilters = [
    selectedCategory,
    selectedDifficulty,
    selectedType,
  ].filter((f) => f !== "All").length;

  // Auto-load sample data for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (flashcards.length === 0) {
        loadSampleData();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [flashcards.length]);

  const handleStudy =(id)=>{
    console.log("idd----of flashcard:",id)
    navigate(`/flashcards/get-flashcards/${id}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-8 group">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1 rounded-xl mr-2 group-hover:scale-110 transition-transform duration-300">
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

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-4 ">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden  bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>
              <div className="p-6 relative z-10 ">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Flashcards Section */}
        {/* //copythe code */}

        {/* Flashcards copied Section */}
        <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-500" />
                Recent Flashcard Sets
              </h3>
              {totalFlashCards > 0 && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalFlashCards} total cards
                </div>
              )}
            </div>

            {/* check this later flashcards check with allflashcards showing not defined  */}
            {allFlashcards.length === 0 && (
              <button
                onClick={loadSampleData}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Load Sample Data
              </button>
            )}
          </div>

          {/* Search and Filter Bar */}
          {allFlashcards.length > 0 && (
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search flashcards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilters > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {activeFilters}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {activeFilters > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear filters
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              {showFilters && (
                <div className="grid md:grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                    >
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:border-blue-300 focus:ring-1 focus:ring-blue-100"
                    >
                      {types.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {totalFlashCards === 0 ? (
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
          ) : filteredFlashcards.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-xl font-medium text-slate-500 mb-2">
                No matching flashcards
              </h4>
              <p className="text-slate-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allFlashcards.map((card, index) => (
                <div
                  key={card._id}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:transform hover:-translate-y-1 cursor-pointer group shadow-sm hover:shadow-md"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.5s ease-out forwards",
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-3 h-3 ${(card.color ||
                        "bg-red-500")} rounded-full`}
                    >
                      
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(card.id);
                        }}
                        className="text-slate-300 hover:text-yellow-400 transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            card.starred
                              ? "fill-yellow-400 text-yellow-400"
                              : ""
                          }`}
                        />
                      </button>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        10 cards
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <h4 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h4>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {card.description || ""}
                  </p>

                  {/* Progress Bar */}
                  {/* <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{card.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${card.color} transition-all duration-300`}
                        style={{ width: `${card.progress}%` }}
                      ></div>
                    </div>
                  </div> */}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {card.category}
                    </span>
                    <span className="w-full flex-wrap">
                      {card.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                         className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>

                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {card.type}
                    </span>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{card.uploadedAt}</span>
                    </div>
                    <button onClick={()=>handleStudy(card._id)} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                      <Play className="w-3 h-3" />
                      Study
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

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

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-slate-500 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Ready to boost your learning?</span>
          </div>
        </div>
      </div>

      <style jsx="true">{`
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default FlashcardHome;
