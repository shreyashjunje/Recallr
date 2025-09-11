import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  File,
  ChevronDown,
  X,
  Tag,
  Plus,
  Send,
  CloudUpload,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = import.meta.env.VITE_API_URL;

const PDFUploadModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);


    // const [selectedFile, setSelectedFile] = useState(null);
    // const [title, setTitle] = useState("");
    // const [selectedCategory, setSelectedCategory] = useState("");
    // const [tags, setTags] = useState([]);
    // const [currentTag, setCurrentTag] = useState("");
    // const [isDragging, setIsDragging] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
  // const fileInputRef = useRef(null);
  const [customCategory, setCustomCategory] = useState("");

  const suggestedTags = [
    "React",
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "HTML",
    "CSS",
    "Node.js",
  ];

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const res = await axios.get(`${API_URL}/pdf/get-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("categoriesss:", res.data.data);
      if (res.status == 200) {
        setCategories(res.data.data);
        toast.success("categories fetched successfully");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file.type !== "application/pdf") {
      alert("Please upload only PDF files");
      return;
    }
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setCurrentTag("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!selectedFile) {
  //     toast.error("Please select a file to upload");
  //     return;
  //   }

  //   if (!title.trim()) {
  //     toast.error("Please enter a title");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", selectedFile);
  //   formData.append("title", title);
  //   formData.append("category", selectedCategory);
  //   formData.append("tags", tags.join(","));

  //   try {
  //     const res = await axios.post(`${API_URL}/pdf/upload-pdf`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     console.log("Upload response:", res.data);
  //     toast.success("File uploaded successfully!");

  //     // Reset form and close modal
  //     setSelectedFile(null);
  //     setTitle("");
  //     setSelectedCategory("");
  //     setTags([]);
  //     if (fileInputRef.current) {
  //       fileInputRef.current.value = "";
  //     }
  //     onClose();
  //   } catch (err) {
  //     console.error("Upload error:", err);
  //     toast.error("Failed to upload file");
  //   }
  // };

    const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting PDF upload...");

    const token = localStorage.getItem("token");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const userID = decodedToken.id;

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);
    // formData.append("category", selectedCategory);
    formData.append(
      "category",
      selectedCategory === "Other" ? customCategory : selectedCategory
    );

    formData.append("tags", tags.join(","));
    formData.append("userID", userID);

    try {
      const response = await axios.post(`${API_URL}/pdf/upload-pdf`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const result = response.data;
      console.log("Upload response:", result);
      toast.success("File uploaded successfully!");

      // Reset form
      setSelectedFile(null);
      setTitle("");
      setSelectedCategory("");
      setTags([]);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Upload PDF</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                  isDragging
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 p-3 rounded-full mb-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-purple-100 p-3 rounded-full inline-flex mb-4">
                      <CloudUpload className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Drag & drop your PDF here
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      or click to browse files
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Select File
                    </button>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Supports single PDF file up to 50MB
              </p>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-right">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              {/* <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    required
                  >
                    <option value="">Select a category...</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div> */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (e.target.value !== "Other") {
                      setCustomCategory(""); // reset if not "Other"
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl 
               focus:ring-2 focus:ring-purple-500 focus:border-transparent 
               appearance-none bg-white cursor-pointer"
                  required
                >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {selectedCategory === "Other" && (
                <div className="mt-3">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter your custom category..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              )}
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-purple-600 hover:text-purple-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && currentTag.trim()) {
                        e.preventDefault();
                        addTag(currentTag.trim());
                      }
                    }}
                    placeholder="Type tag and press Enter..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => currentTag.trim() && addTag(currentTag.trim())}
                  className="px-4 bg-purple-600 text-white font-medium rounded-r-xl hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Suggested Tags */}
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Suggested Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Uploading... ({uploadProgress}%)
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Upload PDF
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PDFUploadModal;
