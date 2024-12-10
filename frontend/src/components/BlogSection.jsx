import React from 'react';
import image1 from '../assets/blog2.jpg';
import image2 from '../assets/blog1.jpg';

const BlogSection = () => {
  return (
    <div id="blog-section" className="py-10 bg-white"> {/* Add the id here */}
      <h1 className="text-customBlue font-roboto text-center text-4xl font-bold mb-10 pb-10">
        Ongoing Tracks
      </h1>
      <div className="flex flex-col md:flex-row justify-center gap-8 px-8 pb-10">
        {/* Card 1 */}
        <div className="relative group w-full md:w-[45%]">
          <img
            src={image1}
            alt="Blog 1"
            className="w-full h-[300px] object-cover rounded-lg opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-b-lg">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-sm">Mar 22, 2023 · 2 min read</p>
            <h2 className="text-lg font-semibold mt-2">
              How to create great video content from home?
            </h2>
            <div className="flex items-center justify-between text-sm mt-4">
              <div className="flex items-center gap-2">
                <span>👁 131</span>
                <span>💬 0</span>
              </div>
              <span>❤️ 5</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative group w-full md:w-[45%]">
          <img
            src={image2}
            alt="Blog 2"
            className="w-full h-[300px] object-cover rounded-lg opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-b-lg">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-sm">Mar 22, 2023 · 2 min read</p>
            <h2 className="text-lg font-semibold mt-2">
              5 Brands that do it right
            </h2>
            <div className="flex items-center justify-between text-sm mt-4">
              <div className="flex items-center gap-2">
                <span>👁 36</span>
                <span>💬 0</span>
              </div>
              <span>❤️ 4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
