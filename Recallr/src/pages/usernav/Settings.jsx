import React, { useState } from 'react';
import { Save, Moon, Sun, Bell, Shield, User, Eye } from 'lucide-react';

const SettingsPage= () => {
  const [settings, setSettings] = useState({
    // Account Settings
    emailNotifications: true,
    profileVisibility: 'public',
    autoSave: true,
    
    // Privacy & Security
    twoFactorAuth: false,
    loginAlerts: true,
    dataSharing: false,
    
    // Notifications
    pushNotifications: true,
    emailUpdates: true,
    weeklyDigest: false,
    
    // Appearance
    theme: 'light',
    fontSize: 'medium',
    compactMode: false,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Account Settings */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  settings.emailNotifications ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Auto-Save</h4>
                <p className="text-sm text-gray-600">Save progress automatically</p>
              </div>
              <button
                onClick={() => handleToggle('autoSave')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  settings.autoSave ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Profile Visibility</h4>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSelect('profileVisibility', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-green-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Privacy & Security</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <button
                onClick={() => handleToggle('twoFactorAuth')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  settings.twoFactorAuth ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Login Alerts</h4>
                <p className="text-sm text-gray-600">Get notified of new logins</p>
              </div>
              <button
                onClick={() => handleToggle('loginAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  settings.loginAlerts ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    settings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">Data Sharing</h4>
              <p className="text-sm text-gray-600">Share usage data for improvements</p>
            </div>
            <button
              onClick={() => handleToggle('dataSharing')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                settings.dataSharing ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  settings.dataSharing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-purple-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Push Notifications</h4>
                <p className="text-sm text-gray-600">Receive browser notifications</p>
              </div>
              <button
                onClick={() => handleToggle('pushNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  settings.pushNotifications ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Email Updates</h4>
                <p className="text-sm text-gray-600">Product updates and news</p>
              </div>
              <button
                onClick={() => handleToggle('emailUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  settings.emailUpdates ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    settings.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">Weekly Digest</h4>
              <p className="text-sm text-gray-600">Summary of your activity</p>
            </div>
            <button
              onClick={() => handleToggle('weeklyDigest')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                settings.weeklyDigest ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex items-center mb-6">
          <Eye className="w-6 h-6 text-indigo-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Appearance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Theme</h4>
            <div className="flex space-x-4">
              <button
                onClick={() => handleSelect('theme', 'light')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  settings.theme === 'light' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>Light</span>
              </button>
              <button
                onClick={() => handleSelect('theme', 'dark')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                  settings.theme === 'dark' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Font Size</h4>
            <select
              value={settings.fontSize}
              onChange={(e) => handleSelect('fontSize', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800">Compact Mode</h4>
              <p className="text-sm text-gray-600">Reduce spacing for more content</p>
            </div>
            <button
              onClick={() => handleToggle('compactMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                settings.compactMode ? 'bg-indigo-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button className="bg-gradient-to-r from-violet-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center">
          <Save className="w-5 h-5 mr-2" />
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;