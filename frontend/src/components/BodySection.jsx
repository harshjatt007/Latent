import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  VideoIcon, 
  StarIcon, 
  TrophyIcon, 
  UsersIcon,
  PlayCircleIcon
} from 'lucide-react';

// Replace with an actual talent competition hero image
import heroImage from '../assets/latentimage.png';
import localVideo from '../assets/INDIA_S GOT LATENT _ EP 11 ft._bhartitv _LifeOfLimbachiyaas _TonyKakkar(1080P_HD)_001.mp4';

const FeatureCard = ({ icon: Icon, color, title, description }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
  >
    <div className="flex items-center mb-3">
      <Icon className={`${color} mr-3 group-hover:rotate-12 transition-transform`} size={32} />
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {description}
    </p>
  </motion.div>
);

const BodySection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeVideo, setActiveVideo] = useState(false);
  const leftContentRef = useRef(null);

  const features = [
    {
      icon: VideoIcon,
      color: "text-purple-500",
      title: "Upload Videos",
      description: "Share your unique talents with the world in high-quality video format."
    },
    {
      icon: StarIcon,
      color: "text-yellow-500", 
      title: "Rate Talents",
      description: "Discover and appreciate incredible performances from global artists."
    },
    {
      icon: TrophyIcon,
      color: "text-green-500",
      title: "Win Contests",
      description: "Compete in diverse talent categories and win exciting prizes."
    },
    {
      icon: UsersIcon,
      color: "text-blue-500",
      title: "Community Vote",
      description: "Let the audience decide your path to stardom through fair voting."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = leftContentRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleStartCompeting = () => {
    navigate('/battle');
  };

  const handleLearnMore = () => {
    navigate('/battle');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between relative">
        {/* Floating Decorative Shapes */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-24 h-24 bg-purple-200 rounded-full opacity-30 animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        {/* Left Content */}
        <motion.div
          ref={leftContentRef}
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-6 text-center md:text-left z-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 leading-tight">
            Unleash Your Talent
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Your platform to shine, compete, and inspire the world.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                color={feature.color}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="flex space-x-4 justify-center md:justify-start mt-6">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleStartCompeting}
              className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition flex items-center space-x-2"
            >
              <span>Start Competing</span>
              <TrophyIcon size={20} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLearnMore}
              className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-full hover:bg-purple-50 transition flex items-center space-x-2"
            >
              <span>Learn More</span>
              <PlayCircleIcon size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 mt-10 md:mt-0 relative z-10 max-w-[500px] mx-auto md:ml-auto"
        >
          <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
            <img 
              src={heroImage} 
              alt="Talent Competition" 
              className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div 
              onClick={() => setActiveVideo(true)}
              className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              <PlayCircleIcon size={64} className="text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
            onClick={() => setActiveVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="bg-white p-4 rounded-xl max-w-4xl w-full"
            >
              <div className="aspect-video">
                <video 
                  controls 
                  src={localVideo} 
                  className="w-full h-full rounded-md"
                ></video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodySection;