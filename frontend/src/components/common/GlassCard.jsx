import { motion } from 'framer-motion';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';

const GlassCard = ({ children, className = '', onClick, hover = true, delay = 0 }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { 
        y: -10, 
        scale: 1.03,
        transition: { duration: 0.3, ease: "easeOut" }
      } : {}}
      onClick={onClick}
      className={`
        ${isDarkMode 
          ? 'bg-gray-800/90 border-gray-700 shadow-xl' 
          : 'bg-white border-gray-200 shadow-lg'
        }
        border-2
        rounded-2xl 
        p-8
        transition-all duration-300
        ${hover ? (isDarkMode ? 'hover:shadow-2xl hover:border-blue-600' : 'hover:shadow-2xl hover:border-blue-500') : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
