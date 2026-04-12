import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const VideoPlayer = () => {
  const { filename } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-500">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-8 pt-[140px] pb-20">
        <div className="max-w-5xl w-full bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 transition-all">
          <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase italic">Now Playing: {filename}</h2>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-600/10">
            <video
              src={`/uploads/${filename}`}
              controls
              preload="metadata"
              playsInline
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VideoPlayer;