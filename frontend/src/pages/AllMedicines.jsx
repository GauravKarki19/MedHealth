import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BsExclamationCircle } from "react-icons/bs";
import useDocTitle from "../hooks/useDocTitle";
import FilterBar from "../components/medicines/FilterBar";
import ProductCard from "../components/medicines/ProductCard";
import filtersContext from "../contexts/filters/filterContext";
import EmptyView from "../components/common/EmptyView";
import SearchBar from "../components/common/SearchBar";
import { useNavigate } from "react-router-dom";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import { useDarkMode } from "../contexts/DarkMode/DarkModeContext";

const AllMedicines = () => {
  const { isLoading, toggleLoading } = useContext(commonContext);
  const { isDarkMode } = useDarkMode();
  const { allProducts } = useContext(filtersContext);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Number of items per page

  useDocTitle("All Medicines");

  const navigate = useNavigate();
  const userNotExists =
    localStorage.getItem("usertype") === undefined ||
    localStorage.getItem("usertype") === null;

  useEffect(() => {
    if (userNotExists) {
      navigate("/");
    } else {
      toggleLoading(true);
      setTimeout(() => toggleLoading(false), 2000);
    }
    //eslint-disable-next-line
  }, []);

  // Reset to page 1 when products change (due to filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [allProducts.length]);

  useScrollDisable(isLoading);

  // Calculate pagination
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Show first 3 pages, ellipsis, and last page
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page, ellipsis, and last 3 pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50/30'
    }`}>
      {/* search-bar */}
      <section id="" className="pt-20 sticky top-0 z-[500] overflow-hidden">
        <SearchBar />
      </section>
      
      {/* all_products section*/}
      <section
        id=""
        className="overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Filter Bar */}
            <div className="col-span-12 lg:col-span-3">
              <FilterBar />
            </div>
            
            {/* Products Container */}
            <div className="col-span-12 lg:col-span-9">
              {/* Results Count */}
              <div className={`mb-6 flex items-center justify-between ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p className="text-sm font-medium">
                  Showing <span className="font-bold">{startIndex + 1}</span> -{" "}
                  <span className="font-bold">
                    {Math.min(endIndex, allProducts.length)}
                  </span>{" "}
                  of <span className="font-bold">{allProducts.length}</span> medicines
                </p>
                {totalPages > 1 && (
                  <p className="text-sm font-medium">
                    Page <span className="font-bold">{currentPage}</span> of{" "}
                    <span className="font-bold">{totalPages}</span>
                  </p>
                )}
              </div>

              {/* Products Grid */}
              {currentProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {currentProducts.map((item) => (
                      <ProductCard key={item.id} {...item} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-wrap items-center justify-center gap-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {/* Previous Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                          currentPage === 1
                            ? isDarkMode
                              ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                            : isDarkMode
                              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </motion.button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-2">
                        {getPageNumbers().map((page, index) => {
                          if (page === '...') {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className={`px-3 py-2 ${
                                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                }`}
                              >
                                ...
                              </span>
                            );
                          }

                          return (
                            <motion.button
                              key={page}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 min-w-[40px] ${
                                currentPage === page
                                  ? isDarkMode
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                                  : isDarkMode
                                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md'
                              }`}
                            >
                              {page}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                          currentPage === totalPages
                            ? isDarkMode
                              ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                            : isDarkMode
                              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-md'
                        }`}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  )}
                </>
              ) : (
                <EmptyView
                  icon={<BsExclamationCircle className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />}
                  msg="No Results Found"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllMedicines;
