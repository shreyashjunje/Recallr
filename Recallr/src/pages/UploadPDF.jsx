import React, { useState, useRef } from "react";
import { Upload, File, Tag, ChevronDown, X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


const PDFUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);


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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    // ✅ Create FormData
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title); // ✅ Now sending title from input
    formData.append("category", selectedCategory);
    formData.append("tags", tags.join(","));

    try {
      const res = await axios.post(`${API_URL}/pdf/upload-pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload response:", res.data);
      toast.success("File uploaded successfully!");

      // ✅ Reset form
      setSelectedFile(null);
      setTitle("");
      setSelectedCategory("");
      setTags([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload file");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Upload PDF</h1>

      <form onSubmit={handleSubmit}>
        {/* ✅ Title Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter PDF title..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragging
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ cursor: "pointer" }}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <File className="w-10 h-10 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Drag & drop your PDF here
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  or click to browse files
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
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
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
              required
            >
              <option value="">Select a category...</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Structures & Algorithms">
                Data Structures & Algorithms
              </option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Tags Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => currentTag.trim() && addTag(currentTag.trim())}
              className="px-4 py-2 bg-purple-600 text-white font-medium rounded-r-md hover:bg-purple-700"
            >
              Add
            </button>
          </div>

          {/* Suggested Tags */}
          <div className="mt-3">
            <p className="text-xs text-gray-600 mb-1">Suggested Tags:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700"
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
          className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors shadow-sm"
          disabled={!selectedFile}
        >
          Upload PDF
        </button>
      </form>
    </div>
  );
};

export default PDFUploadForm;
