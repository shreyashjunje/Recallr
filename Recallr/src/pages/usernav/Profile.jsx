import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  MapPin,
  Calendar,
  Trophy,
  Target,
  BookOpen,
  Star,
  Phone,
  Mail,
  User,
  Key,
  Shield,
  Globe,
  Briefcase,
  GraduationCap,
  Heart,
  Clock,
  Languages,
  MessageSquare,
  FileText,
  Hash,
} from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState({});
  const [showFileInput, setShowFileInput] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile); // preview
    setUploading(true);

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const res = await axios.put(
        `${API_URL}/user/update-profile-picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        console.log("Profile updated:", data.user);
      } else {
        console.error("Upload failed:", data.message);
      }
    } catch (err) {
      console.error("Error uploading:", err);
    } finally {
      setUploading(false);
    }
  };

  // Sample user data based on your backend structure
  // const userData = {
  //   _id: "68a16a8d36f7038f06532887",
  //   userName: "shreyash_junje",
  //   email: "shreyashjunje@gmail.com",
  //   phoneNumber: "9022478008",
  //   telegramChatId: "1412911125",
  //   telegramLinkToken: null,
  //   createdAt: "2025-08-17T05:37:17.941Z",
  //   updatedAt: "2025-09-02T18:08:10.418Z",
  //   pdfs: [],
  //   attempts: [],
  //   quizzes: [],
  //   favouritePdfs: ["68b2da52a5ac32fbc6b4324f"],
  // };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/user/full-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setUserData(res.data.data);
        console.log("user in the profile::", res.data.data);
        console.log("profile pictire::", res.data.data.profilePicture);
        toast.success("user fetched successfully");
      }
    } catch (err) {
      console.log("Error:", err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity" },
    { id: "saved", label: "Saved Items" },
  ];

  const stats = [
    {
      icon: FileText,
      label: "PDFs Uploaded",
      value: userData.pdfs?.length.toString(),
    },
    {
      icon: BookOpen,
      label: "Quiz Attempts",
      value: userData.attempts?.length.toString(),
    },
    {
      icon: Trophy,
      label: "Quizzes Created",
      value: userData.quizzes?.length.toString(),
    },
    {
      icon: Heart,
      label: "Favourite PDFs",
      value: userData.favouritePdfs?.length.toString(),
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeSince = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const personalInfo = [
    {
      icon: User,
      label: "Full Name",
      value: userData.userName,
      editable: true,
    },
    {
      icon: User,
      label: "Username",
      value: `@${userData.userName}`,
      editable: true,
    },
    {
      icon: Mail,
      label: "Email Address",
      value: userData.email,
      editable: true,
    },
    {
      icon: Phone,
      label: "Phone Number",
      value: `+91 ${userData.phoneNumber}`,
      editable: true,
    },
    { icon: Hash, label: "User ID", value: userData._id, editable: false },
    {
      icon: MessageSquare,
      label: "Telegram Chat ID",
      value: userData.telegramChatId || "Not Connected",
      editable: false,
    },
  ];

  const accountInfo = [
    {
      icon: Calendar,
      label: "Member Since",
      value: formatDate(userData.createdAt),
      editable: false,
    },
    {
      icon: Clock,
      label: "Last Updated",
      value: getTimeSince(userData.updatedAt),
      editable: false,
    },
    { icon: Shield, label: "Account Status", value: "Active", editable: false },
    {
      icon: MessageSquare,
      label: "Telegram Status",
      value: userData.telegramChatId ? "Connected" : "Not Connected",
      editable: false,
    },
    {
      icon: Key,
      label: "Link Token",
      value: userData.telegramLinkToken || "Not Generated",
      editable: false,
    },
    {
      icon: Globe,
      label: "Account Type",
      value: "Standard Member",
      editable: false,
    },
  ];

  const InfoSection = ({ title, items, bgColor }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bgColor} rounded-2xl shadow-xl border border-white/20 p-6`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((info, index) => {
          const Icon = info.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-white/20 hover:bg-white/40 transition-all duration-200"
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {info.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {info.value}
                  </p>
                </div>
              </div>
              {info.editable && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-gray-400 hover:text-indigo-600 transition-colors duration-200 p-2 rounded-lg hover:bg-white/20"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  return (
 <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-6 md:space-y-8"
  >
    {/* Header Section */}
    <div className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-white/20 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-40 sm:h-48 md:h-56 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 relative">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col sm:flex-row gap-2 sm:gap-3"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/reset-password")}
            className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-lg md:rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-xs sm:text-sm"
          >
            <Key className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Change Password</span>
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditModalOpen(true)}
            className="bg-white/20 backdrop-blur-sm text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-lg md:rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-xs sm:text-sm"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Edit Profile</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Profile Info */}
      <div className="relative px-4 sm:px-6 md:px-8 pb-6 md:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6 -mt-16 md:-mt-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-white rounded-xl md:rounded-2xl p-1 shadow-xl md:shadow-2xl mb-4 lg:mb-0 relative mx-auto lg:mx-0"
          >
            {/* Avatar */}
            <div className="w-full h-full rounded-lg md:rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center overflow-hidden">
              {userData.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-lg md:rounded-xl"
                />
              ) : (
                <User className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
              )}
            </div>

            {/* Edit button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white p-1.5 sm:p-2 rounded-md md:rounded-lg shadow-md md:shadow-lg"
              onClick={() => setShowFileInput((prev) => !prev)}
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>

            {/* Hidden File Input */}
            {showFileInput && (
              <input
                type="file"
                accept="image/*"
                className="absolute bottom-0 right-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handleFileChange}
                disabled={uploading}
              />
            )}

            {/* Uploading Loader */}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-xs sm:text-sm rounded-lg md:rounded-xl">
                Uploading...
              </div>
            )}
          </motion.div>
          
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {userData.userName}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 font-medium mb-2">
                  @{userData.userName}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                  <div className="flex items-center justify-center lg:justify-start space-x-1">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{userData.email}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Joined {formatDate(userData.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2 mt-4 sm:mt-0">
                <div className="bg-green-100 text-green-800 px-2 py-1 text-xs sm:text-sm rounded-full font-medium">
                  ● Active
                </div>
                {userData.telegramChatId && (
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 text-xs sm:text-sm rounded-full font-medium">
                    Telegram Connected
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to your dashboard! Manage your PDFs, take quizzes, and
              track your learning progress. Your account is connected and
              ready to help you achieve your learning goals.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
      {/* Main Content */}
      <div className="xl:col-span-3 space-y-6 md:space-y-8">
        {/* Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-white/20 p-4 sm:p-5 md:p-6">
          <div className="border-b border-gray-200 mb-4 md:mb-6 overflow-x-auto">
            <nav className="flex space-x-4 md:space-x-8 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-2 md:py-3 px-1 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && (
              <div className="space-y-6 md:space-y-8">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditModalOpen(true)}
                      className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-indigo-100 text-left hover:shadow-lg transition-all duration-200"
                    >
                      <Edit className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-indigo-600 mb-2 md:mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                        Edit Profile
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Update your personal information
                      </p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/reset-password")}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-green-100 text-left hover:shadow-lg transition-all duration-200"
                    >
                      <Key className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600 mb-2 md:mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                        Change Password
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Update your account security
                      </p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-purple-100 text-left hover:shadow-lg transition-all duration-200"
                    >
                      <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600 mb-2 md:mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                        Telegram Settings
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Manage Telegram integration
                      </p>
                    </motion.button>
                  </div>
                </div>

                {/* Account Summary */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                    Account Summary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-blue-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {userData.pdfs?.length}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            PDFs Uploaded
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-green-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {userData.favouritePdfs?.length}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Favourite PDFs
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-purple-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {userData.attempts?.length}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Quiz Attempts
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-orange-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {userData.quizzes?.length}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Quizzes Created
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                  Recent Activity
                </h3>
                {userData.pdfs.length === 0 &&
                userData.attempts.length === 0 &&
                userData.quizzes.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      No Activity Yet
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Start uploading PDFs or taking quizzes to see your
                      activity here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50/50 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">
                              Account created
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {getTimeSince(userData.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gray-50/50 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">
                              Profile last updated
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              {getTimeSince(userData.updatedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                  Favourite PDFs
                </h3>
                {userData.favouritePdfs.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <Heart className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      No Favourites Yet
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Start marking PDFs as favourites to see them here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {userData.favouritePdfs.map((pdfId, index) => (
                      <motion.div
                        key={pdfId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-pink-100 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                              Favourite PDF
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              PDF ID: {pdfId}
                            </p>
                          </div>
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 fill-current" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="xl:col-span-1 space-y-4 md:space-y-6">
        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-white/20 p-4 md:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 md:mb-6">
            Your Stats
          </h3>
          <div className="space-y-3 md:space-y-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-100 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-white/20 p-4 md:p-6"
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
            Integrations
          </h3>
          <div className="space-y-2 md:space-y-3">
            <div
              className={`flex items-center justify-between p-2 md:p-3 rounded-lg md:rounded-xl ${
                userData.telegramChatId
                  ? "bg-green-50 border border-green-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <MessageSquare
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    userData.telegramChatId
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span className="font-medium text-gray-900 text-sm sm:text-base">Telegram</span>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userData.telegramChatId
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {userData.telegramChatId ? "Connected" : "Not Connected"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Information Sections */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      <InfoSection
        title="Personal Information"
        items={personalInfo}
        bgColor="bg-white/70 backdrop-blur-sm"
      />
      <InfoSection
        title="Account Information"
        items={accountInfo}
        bgColor="bg-white/70 backdrop-blur-sm"
      />
    </div>
  </motion.div>

  <EditProfileModal
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    userData={userData}
  />

  <ChangePasswordModal
    isOpen={isPasswordModalOpen}
    onClose={() => setIsPasswordModalOpen(false)}
  />
</div>
  );
};

export default ProfilePage;
