import React from "react";
import { motion } from "framer-motion";
import { Heart, Activity } from "lucide-react";

const Preloader = () => {
    return (
      <div
        id="preloader"
        className="fixed top-0 left-0 w-full h-full z-[99999] bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative text-center"
        >
          {/* Animated Heart Logo */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
              {/* ECG Line Animation */}
              <motion.div
                animate={{
                  x: [-40, 120],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-1 overflow-hidden"
              >
                <svg className="w-full h-full" viewBox="0 0 80 10" preserveAspectRatio="none">
                  <path
                    d="M0,5 L15,5 L18,2 L22,8 L26,5 L40,5"
                    stroke="white"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* MedHealth Text */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2"
          >
            MedHealth
          </motion.h1>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-4"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-cyan-600 rounded-full"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
          </motion.div>

          {/* Loading Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm text-gray-600 mt-4 font-medium"
          >
            Loading...
          </motion.p>
        </motion.div>
      </div>
    );
  };
  
  export default Preloader;