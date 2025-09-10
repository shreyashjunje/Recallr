import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Search,
  ChevronDown,
  FileText,
  Eye,
  Download,
  BookOpen,
  Brain,
  CreditCard,
  Upload,
  MoreVertical,
  Clock,
  Tag,
  Grid,
  List,
  Edit,
  Trash2,
  Star,
  FilePlus,
  Bookmark,
  FileEdit,
  FileMinus,
  FileOutput,
  FileSearch,
  FileBarChart2,
  FileInput,
  FileClock,
  FileCheck,
  FileX,
  FileUp,
  X,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PDFUploadModal from "../components/modals/PdfUploadModal";
import { toast } from "react-toastify";
// import PdfReaderModal from "../components/helper/PdfReaderModal";
import PdfReader from "../components/helper/PdfViewer";
import PdfViewer from "../components/helper/PdfViewer";
// import PDFViewer from "./ViewPdf";
const API_URL = import.meta.env.VITE_API_URL;

const MyLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Most Recent");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [PDFS, setPDFS] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showViewer, setShowViewer] = useState(null);
  const [averageProgress, setAverageProgress] = useState(0);
  const [favorites, setFavorites] = useState([]);
  // const handleToggleFavorite = async (pdf) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     const endpoint = pdf.isFavorite
  //       ? `${API_URL}/helper/remove-from-favourite`
  //       : `${API_URL}/helper/add-to-favourite`;

  //     const response = await axios.post(
  //       endpoint,
  //       { pdfId: pdf._id },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.status === 200) {
  //       setPDFS((prevPDFs) =>
  //         prevPDFs.map((p) =>
  //           p._id === pdf._id ? { ...p, isFavorite: !p.isFavorite } : p
  //         )
  //       );

  //       toast.success(
  //         pdf.isFavorite ? "Removed from favorites" : "Added to favorites"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error toggling favorite:", error);
  //     toast.error("Failed to update favorites");
  //   }
  // };

  const dropdownRef = useRef(null);

  // const [title, setTitle] = useState("");
  // const [category, setCategory] = useState("");
  // const [tags, setTags] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
  });

  useEffect(() => {
    if (selectedPdf) {
      setFormData({
        title: selectedPdf.title || "",
        category: selectedPdf.category || "",
        tags: selectedPdf.tags?.join(", ") || "",
      });
    } else {
      setFormData({
        title: "",
        category: "",
        tags: "",
      });
    }
  }, [selectedPdf, showModal]); // Add showModal to dependencies

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchAverageProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/user/average-progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Average Progress:", data.averageProgress);
      setAverageProgress(data.averageProgress); // store in state
    } catch (error) {
      console.error("Error fetching average progress:", error);
    }
  };

  useEffect(() => {
    fetchAverageProgress();
  }, []);

  useEffect(() => {
    if (!showModal) {
      setFormData({
        title: "",
        category: "",
        tags: "",
      });
    }
  }, [showModal]);

  // Color generator based on title hash
  const getColorFromTitle = (title) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-emerald-500 to-emerald-600",
      "from-orange-500 to-orange-600",
      "from-purple-500 to-purple-600",
      "from-red-500 to-red-600",
      "from-indigo-500 to-indigo-600",
      "from-pink-500 to-pink-600",
      "from-cyan-500 to-cyan-600",
    ];
    const hash = title
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

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

      // Transform the data to include calculated fields
      const transformedData = res.data.pdfs.map((pdf) => ({
        ...pdf,
        color: getColorFromTitle(pdf.title),
        formattedSize: formatFileSize(pdf.size || 0),
        formattedDate: formatDate(pdf.createdAt || new Date()),
        // progress: Math.floor(Math.random() * 100), // Random progress for demo
        features: ["Summary", "Quiz", "Flashcards"], // Default features
        tags: pdf.tags || ["Document", "Study"], // Default tags if none
      }));

      setPDFS(transformedData);
      console.log("Fetched PDFs:", transformedData);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's favorite PDFs
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(`${API_URL}/helper/get-favourite-pdfs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFavorites(response.data.data);

        // Update the PDFs with favorite status
        setPDFS((prevPDFs) =>
          prevPDFs.map((pdf) => ({
            ...pdf,
            isFavorite: response.data.data.some((fav) => fav._id === pdf._id),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // Fetch PDFs from backend
  useEffect(() => {
    fetchPdfs();
    fetchFavorites();
  }, [user]);

  // Toggle favorite status
  const handleToggleFavorite = async (pdf) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Determine which endpoint to call based on current favorite status
      const endpoint = pdf.isFavorite
        ? `${API_URL}/helper/remove-from-favourite`
        : `${API_URL}/helper/add-to-favourite`;

      // Use appropriate HTTP method
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      let response;
      if (pdf.isFavorite) {
        // Use DELETE method for removal
        response = await axios.delete(endpoint, {
          ...config,
          data: { pdfId: pdf._id },
        });
      } else {
        // Use POST method for addition
        response = await axios.post(endpoint, { pdfId: pdf._id }, config);
      }

      if (response.status === 200) {
        // Update local state
        setPDFS((prevPDFs) =>
          prevPDFs.map((p) =>
            p._id === pdf._id ? { ...p, isFavorite: !p.isFavorite } : p
          )
        );

        setFavorites((prevPdfs) =>
          prevPdfs.map((p) =>
            p._id === pdf._id ? { ...p, isFavorite: !p.isFavorite } : p
          )
        );

        // Update favorites list
        if (pdf.isFavorite) {
          setFavorites((prev) => prev.filter((fav) => fav._id !== pdf._id));
        } else {
          // We might not have the full PDF data, so we add what we have
          setFavorites((prev) => [...prev, { ...pdf, isFavorite: true }]);
        }

        // Show toast notification
        toast.success(
          pdf.isFavorite ? "Removed from favorites" : "Added to favorites"
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  // Filter and sort PDFs
  const filteredPdfs = PDFS.filter((pdf) => {
    const matchesSearch =
      pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pdf.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      pdf.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      pdf.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "Most Recent":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "Oldest First":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "Progress High to Low":
        return b.progress - a.progress;
      case "Progress Low to High":
        return a.progress - b.progress;
      case "A-Z":
        return a.title.localeCompare(b.title);
      case "Z-A":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Categories from actual data
  const categories = [
    "All Categories",
    ...new Set(PDFS.map((pdf) => pdf.category).filter(Boolean)),
  ];

  const sortOptions = [
    "Most Recent",
    "Oldest First",
    "Progress High to Low",
    "Progress Low to High",
    "A-Z",
    "Z-A",
  ];
  const getCategoryGradient = (category) => {
    const gradientMap = {
      Finance: "from-green-500 to-emerald-500",
      Technology: "from-blue-500 to-cyan-500",
      Education: "from-purple-500 to-indigo-500",
      Business: "from-amber-500 to-orange-500",
      Research: "from-red-500 to-pink-500",
      Default: "from-gray-500 to-slate-500",
    };

    return gradientMap[category] || gradientMap["Default"];
  };

  // Feature icons
  const getFeatureIcon = (feature) => {
    switch (feature) {
      case "Summary":
        return <BookOpen className="w-4 h-4" />;
      case "Quiz":
        return <Brain className="w-4 h-4" />;
      case "Flashcards":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Progress color
  const getProgressColor = (progress) => {
    if (progress === 0) return "bg-gray-200";
    if (progress < 30) return "bg-red-400";
    if (progress < 70) return "bg-yellow-400";
    return "bg-green-400";
  };

  // Handle PDF actions
  const handlePdfAction = (action, pdf) => {
    console.log("pdf::::::::::", pdf);
    switch (action) {
      case "view":
        navigate("/view", { state: { pdfUrl: pdf.cloudinaryUrl } });
        break;
      case "edit":
        setSelectedPdf(pdf);
        setShowModal(true);
        break;
      case "delete":
        setPdfToDelete(pdf);
        setShowDeleteConfirm(true);

        break;
      case "download":
        // console.log("Download PDF:", pdf);
        setSelectedPdf(pdf);

        break;
      default:
        break;
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!pdfToDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userID = decodedToken.id;

    // Optimistic update
    const oldPDFs = [...PDFS];
    setPDFS((prev) => prev.filter((p) => p._id !== pdfToDelete._id));
    setShowDeleteConfirm(false);
    setPdfToDelete(null);

    try {
      await axios.delete(`${API_URL}/pdf/delete-pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: userID, pdfId: pdfToDelete._id },
      });

      toast.success("PDF deleted successfully");
    } catch (error) {
      console.error("Error deleting PDF:", error);
      setPDFS(oldPDFs); // rollback if deletion failed
      toast.error("Failed to delete PDF");
    }
  };

  const handleRead = async (pdf) => {
    //  console.log("Reading PDF url:", pdf.cloudinaryUrl);
    //  setShowViewer(pdf.cloudinaryUrl)
    //  console.log("Show viewer set to:", showViewer);
    console.log("pdfId:::", pdf._id);
    navigate("/view", { state: { url: pdf.cloudinaryUrl, pdfId: pdf._id } });
    // navigate("/view", { state: { pdfUrl: pdf.cloudinaryUrl ,fileName:pdf.title });
  };

  const editHandler = async () => {
    if (!selectedPdf) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userID = decodedToken.id;

    try {
      const pdfData = {
        title: formData.title,
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await axios.patch(
        `${API_URL}/pdf/edit-pdf`,
        { userId: userID, pdfId: selectedPdf._id, ...pdfData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toast.success("PDF details updated successfully");
        // Refresh your PDF list here
        setShowModal(false);
        setSelectedPdf(null);
      }
    } catch (error) {
      console.error("Error updating PDF:", error);
      toast.error("Failed to update PDF details");
    }
  };

  const handledownload = async (pdf) => {
    const pdfName =
      pdf.originalName && pdf.originalName.trim() !== ""
        ? pdf.originalName
        : "myfile.pdf";

    try {
      const response = await fetch(pdf.cloudinaryUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = pdfName; // force your filename
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handlePdfDetails = (pdfId) => {
    navigate(`/pdf/${pdfId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                My Library
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {filteredPdfs.length}{" "}
                {filteredPdfs.length === 1 ? "document" : "documents"} in your
                collection
              </p>
            </div>

            {/* Upload Button */}
            <button
              className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3
                   bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg sm:rounded-xl
                   font-medium text-sm sm:text-base
                   hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-blue-500/25
                   hover:scale-[1.02] active:scale-95 w-full sm:w-auto justify-center"
              onClick={() => setIsModalOpen(true)}
            >
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Upload New PDF</span>
            </button>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search PDFs, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-lg sm:rounded-xl
                     text-sm sm:text-base text-gray-900 placeholder-gray-500
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                     transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
              {/* Category Filter */}
              <div className="relative flex-1 lg:flex-none min-w-[140px] sm:min-w-[180px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10
                       text-sm sm:text-base text-gray-700
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       transition-all duration-200 shadow-sm w-full"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              </div>

              {/* Sort Filter */}
              <div className="relative flex-1 lg:flex-none min-w-[120px] sm:min-w-[160px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10
                       text-sm sm:text-base text-gray-700
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                       transition-all duration-200 shadow-sm w-full"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg sm:rounded-xl p-0.5 sm:p-1 bg-white shadow-sm w-full sm:w-auto justify-center">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 sm:p-2.5 rounded-md sm:rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 sm:p-2.5 rounded-md sm:rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Grid/List */}
      <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-6 py-8 ">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPdfs.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or upload a new PDF
            </p>
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              onClick={() => setShowModal(true)}
            >
              <Upload className="w-5 h-5 inline mr-2" />
              Upload PDF
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPdfs.map((pdf) => (
              <div
                key={pdf._id}
                className="group relative h-full bg-white rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden border border-gray-100"
                onClick={(e) => {
                  if (!e.target.closest('button, a, [role="button"]')) {
                    handlePdfDetails(pdf._id);
                  }
                }}
              >
                {/* Card header with gradient */}
                <div
                  className={`h-2 w-full ${getCategoryGradient(pdf.category)}`}
                ></div>

                <div className="p-5">
                  {/* Top section with icon and actions */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pdf.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <FileText className="w-7 h-7 text-white" />
                    </div>

                    {/* Favorite and More Actions */}
                    <div className="flex items-center gap-1">
                      {/* Favorite Icon */}
                      <button
                        className="p-2 hover:bg-yellow-50 rounded-lg transition-colors text-gray-400 hover:text-yellow-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(pdf);
                        }}
                        title={
                          pdf.isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        {pdf.isFavorite ? (
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <Star className="w-5 h-5" />
                        )}
                      </button>

                      <div className="relative">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPdf(pdf);
                          }}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown menu */}
                        {selectedPdf?._id === pdf._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10 border border-gray-200 overflow-hidden"
                          >
                            {/* Close Icon */}
                            <button
                              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPdf(null);
                              }}
                            >
                              <X className="w-5 h-5" />
                            </button>

                            <div className="py-2">
                              <button
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 w-full text-left transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePdfAction("edit", pdf);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-3 text-blue-500" />
                                Edit Details
                              </button>
                              <button
                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 w-full text-left transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePdfAction("download", pdf);
                                }}
                              >
                                <Download className="w-4 h-4 mr-3 text-blue-500" />
                                Download
                              </button>
                              <button
                                className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPdfToDelete(pdf);
                                  setShowDeleteConfirm(true);
                                  setSelectedPdf(null);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PDF Title and Metadata */}
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors h-[56px]">
                      {pdf.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {pdf.category || "Uncategorized"}
                      </span>
                      {/* Favorite badge for mobile view */}
                      {/* {pdf.isFavorite && (
                        <div className="md:hidden flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-400 mr-1" />
                          <span className="text-xs">Favorite</span>
                        </div>
                      )} */}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Uploaded {formatDate(pdf.uploadedAt)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8 h-[40px]">
                    {pdf.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {pdf.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
                        +{pdf.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Reading Progress
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {pdf.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${getProgressColor(
                          pdf.progress
                        )} transition-all duration-700`}
                        style={{ width: `${pdf.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Feature Chips */}
                  <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
                    {pdf?.isQuizGenerated && (
                      <div className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-100">
                        {getFeatureIcon("Quiz")}
                        <span className="ml-1.5">Quiz</span>
                      </div>
                    )}
                    {pdf?.isFlashcardGenerated && (
                      <div className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-100">
                        {getFeatureIcon("Flashcards")}
                        <span className="ml-1.5">Flashcards</span>
                      </div>
                    )}
                    {pdf.isSummarized && (
                      <div className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-100">
                        {getFeatureIcon("Summary")}
                        <span className="ml-1.5">Summary</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg shadow-blue-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRead(pdf);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Read Now</span>
                    </button>
                    <button
                      className="p-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-200 hover:shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handledownload(pdf);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredPdfs.map((pdf) => (
              <div
                key={pdf._id}
                className="group relative bg-white rounded-2xl transition-all duration-300 p-5 flex flex-col md:flex-row md:items-center gap-5 hover:shadow-lg hover:border-transparent cursor-pointer border border-gray-100"
                onClick={(e) => {
                  if (!e.target.closest("button, a, [role='button']")) {
                    handlePdfDetails(pdf._id);
                  }
                }}
              >
                {/* PDF Icon */}
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${pdf.color} flex items-center justify-center flex-shrink-0 shadow-md`}
                >
                  <FileText className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {pdf.title}
                        </h3>
                        {pdf.isFavorite && (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                        )}
                      </div>

                      {/* Category + Size + Date */}
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {pdf.category || "Uncategorized"}
                        </span>
                        <span>{pdf.formattedSize}</span>
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{pdf.formattedDate}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {pdf.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {pdf.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
                            +{pdf.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar (stacked on mobile) */}
                    <div className="text-left sm:text-right min-w-[120px]">
                      <div className="text-xs md:text-sm font-medium text-gray-900 mb-1">
                        {pdf.progress}% Complete
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressColor(
                            pdf.progress
                          )}`}
                          style={{ width: `${pdf.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feature Chips */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {pdf?.isQuizGenerated && (
                      <div className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-100">
                        {getFeatureIcon("Quiz")}
                        <span className="ml-1">Quiz</span>
                      </div>
                    )}
                    {pdf?.isFlashcardGenerated && (
                      <div className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-100">
                        {getFeatureIcon("Flashcards")}
                        <span className="ml-1">Flashcards</span>
                      </div>
                    )}
                    {pdf.isSummarized && (
                      <div className="inline-flex items-center px-2.5 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-100">
                        {getFeatureIcon("Summary")}
                        <span className="ml-1">Summary</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 mt-4 md:mt-0">
                  {/* Favorite */}
                  <button
                    className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(pdf);
                    }}
                    title={
                      pdf.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {pdf.isFavorite ? (
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <Star className="w-5 h-5" />
                    )}
                  </button>

                  {/* Read */}
                  <button
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRead(pdf);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Read</span>
                  </button>

                  {/* Download */}
                  <button
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handledownload(pdf);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* More menu */}
                  <div className="relative">
                    <button
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPdf(pdf);
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {selectedPdf?._id === pdf._id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg z-10 border border-gray-200 overflow-hidden"
                      >
                        {/* Close */}
                        <button
                          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPdf(null);
                          }}
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <div className="py-2">
                          <button
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePdfAction("edit", pdf);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-3 text-blue-500" />
                            Edit Details
                          </button>
                          <button
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 w-full text-left"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePdfAction("download", pdf);
                            }}
                          >
                            <Download className="w-4 h-4 mr-3 text-blue-500" />
                            Download
                          </button>
                          <button
                            className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPdfToDelete(pdf);
                              setShowDeleteConfirm(true);
                              setSelectedPdf(null);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Total Documents */}
            <div className="text-center p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg lg:rounded-xl shadow-sm">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mb-1">
                {PDFS.length}
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-blue-700 font-medium">
                Total Documents
              </div>
            </div>

            {/* Average Progress */}
            <div className="text-center p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg lg:rounded-xl shadow-sm">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900 mb-1">
                {averageProgress}%
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-green-700 font-medium">
                Average Progress
              </div>
            </div>

            {/* Categories */}
            <div className="text-center p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg lg:rounded-xl shadow-sm">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-900 mb-1">
                {categories.length - 1}
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-purple-700 font-medium">
                Categories
              </div>
            </div>

            {/* Completed */}
            <div className="text-center p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg lg:rounded-xl shadow-sm">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-900 mb-1">
                {PDFS.filter((pdf) => pdf.progress === 100).length}
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-orange-700 font-medium">
                Completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Edit PDF Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories
                      .filter((c) => c !== "All Categories")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPdf(null);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={editHandler}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to parent
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Delete PDF?
              </h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to delete "{pdfToDelete?.title}"? This
                action cannot be undone.
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PDFUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MyLibrary;
