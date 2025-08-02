import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Contact Section */}
        <div id="contact" className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="text-purple-500" />
                <span>Chitkara University, Rajpura, Punjab, 410401</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-purple-500" />
                <span>abhishekchoudhary236@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-purple-500" />
                <span>+91 7 643 826 643</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-purple-500" />
                <span>+91 8 084 123 158</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button className="text-left hover:text-purple-500 bg-transparent border-none cursor-pointer">About Us</button></li>
              <li><button className="text-left hover:text-purple-500 bg-transparent border-none cursor-pointer">How It Works</button></li>
              <li><button className="text-left hover:text-purple-500 bg-transparent border-none cursor-pointer">FAQ</button></li>
              <li><button className="text-left hover:text-purple-500 bg-transparent border-none cursor-pointer">Terms of Service</button></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com/yourprofile" className="hover:text-purple-500" target="_blank" rel="noopener noreferrer">
                <Facebook size={24} />
              </a>
              <a href="https://twitter.com/yourprofile" className="hover:text-purple-500" target="_blank" rel="noopener noreferrer">
                <Twitter size={24} />
              </a>
              <a href="https://instagram.com/yourprofile" className="hover:text-purple-500" target="_blank" rel="noopener noreferrer">
                <Instagram size={24} />
              </a>
              <a href="https://linkedin.com/in/yourprofile" className="hover:text-purple-500" target="_blank" rel="noopener noreferrer">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-4 border-t border-gray-800">
          <p>&copy; 2024 Latent. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
