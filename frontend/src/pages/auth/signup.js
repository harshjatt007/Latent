import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Zustand state
  const { signup, isLoading, error } = useAuthStore();

  // Form state with local state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Helper: Capitalize the first letter of each word
  const capitalizeWords = (value) => {
    return value
      .split(" ")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  };

  // Validation rules
  const validateField = (field, value) => {
    let message = "";
    if (!value) {
      message = `${field} is required`;
    } else if (field === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com)$/i;
      if (!emailRegex.test(value)) {
        message = "Please enter a valid email with @gmail.com, @hotmail.com, or @yahoo.com domain";
      }
    }
     else if (["firstName", "lastName"].includes(field)) {
      if (!/^[a-zA-Z ]+$/.test(value)) {
        message = "Only English letters and spaces are allowed";
      } else {
        setFormData((prev) => ({ ...prev, [field]: capitalizeWords(value) }));
      }
    } else if (field === "password" && value.length < 6) {
      message = "Password must be at least 6 characters";
    } else if (field === "confirmPassword" && value !== password) {
      message = "Passwords do not match";
    }

    setErrors((prev) => ({ ...prev, [field]: message }));
    return message === "";
  };

  // Handle sign-up submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate fields
    const isValid = [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
    ].every((field) => validateField(field, formData[field] || password));

    if (!isValid) return;

    try {
      await signup(
        formData.email,
        password,
        formData.firstName,
        formData.lastName
      );
      alert("Signup successful! Welcome!");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  return (
    <div className="relative w-full h-screen flex">
      <div className="left w-full lg:w-1/2 flex flex-col justify-center items-center bg-blue-100">
        <div className="w-3/4 max-w-md">
          <h1 className="text-2xl font-bold text-gray-800">
            Start your journey
          </h1>
          <h2 className="text-lg text-gray-600 mb-6">Sign Up to Latent</h2>

          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="flex space-x-4">
              {["firstName", "lastName"].map((field) => (
                <div key={field} className="w-1/2">
                  <label htmlFor={field} className="text-gray-700">
                    {field === "firstName" ? "First Name" : "Last Name"}
                  </label>
                  <input
                    type="text"
                    id={field}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={
                      field === "firstName" ? "First Name" : "Last Name"
                    }
                    className="w-full"
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="email" className="text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email"
                className="w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                }}
                placeholder="Password"
                className="w-full"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-gray-700">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateField("confirmPassword", e.target.value);
                }}
                placeholder="Confirm Password"
                className="w-full"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-center mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                  className="form-checkbox"
                />
                <span className="text-sm text-gray-600">Show Password</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
