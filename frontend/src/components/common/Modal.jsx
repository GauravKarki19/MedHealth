import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const { isDarkMode } = useDarkMode();

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                ${sizeClasses[size]}
                w-full
                ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
                rounded-2xl
                shadow-2xl
                overflow-hidden
              `}
            >
              {/* Header */}
              {title && (
                <div className={`
                  flex items-center justify-between p-6 border-b
                  ${isDarkMode 
                    ? 'border-gray-700 bg-gray-800/50' 
                    : 'border-gray-200 bg-gray-50'
                  }
                `}>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className={`
                      p-2 rounded-full transition-colors
                      ${isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <X size={24} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

