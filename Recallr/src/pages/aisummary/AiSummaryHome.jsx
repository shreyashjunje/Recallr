import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  Send,
  Download,
  Copy,
  RefreshCw,
  BookOpen,
  // File,
  Zap,
  Brain,
  Search,
  FolderOpen,
  Clock,
  User,
} from "lucide-react";
import logo from "../../assets/logoR.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const AiSummaryHome = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSource, setFileSource] = useState("local");
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [filteredLibraryFiles, setFilteredLibraryFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLibraryFile, setSelectedLibraryFile] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const promptTemplates = [
    "Create a concise summary highlighting the main points and key takeaways",
    "Generate an executive summary focusing on critical insights and recommendations",
    "Provide a detailed summary with bullet points for easy reading",
    "Create a brief overview suitable for quick reference",
    "Summarize with emphasis on actionable items and next steps",
  ];

  // Fetch PDFs from library when user selects the library tab
  useEffect(() => {
    if (fileSource === "library") {
      fetchLibraryPDFs();
    }
  }, [fileSource]);

  // Filter library files based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = libraryFiles.filter(
        (file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (file.description &&
            file.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredLibraryFiles(filtered);
    } else {
      setFilteredLibraryFiles(libraryFiles);
    }
  }, [searchQuery, libraryFiles]);

  const fetchLibraryPDFs = async () => {
    setIsLoadingLibrary(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to access your PDF library");
        return;
      }

      const response = await axios.get(`${API_URL}/pdf/pdfs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log("pdf in library::",response.data.pdfs)
        setLibraryFiles(response.data.pdfs);
        setFilteredLibraryFiles(response.data.pdfs);
      }
    } catch (error) {
      console.error("Error fetching PDF library:", error);
      toast.error("Failed to load PDF library");

      // Fallback to mock data if API fails (for demo purposes)
      const mockFiles = [
        {
          id: 1,
          name: "Research Paper - AI Ethics.pdf",
          size: "2.3 MB",
          uploadedAt: "2024-01-15",
          description:
            "A comprehensive analysis of ethical considerations in artificial intelligence development",
        },
        {
          id: 2,
          name: "Business Report 2024.pdf",
          size: "1.8 MB",
          uploadedAt: "2024-01-20",
          description:
            "Annual performance review and strategic outlook for 2024",
        },
        {
          id: 3,
          name: "Technical Documentation.pdf",
          size: "3.1 MB",
          uploadedAt: "2024-01-18",
          description:
            "Complete technical specifications and API documentation",
        },
        {
          id: 4,
          name: "Marketing Strategy.pdf",
          size: "1.2 MB",
          uploadedAt: "2024-01-22",
          description: "Q2 marketing initiatives and campaign planning",
        },
      ];
      setLibraryFiles(mockFiles);
      setFilteredLibraryFiles(mockFiles);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setFileSource("local");
    }
  };

  const handleLibraryFileSelect = (file) => {
    setSelectedLibraryFile(file);
    setSelectedFile(null);
    setFileSource("library");

    // Create a file object from the library file to match the expected format
    const fileObj = new File([], file.title, {
      type: "application/pdf",
      lastModified: new Date(file.uploadedAt).getTime(),
    });
    setSelectedFile(fileObj);
  };

  const generateSummary = async () => {
    if ((!selectedFile && !selectedLibraryFile) || !customPrompt.trim()) {
      alert(
        "Please select a file and provide a prompt for summary generation."
      );
      return;
    }

    setIsGenerating(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to generate summaries");
      setIsGenerating(false);
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const formData = new FormData();
    formData.append("userId", userId);

    if (fileSource === "library" && selectedLibraryFile) {
      // For library files, send the file ID instead of the file itself
      formData.append("fileId", selectedLibraryFile.id);
    } else {
      // For uploaded files, send the file
      formData.append("file", selectedFile);
    }

    formData.append("customPrompt", customPrompt);

    try {
      const res = await axios.post(
        `${API_URL}/summary/generate-summary`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        navigate(`/summary/${res.data.data._id}`, {
          state: { summary: res.data },
        });
        toast.success("Summary generated successfully");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedLibraryFile(null);
    setCustomPrompt("");
    setFileSource("local");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="logo" className="w-12 h-16 sm:w-15 sm:h-20" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Summify: Learn Smarter{" "}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            Transform your documents into concise, insightful summaries with the
            power of AI
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-6">
          {/* File Source Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 flex items-center">
              <FileText className="mr-3 text-indigo-600 h-5 w-5 sm:h-6 sm:w-6" />
              Choose Your Document
            </h2>

            {/* Source Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg sm:rounded-xl p-1 mb-4 sm:mb-6">
              <button
                onClick={() => setFileSource("local")}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  fileSource === "local"
                    ? "bg-white dark:bg-gray-900 shadow-md text-indigo-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload File
              </button>
              <button
                onClick={() => setFileSource("library")}
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md sm:rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                  fileSource === "library"
                    ? "bg-white dark:bg-gray-900 shadow-md text-indigo-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                PDF Library
              </button>
            </div>

            {/* Local Upload Section */}
            {fileSource === "local" && (
              <div className="border-2 border-dashed border-indigo-300 rounded-xl p-4 sm:p-8 text-center bg-indigo-50/50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-300">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 dark:bg-gray-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                  </div>
                  <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                    {selectedFile ? selectedFile.name : "Click to upload PDF"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    or drag and drop your file here
                  </p>
                </label>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded-lg border border-indigo-200 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Selected: {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Library Section */}
            {fileSource === "library" && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search your PDF library..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                  />
                </div>

                {isLoadingLibrary ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                    <p className="text-gray-600 dark:text-gray-300">
                      Loading your PDF library...
                    </p>
                  </div>
                ) : filteredLibraryFiles?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FolderOpen className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No PDF files found in your library</p>
                  </div>
                ) : (
                  <div>
                    <select
                      value={selectedLibraryFile?._id || ""}
                      onChange={(e) => {
                        const selected = filteredLibraryFiles.find(
                          (file) => file._id.toString() === e.target.value
                        );
                        if (selected) handleLibraryFileSelect(selected);
                      }}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                    >
                      <option value="">Select a PDF...</option>
                      {filteredLibraryFiles?.map((file) => (
                        <option key={file._id} value={file._id}>
                          {file.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prompt Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 flex items-center">
              <Sparkles className="mr-3 text-purple-600 h-5 w-5 sm:h-6 sm:w-6" />
              Customize Your Summary
            </h2>

            {/* Prompt Templates */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quick Templates:
              </p>
              <div className="flex flex-wrap gap-2">
                {promptTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setCustomPrompt(template)}
                    className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:text-indigo-700 transition-colors duration-200"
                  >
                    {template.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe how you want your summary to be generated..."
              className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
            />

            {/* Selected File Info */}
            {(selectedFile || selectedLibraryFile) && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  Selected:{" "}
                  {selectedLibraryFile
                    ? selectedLibraryFile.name
                    : selectedFile.name}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
              <button
                onClick={generateSummary}
                disabled={
                  isGenerating ||
                  (!selectedFile && !selectedLibraryFile) ||
                  !customPrompt.trim()
                }
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Generate Summary
                  </>
                )}
              </button>
              <button
                onClick={resetForm}
                className="px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 font-medium text-sm sm:text-base"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          <p>
            Powered by Gemini AI • Transform documents into actionable insights
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiSummaryHome;
