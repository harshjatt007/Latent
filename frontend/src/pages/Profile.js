import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { motion } from 'framer-motion';
import { User, Mail, BookOpen, Edit3, Save, X } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuthStore();
  
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    bio: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setUserDetails({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const nameParts = userDetails.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await axios.post(`${API_BASE_URL}/api/updateProfile`, {
        userId: user?._id || user?.id,
        firstName,
        lastName,
        email: userDetails.email,
        bio: userDetails.bio,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex-grow pt-[120px] container mx-auto px-4 max-w-4xl mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Background Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
            {/* Header / Hero Area */}
            <div className="h-48 bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 relative overflow-hidden">
               {/* Pattern overlay */}
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:24px_24px]" />
            </div>

            <div className="px-8 pb-10">
              {/* Profile Avatar overlap */}
              <div className="relative -mt-20 flex flex-col items-center">
                <div className="w-40 h-40 rounded-[2rem] border-[6px] border-white dark:border-gray-900 shadow-2xl overflow-hidden bg-white dark:bg-gray-800 transition-transform duration-300 hover:scale-105 relative">
                  <UserAvatar user={user} size="w-full h-full" textClass="text-5xl" />
                </div>
                
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-6 tracking-tight">
                  {userDetails.name}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium">
                  <Mail size={16} />
                  <span>{userDetails.email}</span>
                </div>

                {/* Role Badge */}
                <div className="mt-4">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                    user?.role === 'contestant' 
                      ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' 
                      : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                  }`}>
                    {user?.role === 'contestant' ? 'Contestant' : 'Audience'}
                  </span>
                </div>
              </div>

              {/* Form Content */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 ring-1 ring-gray-100 dark:ring-gray-800 p-8 rounded-[2rem] bg-gray-50/50 dark:bg-gray-800/30">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
                    <User size={14} /> Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={userDetails.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all shadow-sm font-semibold text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="px-5 py-4 bg-white/50 dark:bg-gray-900/50 rounded-2xl border border-transparent font-bold text-gray-800 dark:text-gray-200">
                      {userDetails.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
                    <Mail size={14} /> Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all shadow-sm font-semibold text-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="px-5 py-4 bg-white/50 dark:bg-gray-900/50 rounded-2xl border border-transparent font-bold text-gray-800 dark:text-gray-200">
                      {userDetails.email}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
                    <BookOpen size={14} /> About Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={userDetails.bio}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white dark:bg-gray-900 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 rounded-2xl outline-none transition-all shadow-sm font-semibold text-gray-900 dark:text-white min-h-[120px] resize-none"
                      placeholder="Share your talent journey..."
                    />
                  ) : (
                    <div className="px-5 py-4 bg-white/50 dark:bg-gray-900/50 rounded-2xl border border-transparent font-medium text-gray-700 dark:text-gray-300 min-h-[120px]">
                      {userDetails.bio || "No biography provided yet. Tap edit to add one!"}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 flex justify-center gap-4">
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleEditing}
                      className="flex items-center gap-2 px-8 py-4 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-black rounded-2xl transition hover:bg-gray-300 dark:hover:bg-gray-700 shadow-lg"
                    >
                      <X size={20} /> Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white font-black rounded-2xl transition hover:bg-blue-700 shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)]"
                    >
                      <Save size={20} /> Save Changes
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleEditing}
                    className="flex items-center gap-3 px-12 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl transition hover:shadow-2xl shadow-xl"
                  >
                    <Edit3 size={20} /> Edit Information
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;