import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Pill, Star, ArrowRight, Sparkles } from "lucide-react";
import FeaturedSlider from "../components/medicines/FeaturedProducts";
import TopProducts from "../components/medicines/TopProducts";
import useDocTitle from "../hooks/useDocTitle";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import { useDarkMode } from "../contexts/DarkMode/DarkModeContext";

const BuyMedicines = () => {
  const { isLoading, toggleLoading } = useContext(commonContext);
  const { isDarkMode } = useDarkMode();

  useDocTitle("Buy Medicines");

  const navigate = useNavigate();
  const userNotExists =
    localStorage.getItem("usertype") === undefined ||
    localStorage.getItem("usertype") === null;

  useEffect(() => {
    if (userNotExists) {
      navigate("/");
    } else {
      toggleLoading(true);
      setTimeout(() => toggleLoading(false), 1000);
    }
    //eslint-disable-next-line
  }, []);

  useScrollDisable(isLoading);

  if (isLoading) {
    return <Preloader />;
  }

  const features = [
    { icon: Pill, text: "Verified Medicines", color: "from-blue-500 to-cyan-500" },
    { icon: ShoppingBag, text: "Fast Delivery", color: "from-green-500 to-emerald-500" },
    { icon: Star, text: "Quality Assured", color: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div id="buy-medicines" className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50/30'
    }`}>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200 dark:border-blue-700"
              >
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className={`text-sm font-semibold ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  Trusted Pharmacy Platform
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`text-4xl md:text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-r ${
                  isDarkMode
                    ? 'from-white via-blue-200 to-white'
                    : 'from-gray-900 via-blue-600 to-gray-900'
                } bg-clip-text text-transparent`}
              >
                Premium Medicines
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Collection
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`text-lg md:text-xl leading-relaxed ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Access a wide range of verified medicines from trusted pharmacies. 
                Fast delivery, quality assured, and affordable prices—all in one place.
              </motion.p>

              {/* Price Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className={`px-6 py-3 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                } shadow-lg`}>
                  <span className="text-white text-sm font-semibold">Starting at</span>
                  <span className="text-white text-2xl font-black ml-2">₹49</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/all-medicines")}
                  className={`px-8 py-4 rounded-xl font-bold text-base shadow-xl transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-blue-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/30'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    Browse Medicines
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/all-medicines")}
                  className={`px-8 py-4 rounded-xl font-bold text-base border-2 transition-all duration-300 ${
                    isDarkMode
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  View All
                </motion.button>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="grid grid-cols-3 gap-4 pt-4"
              >
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className={`flex flex-col items-center p-4 rounded-xl ${
                        isDarkMode 
                          ? 'bg-gray-800 border border-gray-700' 
                          : 'bg-white border border-gray-200'
                      } shadow-md`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.color} mb-2`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className={`text-xs font-semibold text-center ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {feature.text}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
                  alt="Medicines Collection"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop";
                  }}
                />
                {/* Decorative Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  isDarkMode 
                    ? 'from-gray-900/40 via-gray-900/20 to-transparent' 
                    : 'from-black/30 via-black/10 to-transparent'
                }`} />
              </div>
              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute -bottom-6 -left-6 px-6 py-4 rounded-2xl shadow-2xl ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-white fill-white" />
                  <div>
                    <div className="text-white text-xs font-semibold">Verified</div>
                    <div className="text-white text-sm font-black">Quality Assured</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Medicines Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <h2 className={`text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r ${
              isDarkMode
                ? 'from-white via-blue-200 to-white'
                : 'from-gray-900 via-blue-600 to-gray-900'
            } bg-clip-text text-transparent`}>
              Featured Medicines
            </h2>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Handpicked selection of our most popular and trusted medicines
            </p>
          </motion.div>
          <FeaturedSlider />
        </div>
      </section>

      {/* Latest Medicines Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h2 className={`text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r ${
              isDarkMode
                ? 'from-white via-green-200 to-white'
                : 'from-gray-900 via-green-600 to-gray-900'
            } bg-clip-text text-transparent`}>
              Latest Medicines
            </h2>
            <p className={`text-lg ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Explore our newest additions to the medicine collection
            </p>
          </motion.div>
          <TopProducts />
        </div>
      </section>
    </div>
  );
};

export default BuyMedicines;