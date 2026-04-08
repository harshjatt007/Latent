import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex-grow pt-[120px] container mx-auto px-4 max-w-4xl mb-12">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm p-8 md:p-12 border border-gray-100 dark:border-gray-800">
          <h1 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-8 tracking-tighter uppercase italic text-center">About Latent</h1>
          <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">
            <p>
              Welcome to <strong>Latent</strong>, the premier platform designed to discover, showcase, and elevate raw talent. We believe that everyone has a unique hidden potential just waiting to be unleashed.
            </p>
            <p>
              Our mission is to democratize talent discovery. Whether you are an aspiring artist, a brilliant developer, a creative soul, or a performer with a dream, Latent connects you with the audience and opportunities you deserve. 
            </p>
            <p>
              We host regular <strong>Event Battles</strong> where creators can submit their work and compete for recognition, visibility, and direct opportunities. Our robust voting and rating systems ensure that the community always picks the best.
            </p>
            <p className="font-black text-gray-900 dark:text-white pt-6 text-center border-t border-gray-100 dark:border-gray-800">
              Join us in turning the latent energy inside you into the kinetic power of success.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
