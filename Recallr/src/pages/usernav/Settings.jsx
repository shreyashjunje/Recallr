// import React, { useState } from 'react';
// import { Save, Moon, Sun, Bell, Shield, User, Eye } from 'lucide-react';

// const SettingsPage= () => {
//   const [settings, setSettings] = useState({
//     // Account Settings
//     emailNotifications: true,
//     profileVisibility: 'public',
//     autoSave: true,
    
//     // Privacy & Security
//     twoFactorAuth: false,
//     loginAlerts: true,
//     dataSharing: false,
    
//     // Notifications
//     pushNotifications: true,
//     emailUpdates: true,
//     weeklyDigest: false,
    
//     // Appearance
//     theme: 'light',
//     fontSize: 'medium',
//     compactMode: false,
//   });

//   const handleToggle = (key) => {
//     setSettings(prev => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleSelect = (key, value) => {
//     setSettings(prev => ({ ...prev, [key]: value }));
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-8">
//       {/* Account Settings */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
//         <div className="flex items-center mb-6">
//           <User className="w-6 h-6 text-blue-500 mr-3" />
//           <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="font-semibold text-gray-800">Email Notifications</h4>
//                 <p className="text-sm text-gray-600">Receive updates via email</p>
//               </div>
//               <button
//                 onClick={() => handleToggle('emailNotifications')}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
//                   settings.emailNotifications ? 'bg-blue-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
//                     settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="font-semibold text-gray-800">Auto-Save</h4>
//                 <p className="text-sm text-gray-600">Save progress automatically</p>
//               </div>
//               <button
//                 onClick={() => handleToggle('autoSave')}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
//                   settings.autoSave ? 'bg-blue-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
//                     settings.autoSave ? 'translate-x-6' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>

//           <div>
//             <h4 className="font-semibold text-gray-800 mb-2">Profile Visibility</h4>
//             <select
//               value={settings.profileVisibility}
//               onChange={(e) => handleSelect('profileVisibility', e.target.value)}
//               className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//             >
//               <option value="public">Public</option>
//               <option value="private">Private</option>
//               <option value="friends">Friends Only</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Privacy & Security */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
//         <div className="flex items-center mb-6">
//           <Shield className="w-6 h-6 text-green-500 mr-3" />
//           <h2 className="text-2xl font-bold text-gray-800">Privacy & Security</h2>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="font-semibold text-gray-800">Two-Factor Authentication</h4>
//                 <p className="text-sm text-gray-600">Add extra security to your account</p>
//               </div>
//               <button
//                 onClick={() => handleToggle('twoFactorAuth')}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
//                   settings.twoFactorAuth ? 'bg-green-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
//                     settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="font-semibold text-gray-800">Login Alerts</h4>
//                 <p className="text-sm text-gray-600">Get notified of new logins</p>
//               </div>
//               <button
//                 onClick={() => handleToggle('loginAlerts')}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
//                   settings.loginAlerts ? 'bg-green-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
//                     settings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="font-semibold text-gray-800">Data Sharing</h4>
//               <p className="text-sm text-gray-600">Share usage data for improvements</p>
//             </div>
//             <button
//               onClick={() => handleToggle('dataSharing')}
//               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
//                 settings.dataSharing ? 'bg-green-500' : 'bg-gray-300'
//               }`}
//             >
//               <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
//                   settings.dataSharing ? 'translate-x-6' : 'translate-x-1'
//                 }`}
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Notifications */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
//         <div className="flex items-center mb-6">
//           <Bell className="w-6 h-6 text-purple-500 mr-3" />
//           <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="font-semibold text-gray-800">Push Notifications</h4>
//                 <p className="text-sm text-gray-600">Receive browser notifications</p>
//               </div>
//               <button
//                 onClick={() => handleToggle('pushNotifications')}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
//                   settings.pushNotifications ? 'bg-purple-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
//                     settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//             </div>

//             <div className="flex items-center justify-between">
//               <div>
//                 <h4 className="font-semibold text-gray-800">Email Updates</h4>
//                 <p className="text-sm text-gray-600">Product updates and news</p>
//               </div>
//               <button
//                 onClick={() => handleToggle('emailUpdates')}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
//                   settings.emailUpdates ? 'bg-purple-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
//                     settings.emailUpdates ? 'translate-x-6' : 'translate-x-1'
//                   }`}
//                 />
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="font-semibold text-gray-800">Weekly Digest</h4>
//               <p className="text-sm text-gray-600">Summary of your activity</p>
//             </div>
//             <button
//               onClick={() => handleToggle('weeklyDigest')}
//               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
//                 settings.weeklyDigest ? 'bg-purple-500' : 'bg-gray-300'
//               }`}
//             >
//               <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
//                   settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
//                 }`}
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Appearance */}
//       <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
//         <div className="flex items-center mb-6">
//           <Eye className="w-6 h-6 text-indigo-500 mr-3" />
//           <h2 className="text-2xl font-bold text-gray-800">Appearance</h2>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h4 className="font-semibold text-gray-800 mb-4">Theme</h4>
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => handleSelect('theme', 'light')}
//                 className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
//                   settings.theme === 'light' 
//                     ? 'border-blue-500 bg-blue-50' 
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <Sun className="w-5 h-5" />
//                 <span>Light</span>
//               </button>
//               <button
//                 onClick={() => handleSelect('theme', 'dark')}
//                 className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
//                   settings.theme === 'dark' 
//                     ? 'border-blue-500 bg-blue-50' 
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <Moon className="w-5 h-5" />
//                 <span>Dark</span>
//               </button>
//             </div>
//           </div>

//           <div>
//             <h4 className="font-semibold text-gray-800 mb-4">Font Size</h4>
//             <select
//               value={settings.fontSize}
//               onChange={(e) => handleSelect('fontSize', e.target.value)}
//               className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//             >
//               <option value="small">Small</option>
//               <option value="medium">Medium</option>
//               <option value="large">Large</option>
//             </select>
//           </div>
//         </div>

//         <div className="mt-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="font-semibold text-gray-800">Compact Mode</h4>
//               <p className="text-sm text-gray-600">Reduce spacing for more content</p>
//             </div>
//             <button
//               onClick={() => handleToggle('compactMode')}
//               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
//                 settings.compactMode ? 'bg-indigo-500' : 'bg-gray-300'
//               }`}
//             >
//               <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
//                   settings.compactMode ? 'translate-x-6' : 'translate-x-1'
//                 }`}
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Save Button */}
//       <div className="flex justify-center">
//         <button className="bg-gradient-to-r from-violet-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center">
//           <Save className="w-5 h-5 mr-2" />
//           Save All Changes
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;


import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, User, Bell, Shield, Palette } from "lucide-react";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "@/context/AdminThemeContext";

const SettingsPage = () => {
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

export default SettingsPage;
