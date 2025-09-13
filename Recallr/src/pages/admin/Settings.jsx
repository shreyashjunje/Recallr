import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, User, Bell, Shield, Palette } from "lucide-react";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "@/context/AdminThemeContext";

const AdminSettings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "admin",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      ticketUpdates: true,
      systemAlerts: true,
    },
    appearance: {
      theme: isDark ? "dark" : "light",
      compactMode: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
    },
  });

  const handleSave = () => {
    console.log("Settings saved:", settings);
  };

  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const settingSections = [
    {
      title: "Profile Settings",
      icon: User,
      content: (
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) =>
                handleInputChange("profile", "name", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) =>
                handleInputChange("profile", "email", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <input
              type="text"
              value={settings.profile.role}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Notifications",
      icon: Bell,
      content: (
        <div className="space-y-4">
          {[
            {
              label: "Email Notifications",
              desc: "Receive notifications via email",
              field: "emailNotifications",
            },
            {
              label: "Push Notifications",
              desc: "Receive browser push notifications",
              field: "pushNotifications",
            },
            {
              label: "Ticket Updates",
              desc: "Get notified when tickets are updated",
              field: "ticketUpdates",
            },
          ].map((item) => (
            <div
              key={item.field}
              className="flex items-center justify-between flex-wrap gap-2"
            >
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.label}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications[item.field]}
                onChange={(e) =>
                  handleInputChange(
                    "notifications",
                    item.field,
                    e.target.checked
                  )
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Appearance",
      icon: Palette,
      content: (
        <div className="space-y-4">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={!isDark}
                  onChange={toggleTheme}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Light
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={isDark}
                  onChange={toggleTheme}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Dark
                </span>
              </label>
            </div>
          </div>

          {/* Compact mode */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Compact Mode
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Use compact layout for tables and lists
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.appearance.compactMode}
              onChange={(e) =>
                handleInputChange("appearance", "compactMode", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Security",
      icon: Shield,
      content: (
        <div className="space-y-4">
          {/* 2FA */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Two-Factor Authentication
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) =>
                handleInputChange(
                  "security",
                  "twoFactorAuth",
                  e.target.checked
                )
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          {/* Timeout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Session Timeout (minutes)
            </label>
            <select
              value={settings.security.sessionTimeout}
              onChange={(e) =>
                handleInputChange("security", "sessionTimeout", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="0">Never</option>
            </select>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage your admin panel preferences
          </p>
        </div>
        <Button onClick={handleSave} className="w-full sm:w-auto">
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <section.icon
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            {section.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminSettings;
