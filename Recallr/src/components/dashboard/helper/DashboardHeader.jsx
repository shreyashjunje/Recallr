import { Sparkles, Bell, Timer, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import QuoteCard from "./QuoteCard";

const DashboardHeader = () => {
  const [showReminder, setShowReminder] = useState(false);
  const [studyTime, setStudyTime] = useState("");

  const setReminder = () => {
    alert(`Reminder set for ${studyTime}`);
    setShowReminder(false);
  };

  return (
    <div className="relative">
      {/* Background gradient with floating orbs */}
      <div
        className="bg-gradient-to-r from-sky-500/60 via-indigo-500/60 to-teal-500/60
 text-white rounded-3xl p-8 shadow-2xl overflow-hidden relative backdrop-blur-md"

//  className="bg-gradient-to-r from-sky-500/40 via-indigo-500/40 to-teal-500/40 
// text-white rounded-3xl p-8 shadow-2xl overflow-hidden relative backdrop-blur-md"

      >
        {/* Floating shapes */}
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-48 translate-x-48"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-32 -translate-x-32"
        />

        <div className="relative z-10">
          {/* Top Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 20, scale: 1.1 }}
                className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Welcome to{" "}
                  <span className="text-yellow-300">Recallr</span> 
                </h1>
                <p className="text-white/70 font-semibold text-lg">
                  Your journey to smarter learning starts now.{" "}
                  {/* <span className="font-semibold text-pink-200">greatness</span>{" "} */}
                  {/* today? */}
                </p>
              </div>
            </div>

            {/* Reminder Button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowReminder(!showReminder)}
                className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
              >
                <Bell className="w-6 h-6" />
              </motion.button>

              {showReminder && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-16 right-0 bg-white rounded-2xl shadow-2xl p-6 w-80 z-50 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Timer className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">
                      Set Study Reminder
                    </h3>
                  </div>
                  <input
                    type="datetime-local"
                    value={studyTime}
                    onChange={(e) => setStudyTime(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={setReminder}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
                    >
                      Set Reminder
                    </button>
                    <button
                      onClick={() => setShowReminder(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Quote Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <QuoteCard />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
