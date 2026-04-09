import React, { useState, useEffect, useCallback } from "react";
import { Trophy, Trash2, RefreshCw, Crown } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserAvatar from "./components/UserAvatar";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "./config/api";

const AdminDash = () => {
  const [videos, setVideos] = useState([]);
  const [currentLeaders, setCurrentLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setLastRefresh] = useState(new Date());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [allVideosRes, leaderRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/battles/summary`),
        axios.get(`${API_BASE_URL}/api/battles/test-winner`)
      ]);
      const enriched = (allVideosRes.data.ongoing || []).map(v => ({
        ...v,
        avgRating: v.ratings?.length ? (v.ratings.reduce((a, b) => a + b, 0) / v.ratings.length) : 0,
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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleDelete = async (videoId) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/admin/video/${videoId}`);
        setVideos((prev) => prev.filter((v) => v._id !== videoId));
        toast.success("Video deleted");
      } catch (err) {
        toast.error("Failed to delete video.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col transition-colors duration-500 font-sans">
      <Navbar />
      <div className="flex-grow pt-[120px] pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Admin Showcase Control</h1>
            <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">Live contest overview · Auto-refreshes every 30s</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Entries", value: videos.length, color: "text-blue-600" },
            { label: "Total Votes Cast", value: videos.reduce((a, v) => a + v.votes, 0), color: "text-purple-600" },
            { label: "Current Leaders", value: currentLeaders.length, color: "text-emerald-600" },
            { label: "Avg Audience Rating", value: videos.length ? (videos.reduce((a, v) => a + v.avgRating, 0) / videos.length).toFixed(2) : "—", color: "text-amber-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <section className="bg-white dark:bg-gray-900 shadow-xl rounded-[2.5rem] p-8 mb-8 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2"><Crown size={20} className="text-amber-500" /> Current Leader(s)</h2>
          </div>
          {loading ? <div className="animate-pulse">Loading...</div> : currentLeaders.length === 0 ? <div className="text-center py-4">No entries yet.</div> : (
            <div className="space-y-4">
              {currentLeaders.map((leader, i) => (
                <div key={i} className="flex items-center gap-5 p-5 rounded-3xl border bg-gray-50 dark:bg-gray-800/50">
                  <UserAvatar name={leader.name} size="w-14 h-14" />
                  <div className="flex-1">
                    <h3 className="text-lg font-black uppercase">{leader.name}</h3>
                    <div className="flex gap-4 text-xs font-bold text-gray-500">
                      <span>Jury: {leader.rating}/5</span>
                      <span>Audience: {(leader.avgRating || 0).toFixed(2)}/5</span>
                      <span>Votes: {leader.votes ?? leader.ratings?.length}</span>
                    </div>
                  </div>
                  <Trophy size={28} className="text-amber-500" />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-gray-900 shadow-xl rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-black uppercase mb-6">Today's Submissions ({videos.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 uppercase text-[10px] tracking-widest font-black border-b border-gray-100 dark:border-gray-800">
                  <th className="py-4 px-4 text-left">Participant</th>
                  <th className="py-4 px-4 text-center">Jury</th>
                  <th className="py-4 px-4 text-center">Audience</th>
                  <th className="py-4 px-4 text-center">Votes</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video._id} className="border-b border-gray-50 dark:border-gray-800">
                    <td className="py-4 px-4"><div className="flex items-center gap-3"><UserAvatar name={video.name} size="w-9 h-9" /><div><p className="font-black">{video.name}</p></div></div></td>
                    <td className="text-center font-bold text-amber-600">{video.rating}/5</td>
                    <td className="text-center font-bold text-blue-600">{video.avgRating.toFixed(2)}/5</td>
                    <td className="text-center font-bold">{video.votes}</td>
                    <td className="text-center">
                      <button onClick={() => handleDelete(video._id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDash;
