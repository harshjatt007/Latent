import React, { useState, useEffect, useRef, useCallback } from 'react';
import { VideoIcon, Star, Award, Users, Trophy, Play, Info, Search, TrendingUp, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';
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
  <div className="w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] animate-pulse border border-gray-100 dark:border-gray-800" />
);

const VideoCard = ({ vid, index, isMatch, isAdmin, isContestant, onDelete }) => {
  const avgR = vid.ratings?.length ? (vid.ratings.reduce((a, b) => a + b, 0) / vid.ratings.length).toFixed(1) : '0.0';
  const { isDark } = useTheme();

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
      <div className="relative h-60 overflow-hidden bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <video controls src={vid.videoUrl ? (vid.videoUrl.startsWith('http') ? vid.videoUrl : `${API_BASE_URL}/${vid.videoUrl}`) : ""} className="w-full h-full object-cover" preload="metadata" onLoadedMetadata={(e) => { e.target.currentTime = 0.1; }} onPlay={(e) => { document.querySelectorAll('video').forEach(v => { if (v !== e.target && !v.paused) v.pause(); }); }} />
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">{vid.age} Yrs · {vid.address?.split(',')[0]}</div>
        {isAdmin && isMatch && <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-emerald-500/20 animate-pulse">POTENTIAL WINNER</div>}
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6 gap-2">
          <div className="flex items-center gap-3">
              <UserAvatar name={vid.name} size="w-12 h-12" textClass="text-sm" />
             <div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase italic">{vid.name}</h4>
                <p className="text-xs font-bold text-gray-400 mt-2">Active Contestant</p>
             </div>
          </div>
          <div className="flex flex-col items-end">
            {!isAdmin ? <div className="text-gray-400 font-black text-xs uppercase tracking-widest mt-1">Pending</div> : <div className="flex items-center gap-1 text-emerald-500 font-black text-xl"><Star size={18} fill="currentColor" /> {avgR}</div>}
            <p className="text-[10px] font-bold text-gray-400">{vid.ratings?.length || 0} Votes</p>
          </div>
        </div>
        <div className="relative p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 text-center">Self Rank</p><p className="text-2xl font-black text-blue-600 dark:text-blue-400 text-center">{vid.rating}.0</p></div>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 text-center">Audience Avg</p>
              {!isAdmin ? <p className="text-[12px] font-black tracking-widest text-gray-400 text-center pt-2 italic">Hidden</p> : <p className={`text-2xl font-black text-center ${isMatch ? 'text-emerald-500' : 'text-gray-400'}`}>{avgR}</p>}
            </div>
          </div>
        </div>
        {isAdmin && <button onClick={() => onDelete(vid._id)} className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-red-50 text-red-500 text-xs font-bold uppercase transition-colors"><Trash2 size={14} /> Remove Entry</button>}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  const [competitionStats, setCompetitionStats] = useState({ totalParticipants: 0, topRatedValue: 0, myCurrentRanking: 0, activeBattlesCount: 0 });

  async function fetchData() {
    try {
      setIsLoading(true);
      const [allRes, battleRes] = await Promise.all([axios.post(API_ENDPOINTS.allVideos), axios.get(API_ENDPOINTS.battleSummary)]);
      const allVideosData = allRes.data;
      const battleData = battleRes.data;
      if (user?.role === 'admin') setVideos(allVideosData); else setVideos(battleData.ongoing || []);
      
      const totalParticipants = allVideosData.length;
      let topRated = 0; if (totalParticipants > 0) topRated = Math.max(...allVideosData.map(v => v.ratings?.length ? v.ratings.reduce((a, b) => a + b, 0) / v.ratings.length : 0));

      let myRank = 0;
      if (user && battleData.ongoing?.length > 0) {
        const sorted = [...battleData.ongoing].sort((a,b) => (b.ratings?.length ? b.ratings.reduce((s,r)=>s+r,0)/b.ratings.length : 0) - (a.ratings?.length ? a.ratings.reduce((s,r)=>s+r,0)/a.ratings.length : 0));
        const idx = sorted.findIndex(v => v.uploadedBy === (user._id || user.id));
        if (idx !== -1) myRank = idx + 1;
      }
      setCompetitionStats({ totalParticipants, topRatedValue: topRated.toFixed(1), myCurrentRanking: myRank, activeBattlesCount: battleData.ongoing?.length || 0 });
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  }

  useEffect(() => { fetchData(); }, [user]);

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm("Delete this submission?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/video/${videoId}`);
        setVideos(v => v.filter(vid => vid._id !== videoId));
        toast.success("Removed");
      } catch (e) { toast.error("Error"); }
    }
  };

  const currentRole = user?.role || 'user';
  const roleLabels = { admin: { label: 'Overseer', color: 'purple' }, contestant: { label: 'Contender', color: 'emerald' }, user: { label: 'Audience', color: 'blue' } };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500 font-sans">
      <Navbar />
      <div className="flex-grow pt-[120px] container mx-auto px-4 max-w-7xl pb-24">
        <div className="relative mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-4 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20`}>{roleLabels[currentRole].label}</span>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">{currentRole} Hub</h1>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search legends..." className="pl-6 pr-6 py-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl w-full sm:w-64 outline-none font-medium" />
            {currentRole === 'admin' && <button onClick={() => navigate('/admin-dash')} className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs">Full Control</button>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Talents', value: competitionStats.totalParticipants, icon: <Users size={24} />, color: 'blue' },
            { label: 'Top Rating', value: `${competitionStats.topRatedValue}/5`, icon: <Star size={24} />, color: 'emerald' },
            { label: currentRole === 'contestant' ? 'My Standing' : 'Active Contests', value: currentRole === 'contestant' ? `#${competitionStats.myCurrentRanking || '--'}` : competitionStats.activeBattlesCount, icon: <Trophy size={24} />, color: 'purple' }
          ].map((stat, i) => (
            <div key={i} className="p-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex justify-between items-start"><div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">{stat.icon}</div></div>
              <div className="mt-6"><p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p><p className="text-4xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? [1, 2, 3].map(i => <VideoSkeleton key={i} />) : videos.filter(v => v.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((v, i) => (
            <VideoCard key={v._id || i} vid={v} index={i} isMatch={Math.abs(parseFloat(v.ratings?.length ? (v.ratings.reduce((a,b)=>a+b,0)/v.ratings.length) : 0) - v.rating) < 0.5} isAdmin={currentRole === 'admin'} isContestant={currentRole === 'contestant'} onDelete={handleDeleteVideo} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;