import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import images with webpack/vite optimization
const importAll = (r) => r.keys().map(r);
const backgroundImages = importAll(
  require.context("../assets", false, /\.(png|jpe?g|svg)$/)
);

const Battle = () => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBattle, setSelectedBattle] = useState(null);

  const battleTypes = [
    {
      title: "Previous Battle: Ultimate Showdown",
      description: "Check out the result from the past epic battle",
      buttonText: "Show Results",
      winner: {
        name: "Abhishek Chaudhary",
        avatar: "https://avatar.iran.liara.run/public/48",
        result: "Victory",
      },
      image: backgroundImages[2],
    },
    {
      title: "Ongoing Battles",
      description: "Join the current exciting competition",
      buttonText: "Participate",
      image: backgroundImages[0],
    },
    {
      title: "Upcoming Battles",
      description: "Preview the next big challenge",
      buttonText: "Learn More",
      image: backgroundImages[1],
      details: {
        date: "December 25, 2024",
        time: "5:00 PM - 8:00 PM",
        location: "Battle Arena, New York",
      },
    },
  ];

  const handleParticipate = () => navigate("/form");

  const handleLearnMore = (battle) => {
    setSelectedBattle(battle);
    setShowModal(true);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-gray-100 p-4 md:p-10 font-quicksand relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <nav className="flex flex-col md:flex-row justify-between items-center mb-16 pb-6 border-b border-white/10 gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 drop-shadow-sm">
            Event Battles
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-medium hover:bg-white/10 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            ← Back
          </motion.button>
        </nav>

        <div className="space-y-12">
          {battleTypes.map((battleType, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group"
            >
              {/* Subtle hover glow on card */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-700 pointer-events-none" />

              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 bg-black/20">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-100 flex items-center gap-3">
                    <span className="w-2 h-8 rounded-full bg-gradient-to-t from-blue-500 to-cyan-400 inline-block"></span>
                    {battleType.title}
                  </h2>
                  <p className="text-gray-400 mt-2 ml-5">{battleType.description}</p>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video md:aspect-auto max-h-[500px]">
                  <img
                    src={battleType.image}
                    alt={battleType.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                </div>

                {battleType.title === "Previous Battle: Ultimate Showdown" && showResults && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center space-x-6 bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl mt-6 shadow-xl"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-yellow-400 blur-md opacity-50 shadow-lg"></div>
                      <img
                        src={battleType.winner.avatar}
                        alt={battleType.winner.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400 relative z-10"
                      />
                    </div>
                    <div>
                      <p className="text-yellow-400 text-sm font-bold tracking-widest uppercase mb-1">Winner</p>
                      <h3 className="text-2xl font-bold text-white">
                        {battleType.winner.name}
                      </h3>
                      <p className="text-gray-300 mt-1 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                        {battleType.winner.result}
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="mt-8 flex justify-end">
                  {battleType.title === "Previous Battle: Ultimate Showdown" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowResults(!showResults)}
                      className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all"
                    >
                      {showResults ? "Hide Results" : battleType.buttonText}
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        battleType.buttonText === "Learn More"
                          ? handleLearnMore(battleType)
                          : handleParticipate()
                      }
                      className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-white shadow-[0_0_20px_rgba(192,38,211,0.4)] hover:shadow-[0_0_30px_rgba(192,38,211,0.6)] transition-all"
                    >
                      {battleType.buttonText}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>

      {showModal && selectedBattle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#111] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg p-8 relative z-10"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-3xl" />
            <h2 className="text-3xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 inline-block">
              Event Details
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">📅</div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                  <p className="font-medium text-white">{selectedBattle.details.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">🕒</div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Time</p>
                  <p className="font-medium text-white">{selectedBattle.details.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">📍</div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
                  <p className="font-medium text-white">{selectedBattle.details.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Battle;
