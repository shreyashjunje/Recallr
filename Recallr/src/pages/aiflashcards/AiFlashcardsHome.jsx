import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  CreditCard,
  SquareStack,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

const FlashcardHome = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTags, setExpandedTags] = useState({});
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Calculate derived data using useMemo to avoid recalculating on every render
  const { totalFlashCards, totalCategories } = useMemo(() => {
    const totalFlashCards = flashcards.length;
    const uniqueCategories = new Set(
      flashcards.map((flashcard) => flashcard.category)
    );
    const totalCategories = uniqueCategories.size;

    return { totalFlashCards, totalCategories };
  }, [flashcards]);

  const stats = useMemo(
    () => [
      {
        title: "Total Pdfs",
        value: `${pdfs.length}`,
        change: "+7 this week",
        icon: <Upload className="w-7 h-7" />,
        gradient: "from-purple-500 to-pink-500",
        trend: "up",
      },
      {
        title: "Total Flashcards",
        value: `${totalFlashCards}`,
        change: `7 this week`,
        icon: <CreditCard className="w-7 h-7" />,
        gradient: "from-blue-500 to-cyan-500",
        trend: "up",
      },
      {
        title: "Total Categories",
        value: `${totalCategories}`,
        change: `7 this week`,
        icon: <FolderOpen className="w-7 h-7" />,
        gradient: "from-emerald-500 to-teal-500",
        trend: "up",
      },
    ],
    [totalFlashCards, totalCategories, pdfs]
  );

  const categories = useMemo(
    () => [
      "All",
      "Programming",
      "Computer Science",
      "Architecture",
      "Database",
      "Security",
      "AI/ML",
    ],
    []
  );

  const difficulties = useMemo(
    () => ["All", "Beginner", "Intermediate", "Advanced"],
    []
  );

  const types = useMemo(
    () => [
      "All",
      "Multiple Choice",
      "Definition",
      "Code Review",
      "Problem Solving",
      "Case Study",
      "Scenario",
    ],
    []
  );

  const features = useMemo(
    () => [
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
    ],
    []
  );

  const fetchAllFlashcards = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/flashcards/get-all-flashcards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setFlashcards(res.data.data);
        toast.success("Flashcards loaded successfully");
      }
    } catch (err) {
      console.error("Error fetching flashcards:", err);
      toast.error("Failed to load flashcards");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPdfs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const userID = decodedToken.id;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/pdf/pdfs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId: userID },
      });

      if (res.status === 200) {
        setPdfs(res.data.pdfs);
        console.log("Fetched PDFs:", res.data.pdfs);
      }
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFlashcards();
  }, [fetchAllFlashcards]);

  useEffect(() => {
    fetchPdfs();
  }, []);

  // Filter flashcards using useMemo to avoid recalculating on every render
  const filteredFlashcards = useMemo(() => {
    return flashcards.filter((card) => {
      const matchesSearch =
        debouncedSearchQuery === "" ||
        card.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        (card.description &&
          card.description
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || card.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === "All" || card.difficulty === selectedDifficulty;

      const matchesType = selectedType === "All" || card.type === selectedType;

      return (
        matchesSearch && matchesCategory && matchesDifficulty && matchesType
      );
    });
  }, [
    flashcards,
    debouncedSearchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedType,
  ]);

  const generateFlashcards = useCallback(async () => {
    navigate("settings");
  }, [navigate]);

  const toggleTags = useCallback((summaryId) => {
    setExpandedTags((prev) => ({
      ...prev,
      [summaryId]: !prev[summaryId],
    }));
  }, []);

  const toggleStar = useCallback((id) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, starred: !card.starred } : card
      )
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
    setSelectedType("All");
  }, []);

  const handleStudy = useCallback(
    (id) => {
      navigate(`/flashgenius/get-flashcards/${id}`);
    },
    [navigate]
  );

  // Format date
  const formatDate = useCallback((dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const activeFilters = useMemo(
    () =>
      [selectedCategory, selectedDifficulty, selectedType].filter(
        (f) => f !== "All"
      ).length,
    [selectedCategory, selectedDifficulty, selectedType]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-8 group">
            <div className="bg-gradient-to-r from-pink-400 to-orange-300 p-1 rounded-xl mr-2 group-hover:scale-110 transition-transform duration-300">
              <SquareStack className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">FlashGenius</h1>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Smart Flashcard
            <span
              className="bg-gradient-to-r  bg-clip-text text-transparent 
            from-pink-500 to-orange-400
"
            >
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
            className="bg-gradient-to-r from-pink-400 to-orange-300 hover:from-pink-500 hover:to-orange-400
 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                {/* <Plus className="w-5 h-5" /> */}
                Generate Flashcards
                {/* <ArrowRight className="w-5 h-5" /> */}
              </>
            )}
          </button>
        </header>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your flashcards...</p>
          </div>
        )}

        {/* Display content when not loading */}
        {!isLoading && (
          <>
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>
                  <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
                      >
                        {stat.icon}
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
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
            <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200 mt-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-pink-500" />
                    Recent Flashcard Sets
                  </h3>
                  {totalFlashCards > 0 && (
                    <div className="bg-orange-300 text-black px-3 py-1 rounded-full text-sm font-medium">
                      {totalFlashCards} total sets
                    </div>
                  )}
                </div>
              </div>

              {/* Search and Filter Bar */}
              {flashcards.length > 0 && (
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
                          onChange={(e) =>
                            setSelectedDifficulty(e.target.value)
                          }
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredFlashcards.map((card, index) => (
                    <div
                      key={card._id}
                      className="relative rounded-3xl shadow-md transition-all duration-500 ease-out p-6 flex flex-col justify-between transform hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl cursor-pointer group"
                      style={{
                        backgroundColor: [
                          "#FFE5D9", // soft peach
                          "#DFF7E3", // mint green
                          "#E5E0FF", // lavender
                          "#FDE2E4", // pink
                          "#E0F7FA", // teal
                          "#FFF5E1", // cream
                        ][index % 6],
                        animationDelay: `${index * 120}ms`,
                        animation: "fadeInUp 0.6s ease-out forwards",
                      }}
                    >
                      {/* Top Section */}
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-medium bg-white/70 px-3 py-1 rounded-full shadow-sm">
                          {formatDate(card.uploadedAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(card._id);
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
                          <span className="text-xs text-slate-700 bg-white/70 px-2 py-1 rounded-full shadow-sm">
                            {card.totalCards || "10"} cards
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors py-4">
                        {card.title}
                      </h4>

                      {/* Category */}
                      <p className="text-sm text-gray-700 font-medium mb-4 py-2">
                        {card.category}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(expandedTags[card._id]
                          ? card.tags
                          : card.tags.slice(0, 3)
                        ).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium bg-white/70 text-gray-800 rounded-full shadow-sm transition-transform duration-300 hover:scale-105"
                          >
                            {tag}
                          </span>
                        ))}
                        {card.tags.length > 3 && (
                          <button
                            onClick={() => toggleTags(card._id)}
                            className="px-2 py-1 text-xs text-gray-700 bg-white/60 hover:bg-white rounded-full transition-transform duration-300 hover:scale-105"
                          >
                            {expandedTags[card._id]
                              ? "See less"
                              : `+${card.tags.length - 3} more`}
                          </button>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800">
                          📘 Study Material
                        </span>
                        <button
                          onClick={() => handleStudy(card._id)}
                          className="px-4 py-2 text-sm font-semibold rounded-full bg-black text-white transition-all duration-300 hover:bg-gray-800 transform hover:scale-105 hover:shadow-lg"
                        >
                          Study
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Features */}
            {/* <section className="grid md:grid-cols-3 gap-8 mb-16 mt-16">
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
            </section> */}

            {/* Footer CTA */}
            {/* <div className="text-center mt-16">
              <div className="inline-flex items-center gap-2 text-slate-500 mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Ready to boost your learning?</span>
              </div>
            </div> */}
          </>
        )}
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
