import React from "react";
import image1 from "../assets/a (1).png"; // Import images
import image2 from "../assets/a (2).png";
import image3 from "../assets/a (3).png";
import image4 from "../assets/a (4).png";
import image5 from "../assets/a (5).png";

const Work = () => {
  const services = [
    {
      title: "Show Your Talent",
      description:
        "Upload your unique talent in a video format. Let the world see what makes you shine!",
      image: image1, // Use imported image
    },
    {
      title: "Rate Talents",
      description:
        "Watch videos uploaded by others and rate their performance. Your vote matters!",
      image: image2,
    },
    {
      title: "Daily Competitions",
      description:
        "Compete with others in daily challenges. The talent with the highest average likes wins!",
      image: image3,
    },
    {
      title: "Engage with Community",
      description:
        "Interact with a vibrant community of talented individuals. Share, comment, and inspire!",
      image: image4,
    },
    {
      title: "Discover New Stars",
      description:
        "Explore trending talents and discover rising stars in various fields of creativity.",
      image: image5,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-16 px-16 transition-colors duration-500">
      <h1 className="text-3xl font-black text-center text-customBlue dark:text-blue-400 mb-12 tracking-tighter">
        What We Do - The Latent
      </h1>
      <div className="space-y-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center border border-blue-100 dark:border-gray-800 rounded-3xl p-6 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Left - Image */}
            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
  <img
    src={service.image}
    alt={service.title}
    className="w-20 h-20 object-cover rounded-md"
  />
</div>
            {/* Right - Content */}
            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <h2 className="text-2xl font-black text-customBlue dark:text-blue-400 mb-2 transition-colors">
                {service.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Button */}
      {/* <div className="text-center mt-8">
        <button className="bg-customBlue text-white py-2 px-6 rounded hover:bg-blue-800 transition-colors">
          Login
        </button>
      </div> */}
    </div>
  );
};

export default Work;
