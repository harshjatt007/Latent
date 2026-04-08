import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex-grow pt-[120px] container mx-auto px-4 max-w-4xl mb-12">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm p-8 md:p-12 border border-gray-100 dark:border-gray-800">
          <h1 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-12 tracking-tighter uppercase italic text-center">How It Works</h1>
          
          <div className="space-y-10 text-gray-700 dark:text-gray-300">
            {[
              { id: 1, title: 'Create Your Profile', text: 'Sign up and build your portfolio. Add your personal bio, links, and set up your creative profile to let the world know who you are.' },
              { id: 2, title: 'Join a Battle', text: 'Head over to the Event Battles section. Participate in ongoing tracks by uploading your video or project submissions directly through our seamless uploader.' },
              { id: 3, title: 'Get Rated', text: 'The community and our panel of experts will review your submissions. Viewers can rate your talent on a scale from 1 to 5.' },
              { id: 4, title: 'Climb the Leaderboards', text: 'The highest-rated talents will be featured on the main dashboard, winning battles and gaining huge exposure to brands and mentors.' }
            ].map((step) => (
              <div key={step.id} className="flex gap-6 group">
                <div className="w-14 h-14 flex-shrink-0 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  {step.id}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight transition-colors">{step.title}</h3>
                  <p className="text-lg font-medium leading-relaxed opacity-80">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
