import React, { useState } from "react";
import { useAuthStore } from '../store/authStore';
import { useNavigate } from "react-router-dom";


const FormComponent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    age: "",
    rating: "",
    video: null,
    aboutPoints: [],
  });
  const { isAuthenticated, logout, user } = useAuthStore();


  const [aboutInput, setAboutInput] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  const handlePayment = () => {
    if(!isFormValid()) {
      alert("Enter all the details in the form to proceed with the payment!");
      return;
    }
    window.location.href = "https://razorpay.me/@adarshkumargupta435?amount=EPec5evqGoRk2C8icWNJlQ%3D%3D";
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    console.log("Token:", token);
  
    // const submissionData = new FormData();
    // submissionData.append("name", formData.name);
    // submissionData.append("address", formData.address);
    // submissionData.append("age", formData.age);
    // submissionData.append("rating", formData.rating);
    // submissionData.append("aboutPoints", JSON.stringify(formData.aboutPoints));
    // submissionData.append("video", formData.video);    
  
    try {
      //console.log("Sending data:", submissionData);
  
      // const response = await fetch("http://localhost:5000/api/upload", {
      //   method: "POST",
      //   body: submissionData,
      //   headers: {
      //     "Authorization": `Bearer ${token}`,
      //   },
      // });
  
     // if (!response.ok) throw new Error("Error submitting form");
  
      //const result = await response.json();
      //console.log(result);
      await handlesubmit2(e);
      alert("Form submitted successfully!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Error submitting form");
    }
  };


async function handlesubmit2(e) {
    e.preventDefault();
    const fileInput = document.getElementById('uploadfile');
    const file = fileInput.files[0];
    console.log(file);
    if (file) {
    const fData = new FormData();
    fData.append('uploadfile', file);
    fData.append("name", user.firstName);
    fData.append("address", formData.address);
    fData.append("age", formData.age);
    fData.append("rating", formData.rating);
    fData.append("aboutPoints", JSON.stringify(formData.aboutPoints));            
    try {
        const uploadResponse = await fetch(`http://localhost:5000/fileupload`, {
                    method: 'POST',
                    body: fData
          });

            const data = await uploadResponse.json();
            console.log(data);

            } catch (error) {
                console.error("Error during file upload:", error);
        }
    }
  }

  const isFormValid = () => {
    return (
      formData.name &&
      formData.address &&
      formData.age &&
      formData.rating &&
      formData.video &&
      formData.aboutPoints.length > 0
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 w-full max-w-2xl my-10 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Submit your video in Battle
        </h2>

        {/* Input Fields */}
        <div className="grid grid-cols-1 gap-6">
          {[{ label: "Name", type: "text", name: "name", value: formData.name },
            { label: "Age", type: "number", name: "age", value: formData.age },
            { label: "Rating (Out of 5)", type: "number", name: "rating", value: formData.rating, step: "0.1", min: "0", max: "5" }].map((input, idx) => (
            <div key={idx}>
              <label className="block text-gray-700 font-bold mb-2">
                {input.label}
              </label>
              <input
                type={input.type}
                name={input.name}
                value={input.value}
                step={input.step}
                min={input.min}
                max={input.max}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-700 font-bold mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {/* About Yourself */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">About Yourself</label>
          <ul className="list-disc list-inside space-y-1">
            {formData.aboutPoints.map((point, index) => (
              <li key={index} className="flex justify-between items-center text-gray-800">
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
              value={aboutInput}
              onChange={(e) => setAboutInput(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddAboutPoint}
              className="ml-3 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Upload Video</label>
          
          {videoPreview && (
            <div className="mt-4">
              <video controls src={videoPreview} className="w-full h-64"></video>
            </div>
          )}
        </div>
        {/* <form encType="multipart/form-data" className="uploadform"> */}
                    <input type="file" name="uploadfile" id="uploadfile" />
                    {/* <button type="submit" onClick={(e)=>handlesubmit2(e)}>Upload</button> */}
      {/* </form> */}
        <div className="flex justify-center gap-5">
          <div
            onClick={handlePayment}
            className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
          
            Pay Now
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>

      


    </div>
  );
};

export default FormComponent;