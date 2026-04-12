import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { RopeLightSwitch } from '../context/ThemeContext';
import UserAvatar from './UserAvatar';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY <= 300);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileMenuOpen && !e.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/', type: 'route' },
    { label: 'Battles', path: '/battle', type: 'route' },
    ...(user?.role !== 'contestant' ? [{ label: 'Ratings', path: '/ratings', type: 'route' }] : []),
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
      className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/30 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="cursor-pointer"
        >
          <img src={logo} alt="Latent Logo" className="h-12 w-auto object-contain" />
        </motion.div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) =>
            link.type === 'scroll' ? (
              <ScrollLink
                key={link.label}
                to={link.path}
                smooth={true}
                duration={500}
                offset={-70}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer font-medium"
              >
                {link.label}
              </ScrollLink>
            ) : (
              <motion.button
                key={link.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(link)}
                className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium ${
                  location.pathname === link.path ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
                }`}
              >
                {link.label}
              </motion.button>
            )
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="relative profile-menu-container" onClick={() => setIsProfileMenuOpen((prev) => !prev)}>
                  <UserAvatar user={user} />

                <AnimatePresence>
                  {isProfileMenuOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                    className="absolute right-0 top-14 z-10 flex flex-col min-w-[180px] gap-1 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm shadow-xl"
                  >
                    <Link
                      to="/profile"
                      className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                    >
                      Account Settings
                    </Link>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
                    >
                      {user?.role === 'contestant' ? 'Contestant Dashboard' : 'User Dashboard'}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin-dash"
                        className="px-4 py-2 rounded-lg text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                        navigate('/');
                      }}
                      className="px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left font-medium"
                    >
                      Logout
                    </button>
                  </motion.ul>
                )}
                </AnimatePresence>
              </div>
              <RopeLightSwitch />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <RopeLightSwitch />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
                className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-semibold shadow-md"
              >
                Sign Up
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-300 transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 px-4 pb-4 overflow-hidden"
          >
            <div className="flex flex-col gap-3 pt-3">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavigation(link)}
                  className="text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium py-2"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex items-center gap-3 py-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">Theme:</span>
                <RopeLightSwitch />
              </div>
              {!isCheckingAuth && (
                isAuthenticated ? (
                  <>
                    <Link to="/profile" className="text-gray-700 dark:text-gray-300 font-medium py-2">Account Settings</Link>
                    <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 font-medium py-2">{user?.role === 'contestant' ? 'Contestant Dashboard' : 'User Dashboard'}</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin-dash" className="text-blue-600 dark:text-blue-400 font-bold py-2">Admin Dashboard</Link>
                    )}
                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-500 font-medium py-2 text-left">Logout</button>
                  </>
                ) : (
                  <button onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }} className="bg-blue-600 text-white rounded-lg py-2 font-semibold">Sign Up</button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;