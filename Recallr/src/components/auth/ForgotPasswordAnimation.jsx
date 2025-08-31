import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function ForgotPasswordAnimation() {
  return (
    <div className="w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-12">
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
          <div className="w-24 h-32 bg-blue-600 rounded-lg relative shadow-lg">
            {/* Lock shackle */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-12 border-4 border-gray-400 rounded-t-full bg-transparent"></div>
            {/* Lock keyhole */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-white"></div>
          </div>
        </motion.div>

        {/* Email Icon */}
        <motion.div
          className="absolute top-16 left-8"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-16 h-12 bg-yellow-400 rounded-lg relative shadow-md transform rotate-12">
            <div className="absolute inset-2 border-2 border-yellow-600 rounded"></div>
            <div className="absolute top-2 left-2 right-2 h-0 border-t-2 border-yellow-600"></div>
          </div>
        </motion.div>

        {/* Key Icon */}
        <motion.div
          className="absolute bottom-20 left-12 origin-left"
          animate={{ rotate: [-15, 15, -15] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="w-20 h-6 bg-gray-400 rounded-full relative shadow-md">
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-400 rounded-sm"></div>
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-200 rounded-sm"></div>
          </div>
        </motion.div>

        {/* Password Field Representation */}
        <motion.div
          className="absolute bottom-8 right-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-32 h-8 bg-yellow-400 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-full">
              <div className="flex gap-1">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-blue-600 rounded-full"
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
        <div className="absolute bottom-16 right-12 w-28 h-6 bg-yellow-400 rounded-lg shadow-md overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 rounded-lg"
            initial={{ width: 0 }}
            animate={{ width: "75%" }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        {/* Settings Gears */}
        <div className="absolute top-8 right-16">
          <Settings
            className="w-8 h-8 text-gray-400 animate-spin"
            style={{ animationDuration: "10s" }}
          />
        </div>

        <div className="absolute top-20 right-8">
          <Settings
            className="w-6 h-6 text-gray-300 animate-spin"
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
          <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center shadow-md transform rotate-12">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-orange-600"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
