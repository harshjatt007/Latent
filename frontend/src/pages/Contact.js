import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // Validate name: only English letters, no spaces
    if (!/^[A-Za-z]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain English letters and no spaces.';
    }

    // Validate email
    const emailRegex = /^[^@\s]+@(?:gmail\.com|hotmail\.com)$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email must be valid (e.g., @gmail.com, @hotmail.com).';
    }

    // Validate message: only letters, max 250 characters
    if (!/^[A-Za-z\s]{1,250}$/.test(formData.message)) {
      newErrors.message = 'Message can only contain letters and must be under 250 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Form submitted successfully!');
      setFormData({ name: '', email: '', message: '' }); // Reset form
      navigate('/'); // Redirect to home route
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-4xl font-bold text-customBlue mb-4">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Have questions or want to get in touch? We'd love to hear from you!
      </p>
      <form
        className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Write your message here"
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-customBlue text-white font-medium rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
