import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Gaurav Karki",
      role: "Founder & CEO",
      avatar: "https://ui-avatars.com/api/?name=Gaurav+Karki&background=3b82f6&color=fff&size=200",
    },
    {
      name: "Yash Pandey",
      role: "Co-Founder & CTO",
      avatar: "https://ui-avatars.com/api/?name=Yash+Pandey&background=10b981&color=fff&size=200",
    },
    {
      name: "Priyanshu SenGupta",
      role: "Co-Founder & CPO",
      avatar: "https://ui-avatars.com/api/?name=Priyanshu+SenGupta&background=8b5cf6&color=fff&size=200",
    },
  ];

  const openSourcePrograms = [
    {
      name: "KWoC 2k24",
      link: "https://kwoc.kossiitkgp.org/",
      logo: "https://raw.githubusercontent.com/PratikMane0112/TelMedSphere/master/Overview/KWoC.png",
    },
    {
      name: "SWoC 2k25",
      link: "https://www.socialwinterofcode.com/",
      logo: "https://raw.githubusercontent.com/PratikMane0112/TelMedSphere/master/Overview/SWoC.png",
    },
    {
      name: "DWoC 2k25",
      link: "https://dwoc.io/",
      logo: "https://raw.githubusercontent.com/PratikMane0112/TelMedSphere/master/Overview/DWoC.jpg",
    },
    {
      name: "IWoC 2k25",
      link: "https://iwoc3.devfolio.co/",
      logo: "https://raw.githubusercontent.com/PratikMane0112/TelMedSphere/master/Overview/IWoC.png",
    },
  ];

  const platformFeatures = [
    {
      title: "Smart Doctor Search",
      description:
        "Find qualified doctors by specialty, availability, and location. Our intelligent search helps you discover the best healthcare providers near you with real-time availability.",
      icon: "🔍",
      image: "/public/doctor-image.png",
      stats: {
        value: "1000+",
        label: "Verified Doctors",
      },
      features: ["Specialty Filter", "Location-based Search", "Availability Check"],
    },
    {
      title: "Real-time Appointment Booking",
      description:
        "Book appointments instantly with real-time slot availability. Our system prevents double bookings and sends instant confirmations with reminders.",
      icon: "📅",
      image: "/public/doctor-image.png",
      stats: {
        value: "24/7",
        label: "Booking Available",
      },
      features: ["Instant Booking", "Conflict Prevention", "Auto Reminders"],
    },
    {
      title: "Location-based Services",
      description:
        "Find doctors based on your location with distance calculations. Get directions to clinics and see nearby healthcare facilities on an interactive map.",
      icon: "📍",
      image: "/public/doctor-image.png",
      stats: {
        value: "50km",
        label: "Search Radius",
      },
      features: [
        "Distance Calculation",
        "Map Integration",
        "Clinic Directions",
      ],
    },
    {
      title: "Medicine Marketplace",
      description:
        "Purchase prescribed medicines and health products from our verified pharmacy partners. Fast delivery and secure payment options available.",
      icon: "💊",
      image: "/public/doctor-image.png",
      stats: {
        value: "5000+",
        label: "Medicines Available",
      },
      features: ["Verified Pharmacy", "Fast Delivery", "Secure Payment"],
    },
    {
      title: "Health Analytics Dashboard",
      description:
        "Doctors can track their appointments, patient history, and clinic performance through comprehensive analytics and insights.",
      icon: "📊",
      image: "/public/doctor-image.png",
      stats: {
        value: "Real-time",
        label: "Analytics",
      },
      features: ["Appointment Insights", "Patient Trends", "Performance Metrics"],
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const scrollYProgress = useScrollProgress();

  return (
    <div className="w-full bg-gray-50 dark:bg-black-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen flex items-center relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20 px-4 dark:bg-none dark:bg-black-6"
      >
        <div className="max-w-7xl mx-auto w-full ">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-5/12 space-y-8 z-10 lg:pr-8"
            >
              <div>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block px-4 py-1 text-sm font-medium bg-blue-600 text-white rounded-full mb-4"
                >
                  Modern Healthcare Platform
                </motion.span>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight dark:text-white"
                >
                  Your Health, Our Priority
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl text-gray-600 leading-relaxed dark:text-gray-300"
                >
                  MedHealth connects patients with qualified healthcare professionals 
                  through an intuitive platform that makes finding and booking doctor 
                  appointments simple, fast, and convenient.
                </motion.p>
              </div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/doctor-search"
                    className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-300 text-lg"
                  >
                    Find Doctors
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/contact"
                    className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 text-lg border-2 border-gray-200 dark:text-white dark:hover:bg-gray-100"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-7/12 relative h-full mt-8 lg:mt-0"
            >
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="relative"
              >
                <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-blue-200">
                  <img
                    src="https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
                    alt="Healthcare Professional"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-blue-600/10 to-transparent"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Platform Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
              Everything you need for your healthcare journey in one convenient platform
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 dark:bg-gray-800"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900"
                  >
                    <span className="text-3xl">{feature.icon}</span>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-300">
                    {feature.description}
                  </p>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-4 pt-4 border-t border-gray-100"
                  >
                    <ul className="space-y-2">
                      {feature.features.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-sm text-gray-600 flex items-center justify-center dark:text-gray-300"
                        >
                          <svg
                            className="w-4 h-4 text-green-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Project Leadership Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">
              Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Dedicated professionals committed to improving healthcare access
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
                className="bg-white rounded-2xl p-6 shadow-lg group dark:bg-gray-800"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-full aspect-square max-w-[200px] mx-auto mb-6 overflow-hidden rounded-2xl"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">
                    {member.name}
                  </h3>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium dark:bg-blue-900 dark:text-blue-200"
                  >
                    {member.role}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contributors Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-4 bg-white"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              MedHealth is committed to making quality healthcare accessible to everyone. 
              We believe that finding the right doctor and booking appointments should be 
              simple, transparent, and convenient. Our platform connects patients with 
              verified healthcare professionals, ensuring you receive the care you need when you need it.
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-blue-50 rounded-xl p-6 dark:bg-gray-800"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-300">
                To become the most trusted healthcare platform, connecting millions of 
                patients with quality healthcare providers seamlessly.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-green-50 rounded-xl p-6 dark:bg-gray-800"
            >
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Leveraging cutting-edge technology to simplify healthcare access and 
                improve patient-doctor interactions.
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-purple-50 rounded-xl p-6 dark:bg-gray-800"
            >
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">Trust & Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All doctors are verified professionals. We ensure quality care and 
                maintain the highest standards of service.
              </p>
            </motion.div>
          </motion.div>
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <Link
              to="/doctor-search"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-300 text-lg"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Open Source Programs Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-4"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">
              Why Choose MedHealth?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experience healthcare made simple and accessible
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Easy Booking",
                description: "Book appointments in just a few clicks with real-time availability",
                icon: "⚡"
              },
              {
                title: "Verified Doctors",
                description: "All healthcare providers are verified and licensed professionals",
                icon: "✅"
              },
              {
                title: "Location-based",
                description: "Find doctors near you with distance calculations and directions",
                icon: "📍"
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock customer support to assist you anytime",
                icon: "🔄"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col items-center text-center dark:bg-gray-800"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 0.5 },
                  }}
                  className="text-5xl mb-4"
                >
                  {feature.icon}
                </motion.div>
                <motion.h3
                  initial={{ y: 0 }}
                  whileHover={{ y: -5 }}
                  className="text-xl font-semibold text-gray-800 mb-3 dark:text-white"
                >
                  {feature.title}
                </motion.h3>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Floating Navigation Dots */}
      {/* <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4"
      >
        {["hero", "features", "leadership", "contributors", "programs"].map(
          (section, index) => (
            <motion.div
              key={section}
              whileHover={{ scale: 1.2 }}
              className="w-3 h-3 rounded-full bg-blue-600 cursor-pointer"
              onClick={() => {
                const element = document.getElementById(section);
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          )
        )}
      </motion.div> */}

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{
          scaleX: scrollYProgress,
        }}
      />
    </div>
  );
};

// Custom hook for scroll progress
const useScrollProgress = () => {
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / scrollHeight;
      setScrollYProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollYProgress;
};

export default AboutUs;
