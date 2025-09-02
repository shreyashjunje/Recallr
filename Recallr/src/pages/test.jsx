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
  const [averageProgress, setAverageProgress] = useState(0);
  const dropdownRef = useRef(null);

  // const [title, setTitle] = useState("");
  // const [category, setCategory] = useState("");
  // const [tags, setTags] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    tags: "",
  });

  // When opening modal, preload values from selectedPdf
  // useEffect(() => {
  //   if (selectedPdf) {
  //     setTitle(selectedPdf.title || "");
  //     setCategory(selectedPdf.category || "");
  //     setTags(selectedPdf.tags?.join(", ") || "");
  //   } else {
  //     setTitle("");
  //     setCategory("");
  //     setTags("");
  //   }
  // }, [selectedPdf]);

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

  // // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setSelectedPdf(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setSelectedPdf(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

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
    if (showModal && selectedPdf) {
      setFormData({
        title: selectedPdf.title || "",
        category: selectedPdf.category || "",
        description: selectedPdf.description || "",
        file: selectedPdf.file || null,
      });
    }
  }, [showModal, selectedPdf]);

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

  // Edit handler
  // const editHandler = async (pdfData) => {
  //   if (!selectedPdf) return;

  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     toast.error("You are not logged in");
  //     return;
  //   }

  //   const decodedToken = jwtDecode(token);
  //   const userID = decodedToken.id;

  //   console.log("selectedpdfF", selectedPdf);
  //   console.log("userID", userID);

  //   try {
  //     const pdfData = {
  //       title,
  //       category,
  //       tags: tags.split(",").map((t) => t.trim()),
  //     };

  //     const res = await axios.patch(
  //       `${API_URL}/pdf/edit-pdf`,
  //       { userId: userID, pdfId: selectedPdf._id, ...pdfData },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (res.status === 200) {
  //       toast.success("PDF details updated successfully");
  //     }

  //     setShowModal(false);
  //     setSelectedPdf(null);
  //     fetchPdfs(); // refresh list
  //   } catch (error) {
  //     console.error("Error updating PDF:", error);
  //     toast.error("Failed to update PDF details");
  //   }
  // };
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}

      {/* PDF Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-8 ">
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
                                handledownload(pdf);
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

                  {/* PDF Title and Metadata */}
                  <div className="mb-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors h-[56px]">
                      {pdf.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {pdf.category || "Uncategorized"}
                      </span>
                      {/* <span className="text-sm text-gray-500">
                        {pdf.formattedSize}
                      </span> */}
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
                  {/* <div className="flex flex-wrap gap-2 mb-6">
              {pdf.features.map((feature) => (
                <div
                  key={feature}
                  className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-xs font-medium border border-gray-100"
                >
                  {getFeatureIcon(feature)}
                  <span className="ml-1.5">{feature}</span>
                </div>
              ))}
            </div> */}
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
                className="group relative bg-white rounded-2xl transition-all duration-300 p-5 flex items-center space-x-5 hover:shadow-lg hover:border-transparent cursor-pointer border border-gray-100"
                onClick={(e) => {
                  if (!e.target.closest('button, a, [role="button"]')) {
                    handlePdfDetails(pdf._id);
                  }
                }}
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pdf.color} flex items-center justify-center flex-shrink-0 shadow-md`}
                >
                  <FileText className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {pdf.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          {pdf.category || "Uncategorized"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {pdf.formattedSize}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{pdf.formattedDate}</span>
                        </div>
                      </div>
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

                    <div className="flex items-center space-x-4 ml-4">
                      <div className="text-right min-w-[80px]">
                        <div className="text-sm font-medium text-gray-900 mb-1">
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

                      <div className="flex gap-1">
                        {pdf.features.map((feature) => (
                          <div
                            key={feature}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg text-xs transition-colors flex items-center"
                            title={feature}
                          >
                            {getFeatureIcon(feature)}
                          </div>
                        ))}
                      </div>

                      <button
                        className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-md shadow-blue-500/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRead(pdf);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Read</span>
                      </button>

                      <button
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handledownload(pdf);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button
                          className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
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
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10 border border-gray-200 overflow-hidden"
                          >
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
                </div>
              </div>
            ))}
          </div>
        )}
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
                    // onChange={handleInputChange}
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

      <PDFUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MyLibrary;
