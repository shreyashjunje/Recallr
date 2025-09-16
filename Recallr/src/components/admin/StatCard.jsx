import React from "react";
import { motion } from "framer-motion";
import { DivideIcon as LucideIcon } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color, index }) => {
  const colorClasses = {
    blue: "bg-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    green:
      "bg-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
    yellow: "bg-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900/20",
    red: "bg-red-500 text-red-600 bg-red-50 dark:bg-red-900/20",
  };

  const [bgColor, textColor, cardBg] = colorClasses[color].split(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`${cardBg} p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-800">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-900 mt-2">
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
