import React, { useState } from "react";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    age: "",
    rating: "",
    video: null,
    aboutPoints: [],
  });

  const [aboutInput, setAboutInput] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, video: file });
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleAddAboutPoint = () => {
    if (aboutInput.trim()) {
      setFormData({
        ...formData,
        aboutPoints: [...formData.aboutPoints, aboutInput],
      });
      setAboutInput("");
    }
  };

  const handleDeleteAboutPoint = (index) => {
    const updatedPoints = formData.aboutPoints.filter((_, i) => i !== index);
    setFormData({ ...formData, aboutPoints: updatedPoints });
  };

  const handlePayment = () => {
    // Redirect to Razorpay link
    window.location.href = "https://razorpay.me/@adarshkumargupta435?amount=EPec5evqGoRk2C8icWNJlQ%3D%3D";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", formData.name);
    formData.append("address", formData.address);
    formData.append("age", formData.age);
    formData.append("rating", formData.rating);
    formData.append("aboutPoints", JSON.stringify(formData.aboutPoints));
    formData.append("video", formData.video);

    try {
      const response = await fetch("http://localhost:5000/api/form", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error submitting form");
      }

      const result = await response.json();
      console.log(result);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error submitting form");
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Enhanced React Form
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 font-bold mb-2"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Age */}
        <div className="mb-4">
          <label htmlFor="age" className="block text-gray-700 font-bold mb-2">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label
            htmlFor="rating"
            className="block text-gray-700 font-bold mb-2"
          >
            Rating (Out of 5)
          </label>
          <input
            type="number"
            step="0.1"
            max="5"
            min="0"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* About Yourself */}
        <div className="mb-4">
          <label
            htmlFor="about"
            className="block text-gray-700 font-bold mb-2"
          >
            About Yourself
          </label>
          <ul className="list-disc list-inside mb-2">
            {formData.aboutPoints.map((point, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{point}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteAboutPoint(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center">
            <input
              type="text"
              id="about"
              value={aboutInput}
              onChange={(e) => setAboutInput(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            />
            <button
              type="button"
              onClick={handleAddAboutPoint}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* Video Upload */}
        <div className="mb-4">
          <label
            htmlFor="video"
            className="block text-gray-700 font-bold mb-2"
          >
            Upload Video
          </label>
          <div className="w-32 h-32 border rounded bg-gray-200 flex items-center justify-center mb-2 overflow-hidden">
            {videoPreview ? (
              <video
                src={videoPreview}
                controls
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-sm text-gray-500">No video</span>
            )}
          </div>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Pay Now Button */}
        <div className="mb-4 text-center">
          <button
            type="button"
            onClick={handlePayment}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Pay Now
          </button>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;