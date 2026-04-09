import React, { useState, useEffect, useCallback } from "react";
import { Trophy, VideoIcon, Star, Trash2, RefreshCw, Crown } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserAvatar from "./components/UserAvatar";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "./config/api";

const AdminDash = () => {
  const [videos, setVideos] = useState([]);
  const [currentLeaders, setCurrentLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch live winner preview using today's videos
      const [allVideosRes, leaderRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/battles/summary`),
        axios.get(`${API_BASE_URL}/api/battles/test-winner`)
      ]);

      // Ongoing videos = today's submissions
      const todayVids = allVideosRes.data.ongoing || [];
      // Enrich with avgRating
      const enriched = todayVids.map(v => ({
        ...v,
        avgRating: v.ratings?.length
          ? (v.ratings.reduce((a, b) => a + b, 0) / v.ratings.length)
          : 0,
        votes: v.ratings?.length || 0
      })).sort((a, b) => b.avgRating - a.avgRating);

      setVideos(enriched);
      setCurrentLeaders(leaderRes.data.winners || []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Admin dash fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDelete = async (videoId) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-bold text-sm">Delete this video submission?</span>
        <div className="flex justify-end gap-2 mt-2">
          <button 
            className="px-3 py-1 bg-red-600 text-white rounded text-xs"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`${API_BASE_URL}/api/videos/${videoId}`);
                setVideos((prev) => prev.filter((v) => v._id !== videoId));
                setCurrentLeaders((prev) => prev.filter((v) => v._id !== videoId));
                toast.success("Video deleted");
              } catch (err) {
                toast.error("Failed to delete video.");
              }
            }}
          >
            Yes, delete
          </button>
          <button 
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-xs"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-500 font-sans">
      <Navbar />
      <div className="flex-grow pt-[120px] pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
              Admin Control
            </h1>
            <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">
              Live contest overview · Auto-refreshes every 30s
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Entries", value: videos.length, color: "text-blue-600" },
            { label: "Total Votes Cast", value: videos.reduce((a, v) => a + v.votes, 0), color: "text-purple-600" },
            { label: "Current Leaders", value: currentLeaders.length, color: "text-emerald-600" },
            { label: "Avg Audience Rating", value: videos.length ? (videos.reduce((a, v) => a + v.avgRating, 0) / videos.length).toFixed(2) : "—", color: "text-amber-600" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Current Leader(s) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 shadow-xl rounded-[2.5rem] p-8 mb-8 border border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Crown size={20} className="text-amber-500" />
                Current Leader{currentLeaders.length > 1 ? "s" : ""}
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">
                Based on today's votes so far · updates every 30s
              </p>
            </div>
            {currentLeaders.length > 1 && (
              <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl">
                <p className="text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest">
                  🏆 {currentLeaders.length} Co-Leaders · Prize Splits Equally
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-gray-400 text-sm font-bold uppercase tracking-widest animate-pulse">Loading live data...</div>
          ) : currentLeaders.length === 0 ? (
            <div className="text-gray-400 text-sm font-bold uppercase tracking-widest py-4 text-center">
              No entries yet for today's contest
            </div>
          ) : (
            <div className="space-y-4">
              {currentLeaders.map((leader, i) => {
                const match = Math.abs((leader.avgRating || 0) - leader.rating) <= 0.5;
                return (
                  <div key={i} className={`flex items-center gap-5 p-5 rounded-3xl border ${
                    match
                      ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800"
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800"
                  }`}>
                    <div className="text-2xl">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                    <UserAvatar name={leader.name} size="w-14 h-14" textClass="text-lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase truncate">{leader.name}</h3>
                      <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <span className="text-xs font-bold text-gray-500">Jury Score: <strong className="text-gray-800 dark:text-white">{leader.rating}/5</strong></span>
                        <span className="text-xs font-bold text-gray-500">Audience Avg: <strong className="text-blue-600">{(leader.avgRating || 0).toFixed(2)}/5</strong></span>
                        <span className="text-xs font-bold text-gray-500">Votes: <strong>{leader.votes ?? leader.ratings?.length ?? 0}</strong></span>
                        {match && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                            ✓ Match
                          </span>
                        )}
                      </div>
                    </div>
                    {i === 0 && <Trophy size={28} className="text-amber-500 shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* All Submissions Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 shadow-xl rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800"
        >
          <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">
            Today's Submissions ({videos.length})
          </h3>

          {loading ? (
            <div className="text-gray-400 text-sm font-bold uppercase tracking-widest animate-pulse text-center py-8">Loading submissions...</div>
          ) : videos.length === 0 ? (
            <div className="text-gray-400 text-sm font-bold uppercase tracking-widest text-center py-8">No submissions today yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100 dark:border-gray-800 text-gray-400 uppercase text-[10px] tracking-widest font-black">
                    <th className="py-3 px-4 text-left">Rank</th>
                    <th className="py-3 px-4 text-left">Participant</th>
                    <th className="py-3 px-4 text-center">Jury Rating</th>
                    <th className="py-3 px-4 text-center">Audience Avg</th>
                    <th className="py-3 px-4 text-center">Votes</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video, i) => {
                    const avgStr = video.avgRating.toFixed(2);
                    const match = Math.abs(video.avgRating - video.rating) <= 0.5;
                    return (
                      <tr key={video._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 px-4 text-center font-black text-gray-500">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={video.name} size="w-9 h-9" textClass="text-xs" />
                            <div>
                              <p className="font-black text-gray-900 dark:text-white text-sm">{video.name}</p>
                              <p className="text-xs text-gray-400">{video.address}</p>
                            </div>
                            {match && (
                              <span className="ml-2 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-full tracking-widest">
                                Match
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="bg-amber-100 text-amber-700 py-1 px-3 rounded-full text-xs font-black">{video.rating}/5</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`py-1 px-3 rounded-full text-xs font-black ${
                            match
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-600"
                          }`}>{avgStr}/5</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="font-black text-gray-700 dark:text-gray-300">{video.votes}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <a
                              href={video.videoUrl?.startsWith("http") ? video.videoUrl : `${API_BASE_URL}/${video.videoUrl}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-black uppercase"
                            >
                              <VideoIcon size={14} /> Watch
                            </a>
                            <button
                              onClick={() => handleDelete(video._id)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>

        <p className="text-center text-gray-300 dark:text-gray-700 text-xs mt-6 font-mono">
          Last refreshed: {lastRefresh.toLocaleTimeString()}
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDash;
