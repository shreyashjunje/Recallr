import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function ForgotPasswordAnimation() {
  return (
    <div className="w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-12">
      <motion.div
        className="relative w-80 h-80"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {/* Main Lock */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-24 h-32 bg-blue-600 rounded-lg relative shadow-lg dark:bg-blue-500">
            {/* Lock shackle */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-12 border-4 border-gray-400 rounded-t-full bg-transparent dark:border-gray-500"></div>
            {/* Lock keyhole */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-200 rounded-full"></div>
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-white dark:bg-gray-200"></div>
          </div>
        </motion.div>

        {/* Email Icon */}
        <motion.div
          className="absolute top-16 left-8"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-16 h-12 bg-yellow-400 rounded-lg relative shadow-md transform rotate-12 dark:bg-yellow-500">
            <div className="absolute inset-2 border-2 border-yellow-600 rounded dark:border-yellow-400"></div>
            <div className="absolute top-2 left-2 right-2 h-0 border-t-2 border-yellow-600 dark:border-yellow-400"></div>
          </div>
        </motion.div>

        {/* Key Icon */}
        <motion.div
          className="absolute bottom-20 left-12 origin-left"
          animate={{ rotate: [-15, 15, -15] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-20 h-6 bg-gray-400 rounded-full relative shadow-md dark:bg-gray-600">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-400 rounded-sm dark:bg-gray-500"></div>
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-200 rounded-sm dark:bg-gray-400"></div>
          </div>
        </motion.div>

        {/* Password Field Representation */}
        <motion.div
          className="absolute bottom-8 right-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-32 h-8 bg-yellow-400 rounded-lg shadow-md dark:bg-yellow-500">
            <div className="flex items-center justify-center h-full">
              <div className="flex gap-1">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-blue-600 rounded-full dark:bg-blue-500"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 1,
                      delay: i * 0.2,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="absolute bottom-16 right-12 w-28 h-6 bg-yellow-400 rounded-lg shadow-md overflow-hidden dark:bg-yellow-500">
          <motion.div
            className="h-full bg-blue-600 rounded-lg dark:bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* Settings Gears */}
        <div className="absolute top-8 right-16">
          <Settings
            className="w-8 h-8 text-gray-400 dark:text-gray-500 animate-spin"
            style={{ animationDuration: "10s" }}
          />
        </div>

        <div className="absolute top-20 right-8">
          <Settings
            className="w-6 h-6 text-gray-300 dark:text-gray-400 animate-spin"
            style={{
              animationDuration: "15s",
              animationDirection: "reverse",
            }}
          />
        </div>

        {/* Warning Triangle */}
        <motion.div
          className="absolute bottom-4 right-4"
          animate={{ rotate: [10, -10, 10] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center shadow-md transform rotate-12 dark:bg-yellow-500">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-orange-600 dark:border-b-orange-500"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
