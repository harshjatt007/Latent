import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const FormComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    age: "",
    rating: "",
    video: null,
    aboutPoints: [],
  });
  const [errors, setErrors] = useState({});
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [aboutInput, setAboutInput] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name.trim());
  };

  const validateAge = (age) => {
    const numAge = Number(age);
    return !isNaN(numAge) && numAge > 0 && numAge <= 100;
  };

  const validateNotEmptyWhitespace = (value) => {
    return value.trim().length > 0;
  };

  // Enhanced form validation
  const validateForm = () => {
    const newErrors = {};

    // Validate Name
    if (!validateName(formData.name)) {
      newErrors.name = "Name must contain only English letters";
    }

    // Validate Age
    if (!validateAge(formData.age)) {
      newErrors.age = "Age must be a number between 1 and 100";
    }

    // Validate Address
    if (!validateNotEmptyWhitespace(formData.address)) {
      newErrors.address = "Address cannot be empty";
    }

    // Validate Rating
    if (!formData.rating || isNaN(formData.rating)) {
      newErrors.rating = "Rating is required";
    }

    // Validate Video
    if (!formData.video) {
      newErrors.video = "Please upload a video";
    }

    // Validate About Points
    if (formData.aboutPoints.length === 0) {
      newErrors.aboutPoints = "Please add at least one point about yourself";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Razorpay payment
  const handlePayment = async () => {
    if (!validateForm()) {
      alert(
        "Please correct the errors in the form before proceeding with payment."
      );
      return;
    }

    try {
      const response = await fetch("https://latent-kk5m.onrender.com/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 1 }), // Amount in INR (1 Rs)
      });

      const data = await response.json();

      if (data.error) {
        alert("Error creating payment order.");
        return;
      }

      const options = {
        key: "rzp_test_jX0Zhni0nTh4Wp", // Replace with your Razorpay key ID
        amount: data.amount,
        currency: "INR",
        name: "Your Company Name",
        description: "Payment for Video Upload",
        order_id: data.id,
        handler: function (response) {
          alert("Payment successful");
          setIsPaymentSuccessful(true);
        },
        prefill: {
          name: formData.name,
          email: user.email,
          contact: user.contact,
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Error initiating payment");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let isValid = true;

    // Specific validations for each field
    switch (name) {
      case "name":
        isValid = validateName(value);
        break;
      case "age":
        isValid = validateAge(value);
        break;
        case "address":
          const wordCount = value.trim().split(/\s+/).length; // Count the words
          if (!validateNotEmptyWhitespace(value)) {
            isValid = false;
            setErrors((prevErrors) => ({
              ...prevErrors,
              address: "Address cannot be empty",
            }));
          } else if (wordCount > 20) {
            isValid = false;
            setErrors((prevErrors) => ({
              ...prevErrors,
              address: "Address cannot exceed 20 words",
            }));
          } else {
            isValid = true;
            setErrors((prevErrors) => {
              const newErrors = { ...prevErrors };
              delete newErrors.address;
              return newErrors;
            });
          }
          break;
        
      default:
        break;
    }

    // Update form data and clear error if valid
    setFormData({ ...formData, [name]: value });

    // Update or clear specific field errors
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (isValid) {
        delete newErrors[name];
      } else {
        switch (name) {
          case "name":
            newErrors.name = "Name must contain only English letters";
            break;
          case "age":
            newErrors.age = "Age must be a number between 1 and 100";
            break;
            case "address":
              const wordCount = value.trim().split(/\s+/).length;
              if (!validateNotEmptyWhitespace(value)) {
                isValid = false;
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  address: "Address cannot be empty",
                }));
              } else if (wordCount > 20) {
                isValid = false;
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  address: "Address cannot exceed 20 words",
                }));
              } else {
                isValid = true;
                setErrors((prevErrors) => {
                  const newErrors = { ...prevErrors };
                  delete newErrors.address;
                  return newErrors;
                });
              }
              break;
            
        }
      }
      return newErrors;
    });
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, video: file });
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  // Handle adding about points
  const handleAddAboutPoint = () => {
    const wordCount = aboutInput.trim().split(/\s+/).length;
    if (wordCount > 5) {
      alert("Each point about yourself cannot exceed 5 words.");
      return;
    }
  
    if (aboutInput.trim()) {
      setFormData({
        ...formData,
        aboutPoints: [...formData.aboutPoints, aboutInput],
      });
      setAboutInput("");
    }
  };
  

  // Handle deleting about points
  const handleDeleteAboutPoint = (index) => {
    const updatedPoints = formData.aboutPoints.filter((_, i) => i !== index);
    setFormData({ ...formData, aboutPoints: updatedPoints });
  };

  // Added handlesubmit2 method
  const handlesubmit2 = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("uploadfile");
    const file = fileInput.files[0];

    if (file) {
      const fData = new FormData();
      fData.append("uploadfile", file);
      fData.append("name", formData.name);
      fData.append("address", formData.address);
      fData.append("age", formData.age);
      fData.append("rating", formData.rating);
      fData.append("aboutPoints", JSON.stringify(formData.aboutPoints));

      try {
        const uploadResponse = await fetch("https://latent-kk5m.onrender.com/fileupload", {
          method: "POST",
          body: fData,
        });

        const data = await uploadResponse.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error("Error during file upload:", error);
        throw error;
      }
    } else {
      throw new Error("No file selected");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      alert("Please correct the errors in the form before submitting.");
      return;
    }

    try {
      await handlesubmit2(e);
      alert("Form submitted successfully!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 w-full max-w-2xl my-10 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Submit your video in Battle
        </h2>

        {/* Input Fields */}
        <div className="grid grid-cols-1 gap-6">
          {[
            {
              label: "Name",
              type: "text",
              name: "name",
              value: formData.name,
            },
            {
              label: "Age",
              type: "number",
              name: "age",
              value: formData.age,
            },
            {
              label: "Rating (Out of 5)",
              type: "number",
              name: "rating",
              value: formData.rating,
              step: "0.1",
              min: "0",
              max: "5",
            },
          ].map((input, idx) => (
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
                className={`shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none 
                  ${
                    errors[input.name]
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-2 focus:ring-blue-500"
                  }`}
              />
              {errors[input.name] && (
                <p className="text-red-500 text-xs italic mt-1">
                  {errors[input.name]}
                </p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className={`shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none 
                ${
                  errors.address
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.address}
              </p>
            )}
          </div>
        </div>

        {/* About Yourself */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            About Yourself
          </label>
          <ul className="list-disc list-inside space-y-1">
            {formData.aboutPoints.map((point, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-gray-800"
              >
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
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={aboutInput}
              onChange={(e) => setAboutInput(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a point about yourself"
            />
            <button
              type="button"
              onClick={handleAddAboutPoint}
              className="ml-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Upload Video
          </label>
          {videoPreview && (
            <div className="mt-4">
              <video
                controls
                src={videoPreview}
                className="w-full h-64"
              ></video>
            </div>
          )}
          <input
            type="file"
            name="uploadfile"
            id="uploadfile"
            onChange={handleFileChange}
            className="mt-2"
          />
          {errors.video && (
            <p className="text-red-500 text-xs italic mt-1">{errors.video}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-5">
          <div
            onClick={handlePayment}
            className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Pay Now
          </div>
          <button
            type="submit"
            disabled={!isPaymentSuccessful} // Disable if payment is not successful
            className={`px-6 py-2 rounded-lg ${
              isPaymentSuccessful
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;