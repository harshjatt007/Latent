import React from "react";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.png";
import image7 from "../assets/image7.png";
import image8 from "../assets/image8.png";
import image9 from "../assets/image9.png";
import image10 from "../assets/image10.png";

const PartnershipSection = () => {
  const logos = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
  ];

  return (
    <div className="relative overflow-hidden bg-white py-10">
      <h2 className="text-center text-customBlue text-2xl font-semibold mb-8 pb-10">
        Brands & Partnerships
      </h2>

      <div className="relative flex items-center overflow-hidden w-full">
        {/* Moving Logos Container */}
        <div className="flex animate-scroll whitespace-nowrap">
          {/* Primary Logos */}
          {logos.map((logo, index) => (
            <div
              key={index}
              className="w-40 flex-shrink-0 flex items-center justify-center px-4 mx-8"
            >
              <img
                src={logo}
                alt={`Brand ${index + 1}`}
                className="w-full h-auto object-contain"
              />
            </div>
          ))}

          {/* Duplicate Logos for Seamless Scrolling */}
          {logos.map((logo, index) => (
            <div
              key={`duplicate-${index}`}
              className="w-40 flex-shrink-0 flex items-center justify-center mx-8 px-4"
            >
              <img
                src={logo}
                alt={`Brand Duplicate ${index + 1}`}
                className="w-full h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnershipSection;
