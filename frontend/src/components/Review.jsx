import React, { useEffect, useState, useRef } from 'react';
import image from '../assets/in.png'; // Replace with the actual image path

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
      className="flex flex-col md:flex-row items-center justify-between px-16 py-16 bg-white font-quicksand mt-10 mb-16"
    >
      {/* Left Content */}
      <div
        className={`w-[40%] space-y-6 transform transition-transform duration-1000 ease-out opacity-0 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10'
        }`}
      >
        <h1 className="text-blue-600 font-bold text-3xl md:text-4xl leading-tight">
          Hello, I’m Alice!
        </h1>
        <h2 className="text-blue-600 font-semibold text-2xl md:text-3xl leading-snug">
          Here to take your Social Media to another level
        </h2>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click "Edit Text" or double click me to add your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your page. I’m a great place for you to tell a story and let your users know a little more about you.
        </p>
      </div>

      {/* Right Image */}
      <div
        className={`w-[50%] mt-8 md:mt-0 transform transition-transform duration-1000 ease-out opacity-0 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10'
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
