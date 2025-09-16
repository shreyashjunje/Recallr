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
import { useTheme } from "@/context/AdminThemeContext";

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
  const { isDark, toggleTheme } = useTheme(); // Get theme state and toggle function

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
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Background Pattern */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isDark
            ? "bg-grid-pattern-dark opacity-10"
            : "bg-grid-pattern opacity-5"
        }`}
      ></div>

      <div className="relative max-w-6xl mx-auto px-2 md:px-4 lg:px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-8 group">
            <div className="bg-gradient-to-r from-pink-400 to-orange-300 p-1 rounded-xl mr-2 group-hover:scale-110 transition-transform duration-300">
              <SquareStack className="w-8 h-8 text-white" />
            </div>
            <h1
              className={`text-2xl font-bold transition-colors duration-300 ${
                isDark ? "text-gray-100" : "text-slate-800"
              }`}
            >
              FlashGenius
            </h1>
          </div>

          <h2
            className={`text-5xl md:text-6xl font-bold mb-6 leading-tight transition-colors duration-300 ${
              isDark ? "text-gray-100" : "text-slate-900"
            }`}
          >
            Smart Flashcard
            <span className="bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
              {" "}
              Generator
            </span>
          </h2>

          <p
            className={`text-xl mb-10 max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${
              isDark ? "text-gray-400" : "text-slate-600"
            }`}
          >
            Transform your learning experience with AI-powered flashcards.
            Create, study, and master any subject efficiently.
          </p>

          <button
            onClick={generateFlashcards}
            disabled={isGenerating}
            className="bg-gradient-to-r from-pink-400 to-orange-300 hover:from-pink-500 hover:to-orange-400 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>Generate Flashcards</>
            )}
          </button>
        </header>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p
              className={`transition-colors duration-300 ${
                isDark ? "text-gray-400" : "text-slate-600"
              }`}
            >
              Loading your flashcards...
            </p>
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
                  className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
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
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <TrendingUp className="w-4 h-4" />
                        {stat.change}
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium mb-1 transition-colors duration-300 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {stat.title}
                      </p>
                      <p
                        className={`text-3xl font-bold transition-colors duration-300 ${
                          isDark ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Flashcards Section */}
            <section
              className={`rounded-3xl p-4 lg:p-8 border mt-8 transition-colors duration-300 ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <h3
                    className={`text-2xl font-bold flex items-center gap-3 transition-colors duration-300 ${
                      isDark ? "text-gray-100" : "text-slate-800"
                    }`}
                  >
                    <Clock className="w-6 h-6 text-pink-500" />
                    Recent Flashcard Sets
                  </h3>
                  {totalFlashCards > 0 && (
                    <div className="bg-orange-300 text-black px-3 py-1 rounded-full text-xs md:text-sm lg:text-sm font-medium">
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
                    <Search
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        isDark ? "text-gray-500" : "text-slate-400"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Search flashcards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-900"
                          : "border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                      }`}
                    />
                  </div>

                  {/* Filter Toggle */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 transition-colors duration-300 ${
                        isDark
                          ? "text-gray-400 hover:text-blue-400"
                          : "text-slate-600 hover:text-blue-600"
                      }`}
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
                        className={`text-sm flex items-center gap-1 transition-colors duration-300 ${
                          isDark
                            ? "text-gray-500 hover:text-gray-300"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        <X className="w-3 h-3" />
                        Clear filters
                      </button>
                    )}
                  </div>

                  {/* Filter Controls */}
                  {showFilters && (
                    <div
                      className={`grid md:grid-cols-3 gap-4 p-4 rounded-xl border transition-colors duration-300 ${
                        isDark
                          ? "bg-gray-700 border-gray-600"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                            isDark ? "text-gray-300" : "text-slate-700"
                          }`}
                        >
                          Category
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                            isDark
                              ? "bg-gray-600 border-gray-500 text-white focus:border-blue-400 focus:ring-blue-900"
                              : "border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                          }`}
                        >
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                            isDark ? "text-gray-300" : "text-slate-700"
                          }`}
                        >
                          Difficulty
                        </label>
                        <select
                          value={selectedDifficulty}
                          onChange={(e) =>
                            setSelectedDifficulty(e.target.value)
                          }
                          className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                            isDark
                              ? "bg-gray-600 border-gray-500 text-white focus:border-blue-400 focus:ring-blue-900"
                              : "border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                          }`}
                        >
                          {difficulties.map((difficulty) => (
                            <option key={difficulty} value={difficulty}>
                              {difficulty}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                            isDark ? "text-gray-300" : "text-slate-700"
                          }`}
                        >
                          Question Type
                        </label>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className={`w-full p-2 border rounded-lg transition-colors duration-300 ${
                            isDark
                              ? "bg-gray-600 border-gray-500 text-white focus:border-blue-400 focus:ring-blue-900"
                              : "border-slate-200 focus:border-blue-300 focus:ring-blue-100"
                          }`}
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
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                      isDark ? "bg-gray-700" : "bg-slate-200"
                    }`}
                  >
                    <BookOpen
                      className={`w-8 h-8 transition-colors duration-300 ${
                        isDark ? "text-gray-400" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <h4
                    className={`text-xl font-medium mb-2 transition-colors duration-300 ${
                      isDark ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    No flashcards yet
                  </h4>
                  <p
                    className={`transition-colors duration-300 ${
                      isDark ? "text-gray-500" : "text-slate-500"
                    }`}
                  >
                    Create your first set to get started with smart learning
                  </p>
                </div>
              ) : filteredFlashcards.length === 0 ? (
                <div className="text-center py-16">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                      isDark ? "bg-gray-700" : "bg-slate-200"
                    }`}
                  >
                    <Search
                      className={`w-8 h-8 transition-colors duration-300 ${
                        isDark ? "text-gray-400" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <h4
                    className={`text-xl font-medium mb-2 transition-colors duration-300 ${
                      isDark ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    No matching flashcards
                  </h4>
                  <p
                    className={`transition-colors duration-300 ${
                      isDark ? "text-gray-500" : "text-slate-500"
                    }`}
                  >
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredFlashcards.map((card, index) => (
                    <div
                      key={card._id}
                      className={`relative rounded-2xl sm:rounded-3xl shadow-md transition-all duration-500 ease-out 
                 p-4 sm:p-6 flex flex-col justify-between 
                 transform hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl cursor-pointer group ${
                   isDark ? "border border-gray-700" : ""
                 }`}
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
                      <div className="flex justify-between items-start mb-4 sm:mb-6">
                        <span
                          className={`text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm transition-colors duration-300 ${
                            isDark
                              ? "bg-gray-800 text-gray-300"
                              : "bg-white/70 text-gray-700"
                          }`}
                        >
                          {formatDate(card.uploadedAt)}
                        </span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(card._id);
                            }}
                            className="text-slate-300 hover:text-yellow-400 transition-colors"
                          >
                            <Star
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                card.starred
                                  ? "fill-yellow-400 text-yellow-400"
                                  : ""
                              }`}
                            />
                          </button>
                          <span
                            className={`text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full shadow-sm transition-colors duration-300 ${
                              isDark
                                ? "bg-gray-800 text-gray-300"
                                : "bg-white/70 text-slate-700"
                            }`}
                          >
                            {card.totalCards || "10"} cards
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-base sm:text-lg font-bold mb-1 sm:mb-2 group-hover:text-gray-800 transition-colors py-2 sm:py-4
                  text-gray-900
                  }`}
                      >
                        {card.title}
                      </h4>

                      {/* Category */}
                      <p
                        className={`text-xs sm:text-sm font-medium mb-3 sm:mb-4 py-1 sm:py-2 transition-colors duration-300 
                    text-gray-700
                  }`}
                      >
                        {card.category}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                        {(expandedTags[card._id]
                          ? card.tags
                          : card.tags.slice(0, 3)
                        ).map((tag, index) => (
                          <span
                            key={index}
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full shadow-sm transition-transform duration-300 hover:scale-105 ${
                              isDark
                                ? "bg-white/70 text-gray-800"
                                : "bg-white/70 text-gray-800"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {card.tags.length > 3 && (
                          <button
                            onClick={() => toggleTags(card._id)}
                            className={`px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded-full transition-transform duration-300 hover:scale-105 ${
                              isDark
                                ? "text-gray-700 bg-white/60 hover:bg-white"
                                : "text-gray-700 bg-white/60 hover:bg-white"
                            }`}
                          >
                            {expandedTags[card._id]
                              ? "See less"
                              : `+${card.tags.length - 3} more`}
                          </button>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-sm font-semibold transition-colors duration-300
                      text-gray-800
                    }`}
                        >
                          📘 Study Material
                        </span>
                        <button
                          onClick={() => handleStudy(card._id)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 text-[12px] sm:text-sm font-semibold rounded-full bg-black text-white transition-all duration-300 hover:bg-gray-800 transform hover:scale-105 hover:shadow-lg"
                        >
                          Study
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
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

        .bg-grid-pattern-dark {
          background-image: linear-gradient(
              rgba(59, 130, 246, 0.15) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(59, 130, 246, 0.15) 1px,
              transparent 1px
            );
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
