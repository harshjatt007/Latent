import React, { useEffect, useState, useRef } from 'react';
import image from '../assets/1.jpg';

const BodySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const leftContentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 } // Trigger animation earlier when 20% of the element is visible
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

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-8 pt-0  pr-16 mt-6 bg-white font-quicksand">
      {/* Left Content */}
      <div
        ref={leftContentRef}
        className={`w-[30%] ml-10 space-y-4 transform transition-transform duration-[1.5s] ease-in-out opacity-0 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20'
        }`}
      >
        <h1 className="font-roboto text-customBlue text-5xl">
          Get the Most Out of Your Social Media
        </h1>
        
      </div>

      {/* Right Image */}
      <div className="w-[60%] mt-6 md:mt-0">
        <img src={image} alt="Social Media" className="w-full" />
      </div>
    </div>
  );
};

export default BodySection;
