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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-56 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 relative">
            <div className="absolute inset-0 bg-black/20" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-6 right-6 flex space-x-3"
            >
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                // onClick={() => setIsPasswordModalOpen(true)}
                onClick={() => navigate("/reset-password")}
                className="bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 font-medium"
              >
                <Key className="w-4 h-4" />
                <span>Change Password</span>
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2 font-medium"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-8 -mt-20">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-36 h-36 bg-white rounded-2xl p-1 shadow-2xl mb-6 lg:mb-0 relative"
              >
                {/* Avatar */}
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center overflow-hidden">
                  {userData.profilePicture ? (
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>

                {/* Edit button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white p-2 rounded-lg shadow-lg"
                  onClick={() => setShowFileInput((prev) => !prev)}
                >
                  <Edit className="w-4 h-4" />
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
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-sm rounded-xl">
                    Uploading...
                  </div>
                )}
              </motion.div>
              );
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {userData.userName}
                    </h1>
                    <p className="text-lg text-white font-medium mb-2 ">
                      @{userData.userName}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{userData.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {formatDate(userData.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      ● Active
                    </div>
                    {userData.telegramChatId && (
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Telegram Connected
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 max-w-3xl leading-relaxed">
                  Welcome to your dashboard! Manage your PDFs, take quizzes, and
                  track your learning progress. Your account is connected and
                  ready to help you achieve your learning goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Tabs */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative py-3 px-1 font-medium text-sm transition-colors duration-200 ${
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
                  <div className="space-y-8">
                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Quick Actions
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setIsEditModalOpen(true)}
                          className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-xl p-6 border border-indigo-100 text-left hover:shadow-lg transition-all duration-200"
                        >
                          <Edit className="w-8 h-8 text-indigo-600 mb-3" />
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Edit Profile
                          </h4>
                          <p className="text-sm text-gray-600">
                            Update your personal information
                          </p>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          // onClick={() => setIsPasswordModalOpen(true)}
                          onClick={() => navigate("/reset-password")}
                          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 text-left hover:shadow-lg transition-all duration-200"
                        >
                          <Key className="w-8 h-8 text-green-600 mb-3" />
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Change Password
                          </h4>
                          <p className="text-sm text-gray-600">
                            Update your account security
                          </p>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 text-left hover:shadow-lg transition-all duration-200"
                        >
                          <MessageSquare className="w-8 h-8 text-purple-600 mb-3" />
                          <h4 className="font-semibold text-gray-900 mb-1">
                            Telegram Settings
                          </h4>
                          <p className="text-sm text-gray-600">
                            Manage Telegram integration
                          </p>
                        </motion.button>
                      </div>
                    </div>

                    {/* Account Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Account Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                {userData.pdfs?.length}
                              </p>
                              <p className="text-sm text-gray-600">
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
                          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                              <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                {userData.favouritePdfs?.length}
                              </p>
                              <p className="text-sm text-gray-600">
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
                          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                {userData.attempts?.length}
                              </p>
                              <p className="text-sm text-gray-600">
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
                          className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                              <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-gray-900">
                                {userData.quizzes?.length}
                              </p>
                              <p className="text-sm text-gray-600">
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Activity
                    </h3>
                    {userData.pdfs.length === 0 &&
                    userData.attempts.length === 0 &&
                    userData.quizzes.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Activity Yet
                        </h3>
                        <p className="text-gray-500">
                          Start uploading PDFs or taking quizzes to see your
                          activity here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  Account created
                                </p>
                                <p className="text-sm text-gray-500">
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
                          className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  Profile last updated
                                </p>
                                <p className="text-sm text-gray-500">
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Favourite PDFs
                    </h3>
                    {userData.favouritePdfs.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Favourites Yet
                        </h3>
                        <p className="text-gray-500">
                          Start marking PDFs as favourites to see them here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userData.favouritePdfs.map((pdfId, index) => (
                          <motion.div
                            key={pdfId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100 hover:shadow-lg transition-all duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  Favourite PDF
                                </p>
                                <p className="text-sm text-gray-600">
                                  PDF ID: {pdfId}
                                </p>
                              </div>
                              <Heart className="w-5 h-5 text-pink-500 fill-current" />
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
          <div className="xl:col-span-1 space-y-6">
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Your Stats
              </h3>
              <div className="space-y-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-4 border border-gray-100 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                          <p className="text-sm text-gray-600">{stat.label}</p>
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
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Integrations
              </h3>
              <div className="space-y-3">
                <div
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    userData.telegramChatId
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare
                      className={`w-5 h-5 ${
                        userData.telegramChatId
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="font-medium text-gray-900">Telegram</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
