import { motion } from "framer-motion";
import { useState } from "react";

export default function RegisterAnimation() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-28 py-16 rounded-xl flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-500">
      <div className="relative">
        {/* Phone animation with drag */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: isDragging ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-64 h-[480px] bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 rounded-[2.5rem] p-2 shadow-2xl transition-colors duration-500">
            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden relative flex flex-col transition-colors duration-500">
              {/* Status bar - improved */}
              <motion.div
                className="flex justify-between items-center px-4 pt-2 pb-1 text-gray-800 dark:text-gray-200"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-xs font-medium">9:41</div>
                <div className="flex space-x-1">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-gray-800 dark:bg-gray-300 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Screen content */}
              <div className="flex-1 pt-4 px-6 space-y-6">
                {/* Profile with improved animation */}
                <motion.div
                  className="flex flex-col items-center justify-center space-y-3"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-md"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                          <motion.div
                            className="w-4 h-4 bg-white dark:bg-gray-700 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 }}
                    />
                  </div>
                  <motion.div
                    className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.6 }}
                  />
                </motion.div>

                {/* Continuous animated bars */}
                <div className="space-y-4">
                  {[
                    { color: "from-orange-300 to-orange-400", delay: 0.6 },
                    { color: "from-orange-400 to-orange-500", delay: 0.7 },
                    { color: "from-yellow-300 to-yellow-400", delay: 0.8 },
                  ].map((bar, i) => (
                    <motion.div
                      key={i}
                      className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: bar.delay }}
                    >
                      <motion.div
                        className={`h-full bg-gradient-to-r ${bar.color} rounded-full`}
                        initial={{ x: "-100%" }}
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          delay: bar.delay + 0.2,
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{ width: "50%" }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Animated button with hover effect */}
                <motion.div
                  className="relative overflow-hidden rounded-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.div
                    className="h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span
                      className="text-white font-medium text-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      Register Now
                    </motion.span>
                  </motion.div>
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-700 opacity-0"
                    animate={{
                      x: ["-100%", "100%"],
                      opacity: [0, 0.3, 0],
                    }}
                    transition={{
                      delay: 1.5,
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                </motion.div>

                {/* Animated form fields */}
                <div className="space-y-3">
                  {[
                    { delay: 1.2, label: "Username" },
                    { delay: 1.3, label: "Email" },
                    { delay: 1.4, label: "Password" },
                  ].map((field, i) => (
                    <motion.div
                      key={i}
                      className="space-y-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: field.delay }}
                    >
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-8 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"></div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Home indicator */}
              <motion.div
                className="flex justify-center pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                <div className="w-20 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Left hand - improved */}
        <motion.div
          className="absolute -bottom-8 -left-8 z-20"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
        >
          <div className="relative">
            <motion.div
              className="w-24 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-full rounded-bl-full transform -rotate-12 shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-0 left-4 w-16 h-20 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full shadow-inner"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="absolute top-16 left-6 w-4 h-8 bg-gradient-to-b from-purple-300 to-purple-400 rounded-full transform rotate-45"
              animate={{ rotate: [45, 30, 45] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Right hand - improved */}
        <motion.div
          className="absolute -bottom-8 -right-8 z-20"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
            repeatType: "mirror",
          }}
        >
          <div className="relative">
            <motion.div
              className="w-24 h-32 bg-gradient-to-bl from-purple-400 to-purple-600 rounded-t-full rounded-br-full transform rotate-12 shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-0 right-4 w-16 h-20 bg-gradient-to-bl from-purple-300 to-purple-500 rounded-full shadow-inner"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.2 }}
            />
            {/* Finger pointing */}
            <motion.div
              className="absolute top-8 right-2 w-4 h-12 bg-gradient-to-b from-purple-300 to-purple-500 rounded-full transform rotate-45"
              animate={{
                rotate: [45, 60, 45],
                y: [0, -5, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Floating indicators */}
        <motion.div
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Subtle background elements */}
        <motion.div
          className="absolute -top-8 -left-8 w-16 h-16 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-8 -right-8 w-20 h-20 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>
    </div>
  );
}
