import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  FileText, 
  ShoppingCart,
  Wallet,
  ChevronDown,
  Search,
  Home,
  Stethoscope,
  Activity,
  Pill,
  BookOpen,
  Info,
  Moon,
  Sun
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';
import commonContext from '../../contexts/common/commonContext';
import { useContext } from 'react';
import httpClient from '../../httpClient';
import cartContext from '../../contexts/cart/cartContext';

const GovernmentHeader = ({ isSignup = false, setIsSignup = null }) => {
  const { toggleForm, userLogout, toggleProfile } = useContext(commonContext);
  const { cartItems } = useContext(cartContext);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('username') && localStorage.getItem('username') !== 'undefined';
  const userType = localStorage.getItem('usertype');
  const username = localStorage.getItem('username');
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && !event.target.closest('button[aria-label="Search"]')) {
        if (showSearch && !searchQuery) {
          setShowSearch(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch, searchQuery]);

  const handleLogout = () => {
    if (userType === 'doctor') {
      httpClient.put("/doc_status", { email: localStorage.getItem("email") }).catch(err => console.log(err));
    }
    userLogout();
    navigate('/');
    setShowUserMenu(false);
  };

  const handleLoginClick = () => {
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    if (setIsSignup) setIsSignup(false);
    toggleForm(true);
  };

  const handleRegisterClick = () => {
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    if (setIsSignup) setIsSignup(true);
    toggleForm(true);
  };

  // Navigation items - only show when logged in
  const navigationItems = [
    { path: '/', label: 'Home', icon: Home, show: isLoggedIn },
    { path: '/doctor-search', label: 'Find Doctors', icon: Stethoscope, show: isLoggedIn && (userType === 'patient' || !userType) },
    { path: '/doctors', label: 'Doctors', icon: Stethoscope, show: isLoggedIn && (userType === 'patient' || !userType) },
    { path: '/disease-prediction', label: 'Health Check', icon: Activity, show: isLoggedIn },
    { path: '/buy-medicines', label: 'Medicines', icon: Pill, show: isLoggedIn },
    { path: '/health-blogs', label: 'Health Info', icon: BookOpen, show: isLoggedIn },
    { path: '/about', label: 'About', icon: Info, show: isLoggedIn },
  ].filter(item => item.show);

  const cartItemCount = cartItems?.length || 0;

  return (
    <>
      {/* Main Header - Sticky to Top - Minimalistic Design */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? isDarkMode 
              ? 'bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-800'
              : 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200'
            : isDarkMode
              ? 'bg-gray-900 border-b border-gray-800'
              : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Simplified */}
            <Link to="/" className="flex items-center space-x-2.5 group flex-shrink-0">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors overflow-hidden ${
                isDarkMode 
                  ? 'bg-gray-800' 
                  : 'bg-gray-50'
              }`}
              >
                <img
                  src="/icon.png"
                  alt="MedHealth Logo"
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    console.error('Logo failed to load');
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  MedHealth
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation - Minimalistic - Only show when logged in */}
            {isLoggedIn && navigationItems.length > 0 && (
              <nav className="hidden xl:flex items-center justify-center flex-1 px-8">
                <div className={`flex items-center space-x-1 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-800/50' 
                    : 'bg-gray-50'
                }`}>
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        location.pathname === item.path
                          ? isDarkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white'
                          : isDarkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <item.icon className={`w-4 h-4 ${
                          location.pathname === item.path ? 'text-white' : ''
                        }`} />
                        <span className="whitespace-nowrap">{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </nav>
            )}

            {/* Right Actions Section - Minimalistic */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Search Button - Only show when logged in */}
              {isLoggedIn && (
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className={`p-2 rounded-lg transition-colors ${
                    showSearch 
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'hover:bg-gray-800 text-gray-300'
                        : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-800 text-yellow-400'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Cart (for patients) - Only show when logged in */}
              {isLoggedIn && userType === 'patient' && (
                <Link
                  to="/my-cart"
                  className={`relative p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-800 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User Menu or Login/Register Buttons */}
              {isLoggedIn ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                      isDarkMode
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isDarkMode
                        ? 'bg-gray-700'
                        : 'bg-white/20'
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-semibold leading-tight">{username}</div>
                      <div className={`text-xs capitalize ${
                        isDarkMode ? 'text-gray-400' : 'text-blue-100'
                      }`}>{userType}</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 mt-3 w-72 rounded-2xl shadow-2xl border-2 py-2 overflow-hidden z-50 ${
                          isDarkMode
                            ? 'bg-gray-800 border-gray-700'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {/* User Info Header */}
                        <div className={`px-5 py-4 border-b ${
                          isDarkMode
                            ? 'border-gray-700 bg-gray-800'
                            : 'border-gray-200 bg-gray-50'
                        }`}>
                          <p className={`font-black text-lg ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{username}</p>
                          <p className={`text-sm capitalize font-semibold mt-0.5 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>{userType}</p>
                        </div>

                        {/* Menu Items */}
                        <div className={`py-2 ${
                          isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                        }`}>
                          <button
                            onClick={() => {
                              toggleProfile(true);
                              setShowUserMenu(false);
                            }}
                            className={`w-full px-5 py-3 text-left flex items-center space-x-3 transition-colors group ${
                              isDarkMode
                                ? 'hover:bg-gray-700 text-gray-300'
                                : 'hover:bg-gray-200 text-gray-700 bg-gray-50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              isDarkMode
                                ? 'bg-gray-700 group-hover:bg-gray-600'
                                : 'bg-gray-200 group-hover:bg-blue-300'
                            }`}>
                              <User className={`w-5 h-5 ${
                                isDarkMode
                                  ? 'text-gray-400 group-hover:text-white'
                                  : 'text-gray-600 group-hover:text-blue-700'
                              }`} />
                            </div>
                            <div>
                              <div className={`font-semibold text-sm ${
                                isDarkMode ? 'text-gray-200' : 'text-gray-900'
                              }`}>Profile Settings</div>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-500'
                              }`}>Manage your account</div>
                            </div>
                          </button>
                          
                          {userType === 'patient' && (
                            <>
                              <Link
                                to="/my-wallet"
                                onClick={() => setShowUserMenu(false)}
                                className={`w-full px-5 py-3 text-left flex items-center space-x-3 transition-colors group ${
                                  isDarkMode
                                    ? 'hover:bg-gray-700 text-gray-300'
                                    : 'hover:bg-gray-200 text-gray-700 bg-gray-50'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                  isDarkMode
                                    ? 'bg-gray-700 group-hover:bg-gray-600'
                                    : 'bg-gray-200 group-hover:bg-green-300'
                                }`}>
                                  <Wallet className={`w-5 h-5 ${
                                    isDarkMode
                                      ? 'text-gray-400 group-hover:text-white'
                                      : 'text-gray-600 group-hover:text-green-700'
                                  }`} />
                                </div>
                                <div>
                                  <div className={`font-semibold text-sm ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                  }`}>My Wallet</div>
                                  <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                  }`}>View balance & transactions</div>
                                </div>
                              </Link>
                              <Link
                                to="/my-cart"
                                onClick={() => setShowUserMenu(false)}
                                className={`w-full px-5 py-3 text-left flex items-center space-x-3 transition-colors group ${
                                  isDarkMode
                                    ? 'hover:bg-gray-700 text-gray-300'
                                    : 'hover:bg-gray-200 text-gray-700 bg-gray-50'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors relative ${
                                  isDarkMode
                                    ? 'bg-gray-700 group-hover:bg-gray-600'
                                    : 'bg-gray-200 group-hover:bg-blue-300'
                                }`}>
                                  <ShoppingCart className={`w-5 h-5 ${
                                    isDarkMode
                                      ? 'text-gray-400 group-hover:text-white'
                                      : 'text-gray-600 group-hover:text-blue-700'
                                  }`} />
                                  {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                      {cartItemCount > 9 ? '9+' : cartItemCount}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className={`font-semibold text-sm ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                  }`}>My Cart</div>
                                  <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                  }`}>{cartItemCount} item(s) in cart</div>
                                </div>
                              </Link>
                              <Link
                                to="/my-orders"
                                onClick={() => setShowUserMenu(false)}
                                className={`w-full px-5 py-3 text-left flex items-center space-x-3 transition-colors group ${
                                  isDarkMode
                                    ? 'hover:bg-gray-700 text-gray-300'
                                    : 'hover:bg-gray-200 text-gray-700 bg-gray-50'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                  isDarkMode
                                    ? 'bg-gray-700 group-hover:bg-gray-600'
                                    : 'bg-gray-200 group-hover:bg-purple-300'
                                }`}>
                                  <FileText className={`w-5 h-5 ${
                                    isDarkMode
                                      ? 'text-gray-400 group-hover:text-white'
                                      : 'text-gray-600 group-hover:text-purple-700'
                                  }`} />
                                </div>
                                <div>
                                  <div className={`font-semibold text-sm ${
                                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                  }`}>My Orders</div>
                                  <div className={`text-xs ${
                                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                  }`}>View order history</div>
                                </div>
                              </Link>
                            </>
                          )}
                          
                          {userType === 'doctor' && (
                            <Link
                              to="/analytics"
                              onClick={() => setShowUserMenu(false)}
                              className={`w-full px-5 py-3 text-left flex items-center space-x-3 transition-colors group ${
                                isDarkMode
                                  ? 'hover:bg-gray-700 text-gray-300'
                                  : 'hover:bg-gray-200 text-gray-700 bg-gray-50'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                isDarkMode
                                  ? 'bg-gray-700 group-hover:bg-gray-600'
                                  : 'bg-gray-200 group-hover:bg-blue-300'
                              }`}>
                                <Activity className={`w-5 h-5 ${
                                  isDarkMode
                                    ? 'text-gray-400 group-hover:text-white'
                                    : 'text-gray-600 group-hover:text-blue-700'
                                }`} />
                              </div>
                              <div>
                                <div className={`font-semibold text-sm ${
                                  isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                }`}>Analytics Dashboard</div>
                                <div className={`text-xs ${
                                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                                }`}>View insights & reports</div>
                              </div>
                            </Link>
                          )}

                          <div className={`border-t my-2 ${
                            isDarkMode ? 'border-gray-700' : 'border-gray-100'
                          }`} />

                          <button
                            onClick={handleLogout}
                            className={`w-full px-5 py-3 text-left flex items-center space-x-3 transition-colors group ${
                              isDarkMode
                                ? 'hover:bg-red-900/20 text-red-400'
                                : 'hover:bg-red-100 text-red-600 bg-gray-50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              isDarkMode
                                ? 'bg-red-900/30 group-hover:bg-red-900/50'
                                : 'bg-red-100 group-hover:bg-red-200'
                            }`}>
                              <LogOut className="w-5 h-5" />
                            </div>
                            <div>
                              <div className={`font-semibold text-sm ${
                                isDarkMode ? 'text-red-300' : 'text-red-700'
                              }`}>Logout</div>
                              <div className={`text-xs ${
                                isDarkMode ? 'text-red-500' : 'text-red-400'
                              }`}>Sign out of your account</div>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
              /* Login/Register Buttons - Minimalistic - Show when not logged in */
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLoginClick}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    isDarkMode
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`xl:hidden p-2 rounded-lg transition-colors ${
                isMobileMenuOpen
                  ? isDarkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'hover:bg-gray-800 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Minimalistic - Only show when logged in */}
        {isLoggedIn && (
          <AnimatePresence>
            {showSearch && (
              <motion.div
                ref={searchRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`border-t ${
                  isDarkMode
                    ? 'border-gray-800 bg-gray-900'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      placeholder="Search doctors, medicines, health info..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2 rounded-lg border transition-all placeholder-gray-400 ${
                        isDarkMode
                          ? 'border-gray-700 bg-gray-800 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                      }`}
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                          isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Mobile Menu - Minimalistic */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`xl:hidden border-t ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-800' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <nav className="px-4 py-4 space-y-1">
                {!isLoggedIn ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        isDarkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        handleRegisterClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        isDarkMode
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Register
                    </button>
                  </div>
                ) : (
                  navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        location.pathname === item.path
                          ? isDarkMode
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white'
                          : isDarkMode
                            ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default GovernmentHeader;
