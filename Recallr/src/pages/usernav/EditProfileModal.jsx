import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Briefcase, // Added missing imports
} from "lucide-react";

// interface EditProfileModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

const EditProfileModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "Sarah Johnson",
    username: "sarah_dev",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate full-stack developer with a love for creating beautiful, functional web experiences. Always learning and exploring new technologies to build innovative solutions.",
    location: "San Francisco, CA",
    website: "www.sarahdev.com",
    company: "Tech Innovations Inc.",
    jobTitle: "Senior Full Stack Developer",
    timezone: "Pacific Standard Time (PST)",
    dateOfBirth: "1992-08-15",
    gender: "female",
    emergencyContact: "John Johnson - +1 (555) 987-6543",
    skills: "React, TypeScript, Node.js, Python, AWS",
    education: "BS Computer Science, Stanford University",
    experience: "5+ Years",
    languages: "English (Native), Spanish (Fluent), French (Intermediate)",
    linkedIn: "linkedin.com/in/sarahjohnson",
    github: "github.com/sarah-dev",
    twitter: "@sarah_codes",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    // Show success toast
    if (window.showToast) {
      window.showToast("Profile updated successfully!", "success");
    }

    onClose();
  };

  const formFields = [
    {
      key: "name",
      label: "Full Name",
      icon: User,
      type: "text",
      required: true,
    },
    {
      key: "username",
      label: "Username",
      icon: User,
      type: "text",
      required: true,
    },
    {
      key: "email",
      label: "Email Address",
      icon: Mail,
      type: "email",
      required: true,
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      type: "tel",
      required: false,
    },
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      type: "text",
      required: false,
    },
    {
      key: "website",
      label: "Website",
      icon: Globe,
      type: "url",
      required: false,
    },
    {
      key: "company",
      label: "Company",
      icon: User,
      type: "text",
      required: false,
    },
    {
      key: "jobTitle",
      label: "Job Title",
      icon: User,
      type: "text",
      required: false,
    },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      icon: Calendar,
      type: "date",
      required: false,
    },
    {
      key: "emergencyContact",
      label: "Emergency Contact",
      icon: Phone,
      type: "text",
      required: false,
    },
    {
      key: "linkedIn",
      label: "LinkedIn Profile",
      icon: Globe,
      type: "url",
      required: false,
    },
    {
      key: "github",
      label: "GitHub Profile",
      icon: Globe,
      type: "url",
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Edit Profile</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-8">
                {/* Profile Picture Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400"
                      alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white p-2 rounded-lg shadow-lg"
                    >
                      <Camera className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Profile Picture
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Upload a new avatar for your account
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Change Photo
                    </motion.button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-indigo-600" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formFields.slice(0, 6).map((field) => {
                        const Icon = field.icon;
                        return (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            <div className="relative">
                              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type={field.type}
                                value={formData[field.key]}
                                onChange={(e) =>
                                  handleInputChange(field.key, e.target.value)
                                }
                                required={field.required}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                      Professional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formFields.slice(6, 10).map((field) => {
                        const Icon = field.icon;
                        return (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            <div className="relative">
                              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type={field.type}
                                value={formData[field.key]}
                                onChange={(e) =>
                                  handleInputChange(field.key, e.target.value)
                                }
                                required={field.required}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                      Social Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {formFields.slice(10).map((field) => {
                        const Icon = field.icon;
                        return (
                          <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </label>
                            <div className="relative">
                              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                              <input
                                type={field.type}
                                value={formData[field.key]}
                                onChange={(e) =>
                                  handleInputChange(field.key, e.target.value)
                                }
                                required={field.required}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bio and Additional Fields */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange("bio", e.target.value)
                        }
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={formData.timezone}
                        onChange={(e) =>
                          handleInputChange("timezone", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                      >
                        <option value="Pacific Standard Time (PST)">
                          Pacific Standard Time (PST)
                        </option>
                        <option value="Mountain Standard Time (MST)">
                          Mountain Standard Time (MST)
                        </option>
                        <option value="Central Standard Time (CST)">
                          Central Standard Time (CST)
                        </option>
                        <option value="Eastern Standard Time (EST)">
                          Eastern Standard Time (EST)
                        </option>
                        <option value="Greenwich Mean Time (GMT)">
                          Greenwich Mean Time (GMT)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200/50 flex items-center justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isLoading ? "Saving..." : "Save Changes"}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
