import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Name: allow letters and spaces, min 2 chars
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (at least 2 characters).';
    }

    // Email: standard email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Message: at least 5 chars, max 1000
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = 'Message must be at least 5 characters.';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message must be under 1000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await axios.post(`${API_BASE_URL}/api/contact`, formData);
        toast.success("Message sent successfully!", {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        toast.error('Failed to send message.');
        console.error('Contact form error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear error for this field when user types
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: '' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 pt-[140px] pb-20">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter uppercase italic">Get In Touch</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
              Have questions or want to collaborate? We'd love to hear from you!
            </p>
          </div>

          <form
            className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-10 md:p-14 space-y-8"
            onSubmit={handleSubmit}
          >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest pl-4" htmlFor="name">
                    Name or Username
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-6 py-4 border rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium ${errors.name ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 dark:text-white'
                      }`}
                    placeholder="Abhishek Choudhary"
                  />
                  {errors.name && <p className="text-red-500 text-xs font-bold pl-4">{errors.name}</p>}
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest pl-4" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-6 py-4 border rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium ${errors.email ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 dark:text-white'
                      }`}
                    placeholder="abhishek@gmail.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs font-bold pl-4">{errors.email}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-black text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-widest pl-4" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 border rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none ${errors.message ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 dark:text-white'
                    }`}
                  placeholder="Type your message here..."
                />
                <div className="flex justify-between px-4">
                  {errors.message && <p className="text-red-500 text-xs font-bold">{errors.message}</p>}
                  <p className="text-gray-400 dark:text-gray-600 text-[10px] font-black uppercase tracking-widest ml-auto">{formData.message.length}/1000</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20 uppercase tracking-widest text-sm"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
