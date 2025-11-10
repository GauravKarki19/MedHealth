import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false
}) => {
  const { isDarkMode } = useDarkMode();
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: isDarkMode
      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-md hover:shadow-lg border border-blue-600'
      : 'bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:from-blue-800 hover:to-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg border border-blue-900',
    secondary: isDarkMode
      ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500 shadow-md hover:shadow-lg border-2 border-gray-600'
      : 'bg-white text-blue-900 hover:bg-gray-50 focus:ring-blue-500 shadow-md hover:shadow-lg border-2 border-blue-900',
    outline: isDarkMode
      ? 'border-2 border-gray-600 text-gray-300 hover:bg-gray-800 focus:ring-gray-500 bg-transparent'
      : 'border-2 border-blue-900 text-blue-900 hover:bg-blue-50 focus:ring-blue-500 bg-white',
    ghost: isDarkMode
      ? 'text-gray-300 hover:bg-gray-800 focus:ring-gray-500'
      : 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02, y: disabled || isLoading ? 0 : -2 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin mr-2" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
