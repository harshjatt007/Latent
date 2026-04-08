import React, { useEffect, useState, useRef } from "react";
import image from "../assets/in.png"; // Replace with the actual image path

const Review = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 } // Adjust threshold as needed
    );

    // Save the current ref value to a variable
    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="flex flex-col md:flex-row items-center justify-between px-16 py-20 bg-white dark:bg-gray-900 font-quicksand mt-10 mb-16 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-500"
    >
      {/* Left Content */}
      <div
        className={`w-[40%] space-y-6 transform transition-transform duration-1000 ease-out opacity-0 ${
          isVisible ? "translate-x-0 opacity-100" : "-translate-x-10"
        }`}
      >
        <h1 className="text-blue-600 dark:text-blue-400 font-black text-3xl md:text-5xl tracking-tighter">
          Hello, I’m Alice!
        </h1>
        <h2 className="text-blue-600/80 dark:text-blue-300 font-bold text-2xl md:text-3xl tracking-tight leading-snug">
          Here to take your Social Media to another level
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-blue-100 dark:border-blue-900 pl-6">
          "I am Alice from goa, and I’ve had an amazing experience using *Latent*! The
          platform is incredibly engaging, offering a unique way to showcase
          talent and connect with a vibrant community. The voting and prize
          features add an exciting layer of competition, making every
          interaction fun and rewarding. Its user-friendly interface and
          seamless functionality make it a pleasure to navigate..."
        </p>
      </div>

      {/* Right Image */}
      <div
        className={`w-[50%] mt-8 md:mt-0 transform transition-transform duration-1000 ease-out opacity-0 ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-10"
        }`}
      >
        <img
          src={image}
          alt="George holding a laptop and smiling"
          className="w-full rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Review;
