import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import images with webpack/vite optimization
const importAll = (r) => r.keys().map(r);
const backgroundImages = importAll(require.context('../assets', false, /\.(png|jpe?g|svg)$/));

const Battle = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const battleTypes = [
    { 
      title: "Previous Battles", 
      description: "Check out the results from past epic battles",
      buttonText: "Show Results"
    },
    { 
      title: "Ongoing Battles", 
      description: "Join the current exciting competition",
      buttonText: "Participate"
    },
    { 
      title: "Upcoming Battles", 
      description: "Preview the next big challenge",
      buttonText: "Learn More"
    }
  ];

  const handleParticipate = (battleType) => {
    if (battleType === "Ongoing Battles") {
      // Redirect to form in the same page
      navigate("/form");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 md:p-8">
      {/* Enhanced Top Navigation */}
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

      {/* Responsive Battle Sections */}
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
                <p className="text-gray-600 text-sm">
                  {battleType.description}
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {[0, 1, 2].map((boxIndex) => {
                const imageIndex = boxIndex + index * 3;
                return (
                  <motion.div
                    key={boxIndex}
                    className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: boxIndex * 0.2 }}
                  >
                    <div className="relative">
                      <img
                        src={backgroundImages[imageIndex % backgroundImages.length]}
                        alt={`${battleType.title} Battle ${boxIndex + 1}`}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {battleType.title} {boxIndex + 1}
                      </h3>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleParticipate(battleType.title)}
                        className="w-full mt-2 bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors"
                      >
                        {battleType.buttonText}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default Battle;