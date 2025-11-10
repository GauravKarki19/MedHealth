import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, A11y, Autoplay, Navigation } from "swiper/modules";
import medicinesData from "../../data/medicinesData";
import { useDarkMode } from "../../contexts/DarkMode/DarkModeContext";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const FeaturedSlider = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="relative">
    <Swiper
        modules={[EffectCoverflow, Pagination, A11y, Autoplay, Navigation]}
      loop={true}
        speed={600}
        spaceBetween={30}
      slidesPerView={"auto"}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
        }}
      effect={"coverflow"}
      centeredSlides={true}
      coverflowEffect={{
          rotate: 15,
        stretch: 0,
          depth: 100,
          modifier: 2.5,
          slideShadows: true,
      }}
      autoplay={{
          delay: 3000,
        disableOnInteraction: false,
          pauseOnMouseEnter: true,
      }}
      breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          640: {
          slidesPerView: 2,
            spaceBetween: 30,
        },
          1024: {
          slidesPerView: 3,
            spaceBetween: 40,
        },
      }}
        className="!py-12 !pb-20 featured-swiper"
    >
      {medicinesData.slice(0, 5).map((item) => {
        const { id, images, title, price } = item;

        return (
            <SwiperSlide key={id} className="!w-auto">
              <motion.div
                whileHover={{ y: -10, scale: 1.05 }}
                className={`group relative h-full rounded-2xl overflow-hidden ${
                  isDarkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                } shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 w-[280px] md:w-[320px]`}
              >
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                    <Star className="w-3.5 h-3.5 text-white fill-white" />
                    <span className="text-xs font-bold text-white">Featured</span>
                  </div>
                </div>

                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800">
                  <Link to={`/all-medicines/medicine-details/${id}`} className="block w-full h-full">
                    <motion.img
                  src={images[0]}
                      alt={title}
                      className="w-full h-full object-contain p-6"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.4 }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop";
                      }}
                />
              </Link>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Title */}
                  <Link to={`/all-medicines/medicine-details/${id}`}>
                    <h3 className={`text-lg font-bold mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${
                      isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900'
                    }`}>
                      {title}
                    </h3>
                  </Link>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <span className={`text-xs font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Price
                      </span>
                      <div className={`text-2xl font-black ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        ₹{price}
                      </div>
                    </div>
                    <Link
                      to={`/all-medicines/medicine-details/${id}`}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
                      } shadow-lg hover:shadow-xl`}
                    >
                      <span>View</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300 pointer-events-none" />
              </motion.div>
          </SwiperSlide>
        );
      })}
    </Swiper>

    </div>
  );
};

export default FeaturedSlider;