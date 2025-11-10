import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkMode/DarkModeContext';

const GovernmentFooter = () => {
  const { isDarkMode } = useDarkMode();

  const footerLinks = {
    quickLinks: [
      { path: '/', label: 'Home' },
      { path: '/doctor-search', label: 'Find Doctors' },
      { path: '/buy-medicines', label: 'Medicines' },
      { path: '/disease-prediction', label: 'Health Check' },
      { path: '/health-blogs', label: 'Health Info' },
      { path: '/about', label: 'About Us' },
    ],
    services: [
      { path: '/doctors', label: 'Doctor Directory' },
      { path: '/buy-medicines', label: 'Pharmacy' },
      { path: '/disease-prediction', label: 'AI Health Check' },
      { path: '/health-blogs', label: 'Health Blogs' },
      { path: '/contact', label: 'Contact Us' },
      { path: '/feedback', label: 'Feedback' },
    ],
    support: [
      { path: '/about', label: 'About MedHealth' },
      { path: '/privacy', label: 'Privacy Policy' },
      { path: '/contact', label: 'Help Center' },
      { path: '/feedback', label: 'Report Issue' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className={`mt-20 ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
    }`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-black text-white">MedHealth</h3>
                <p className="text-xs text-gray-400 font-semibold">Healthcare Platform</p>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              Healthcare platform connecting citizens with quality healthcare services.
              Your health, our priority.
            </p>
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Helpline</p>
                  <a href="tel:+911234567890" className="text-white hover:text-blue-400 transition-colors">
                    +91 12345 67890
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <a href="mailto:support@medhealth.com" className="text-white hover:text-blue-400 transition-colors">
                    support@medhealth.com
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white text-sm">
                    Healthcare Services,<br />
                    India
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} MedHealth. All rights reserved.
            </p>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Secure & Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GovernmentFooter;
