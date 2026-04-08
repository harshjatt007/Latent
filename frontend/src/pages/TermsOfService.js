import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex-grow pt-[120px] container mx-auto px-4 max-w-4xl mb-12">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm p-8 md:p-12 border border-gray-100 dark:border-gray-800">
          <h1 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-12 tracking-tighter uppercase italic text-center">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">
            <p>
              <strong className="text-gray-900 dark:text-white">1. Acceptance of Terms:</strong> By accessing and using Latent, you agree to comply with and be bound by these terms. If you do not agree to the terms, please do not use the platform.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">2. User Accounts:</strong> You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">3. Content Ownership:</strong> You retain your rights to any content you submit, post or display on Latent. Meaning, your talent remains yours. By submitting content on the platform, you simply grant us a worldwide, non-exclusive, royalty-free license to distribute and display the content.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">4. Acceptable Use:</strong> Users may not use Latent for illegal or unauthorized purposes. Abuse, harassment, or violation of any laws will result in immediate termination of the account.
            </p>
            <p className="text-sm text-gray-500 pt-8 text-center border-t border-gray-100 dark:border-gray-800">
              Last updated: April 8, 2026.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
