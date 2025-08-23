import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  Send,
  Download,
  Copy,
  RefreshCw,
  BookOpen,
  File,
  Zap,
  Brain,
} from "lucide-react";
import logo from "../../assets/logoR.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const API_URL = import.meta.env.VITE_API_URL;

const AiSummaryHome = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSource, setFileSource] = useState("local");
  const [libraryFiles] = useState([
    {
      id: 1,
      name: "Research Paper - AI Ethics.pdf",
      size: "2.3 MB",
      date: "2024-01-15",
    },
    {
      id: 2,
      name: "Business Report 2024.pdf",
      size: "1.8 MB",
      date: "2024-01-20",
    },
    {
      id: 3,
      name: "Technical Documentation.pdf",
      size: "3.1 MB",
      date: "2024-01-18",
    },
    {
      id: 4,
      name: "Marketing Strategy.pdf",
      size: "1.2 MB",
      date: "2024-01-22",
    },
  ]);
  const [selectedLibraryFile, setSelectedLibraryFile] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const fileInputRef = useRef(null);
  const navigate=useNavigate();

  const promptTemplates = [
    "Create a concise summary highlighting the main points and key takeaways",
    "Generate an executive summary focusing on critical insights and recommendations",
    "Provide a detailed summary with bullet points for easy reading",
    "Create a brief overview suitable for quick reference",
    "Summarize with emphasis on actionable items and next steps",
  ];

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
  };

  const generateSummary = async () => {
    if ((!selectedFile && !selectedLibraryFile) || !customPrompt.trim()) {
      alert(
        "Please select a file and provide a prompt for summary generation."
      );
      return;
    }

    console.log("selected file, ", selectedFile);
    console.log("customPrompt:  ", customPrompt);

    setIsGenerating(true);

   
    const token = localStorage.getItem("token");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("file", selectedFile);
    formData.append("customPrompt", customPrompt);

    const res = await axios.post(
      `${API_URL}/summary/generate-summary`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("id:",res.data.data._id)

    if(res.status==200){
      navigate(`/summary/${res.data.data._id}`,{state :{summary:res.data}})
      toast.success("summary generated successfully")
    }

    console.log("res:", res.data);

    setIsGenerating(false);
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
    alert("Summary copied to clipboard!");
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document-summary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedLibraryFile(null);
    setCustomPrompt("");
    setSummary("");
    setShowSummary(false);
    setFileSource("local");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            {/* <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <Brain className="h-8 w-8 text-white" />
            </div> */}
            <img src={logo} alt="logo" className="w-15 h-20" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Summify: Learn Smarter{" "}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transform your documents into concise, insightful summaries with the
            power of AI
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* File Source Selection */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-3 text-indigo-600" />
                Choose Your Document
              </h2>

              {/* Source Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  onClick={() => setFileSource("local")}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    fileSource === "local"
                      ? "bg-white shadow-md text-indigo-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload File
                </button>
                <button
                  onClick={() => setFileSource("library")}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    fileSource === "library"
                      ? "bg-white shadow-md text-indigo-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  PDF Library
                </button>
              </div>

              {/* Local Upload Section */}
              {fileSource === "local" && (
                <div className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center bg-indigo-50/50 hover:bg-indigo-50 transition-colors duration-300">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-indigo-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {selectedFile ? selectedFile.name : "Click to upload PDF"}
                    </p>
                    <p className="text-gray-500">
                      or drag and drop your file here
                    </p>
                  </label>
                  {selectedFile && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
                      <p className="text-sm text-gray-600">
                        Selected: {selectedFile.name} (
                        {(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Library Section */}
              {fileSource === "library" && (
                <div className="space-y-3">
                  {libraryFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => handleLibraryFileSelect(file)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedLibraryFile?.id === file.id
                          ? "border-indigo-500 bg-indigo-50 shadow-md"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <File className="w-5 h-5 text-red-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-800">
                              {file.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {file.size} • {file.date}
                            </p>
                          </div>
                        </div>
                        {selectedLibraryFile?.id === file.id && (
                          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prompt Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Sparkles className="mr-3 text-purple-600" />
                Customize Your Summary
              </h2>

              {/* Prompt Templates */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Quick Templates:
                </p>
                <div className="flex flex-wrap gap-2">
                  {promptTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setCustomPrompt(template)}
                      className="text-xs px-3 py-2 bg-gray-100 hover:bg-indigo-100 rounded-lg text-gray-700 hover:text-indigo-700 transition-colors duration-200"
                    >
                      {template.substring(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Describe how you want your summary to be generated. Be specific about style, length, focus areas, or format preferences..."
                className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={generateSummary}
                  disabled={
                    isGenerating ||
                    (!selectedFile && !selectedLibraryFile) ||
                    !customPrompt.trim()
                  }
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Generate Summary
                    </>
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 min-h-96">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Send className="mr-3 text-green-600" />
                  Generated Summary
                </h2>
                {summary && (
                  <div className="flex gap-2">
                    <button
                      onClick={copySummary}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={downloadSummary}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="Download summary"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {!summary && !isGenerating && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium mb-2">Ready to Generate</p>
                  <p className="text-center">
                    Select a document and provide instructions to get started
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <RefreshCw className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Processing Your Document
                  </p>
                  <p className="text-gray-500 text-center">
                    AI is analyzing and generating your summary...
                  </p>
                </div>
              )}

              {summary && showSummary && (
                <div className="prose max-w-none">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-l-4 border-green-500">
                    <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                      {summary}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>
            Powered by Gemini AI • Transform documents into actionable insights
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiSummaryHome;
