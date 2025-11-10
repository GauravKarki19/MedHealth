import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Dumbbell, 
  Apple, 
  Moon, 
  Activity, 
  Heart,
  ExternalLink,
  BookOpen,
  Sparkles
} from "lucide-react";
import { useDarkMode } from "../contexts/DarkMode/DarkModeContext";

const healthBlogs = [
  {
    id: 1,
    title: "Understanding Mental Health",
    category: "Mental Health",
    icon: Brain,
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    darkBgGradient: "from-purple-900/20 to-pink-900/20",
    image: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&auto=format&fit=crop",
    summary: "Explore the importance of mental health and ways to maintain psychological well-being in today's fast-paced world.",
    link: "https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response",
    source: "World Health Organization",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Benefits of Regular Exercise",
    category: "Physical Health",
    icon: Dumbbell,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    darkBgGradient: "from-blue-900/20 to-cyan-900/20",
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop",
    summary: "Learn about how regular physical activity can improve your health, boost mood, and prevent chronic diseases.",
    link: "https://www.cdc.gov/physicalactivity/basics/pa-health/index.htm",
    source: "Centers for Disease Control and Prevention",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "Nutrition and Diet Tips",
    category: "Nutrition",
    icon: Apple,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    darkBgGradient: "from-green-900/20 to-emerald-900/20",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    summary: "Essential guidelines for maintaining a balanced diet and making healthy food choices for optimal health.",
    link: "https://www.nih.gov/health-information/diet-nutrition",
    source: "National Institutes of Health",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Sleep and Recovery",
    category: "Wellness",
    icon: Moon,
    gradient: "from-indigo-500 to-blue-500",
    bgGradient: "from-indigo-50 to-blue-50",
    darkBgGradient: "from-indigo-900/20 to-blue-900/20",
    image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=800&auto=format&fit=crop",
    summary: "Understanding the importance of quality sleep and its impact on physical and mental recovery.",
    link: "https://www.sleepfoundation.org/sleep-hygiene",
    source: "Sleep Foundation",
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "Stress Management",
    category: "Mental Health",
    icon: Activity,
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
    darkBgGradient: "from-orange-900/20 to-red-900/20",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    summary: "Effective techniques and strategies to manage stress and maintain emotional balance in daily life.",
    link: "https://www.nimh.nih.gov/health/publications/stress",
    source: "National Institute of Mental Health",
    readTime: "8 min read"
  },
  {
    id: 6,
    title: "Heart Health Essentials",
    category: "Physical Health",
    icon: Heart,
    gradient: "from-red-500 to-pink-500",
    bgGradient: "from-red-50 to-pink-50",
    darkBgGradient: "from-red-900/20 to-pink-900/20",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop",
    summary: "Key factors in maintaining cardiovascular health and preventing heart disease through lifestyle choices.",
    link: "https://www.heart.org/en/health-topics",
    source: "American Heart Association",
    readTime: "6 min read"
  }
];

const categoryColors = {
  "Mental Health": { light: "bg-purple-100 text-purple-700", dark: "bg-purple-900/30 text-purple-300" },
  "Physical Health": { light: "bg-blue-100 text-blue-700", dark: "bg-blue-900/30 text-blue-300" },
  "Nutrition": { light: "bg-green-100 text-green-700", dark: "bg-green-900/30 text-green-300" },
  "Wellness": { light: "bg-indigo-100 text-indigo-700", dark: "bg-indigo-900/30 text-indigo-300" },
};

const HealthBlogs = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const categories = ["All", ...new Set(healthBlogs.map(blog => blog.category))];
  
  const filteredBlogs = selectedCategory === "All" 
    ? healthBlogs 
    : healthBlogs.filter(blog => blog.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50/30'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r ${
            isDarkMode 
              ? 'from-white via-blue-200 to-white' 
              : 'from-gray-900 via-blue-600 to-gray-900'
          } bg-clip-text text-transparent`}>
            Health & Wellness Info
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Access reliable health information, guidelines, and resources from trusted medical sources
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-md'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {filteredBlogs.map((blog) => {
              const IconComponent = blog.icon;
              const categoryColor = categoryColors[blog.category] || categoryColors["Wellness"];
              
              return (
                <motion.div
                  key={blog.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`group relative rounded-2xl overflow-hidden ${
                    isDarkMode 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-white border border-gray-200'
                  } shadow-xl hover:shadow-2xl transition-all duration-300`}
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop";
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      isDarkMode 
                        ? 'from-gray-900/90 via-gray-900/50 to-transparent' 
                        : 'from-black/60 via-black/30 to-transparent'
                    }`} />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md ${
                        isDarkMode 
                          ? categoryColor.dark 
                          : categoryColor.light
                      } shadow-lg`}>
                        <IconComponent className="w-4 h-4" />
                        <span className="text-xs font-bold">{blog.category}</span>
                      </div>
                    </div>

                    {/* Icon in Corner */}
                    <div className={`absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md bg-gradient-to-br ${blog.gradient} shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Title */}
                    <h2 className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${
                      isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900'
                    }`}>
                      {blog.title}
                    </h2>

                    {/* Summary */}
                    <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {blog.summary}
                    </p>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1.5 text-xs ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{blog.readTime}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {blog.source.split(' ')[0]}
                      </span>
                    </div>

                    {/* Read More Button */}
                    <motion.a
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/30'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30'
                      }`}
                    >
                      <span>Read Article</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300 pointer-events-none`} />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No articles found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HealthBlogs; 