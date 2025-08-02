import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY <= 300);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: 'Battles', path: '/battle', type: 'route' },
    { label: 'Blog', path: 'blog-section', type: 'scroll' },
    { label: 'Contact', path: '/contact', type: 'route' }
  ];

  const handleNavigation = (link) => {
    setIsMobileMenuOpen(false);
    if (link.type === 'route') navigate(link.path);
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
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
        </motion.div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) =>
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
                className={`text-customBlue hover:text-blue-700 transition-colors ${location.pathname === link.path ? 'font-bold' : ''
                  }`}
              >
                {link.label}
              </motion.button>
            )
          )}

          {isAuthenticated ? (
            <>
              <img
                src="https://avatar.iran.liara.run/public"
                alt="Profile"
                className="relative inline-block h-12 w-12 cursor-pointer rounded-full object-cover"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              />

              {isProfileMenuOpen && (
                <ul
                  role="menu"
                  className="absolute right-0 top-10 z-10 flex flex-col min-w-[180px] gap-2 rounded-md border bg-white p-3 text-sm shadow-lg"
                >
                  <a href="/profile">
                    <button className="menu-item">My Profile</button>
                  </a>
                  <a href="/dashboard">
                    <button className="menu-item">Dashboard</button>
                  </a>
                  <Link to={'/ratings'}>Rating</Link>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="menu-item text-red-500 hover:text-red-700"
                  >
                    Logout
                  </button>
                </ul>
              )}
            </>
          ) : (
            // Signup button when not logged in
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
            >
              Signup
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;