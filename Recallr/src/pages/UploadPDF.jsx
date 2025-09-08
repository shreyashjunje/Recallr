// import React, { useState, useRef } from "react";
// import {
//   Upload,
//   File,
//   Tag,
//   ChevronDown,
//   X,
//   Bot,
//   MessageCircle,
//   Zap,
//   Shield,
//   ArrowRight,
// } from "lucide-react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import PageHeader from "@/components/helper/PageHeader";
// // Simple toast notification system

// const showToast = (message, type = "info") => {
//   const toast = document.createElement("div");
//   toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 transition-all duration-300 ${
//     type === "success"
//       ? "bg-green-500"
//       : type === "error"
//       ? "bg-red-500"
//       : "bg-blue-500"
//   }`;
//   toast.textContent = message;
//   document.body.appendChild(toast);

//   // Animate in
//   setTimeout(() => (toast.style.transform = "translateX(0)"), 10);

//   // Remove after 3 seconds
//   setTimeout(() => {
//     toast.style.transform = "translateX(100%)";
//     setTimeout(() => document.body.removeChild(toast), 300);
//   }, 3000);
// };

// const toast = {
//   success: (msg) => showToast(msg, "success"),
//   error: (msg) => showToast(msg, "error"),
//   info: (msg) => showToast(msg, "info"),
// };

// const API_URL = import.meta.env.VITE_API_URL;

// const PDFUploadForm = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [title, setTitle] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [tags, setTags] = useState([]);
//   const [currentTag, setCurrentTag] = useState("");
//   const [isDragging, setIsDragging] = useState(false);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const fileInputRef = useRef(null);

//   const suggestedTags = [
//     "React",
//     "JavaScript",
//     "Python",
//     "Java",
//     "C++",
//     "HTML",
//     "CSS",
//     "Node.js",
//   ];

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const files = e.dataTransfer.files;
//     if (files.length > 0) {
//       handleFileSelect(files[0]);
//     }
//   };

//   const handleFileInput = (e) => {
//     if (e.target.files.length > 0) {
//       handleFileSelect(e.target.files[0]);
//     }
//   };

//   const handleFileSelect = (file) => {
//     if (!file) return;

//     const isPDF =
//       file.type === "application/pdf" ||
//       file.type === "application/x-pdf" ||
//       file.name.toLowerCase().endsWith(".pdf");

//     if (!isPDF) {
//       toast.error("Please upload only PDF files");
//       return;
//     }

//     setSelectedFile(file);
//   };

//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const addTag = (tag) => {
//     if (!tags.includes(tag)) {
//       setTags([...tags, tag]);
//     }
//     setCurrentTag("");
//   };

//   const removeTag = (tagToRemove) => {
//     setTags(tags.filter((tag) => tag !== tagToRemove));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submitting PDF upload...");

//     // alert("Submitting PDF upload...");

//     const token = localStorage.getItem("token");
//     if (!token) return;
//     console.log("token::::", token);

//     const decodedToken = jwtDecode(token);
//     const userID = decodedToken.id;

//     if (!selectedFile) {
//       toast.error("Please select a file to upload");
//       return;
//     }

//     if (!title.trim()) {
//       toast.error("Please enter a title");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     formData.append("title", title);
//     formData.append("category", selectedCategory);
//     formData.append("tags", tags.join(","));
//     formData.append("userID", userID); // add userID in body

//     try {
//       // Using fetch instead of axios
//       const response = await axios.post(`${API_URL}/pdf/upload-pdf`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const result = response.data;
//       console.log("Upload response:", result);
//       toast.success("File uploaded successfully!");

//       // Reset form
//       setSelectedFile(null);
//       setTitle("");
//       setSelectedCategory("");
//       setTags([]);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//     } catch (err) {
//       console.error("Upload error:", err);
//       toast.error("Failed to upload file");
//     }
//   };

//   const handleTelegramConnect = async () => {
//     setIsConnecting(true);
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     const decodedToken = jwtDecode(token);
//     const userID = decodedToken.id;
//     try {
//       // Call your backend endpoint to get the Telegram link
//       // const response = await fetch(`${API_URL}/bot/link`, {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       //   // Include any necessary authentication headers if needed
//       // });

//       const response = await axios.post(
//         `${API_URL}/bot/link`,
//         { userID }, // request body
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // if (!response.ok) {
//       //   throw new Error(`HTTP error! status: ${response.status}`);
//       // }

//       const data = response.data;
//       console.log("Telegram link response:", data);

//       if (!data.link) {
//         throw new Error("No link returned from server");
//       }

//       // Open the Telegram link in a new tab
//       window.open(data.link, "_blank");

//       toast.success("Redirecting to Telegram bot...");
//     } catch (error) {
//       console.error("Error connecting to Telegram:", error);
//       toast.error("Failed to connect to Telegram bot");
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Upload Your PDFs
//           </h1>
//           <p className="text-gray-600">
//             Choose between web upload or connect with our Telegram bot for easy
//             mobile uploads
//           </p>
//         </div> */}
//         <PageHeader />

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Web Upload Form */}
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center mb-4">
//               <Upload className="w-6 h-6 text-purple-600 mr-2" />
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Web Upload
//               </h2>
//             </div>

//             <form onSubmit={handleSubmit}>
//               {/* Title Input */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Enter PDF title..."
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   required
//                 />
//               </div>

//               {/* File Upload */}
//               <div className="mb-6">
//                 <div
//                   className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
//                     isDragging
//                       ? "border-purple-500 bg-purple-50"
//                       : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
//                   }`}
//                   onDragOver={handleDragOver}
//                   onDragLeave={handleDragLeave}
//                   onDrop={handleDrop}
//                   onClick={() => fileInputRef.current?.click()}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {selectedFile ? (
//                     <div className="flex flex-col items-center">
//                       <File className="w-10 h-10 text-purple-600 mb-2" />
//                       <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
//                         {selectedFile.name}
//                       </p>
//                       <p className="text-xs text-gray-500 mb-3">
//                         {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
//                       </p>
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleRemoveFile();
//                         }}
//                         className="text-sm text-red-600 hover:text-red-800"
//                       >
//                         Remove file
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <Upload className="w-10 h-10 text-purple-600 mx-auto mb-3" />
//                       <p className="text-sm font-medium text-gray-900 mb-1">
//                         Drag & drop your PDF here
//                       </p>
//                       <p className="text-xs text-gray-500 mb-3">
//                         or click to browse files
//                       </p>
//                       <button
//                         type="button"
//                         className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           fileInputRef.current?.click();
//                         }}
//                       >
//                         Select File
//                       </button>
//                     </>
//                   )}

//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept=".pdf"
//                     onChange={handleFileInput}
//                     className="hidden"
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">
//                   Supports single PDF file up to 50MB
//                 </p>
//               </div>

//               {/* Category Selection */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
//                     required
//                   >
//                     <option value="">Select a category...</option>
//                     <option value="Web Development">Web Development</option>
//                     <option value="Data Structures & Algorithms">
//                       Data Structures & Algorithms
//                     </option>
//                     <option value="Cloud Computing">Cloud Computing</option>
//                     <option value="Machine Learning">Machine Learning</option>
//                     <option value="Other">Other</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>

//               {/* Tags Input */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Tags
//                 </label>
//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {tags.map((tag) => (
//                     <div
//                       key={tag}
//                       className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
//                     >
//                       {tag}
//                       <button
//                         type="button"
//                         onClick={() => removeTag(tag)}
//                         className="ml-1 text-gray-500 hover:text-gray-700"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex">
//                   <input
//                     type="text"
//                     value={currentTag}
//                     onChange={(e) => setCurrentTag(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter" && currentTag.trim()) {
//                         e.preventDefault();
//                         addTag(currentTag.trim());
//                       }
//                     }}
//                     placeholder="Type tag and press Enter..."
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   />
//                   <button
//                     type="button"
//                     onClick={() =>
//                       currentTag.trim() && addTag(currentTag.trim())
//                     }
//                     className="px-4 py-2 bg-purple-600 text-white font-medium rounded-r-md hover:bg-purple-700"
//                   >
//                     Add
//                   </button>
//                 </div>

//                 {/* Suggested Tags */}
//                 <div className="mt-3">
//                   <p className="text-xs text-gray-600 mb-1">Suggested Tags:</p>
//                   <div className="flex flex-wrap gap-2">
//                     {suggestedTags.map((tag) => (
//                       <button
//                         key={tag}
//                         type="button"
//                         onClick={() => addTag(tag)}
//                         className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-purple-100 hover:text-purple-700"
//                       >
//                         {tag}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors shadow-sm"
//                 disabled={!selectedFile}
//               >
//                 Upload PDF
//               </button>
//             </form>
//           </div>

//           {/* Telegram Bot Section */}
//           <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
//             <div className="flex items-center mb-4">
//               <Bot className="w-6 h-6 text-blue-600 mr-2" />
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Upload via Telegram Bot
//               </h2>
//             </div>

//             <div className="mb-6">
//               <p className="text-gray-600 mb-4">
//                 Connect with our Telegram bot for a seamless mobile upload
//                 experience. Send PDFs directly from your phone!
//               </p>

//               {/* Features */}
//               <div className="space-y-3 mb-6">
//                 <div className="flex items-start space-x-3">
//                   <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="font-medium text-gray-900">Instant Upload</p>
//                     <p className="text-sm text-gray-600">
//                       Send PDFs directly from your mobile device
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="font-medium text-gray-900">Chat Interface</p>
//                     <p className="text-sm text-gray-600">
//                       Easy commands and interactive responses
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start space-x-3">
//                   <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                   <div>
//                     <p className="font-medium text-gray-900">
//                       Secure Connection
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Your account is safely linked and protected
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* How it works */}
//               <div className="bg-white rounded-lg p-4 mb-6">
//                 <h3 className="font-semibold text-gray-900 mb-3">
//                   How it works:
//                 </h3>
//                 <div className="space-y-2 text-sm text-gray-600">
//                   <div className="flex items-center space-x-2">
//                     <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
//                       1
//                     </div>
//                     <span>Click "Connect with Bot" below</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
//                       2
//                     </div>
//                     <span>Start conversation with our Telegram bot</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
//                       3
//                     </div>
//                     <span>Your account gets linked automatically</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
//                       4
//                     </div>
//                     <span>Send any PDF and it's instantly uploaded!</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Connect Button */}
//               <button
//                 onClick={handleTelegramConnect}
//                 disabled={isConnecting}
//                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md disabled:opacity-50"
//               >
//                 {isConnecting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
//                     <span>Connecting...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Bot className="w-5 h-5" />
//                     <span>Connect with Telegram Bot</span>
//                     <ArrowRight className="w-4 h-4" />
//                   </>
//                 )}
//               </button>

//               {/* Additional Info */}
//               <div className="mt-4 p-3 bg-blue-100 rounded-lg">
//                 <p className="text-xs text-blue-800">
//                   <strong>Note:</strong> Once connected, you can upload PDFs by
//                   simply sending them to the bot. The bot will automatically
//                   categorize and tag your documents based on content.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PDFUploadForm;
///////////////////////////////////////////////////////////////////////////////////////////////////////////
import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  File,
  Tag,
  ChevronDown,
  X,
  Bot,
  MessageCircle,
  Zap,
  Shield,
  ArrowRight,
  Plus,
  Sparkles,
  BookOpen,
  Send,
  CheckCircle,
  CloudUpload,
} from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PageHeader from "@/components/helper/PageHeader";
import { toast } from "react-toastify";

// Simple toast notification system
const showToast = (message, type = "info") => {
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 transition-all duration-300 transform translate-x-full ${
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500"
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => (toast.style.transform = "translateX(0)"), 10);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};

// const toast = {
//   success: (msg) => showToast(msg, "success"),
//   error: (msg) => showToast(msg, "error"),
//   info: (msg) => showToast(msg, "info"),
// };

const API_URL = import.meta.env.VITE_API_URL;

const PDFUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);
  const [customCategory, setCustomCategory] = useState("");

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

  // const categories = [
  //   "Web Development",
  //   "Data Structures & Algorithms",
  //   "Cloud Computing",
  //   "Machine Learning",
  //   "Other"
  // ];

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
    if (!file) return;

    const isPDF =
      file.type === "application/pdf" ||
      file.type === "application/x-pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      toast.error("Please upload only PDF files");
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

  const handleTelegramConnect = async () => {
    setIsConnecting(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const userID = decodedToken.id;
    try {
      const response = await axios.post(
        `${API_URL}/bot/link`,
        { userID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log("Telegram link response:", data);

      if (!data.link) {
        throw new Error("No link returned from server");
      }

      // Open the Telegram link in a new tab
      window.open(data.link, "_blank");

      toast.success("Redirecting to Telegram bot...");
    } catch (error) {
      console.error("Error connecting to Telegram:", error);
      toast.error("Failed to connect to Telegram bot");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <PageHeader />

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Web Upload Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex-1">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-3">
                Web Upload
              </h2>
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
                    onClick={() =>
                      currentTag.trim() && addTag(currentTag.trim())
                    }
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

          {/* Telegram Bot Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200 p-8 flex-1">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-3">
                Telegram Upload
              </h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-6 text-lg">
                Connect with our Telegram bot for a seamless mobile upload
                experience. Send PDFs directly from your phone!
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Instant Upload
                    </p>
                    <p className="text-sm text-gray-600">
                      Send PDFs directly from your mobile device
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Chat Interface
                    </p>
                    <p className="text-sm text-gray-600">
                      Easy commands and interactive responses
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Secure Connection
                    </p>
                    <p className="text-sm text-gray-600">
                      Your account is safely linked and protected
                    </p>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-white rounded-xl p-5 mb-8 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                  How it works:
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      1
                    </div>
                    <span>Click "Connect with Bot" below</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      2
                    </div>
                    <span>Start conversation with our Telegram bot</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      3
                    </div>
                    <span>Your account gets linked automatically</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      4
                    </div>
                    <span>Send any PDF and it's instantly uploaded!</span>
                  </div>
                </div>
              </div>

              {/* Connect Button */}
              <button
                onClick={handleTelegramConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-5 h-5" />
                    <span>Connect with Telegram Bot</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Additional Info */}
              <div className="mt-5 p-4 bg-blue-100 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Once connected, you can upload PDFs by
                  simply sending them to the bot. The bot will automatically
                  categorize and tag your documents based on content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFUploadForm;
