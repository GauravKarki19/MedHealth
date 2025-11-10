import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Grid3x3 } from 'lucide-react';
import ProductCard from './ProductCard';
import medicinesData from '../../data/medicinesData';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';

const TopProducts = () => {
    const { isDarkMode } = useDarkMode();

    return (
        <div className="w-full">
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {medicinesData.slice(0, 7).map(item => (
                        <ProductCard
                            key={item.id}
                            {...item}
                        />
                ))}
                {/* Browse All Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative"
                >
                    <Link to="/all-medicines">
                        <div className={`relative h-full min-h-[400px] rounded-2xl overflow-hidden ${
                            isDarkMode 
                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                                : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200'
                        } shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center p-8`}>
                            {/* Icon */}
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                                isDarkMode 
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                            } shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Grid3x3 className="w-10 h-10 text-white" />
                            </div>
                            
                            {/* Text */}
                            <h3 className={`text-2xl font-black mb-2 text-center ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Browse All
                            </h3>
                            <h3 className={`text-2xl font-black mb-6 text-center ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Medicines
                            </h3>
                            
                            {/* CTA Button */}
                            <div className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                isDarkMode
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                            } shadow-md group-hover:shadow-lg`}>
                                <span>View All</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                            
                            {/* Hover Border Effect */}
                            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300 pointer-events-none" />
                        </div>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default TopProducts;