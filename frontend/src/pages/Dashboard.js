import React, { useState, useEffect } from 'react';
import { VideoIcon, Star, Award, Users, Trophy, Play, Info, Search, TrendingUp, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserAvatar from '../components/UserAvatar';

const StatSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/10 dark:via-gray-800/20 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
      <div className="w-16 h-2 bg-gray-100 dark:bg-gray-800 rounded-full" />
    </div>
    <div className="w-1/2 h-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3" />
    <div className="w-3/4 h-8 bg-gray-100 dark:bg-gray-800 rounded-xl" />
  </div>
);

const VideoSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden">
    <div className="w-full h-52 bg-gray-100 dark:bg-gray-800 animate-pulse" />
    <div className="p-6 space-y-4">
      <div className="w-3/4 h-6 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      <div className="w-1/2 h-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      <div className="w-full h-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl animate-pulse" />
    </div>
  </div>
);

const VideoCard = ({ vid, index, isMatch, isAdmin, onDelete }) => {
  const avgR = vid.ratings?.length ? (vid.ratings.reduce((a, b) => a + b, 0) / vid.ratings.length).toFixed(1) : '0.0';
  const { isDark } = useTheme();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      <div className="relative h-60 overflow-hidden bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <video
          src={vid.videoUrl ? (vid.videoUrl.startsWith('http') ? vid.videoUrl : `${API_BASE_URL}/${vid.videoUrl}`) : ""}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={(e) => { e.target.currentTime = 0.1; }}
          onMouseEnter={e => {
            const playPromise = e.target.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Ignore interruption errors
              });
            }
          }}
          onMouseLeave={e => {
            e.target.pause();
            e.target.currentTime = 0.1;
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
            e.target.parentElement.innerHTML = '<div class="text-gray-600 dark:text-gray-500 font-black text-xs uppercase tracking-widest text-center">Preview Unavailable</div>';
          }}
        />
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">{vid.age} Yrs · {vid.address?.split(',')[0]}</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md text-white border border-white/20 transition-transform group-hover:rotate-12`}>
              <Play size={14} fill="white" />
            </div>
          </div>
        </div>
        {isMatch && (
          <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-emerald-500/20 animate-pulse">POTENTIAL WINNER</div>
        )}
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-6 gap-2">
          <div className="flex items-center gap-3">
              <UserAvatar name={vid.name} size="w-12 h-12" textClass="text-sm" />
             <div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none group-hover:text-blue-600 transition-colors uppercase italic">{vid.name}</h4>
                <p className="text-xs font-bold text-gray-400 mt-2">Active Contestant</p>
             </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-emerald-500 font-black text-xl">
              <Star size={18} fill="currentColor" /> {avgR}
            </div>
            <p className="text-[10px] font-bold text-gray-400">{vid.ratings?.length || 0} Votes</p>
          </div>
        </div>

        <div className="relative p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 text-center">Self Rank</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 text-center">{vid.rating}.0</p>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 text-center">Jury Avg</p>
              <p className={`text-2xl font-black text-center ${isMatch ? 'text-emerald-500' : 'text-gray-400'}`}>{avgR}</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => onDelete(vid._id)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-800"
          >
            <Trash2 size={14} /> Remove Video
          </button>
        )}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark } = useTheme();
  const { user } = useAuthStore();
  const [competitionStats, setCompetitionStats] = useState({
    totalParticipants: 0,
    topRatedValue: 0,
    myCurrentRanking: 0
  });

  const handleDeleteVideo = async (id) => {
    if (!window.confirm("Are you sure you want to permanently remove this talent submission? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/video/${id}`);
      setVideos(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete video.");
    }
  };

  async function fetchData() {
    try {
      setIsLoading(true);
      const [allRes, battleRes] = await Promise.all([
        axios.post(API_ENDPOINTS.allVideos),
        axios.get(API_ENDPOINTS.battleSummary)
      ]);
      const allVideosData = allRes.data;
      const battleData = battleRes.data;

      if (currentRole === 'admin') {
        setVideos(allVideosData);
      } else {
        setVideos(battleData.ongoing || []);
      }

      const totalParticipants = allVideosData.length;
      let topRated = 0;
      if (totalParticipants > 0) {
        topRated = Math.max(...allVideosData.map(v =>
          v.ratings?.length ? v.ratings.reduce((a, b) => a + b, 0) / v.ratings.length : 0
        ));
      }

      let myRank = 0;
      if (user && battleData.ongoing?.length > 0) {
        const sorted = [...battleData.ongoing].sort((a, b) => {
          const avgA = a.ratings?.length ? a.ratings.reduce((s, r) => s + r, 0) / a.ratings.length : 0;
          const avgB = b.ratings?.length ? b.ratings.reduce((s, r) => s + r, 0) / b.ratings.length : 0;
          return avgB - avgA;
        });
        const idx = sorted.findIndex(v => v.name === user.firstName || v.name?.includes(user.firstName));
        if (idx !== -1) myRank = idx + 1;
      }

      setCompetitionStats({
        totalParticipants,
        topRatedValue: topRated.toFixed(1),
        myCurrentRanking: myRank
      });
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  const filteredVideos = videos.filter(v =>
    v.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleLabels = {
    admin: { label: 'Imperial Overseer', color: 'purple' },
    contestant: { label: 'Elite Performer', color: 'emerald' },
    user: { label: 'Scout / Jury', color: 'blue' }
  };

  const currentRole = user?.role || 'user';

  const statCards = [
    { label: 'Global Talents', value: competitionStats.totalParticipants, icon: <Users size={24} />, color: 'blue' },
    { label: 'Highest Peak', value: `${competitionStats.topRatedValue}/5`, icon: <Star size={24} />, color: 'emerald' },
    { label: currentRole === 'contestant' ? 'My Standing' : 'Active Battles', value: currentRole === 'contestant' ? `#${competitionStats.myCurrentRanking}` : '14', icon: <Trophy size={24} />, color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex-grow pt-[120px] container mx-auto px-4 max-w-7xl pb-24">
        
        {/* Header Section */}
        <div className="relative mb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-3 mb-2">
                    <span className={`px-4 py-1.5 bg-${roleLabels[currentRole].color}-600/10 text-${roleLabels[currentRole].color}-600 dark:text-${roleLabels[currentRole].color}-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-${roleLabels[currentRole].color}-500/20`}>
                      {roleLabels[currentRole].label}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                  {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)} Hub <span className="text-blue-600">.</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 max-w-md italic">
                  {currentRole === 'admin' 
                    ? "Welcome to control center. Manage the arena and crown the winners." 
                    : currentRole === 'contestant' 
                    ? "Your stage is set. Monitor your surge and outshine the rest." 
                    : "Discover, analyze, and reward the next generation of legends."}
                </p>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative group flex-grow sm:flex-grow-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search legends..."
                    className="pl-12 pr-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl w-full sm:w-64 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all shadow-sm font-medium dark:text-white"
                  />
                </div>
                {currentRole !== 'admin' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(currentRole === 'contestant' ? '/ratings' : '/battle')}
                    className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-xl transition-all hover:shadow-blue-600/20 uppercase tracking-widest text-xs"
                  >
                    {currentRole === 'contestant' ? 'MY VIDEO' : 'BECOME CONTESTANT'}
                  </motion.button>
                )}
                {currentRole === 'admin' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/admin-dash')}
                    className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl transition-all hover:shadow-blue-600/20 uppercase tracking-widest text-xs"
                  >
                    FULL CONTROL
                  </motion.button>
                )}
              </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, i) => (
            isLoading ? <StatSkeleton key={i} /> : (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
              >
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
                <div className="flex justify-between items-start relative z-10">
                  <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                    {stat.icon}
                  </div>
                  <TrendingUp size={16} className="text-gray-300" />
                </div>
                <div className="mt-6">
                  <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-4xl font-black text-gray-900 dark:text-white mt-1 tracking-tighter">{stat.value}</p>
                </div>
              </motion.div>
            )
          ))}
        </div>

        {/* Role-Specific Content Area */}
        <div className="space-y-12">
            {/* Common Banner with adjusted text */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="p-1 w-full rounded-[3rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl shadow-blue-600/10"
            >
                <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-3xl rounded-[2.9rem] p-10 flex flex-col lg:flex-row items-center gap-10">
                    <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/40">
                        <Info className="text-white" size={32} />
                    </div>
                    <div className="flex-grow space-y-2 text-center lg:text-left">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Authority & Guidelines</h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl">
                           {currentRole === 'admin' 
                            ? "You are reading live data from Cloudinary and MongoDB. Every verdict counts. Ensure integrity of ratings and video moderation."
                            : currentRole === 'contestant'
                            ? "Your ranking shifts every hour based on audience verdict. Keep your identity clean and your video reachable for maximum growth."
                            : "As a scout, your rating carries weight. Be fair, be bold. The next champion depends on your precision."}
                        </p>
                    </div>
                    <button onClick={() => navigate('/how-it-works')} className="px-8 py-4 border-2 border-gray-100 dark:border-gray-800 rounded-2xl font-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors uppercase tracking-widest text-[10px]">Guidelines</button>
                </div>
            </motion.div>

            {/* Video Feed (Differently accessible) */}
            <div className="space-y-8">
                <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="h-px bg-gray-200 dark:bg-gray-800 flex-grow" />
                    <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em]">
                        {currentRole === 'admin' ? "Global Repository" : currentRole === 'contestant' ? "Contender Arena" : "Verdict Pipeline"}
                    </h2>
                    <div className="h-px bg-gray-200 dark:bg-gray-800 flex-grow" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? [1, 2, 3, 4, 5, 6].map(i => <VideoSkeleton key={i} />) : (
                        <AnimatePresence>
                            {filteredVideos.map((v, i) => {
                                const avgR = v.ratings?.length ? (v.ratings.reduce((a, b) => a + b, 0) / v.ratings.length).toFixed(1) : '0.0';
                                const isMatch = Math.abs(parseFloat(avgR) - v.rating) < 0.3;
                                return <VideoCard key={v._id || i} vid={v} index={i} isMatch={isMatch} isAdmin={currentRole === 'admin'} onDelete={handleDeleteVideo} />;
                            })}
                        </AnimatePresence>
                    )}
                </div>
                
                {filteredVideos.length === 0 && !isLoading && (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
                        <p className="text-gray-400 font-bold italic">No contestants found matching your query.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;