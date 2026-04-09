import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, API_BASE_URL } from "../config/api";
import axios from "axios";
import formSideBg from '../assets/battle_live.png';
import Navbar from "./Navbar";
import Footer from "./Footer";
import toast from "react-hot-toast";

const FormComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  const [hasParticipated, setHasParticipated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  React.useEffect(() => {
    // Safety timeout to prevent infinite Loading screen
    const timeout = setTimeout(() => {
      if (isChecking) setIsChecking(false);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [isChecking]);

  React.useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, isCheckingAuth, navigate]);

  React.useEffect(() => {
    if (user && user.role !== 'contestant') {
      navigate("/dashboard");
    }
  }, [user, navigate]);


  React.useEffect(() => {
    async function checkParticipation() {
      if (isCheckingAuth) return; // Wait for store
      
      if (user && user.role === 'contestant') {
        const userId = user._id || user.id;
        try {
          console.log("Checking participation for:", userId);
          const res = await fetch(`${API_BASE_URL}/api/check-participation/${userId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.participated) {
              setHasParticipated(true);
            }
          }
        } catch (e) {
          console.error("Error checking participation:", e);
        } finally {
          setIsChecking(false);
        }
      } else if (!isCheckingAuth) {
        setIsChecking(false);
      }
    }
    checkParticipation();
  }, [user, isCheckingAuth]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    age: "",
    rating: "",
    video: null,
    aboutPoints: [],
  });
  const [errors, setErrors] = useState({});
  // const [, setIsPaymentSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!user) {
      toast.error(
        "You must be logged in to test the upload. Please log in or sign up first."
      );
      return;
    }

    if (!validateForm()) {
      toast.error(
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

      if (!response.ok) {
        toast.error("Error creating payment order.");
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
          toast.success("Payment successful");
          setFormData(prev => ({ ...prev, paymentStatus: true }));
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
      console.error("Error in Payment Process:", error);
      toast.error("Error initiating payment");
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
            
            default:
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
      toast.error("Each point about yourself cannot exceed 5 words.");
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
      // aboutPoints is already an array of strings as per Video schema
      fData.append("aboutPoints", JSON.stringify(formData.aboutPoints));
      const userIdStr = String(user?._id || user?.id || "");
      if (userIdStr) {
        fData.append("userId", userIdStr);
      }
      console.log("Submitting with userId:", userIdStr);

      try {
        console.log("Uploading to:", API_ENDPOINTS.fileUpload);
        console.log("Form data:", {
          name: formData.name,
          address: formData.address,
          age: formData.age,
          rating: formData.rating,
          aboutPoints: formData.aboutPoints
        });
        
        const uploadResponse = await fetch(API_ENDPOINTS.fileUpload, {
          method: "POST",
          body: fData,
        });

        console.log("Response status:", uploadResponse.status);

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("Error response:", errorText);
          
          // Try to parse the error as JSON
          let errorMessage = `HTTP error! status: ${uploadResponse.status}`;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error) {
              errorMessage = errorJson.error;
            }
          } catch (e) {
            errorMessage += ` - ${errorText}`;
          }
          
          throw new Error(errorMessage);
        }

        const data = await uploadResponse.json();
        console.log("Upload response:", data);
        
        if (data.success) {
          return data;
        } else {
          throw new Error(data.error || 'Upload failed');
        }
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
      toast.error("Please correct the errors in the form before submitting.");
      return;
    }

    if (!formData.paymentStatus) {
      toast.error("Please complete the payment before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      await handlesubmit2(e);
      toast.success("Form submitted successfully! Your video has been uploaded.");
      // Reset form after successful submission
      setFormData({
        name: "",
        age: "",
        rating: "",
        address: "",
        aboutPoints: [],
        video: null,
        paymentStatus: false,
      });
      navigate("/battle");
    } catch (error) {
      console.error("Submission Error Details:", error);
      toast.error(`Error submitting form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isChecking) {
    return <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col justify-center items-center text-gray-500 font-bold uppercase tracking-widest text-2xl">Loading...</div>;
  }

  if (hasParticipated) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
        <Navbar />
        <div className="flex-grow pt-[120px] pb-20 flex justify-center items-center px-4">
          <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-[3rem] p-10 w-full max-w-2xl border border-gray-100 dark:border-gray-800 text-center animate-fade-in-up">
            <h2 className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-4 tracking-tighter uppercase italic">
              LIMIT REACHED
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-bold text-lg">
              You have already successfully submitted your talent for today's contest. Please wait roughly 24 hours to post again!
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl shadow-xl transition-all shadow-blue-600/20 uppercase tracking-widest text-xs"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex-grow pt-[120px] pb-20 flex justify-center items-center px-4">
        
        {/* NEW Split Layout Container */}
        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-[3rem] w-full max-w-6xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row transition-all duration-300">
          
          {/* Image Section */}
          <div className="hidden md:block md:w-5/12 bg-gray-200 dark:bg-gray-800 relative">
             <img src={formSideBg} alt="Stage" className="absolute w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-gray-900/90 to-transparent"></div>
             <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <h3 className="text-3xl font-black text-white italic uppercase drop-shadow-lg mb-2">Claim Your Spotlight</h3>
                <p className="text-gray-200 font-medium">Upload your best talent directly to the global arena.</p>
             </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-7/12 p-8 sm:p-12">
            <form
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <h2 className="text-4xl font-black text-center md:text-left text-blue-600 dark:text-blue-400 mb-8 tracking-tighter uppercase italic">
                Submit your Talent
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
              <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
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
                className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium dark:text-white
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
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium dark:text-white
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
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            About Yourself
          </label>
          <ul className="list-disc list-inside space-y-1">
            {formData.aboutPoints.map((point, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-gray-800 dark:text-gray-200"
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
              className="shadow appearance-none border rounded w-full py-2 px-4 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
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
            className="mt-2 text-gray-900 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/50 dark:file:text-blue-400"
          />
          {errors.video && (
            <p className="text-red-500 text-xs italic mt-1">{errors.video}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-5 pt-6">
          <button
            type="button"
            onClick={handlePayment}
            disabled={formData.paymentStatus}
            className={`flex-1 px-10 py-5 font-black rounded-[1.5rem] transition-all uppercase tracking-widest text-xs shadow-xl ${
              formData.paymentStatus
                ? "bg-emerald-500 text-white cursor-default shadow-emerald-500/20"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-95 border-b-4 border-blue-800"
            }`}
          >
            {formData.paymentStatus ? "✓ Payment Verified" : "Pay & Verify"}
          </button>
          <button
            type="submit"
            disabled={!formData.paymentStatus || isSubmitting}
            className={`flex-1 px-10 py-5 font-black rounded-[1.5rem] transition-all uppercase tracking-widest text-xs shadow-xl ${
              formData.paymentStatus
                ? "bg-gray-900 text-white hover:bg-gray-800 active:scale-95 border-b-4 border-gray-700"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed border-b-4 border-gray-200 dark:border-gray-900"
            } ${isSubmitting ? "opacity-50 cursor-wait" : ""}`}
          >
            {isSubmitting ? "Uploading..." : "Submit Application"}
          </button>
        </div>
      </form>
      </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default FormComponent;