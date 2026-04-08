import React from 'react';
import image1 from '../assets/blog2.jpg';
import image2 from '../assets/blog1.jpg';

const BlogSection = () => {
  return (
    <div id="blog-section" className="py-20 bg-white dark:bg-gray-950 transition-colors duration-500">
      <h1 className="text-customBlue dark:text-blue-400 font-black text-center text-4xl mb-12 tracking-tighter uppercase italic">
        Ongoing Tracks
      </h1>
      <div className="flex flex-col md:flex-row justify-center gap-8 px-8 pb-10">
        {/* Card 1 */}
        <div className="relative group w-full md:w-[45%] overflow-hidden rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl">
          <img
            src={image1}
            alt="Blog 1"
            className="w-full h-[350px] object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
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
        <div className="relative group w-full md:w-[45%] overflow-hidden rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl">
          <img
            src={image2}
            alt="Blog 2"
            className="w-full h-[350px] object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-b-lg">
            <p className="text-sm font-medium">Admin</p>
            <p className="text-sm">Mar 22, 2023 · 2 min read</p>
            <h2 className="text-lg font-semibold mt-2">
              Stunt related video!
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
