import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // More nuanced scroll detection
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll event for performance
    const throttledHandleScroll = () => {
      if (!window.requestAnimationFrame) {
        handleScroll();
      } else {
        window.requestAnimationFrame(handleScroll);
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  // Navigation links configuration
  const navLinks = [
    { 
      label: 'Dashboard', 
      path: '/dashboard',
      type: 'route'
    },
    { 
      label: 'Battles', 
      path: '/battle',
      type: 'route'
    },
    { 
      label: 'Blog', 
      path: 'blog-section',
      type: 'scroll'
    },
    { 
      label: 'Contact', 
      path: '/contact',
      type: 'route'
    }
  ];

  const handleNavigation = (link) => {
    // Close mobile menu
    setIsMobileMenuOpen(false);

    // Handle navigation based on link type
    if (link.type === 'route') {
      navigate(link.path);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ 
        opacity: 1, 
        y: isVisible ? 0 : -100,
        transition: { duration: 0.3 }
      }}
      className="fixed top-0 left-0 w-full z-50 bg-white shadow-md"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="cursor-pointer"
        >
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto object-contain"
          />
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            link.type === 'scroll' ? (
              <ScrollLink
                key={link.label}
                to={link.path}
                smooth={true}
                duration={500}
                offset={-70}
                className="text-customBlue hover:text-blue-700 transition-colors cursor-pointer"
              >
                {link.label}
              </ScrollLink>
            ) : (
              <motion.button
                key={link.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(link)}
                className={`text-customBlue hover:text-blue-700 transition-colors ${
                  location.pathname === link.path ? 'font-bold' : ''
                }`}
              >
                {link.label}
              </motion.button>
            )
          ))}

          {/* Sign Up Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
            className="bg-customBlue text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            <i className="fas fa-user mr-2"></i>Sign Up
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-customBlue focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <i className="fas fa-times text-2xl"></i>
            ) : (
              <i className="fas fa-bars text-2xl"></i>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => (
                link.type === 'scroll' ? (
                  <ScrollLink
                    key={link.label}
                    to={link.path}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-customBlue hover:bg-blue-50 px-3 py-2 rounded"
                  >
                    {link.label}
                  </ScrollLink>
                ) : (
                  <button
                    key={link.label}
                    onClick={() => handleNavigation(link)}
                    className={`w-full text-left text-customBlue hover:bg-blue-50 px-3 py-2 rounded ${
                      location.pathname === link.path ? 'font-bold' : ''
                    }`}
                  >
                    {link.label}
                  </button>
                )
              ))}

              {/* Mobile Sign Up Button */}
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-customBlue text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <i className="fas fa-user mr-2"></i>Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;