import { motion } from "framer-motion";
import { useState } from "react";

export default function PortalLoginAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-28 py-16 rounded-xl flex items-center justify-center border border-gray-700 shadow-2xl">
      <div className="relative w-full max-w-md">
        {/* Portal/Door Concept */}
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Portal Frame */}
          <motion.div
            className="relative bg-gradient-to-br from-blue-900/80 to-purple-900/80 rounded-3xl p-1 shadow-lg overflow-hidden"
            animate={{
              boxShadow: isHovered 
                ? "0 0 30px -5px rgba(99, 102, 241, 0.8)" 
                : "0 0 20px -5px rgba(99, 102, 241, 0.5)"
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Portal Energy Effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Portal Content */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 relative overflow-hidden">
              {/* Floating Particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-blue-400/30"
                  initial={{
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 300 - 150,
                    width: Math.random() * 8 + 2,
                    height: Math.random() * 8 + 2,
                    opacity: 0
                  }}
                  animate={{
                    x: [null, Math.random() * 300 - 150],
                    y: [null, Math.random() * 300 - 150],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    delay: Math.random() * 5
                  }}
                />
              ))}
              
              {/* Portal Core Glow */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: `radial-gradient(circle at center, rgba(99, 102, 241, ${isHovered ? 0.15 : 0.1}) 0%, transparent 70%)`
                }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Login Form */}
              <div className="relative z-10 space-y-6">
                {/* Header */}
                <motion.div 
                  className="text-center space-y-2"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.h2 
                    className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                    animate={{ 
                      textShadow: isHovered 
                        ? "0 0 10px rgba(167, 139, 250, 0.7)" 
                        : "0 0 5px rgba(167, 139, 250, 0.3)"
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    Welcome Back
                  </motion.h2>
                  <motion.p 
                    className="text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Enter your credentials to continue
                  </motion.p>
                </motion.div>
                
                {/* Email Field */}
                <motion.div
                  className="space-y-1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="text-sm text-gray-300">Email</label>
                  <motion.div
                    className={`relative rounded-lg border-2 ${isFocused.email ? 'border-blue-400' : 'border-gray-700'} bg-gray-800`}
                    whileHover={{ borderColor: "#818cf8" }}
                  >
                    <input
                      type="email"
                      className="w-full bg-transparent px-4 py-3 text-gray-200 focus:outline-none"
                      onFocus={() => setIsFocused({...isFocused, email: true})}
                      onBlur={() => setIsFocused({...isFocused, email: false})}
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 origin-left"
                      animate={{ 
                        scaleX: isFocused.email ? 1 : 0,
                        opacity: isFocused.email ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>
                
                {/* Password Field */}
                <motion.div
                  className="space-y-1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="text-sm text-gray-300">Password</label>
                  <motion.div
                    className={`relative rounded-lg border-2 ${isFocused.password ? 'border-purple-400' : 'border-gray-700'} bg-gray-800`}
                    whileHover={{ borderColor: "#a78bfa" }}
                  >
                    <input
                      type="password"
                      className="w-full bg-transparent px-4 py-3 text-gray-200 focus:outline-none"
                      onFocus={() => setIsFocused({...isFocused, password: true})}
                      onBlur={() => setIsFocused({...isFocused, password: false})}
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 origin-left"
                      animate={{ 
                        scaleX: isFocused.password ? 1 : 0,
                        opacity: isFocused.password ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>
                
                {/* Submit Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                >
                  <motion.button
                    className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 0 20px -5px rgba(99, 102, 241, 0.8)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">Sign In</span>
                    <motion.div 
                      className="absolute inset-0 bg-white opacity-0"
                      animate={{ 
                        x: ["-100%", "100%"],
                        opacity: [0, 0.2, 0]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                    />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-blue-500/20 blur-xl"
          animate={{
            x: [0, 20, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-purple-500/20 blur-xl"
          animate={{
            x: [0, -20, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl z-0">
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        </div>
      </div>
    </div>
  );
}