import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Phone,
  Activity,
  FileText,
  Zap,
  TrendingUp,
  Globe,
  Heart,
  Shield,
  Users,
  Cross,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkMode/DarkModeContext';
import Button from '../components/common/Button';
import GlassCard from '../components/common/GlassCard';

const LandingPage = () => {
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  
  // Hero images that will rotate - Using high-quality Pexels images
  const heroImages = [
    'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg',
    'https://images.pexels.com/photos/5327579/pexels-photo-5327579.jpeg',
    'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection(1); // Auto-play goes to next (right)
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroImages.length]);

  // Manual navigation
  const goToNext = () => {
    setDirection(1); // Swipe left (next)
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToPrevious = () => {
    setDirection(-1); // Swipe right (previous)
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToSlide = (index) => {
    const newDirection = index > currentImageIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  // Animation variants for swipe transitions
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 1,
    }),
  };

  const features = [
    {
      icon: Stethoscope,
      title: 'Find Qualified Doctors',
      description: 'Search and connect with verified healthcare professionals in your area with real-time availability and detailed profiles.',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      darkBgGradient: 'from-blue-900/20 to-blue-800/20',
    },
    {
      icon: Calendar,
      title: 'Book Appointments',
      description: 'Schedule appointments online with real-time availability, instant confirmation, and smart AI-powered slot recommendations.',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      darkBgGradient: 'from-green-900/20 to-green-800/20',
    },
    {
      icon: MapPin,
      title: 'Location-Based Search',
      description: 'Find doctors near you with distance-based recommendations and get turn-by-turn directions to clinics.',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      darkBgGradient: 'from-purple-900/20 to-purple-800/20',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Access healthcare services round the clock with our emergency support and flexible appointment scheduling.',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      darkBgGradient: 'from-orange-900/20 to-orange-800/20',
    },
    {
      icon: Activity,
      title: 'AI Health Check',
      description: 'Use our AI-powered health assessment tools to monitor your wellbeing and get personalized health insights.',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-red-100',
      darkBgGradient: 'from-red-900/20 to-red-800/20',
    },
    {
      icon: FileText,
      title: 'Health Information',
      description: 'Access reliable health information, guidelines, and resources from trusted medical sources and experts.',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100',
      darkBgGradient: 'from-indigo-900/20 to-indigo-800/20',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All doctors are verified and certified healthcare professionals',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      darkColor: 'text-blue-400',
      darkBgColor: 'bg-blue-900/30',
    },
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book appointments instantly with real-time availability',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      darkColor: 'text-yellow-400',
      darkBgColor: 'bg-yellow-900/30',
    },
    {
      icon: TrendingUp,
      title: 'AI Recommendations',
      description: 'Get smart slot recommendations based on your preferences',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      darkColor: 'text-green-400',
      darkBgColor: 'bg-green-900/30',
    },
    {
      icon: Globe,
      title: 'Wide Coverage',
      description: 'Access healthcare services across multiple locations',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      darkColor: 'text-purple-400',
      darkBgColor: 'bg-purple-900/30',
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Image Carousel Section */}
      <section className={`relative w-full h-[650px] md:h-[750px] lg:h-[800px] overflow-hidden ${
        isDarkMode 
          ? 'bg-gray-900' 
          : 'bg-gray-900'
      }`}>
        {/* Image Carousel with Swipe Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentImageIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 400, damping: 40, duration: 0.6 },
                opacity: { duration: 0.3 }
              }}
              className="absolute inset-0 w-full h-full"
              style={{ willChange: 'transform' }}
            >
              <img
                src={heroImages[currentImageIndex]}
                alt={`Healthcare image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                style={{ pointerEvents: 'none' }}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient Overlay */}
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-b from-black/70 via-black/60 to-black/75' 
              : 'bg-gradient-to-b from-black/60 via-black/50 to-black/65'
          }`}></div>

          {/* Additional dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-300 shadow-lg hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-300 shadow-lg hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white max-w-5xl mx-auto w-full">
            <motion.h1
              key={`title-${currentImageIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 leading-tight px-4"
            >
              Your Health, Our Priority
            </motion.h1>
            <motion.p
              key={`description-${currentImageIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl lg:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed px-4"
            >
              MedHealth connects you with quality healthcare services. Book appointments, find doctors, and access health information—all in one platform.
            </motion.p>
            <motion.div
              key={`buttons-${currentImageIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center px-4"
            >
              <button
                onClick={() => navigate('/doctor-search')}
                className="bg-gray-50 text-blue-600 hover:bg-blue-100 shadow-lg px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Find a Doctor</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="bg-gray-50 text-blue-600 hover:bg-blue-100 shadow-lg px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300"
              >
                Learn More
              </button>
            </motion.div>
          </div>
        </div>

        {/* Bottom Gradient Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${
          isDarkMode ? 'from-gray-900 to-transparent' : 'from-white to-transparent'
        } z-5`}></div>
      </section>

      {/* Benefits Cards Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 mt-8 relative z-10 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
              >
                <GlassCard className={`text-center h-full border-2 transition-all duration-300 hover:shadow-2xl group cursor-pointer ${
                  isDarkMode
                    ? 'border-gray-700 hover:border-blue-600 bg-gray-800/50'
                    : 'border-gray-200 hover:border-blue-500 bg-white'
                }`}>
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                    isDarkMode ? benefit.darkBgColor : benefit.bgColor
                  }`}>
                    <benefit.icon className={`w-10 h-10 ${
                      isDarkMode ? benefit.darkColor : benefit.color
                    }`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 transition-colors ${
                    isDarkMode
                      ? 'text-white group-hover:text-blue-400'
                      : 'text-gray-900 group-hover:text-blue-900'
                  }`}>
                    {benefit.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {benefit.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-28 px-4 sm:px-6 lg:px-8 ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="mb-8">
              <span className={`text-sm font-semibold uppercase tracking-wide px-4 py-2 rounded-full ${
                isDarkMode 
                  ? 'text-blue-400 bg-blue-900/30' 
                  : 'text-blue-600 bg-blue-100'
              }`}>
                Our Services
              </span>
            </div>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Comprehensive Healthcare Solutions
            </h2>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Everything you need for your healthcare journey in one trusted platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
              >
                <GlassCard className={`h-full border-2 transition-all duration-300 hover:shadow-2xl group cursor-pointer overflow-hidden relative ${
                  isDarkMode
                    ? 'border-gray-700 hover:border-blue-600 bg-gray-800/50'
                    : 'border-gray-200 hover:border-blue-500 bg-white'
                }`}>
                  {/* Hover Effect Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0 ${
                    isDarkMode ? feature.darkBgGradient : feature.bgGradient
                  }`} />
                  
                  <div className="relative z-10 p-8">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 transition-colors ${
                      isDarkMode
                        ? 'text-white group-hover:text-blue-400'
                        : 'text-gray-900 group-hover:text-blue-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed transition-colors text-base ${
                      isDarkMode
                        ? 'text-gray-400 group-hover:text-gray-300'
                        : 'text-gray-600 group-hover:text-gray-700'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800'
          : 'bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600'
      } text-white`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-8 mx-auto shadow-xl"
            >
              <Heart className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-50 max-w-3xl mx-auto leading-relaxed">
              Join thousands of users who trust MedHealth for their healthcare needs.
              Book your appointment today and experience quality healthcare services.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/doctor-search')}
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl px-8 py-4 text-lg"
              >
                Find a Doctor
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/contact')}
                className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 border-t-4 ${
        isDarkMode
          ? 'bg-gray-900 border-red-600'
          : 'bg-gradient-to-r from-red-50 to-red-100 border-red-500'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center justify-center w-20 h-20 rounded-full bg-red-600 text-white shadow-lg"
              >
                <Phone className="w-10 h-10" />
              </motion.div>
              <div>
                <h3 className={`text-3xl font-black mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Emergency Helpline
                </h3>
                <p className={`text-xl ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Available 24/7 for medical emergencies
                </p>
              </div>
            </div>
            <motion.a
              href="tel:+911234567890"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-4 px-10 py-5 rounded-xl font-bold text-xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Phone className="w-7 h-7" />
              <span>+91 12345 67890</span>
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
