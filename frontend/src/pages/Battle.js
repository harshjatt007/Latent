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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 md:p-8">
      <nav className="flex justify-between items-center mb-8 px-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
          Event Battles
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors"
        >
          Back
        </motion.button>
      </nav>

      <div className="space-y-8">
        {battleTypes.map((battleType, index) => (
          <section
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <motion.div
              className="bg-blue-50 p-4 flex justify-between items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {battleType.title}
                </h2>
                <p className="text-gray-600 text-sm">{battleType.description}</p>
              </div>
            </motion.div>

            {battleType.title === "Previous Battle: Ultimate Showdown" ? (
              <div className="p-6">
                <motion.div
                  className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative">
                  <img
  src={battleType.image}
  alt={battleType.title}
  className="w-full h-auto max-h-96 object-contain group-hover:scale-105 transition-transform duration-300"
/>

                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </div>
                </motion.div>

                {showResults && (
                  <div className="flex items-center space-x-6 bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 mt-4">
                    <img
                      src={battleType.winner.avatar}
                      alt={battleType.winner.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {battleType.winner.name}
                      </h3>
                      <p className="text-gray-600">{battleType.winner.result}</p>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowResults(!showResults)}
                  className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                >
                  {showResults ? "Hide Results" : battleType.buttonText}
                </motion.button>
              </div>
            ) : (
              <div className="p-6">
                <motion.div
                  className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="relative">
                  <img
  src={battleType.image}
  alt={battleType.title}
  className="w-full h-auto max-h-96 object-contain group-hover:scale-105 transition-transform duration-300"
/>

                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </div>
                  <div className="p-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        battleType.buttonText === "Learn More"
                          ? handleLearnMore(battleType)
                          : handleParticipate()
                      }
                      className="w-full mt-2 bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                    >
                      {battleType.buttonText}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}
          </section>
        ))}
      </div>

      {showModal && selectedBattle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-8 relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Upcoming Battle Details
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>Date:</strong> {selectedBattle.details.date}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Time:</strong> {selectedBattle.details.time}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Location:</strong> {selectedBattle.details.location}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(false)}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors"
            >
              Close
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Battle;
