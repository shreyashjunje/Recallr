import React from "react";
import { Star, Sparkles, BookOpen } from "lucide-react";
import { useTheme } from "@/context/AdminThemeContext";

const PageHeader = ({
  title,
  category,
  tags,
  isFavorite,
  onToggleFavorite,
}) => {
  const { isDark, toggleTheme } = useTheme(); // Get theme state and toggle function

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${isDark ? 'from-gray-700 to-gray-800' : 'from-white via-blue-50 to-purple-50'} rounded-3xl shadow-xl border border-white/50 p-8`}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="text-center mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Upload Your PDFs
              </h1>
              <p className={` ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose between web upload or connect with our Telegram bot for
                easy mobile uploads
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
