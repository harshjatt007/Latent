import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

// Import images with webpack/vite optimization
const importAll = (r) => r.keys().map(r);
const backgroundImages = importAll(
  require.context("../assets", false, /\.(png|jpe?g|svg)$/)
);

const Battle = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBattle, setSelectedBattle] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [battleData, setBattleData] = useState({
    ongoing: [],
    winner: null,
    loading: true
  });

  useEffect(() => {
    const fetchBattleData = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.battleSummary);
        if (response.data.success) {
          setBattleData({
            ongoing: response.data.ongoing,
            winner: response.data.winner,
            loading: false
          });
        }
      } catch (error) {
        console.error("Error fetching battle data:", error);
        setBattleData(prev => ({ ...prev, loading: false }));
      }
    };
    fetchBattleData();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      if (diff <= 0) return "00:00:00";
      
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const battleTypes = [
    {
      title: "Previous Battle: Daily Champion",
      description: battleData.winner 
        ? `Celebrating yesterday's top performer: ${battleData.winner.name}`
        : "The results for the previous cycle are being calculated...",
      buttonText: "Show Results",
      winner: battleData.winner ? {
        name: battleData.winner.name,
        avatar: `https://i.pravatar.cc/80?u=${battleData.winner.name}`,
        result: "Victory",
      } : null,
      image: backgroundImages[2],
    },
    {
      title: "Ongoing Battles",
      description: battleData.ongoing.length > 0
        ? `Today's talent showdown - ${battleData.ongoing.length} active entries!`
        : "Today's contest has just begun - be the first to enter!",
      buttonText: "Participate",
      image: backgroundImages[0],
    },
    {
      title: "Upcoming Battles",
      description: "New talent and challenges arrive every 24 hours",
      buttonText: "Learn More",
      image: backgroundImages[1],
      details: {
        message: "In the next 24 hours, you will see the new contest and battles!",
      },
    },
  ];

  const handleParticipate = () => {
    if (!isAuthenticated) {
      toast.error("You must sign in to participate in the contest!");
      navigate("/login");
      return;
    }
    navigate("/form");
  };

  const handleLearnMore = (battle) => {
    setSelectedBattle(battle);
    setShowModal(true);
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen p-4 md:p-8 font-quicksand font-sans text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto pt-[100px]">
        <nav className="flex justify-between items-center mb-12 px-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white uppercase">
            Event Battles
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 font-black py-3 px-8 rounded-2xl shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all uppercase tracking-widest text-xs"
          >
            Back
          </motion.button>
        </nav>

        <div className="space-y-12">
          {battleTypes.map((battleType, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row hover:shadow-blue-600/10 transition-all duration-500 w-full group"
            >
              {/* Image Section */}
              <div className="w-full md:w-5/12 bg-gray-200 dark:bg-gray-800 relative overflow-hidden h-80 md:h-auto">
                <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                <img
                  src={battleType.image}
                  alt={battleType.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 blur-[2px] group-hover:blur-0"
                />
                <div className="absolute top-6 left-6 z-20">
                     <div className="px-4 py-2 bg-white/20 backdrop-blur-xl border border-white/30 text-white font-black text-[10px] rounded-full tracking-[0.3em] uppercase">
                        {index === 0 ? "Featured" : index === 1 ? "Live Now" : "Upcoming"}
                     </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-10 md:p-16 w-full md:w-7/12 flex flex-col justify-center bg-white dark:bg-gray-900 transition-colors">
                <div>
                  {battleType.title === "Ongoing Battles" && (
                    <div className="mb-6 inline-flex items-center gap-3 bg-blue-600/10 dark:bg-blue-400/10 px-6 py-2.5 rounded-2xl border border-blue-600/20 dark:border-blue-400/20">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-blue-600/60 dark:text-blue-400/60 uppercase tracking-widest leading-none mb-1">Daily Reset</span>
                        <span className="text-xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                          {timeLeft}
                        </span>
                      </div>
                    </div>
                  )}
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight uppercase group-hover:text-blue-600 transition-colors">
                    {battleType.title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 text-xl font-medium leading-relaxed">
                    {battleType.description}
                  </p>
                </div>

                {battleType.title === "Previous Battle: Daily Champion" && showResults && (
                  battleType.winner ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center space-x-6 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 mb-8"
                    >
                      <img
                        src={battleType.winner.avatar}
                        alt={battleType.winner.name}
                        className="w-20 h-20 rounded-[1.5rem] object-cover bg-white dark:bg-gray-800 border-4 border-green-500/20 shadow-xl"
                      />
                      <div>
                        <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-1">
                          Season Winner
                        </p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase">
                          {battleType.winner.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold mt-1 tracking-tight">
                        Winner - {battleType.winner.result}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 mb-8 text-center italic text-gray-400">
                      No winner was recorded for the previous period.
                    </div>
                  )
                )}

                <div className="flex justify-start">
                  {battleType.title === "Previous Battle: Daily Champion" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowResults(!showResults)}
                      className="w-full md:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-4 px-10 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs"
                    >
                      {showResults ? "Close Results" : "Inspect Victory"}
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (battleType.buttonText === "Learn More") {
                          handleLearnMore(battleType);
                        } else if (battleType.title === "Ongoing Battles" && user?.role === 'user') {
                          if (!isAuthenticated) {
                            toast.error("Sign in to start scouting and voting!");
                            navigate("/login");
                            return;
                          }
                          navigate('/ratings');
                        } else {
                          handleParticipate();
                        }
                      }}
                      className={`w-full md:w-auto font-black py-4 px-10 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs ${
                        battleType.buttonText === "Learn More"
                          ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                      }`}
                    >
                      {battleType.title === "Ongoing Battles" && user?.role === 'user' ? "Vote Now" : battleType.buttonText}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>

      {/* Modal with Dark Mode support */}
      {showModal && selectedBattle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gray-950/80 backdrop-blur-xl"
            onClick={() => setShowModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl w-full max-w-xl p-10 relative z-[110] overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 to-violet-600" />
            <h2 className="text-3xl font-black mb-10 text-gray-900 dark:text-white uppercase pt-4 tracking-tighter">
              New Content Incoming
            </h2>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl">✨</span>
              </div>
              <p className="text-2xl md:text-3xl font-black text-blue-600 dark:text-blue-400 leading-tight uppercase italic tracking-tighter">
                {selectedBattle.details.message}
              </p>
              <div className="mt-8 flex justify-center gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-blue-600/30 animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />
                ))}
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(false)}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-4 px-10 rounded-2xl uppercase tracking-widest text-[10px]"
              >
                Decline
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Battle;
