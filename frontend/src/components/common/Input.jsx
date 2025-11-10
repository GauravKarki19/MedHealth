import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className={`
          block text-sm font-medium mb-2
          ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
        `}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className={`
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
              ${error ? 'text-red-500' : ''}
            `} size={20} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`
            w-full
            ${Icon ? 'pl-10' : 'pl-4'}
            pr-4
            py-3
            rounded-lg
            border
            transition-all
            duration-200
            focus:outline-none
            focus:ring-2
            focus:ring-offset-0
            ${isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
            }
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;

