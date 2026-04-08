import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQ = () => {
  const faqs = [
    {
      question: "What is Latent?",
      answer: "Latent is a talent discovery and battle platform where creators can showcase their skills, engage in community battles, and get rated by a massive audience."
    },
    {
      question: "How do I participate in an Event Battle?",
      answer: "First, you need an account. Once signed up, navigate to the Battles section and click 'Participate' on any of the Ongoing Battles."
    },
    {
      question: "Is it free to join?",
      answer: "Yes! Creating an account and submitting your portfolio is completely free."
    },
    {
      question: "How does the rating system work?",
      answer: "Viewers can rate your uploads on a scale of 1 to 5. The aggregate score powers our leaderboard, surfacing the top talents naturally."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex-grow pt-[120px] container mx-auto px-4 max-w-4xl mb-12">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-sm p-8 md:p-12 border border-gray-100 dark:border-gray-800">
          <h1 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-12 tracking-tighter uppercase italic text-center">Frequently Asked Questions</h1>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 group hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 transition-colors">{faq.question}</h3>
                <p className="text-gray-700 dark:text-gray-400 font-medium leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center border-t border-gray-100 dark:border-gray-800 pt-8">
            <p className="text-gray-600 dark:text-gray-400 font-medium">Still have questions? Head over to our <a href="/contact" className="text-blue-600 dark:text-blue-400 font-black hover:underline tracking-widest uppercase text-xs ml-2">Contact page</a>.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
