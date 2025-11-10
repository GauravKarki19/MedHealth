import React from "react";
import { motion } from "framer-motion";
import { Shield, Info, Lock, CheckCircle2 } from "lucide-react";

const Home = (props) => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  const terms = [
    {
      icon: Info,
      text: "This checkup is not a diagnosis.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      text: "This checkup is for informational purposes and is not a qualified medical opinion.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Lock,
      text: "Information that you provide is anonymous and not shared with anyone.",
      color: "from-green-500 to-emerald-500"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Welcome to Health Check
        </h2>
        <p className={`text-base leading-relaxed ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Before using this symptom checker, please read carefully and accept our Terms and Services:
        </p>
      </div>

      {/* Terms Cards */}
      <div className="space-y-4 mb-8">
        {terms.map((term, index) => {
          const IconComponent = term.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-xl ${
                isDarkMode
                  ? 'bg-gray-700/50 border border-gray-600'
                  : 'bg-blue-50/50 border border-blue-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${term.color} flex-shrink-0`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <p className={`flex-1 pt-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {term.text}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Agreement Checkbox */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`p-6 rounded-xl ${
          isDarkMode
            ? 'bg-gray-700/50 border-2 border-gray-600'
            : 'bg-white border-2 border-gray-200'
        } ${props.isChecked ? (isDarkMode ? 'border-blue-500' : 'border-blue-500') : ''}`}
      >
        <label
          htmlFor="terms-checkbox"
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="relative">
            <input
              checked={props.isChecked}
              onChange={props.checked}
              id="terms-checkbox"
              type="checkbox"
              className="sr-only"
            />
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
              props.isChecked
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-600'
                : isDarkMode
                  ? 'border-gray-500 bg-gray-800'
                  : 'border-gray-300 bg-white'
            }`}>
              {props.isChecked && (
                <CheckCircle2 className="w-4 h-4 text-white" />
              )}
            </div>
          </div>
          <span className={`flex-1 font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            I agree to the MedHealth terms and conditions
          </span>
        </label>
      </motion.div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className={`mt-6 p-4 rounded-xl ${
          isDarkMode
            ? 'bg-yellow-900/20 border border-yellow-700/50'
            : 'bg-yellow-50 border border-yellow-200'
        }`}
      >
        <p className={`text-sm ${
          isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
        }`}>
          <strong>Note:</strong> This tool is for informational purposes only and does not replace professional medical advice. Always consult a healthcare professional for accurate diagnosis.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Home;

