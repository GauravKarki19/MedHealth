import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Check } from 'lucide-react';
import cartContext from '../../contexts/cart/cartContext';
import useActive from '../../hooks/useActive';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';

const ProductCard = (props) => {
    const { id, images, title, price } = props;
    const { addItem, placeOrder } = useContext(cartContext);
    const { active, handleActive } = useActive(false);
    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();
    const [balance, setBalance] = React.useState(0);

    // Add useEffect to fetch wallet balance
    React.useEffect(() => {
        httpClient.post("/get_wallet", { email: localStorage.getItem("email") })
            .then((res) => {
                setBalance(Number(res.data.wallet));
            });
    }, []);

    // handling Add-to-cart
    const handleAddItem = () => {
        const item = { ...props };
        addItem(item);
        handleActive(id);
        setTimeout(() => {
            handleActive(false);
        }, 3000);
    };

    // Handling direct purchase
    const handleDirectPurchase = () => {
        const order = { ...props, quantity: 1 };
        if (price <= balance) {
            httpClient.post("/debit_wallet", {
                email: localStorage.getItem("email"),
                walletAmount: price,
            }).then(() => {
                localStorage.setItem("orders", JSON.stringify([order]));
                window.location.href = "https://telmedsphere-server.vercel.app/success";
            });
        } else {
            localStorage.setItem("totalPrice", price);
            localStorage.setItem("orders", JSON.stringify([order]));
            navigate("/checkout");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative w-full"
        >
            <div className={`relative rounded-2xl overflow-hidden ${
                isDarkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
            } shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col`}>
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800">
                    <Link to={`/all-medicines/medicine-details/${id}`} className="block w-full h-full">
                        <motion.img
                            src={images[0]}
                            alt={title}
                            className="w-full h-full object-contain p-6"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop";
                            }}
                        />
                    </Link>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Quick View Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <div className={`px-3 py-1.5 rounded-full backdrop-blur-md ${
                            isDarkMode 
                                ? 'bg-gray-900/80 text-white' 
                                : 'bg-white/90 text-gray-900'
                        } text-xs font-semibold shadow-lg`}>
                            View Details
                        </div>
                    </motion.div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                    {/* Title */}
                    <Link to={`/all-medicines/medicine-details/${id}`}>
                        <h3 className={`text-lg font-bold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${
                            isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900'
                        }`}>
                            {title}
                        </h3>
                    </Link>

                    {/* Price Section */}
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
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
                            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                                isDarkMode 
                                    ? 'bg-green-900/30 text-green-300' 
                                    : 'bg-green-100 text-green-700'
                            }`}>
                                <Check className="w-4 h-4" />
                                <span className="text-xs font-semibold">In Stock</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => {
                                    localStorage.setItem("totalPrice", price);
                                    const order = { ...props, quantity: 1 };
                                    placeOrder(order);
                                    navigate("/checkout");
                                }}
                                className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                            >
                                <Zap className="w-4 h-4" />
                                Buy Now
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleAddItem}
                                className={`flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                                    active
                                        ? isDarkMode
                                            ? 'bg-green-600 text-white'
                                            : 'bg-green-500 text-white'
                                        : isDarkMode
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                }`}
                            >
                                {active ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Added
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/50 transition-all duration-300 pointer-events-none" />
            </div>
        </motion.div>
    );
};

export default ProductCard;