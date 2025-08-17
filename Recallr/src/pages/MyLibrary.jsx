import React, { useContext, useEffect, useState } from "react";
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
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router";
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

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  // When opening modal, preload values from selectedPdf
  useEffect(() => {
    if (selectedPdf) {
      setTitle(selectedPdf.title || "");
      setCategory(selectedPdf.category || "");
      setTags(selectedPdf.tags?.join(", ") || "");
    } else {
      setTitle("");
      setCategory("");
      setTags("");
    }
  }, [selectedPdf]);

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

  // Fetch PDFs from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const userID = decodedToken.id;

    const fetchPdfs = async () => {
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
          progress: Math.floor(Math.random() * 100), // Random progress for demo
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

    fetchPdfs();
  }, [user]);

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
    navigate("/view", { state: { url: pdf.cloudinaryUrl } });
  };
  // Edit handler
  const editHandler = async (pdfData) => {
    if (!selectedPdf) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userID = decodedToken.id;

    console.log("selectedpdfF", selectedPdf);
    console.log("userID", userID);

    try {
      const pdfData = {
        title,
        category,
        tags: tags.split(",").map((t) => t.trim()),
      };

      const res = await axios.patch(
        `${API_URL}/pdf/edit-pdf`,
        { userId: userID, pdfId: selectedPdf._id, ...pdfData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        toast.success("PDF details updated successfully");
      }

      setShowModal(false);
      setSelectedPdf(null);
      fetchPdfs(); // refresh list
    } catch (error) {
      console.error("Error updating PDF:", error);
      toast.error("Failed to update PDF details");
    }
  };

  const handledownload = async (pdfUrl) => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "myfile.pdf"; // You can also dynamically name the file here
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                My Library
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredPdfs.length}{" "}
                {filteredPdfs.length === 1 ? "document" : "documents"} in your
                collection
              </p>
            </div>
            <button
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-95"
              onClick={() => setIsModalOpen(true)}
            >
              <Upload className="w-5 h-5" />
              <span>Upload New PDF</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search PDFs, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
              <div className="relative flex-1 lg:flex-none min-w-[180px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm w-full"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              <div className="relative flex-1 lg:flex-none min-w-[160px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm w-full"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-xl p-1 bg-white shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPdfs.map((pdf) => (
              <div
                key={pdf._id}
                className="group relative bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 p-6 hover:transform hover:scale-[1.02]"
              >
                {/* Top section with icon and actions */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${pdf.color} flex items-center justify-center shadow-lg`}
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedPdf(pdf)}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Dropdown menu appears when PDF is selected */}
                    {selectedPdf?._id === pdf._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => handlePdfAction("edit", pdf)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Details
                          </button>
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            // onClick={() => handlePdfAction("download", pdf)
                            //    handledownload(pdf) // Uncomment if you want to use the download function
                            // }
                            // // onClick={handledownload(pdf)}

                            onClick={() => {
                              handledownload(pdf.cloudinaryUrl);
                              // setSelectedPdf(pdf);
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </button>
                          <button
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            onClick={() => {
                              setPdfToDelete(pdf);
                              setShowDeleteConfirm(true);
                              setSelectedPdf(null);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Title and Metadata */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                    {pdf.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                      {pdf.category || "Uncategorized"}
                    </span>
                    <span>{pdf.formattedSize}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Uploaded {pdf.formattedDate}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {pdf.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg border border-blue-200"
                    >
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Reading Progress
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {pdf.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(
                        pdf.progress
                      )} transition-all duration-500`}
                      style={{ width: `${pdf.progress}%` }}
                    />
                  </div>
                </div>

                {/* Feature Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {pdf.features.map((feature) => (
                    <button
                      key={feature}
                      className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-sm"
                    >
                      {getFeatureIcon(feature)}
                      <span className="mt-1">{feature}</span>
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                    // onClick={() => handlePdfAction("view", pdf)}
                    onClick={() => handleRead(pdf)}
                    //   onClick={() =>
                    //   <PdfViewer fileUrl={pdf.cloudinaryUrl} />}
                    // onClick={() => setShowViewer(true)}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Read</span>
                  </button>
                  {/* <button
                    className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-200 hover:scale-105"
                    // onClick={() => handlePdfAction("download", pdf)}
                    onClick={() => {
                      handledownload(pdf);
                      // setSelectedPdf(pdf);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </button> */}
                  <button
                    className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      handledownload(pdf.cloudinaryUrl);
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPdfs.map((pdf) => (
              <div
                key={pdf._id}
                className="group relative bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-all duration-300 p-4 flex items-center space-x-4 hover:bg-gray-50"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${pdf.color} flex items-center justify-center flex-shrink-0`}
                >
                  <FileText className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {pdf.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                          {pdf.category || "Uncategorized"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {pdf.formattedSize}
                        </span>
                        <span className="text-xs text-gray-400">
                          Uploaded {pdf.formattedDate}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {pdf.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 ml-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {pdf.progress}%
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${getProgressColor(
                              pdf.progress
                            )}`}
                            style={{ width: `${pdf.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {pdf.features.map((feature) => (
                          <button
                            key={feature}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md text-xs transition-colors"
                            title={feature}
                          >
                            {getFeatureIcon(feature)}
                          </button>
                        ))}
                      </div>

                      <button
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        onClick={() => handleRead(pdf)}
                        // onClick={() => setShowViewer(true)}

                        // onClick={() => (
                        //   <PDFViewer fileUrl={pdf.cloudinaryUrl} />
                        // )}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Read</span>
                      </button>

                      <button
                        className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                        onClick={() => handlePdfAction("download", pdf)}
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={() => setSelectedPdf(pdf)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {selectedPdf?._id === pdf._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => handlePdfAction("edit", pdf)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Details
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => handlePdfAction("download", pdf)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </button>
                              <button
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                onClick={() => {
                                  setPdfToDelete(pdf);
                                  setShowDeleteConfirm(true);
                                  setSelectedPdf(null);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {PDFS.length}
              </div>
              <div className="text-sm text-blue-700 font-medium">
                Total Documents
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-3xl font-bold text-green-900 mb-1">
                {PDFS.length > 0
                  ? Math.round(
                      PDFS.reduce((acc, pdf) => acc + pdf.progress, 0) /
                        PDFS.length
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-green-700 font-medium">
                Average Progress
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {categories.length - 1}
              </div>
              <div className="text-sm text-purple-700 font-medium">
                Categories
              </div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="text-3xl font-bold text-orange-900 mb-1">
                {PDFS.filter((pdf) => pdf.progress === 100).length}
              </div>
              <div className="text-sm text-orange-700 font-medium">
                Completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit PDF Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {selectedPdf ? "Edit PDF Details" : "Upload New PDF"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
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
                  {selectedPdf ? "Save Changes" : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
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

      {/* PDF Reader Modal */}
      {/* {selectedPdf && (
        <PdfReaderModal
          pdfUrl={selectedPdf}
          onClose={() => setSelectedPdf(null)}
        />
      )} */}

    

      {/* {showViewer && <PdfViewer url={`${showViewer}.pdf`} />} */}
      {showViewer && <PdfViewer url={showViewer} />}

      {selectedPdf && <PdfReader pdfUrl={selectedPdf} />}

      <PDFUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MyLibrary;
