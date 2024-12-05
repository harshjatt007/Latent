import React from 'react';
import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#1c2331' }}>
      {/* Social Media Section */}
      <section className="flex justify-between items-center p-4" style={{ backgroundColor: '#6351ce' }}>
        <div>
          <span>Get connected with us on social networks:</span>
        </div>
        <div className="flex space-x-4">
          <a href="https://www.linkedin.com/in/adarsh-kumar-gupta-6b2745186" className="text-white text-lg pr-3" target="_blank" rel="noopener noreferrer ">
            <FaFacebookF />
          </a>
          <a href="https://www.linkedin.com/in/adarsh-kumar-gupta-6b2745186" className="text-white text-lg pr-3" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://www.linkedin.com/in/adarsh-kumar-gupta-6b2745186" className="text-white text-lg pr-3" target="_blank" rel="noopener noreferrer">
            <FaGoogle />
          </a>
          <a href="https://www.linkedin.com/in/adarsh-kumar-gupta-6b2745186" className="text-white text-lg pr-3" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com/in/adarsh-kumar-gupta-6b2745186" className="text-white text-lg pr-3" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://www.linkedin.com/in/adarsh-kumar-gupta-6b2745186" className="text-white text-lg pr-3" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        </div>
      </section>

      {/* Links Section */}
      <div className="container mx-auto px-4 text-center text-md-start mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h6 className="uppercase font-bold">Our Company</h6>
            <hr className="my-4 w-12 mx-auto bg-purple-600 h-1" />
            <p>
              We provide high-quality products and services that cater to your unique needs.
              Our goal is to ensure customer satisfaction through innovation and excellence.
            </p>
          </div>
          <div>
            <h6 className="uppercase font-bold">Products</h6>
            <hr className="my-4 w-12 mx-auto bg-purple-600 h-1" />
            <ul>
              <li>
                <a href="/product-1" className="text-white">Product One</a>
              </li>
              <li>
                <a href="/product-2" className="text-white">Product Two</a>
              </li>
              <li>
                <a href="/product-3" className="text-white">Product Three</a>
              </li>
              <li>
                <a href="/product-4" className="text-white">Product Four</a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="uppercase font-bold">Useful Links</h6>
            <hr className="my-4 w-12 mx-auto bg-purple-600 h-1" />
            <ul>
              <li>
                <a href="/account" className="text-white">Your Account</a>
              </li>
              <li>
                <a href="/affiliate" className="text-white">Become an Affiliate</a>
              </li>
              <li>
                <a href="/shipping" className="text-white">Shipping Rates</a>
              </li>
              <li>
                <a href="/help" className="text-white">Help Center</a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="uppercase font-bold">Contact Us</h6>
            <hr className="my-4 w-12 mx-auto bg-purple-600 h-1" />
            <ul>
              <li>Chitkara University, Rajpura, Punjab, 410401</li>
              <li>adarsh25.10.2002@gmail.com</li>
              <li>+91 7 643 826 643</li>
              <li>+91 8 084 123 158</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2024 All Rights Reserved:
        <a className="text-white ml-1" href="https://yourcompany.com" target="_blank" rel="noopener noreferrer">
          Latent.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
