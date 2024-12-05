import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignupForm = () => {
  const [isSigningIn, setIsSigningIn] = useState(false); // Toggle between Sign In and Sign Up modes
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [password, setPassword] = useState(""); // Store password
  const [confirmPassword, setConfirmPassword] = useState(""); // Store confirm password

  // State to handle input values and errors
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "", // Add error state for confirm password
  });

  const navigate = useNavigate(); // Initialize navigate hook

  // Validation functions (similar to previous ones)
  const validateFirstName = (value) => {
    if (!/^[a-zA-Z]*$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        firstName: "Only letters are allowed",
      }));
    } else {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }
  };

  const validateLastName = (value) => {
    if (!/^[a-zA-Z]*$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        lastName: "Only letters are allowed",
      }));
    } else {
      setErrors((prev) => ({ ...prev, lastName: "" }));
    }
  };

  const validateEmail = (value) => {
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validatePassword = (value) => {
    if (value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  // Handle sign-up submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      // Validation before submission
      if (!firstName) setErrors((prev) => ({ ...prev, firstName: "First Name is required" }));
      if (!lastName) setErrors((prev) => ({ ...prev, lastName: "Last Name is required" }));
      if (!email) setErrors((prev) => ({ ...prev, email: "Email is required" }));
      if (!password) setErrors((prev) => ({ ...prev, password: "Password is required" }));
      if (!confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "Confirm Password is required" }));
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Signup successful! Please log in.');
        setIsSigningIn(true); // Switch to login mode after successful signup
      } else {
        alert(data.message || 'Signup failed!');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('An error occurred during signup.');
    }
  };

  // Handle sign-in submission
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      // Validation before submission
      if (!email) setErrors((prev) => ({ ...prev, email: "Email is required" }));
      if (!password) setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Sign-in successful!');
        // Redirect based on the email
        if (email === "sharmaaayush532@gmail.com") {
          navigate('/admin-dash'); // Redirect to admin dashboard if email matches
        } else {
          navigate('/dashboard'); // Redirect to regular dashboard
        }
      } else {
        alert(data.message || 'Sign-in failed!');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      alert('An error occurred during sign-in.');
    }
  };

  return (
    <div className="relative w-full h-screen flex">
      {/* Left Section (Sign Up / Sign In Form) */}
      <div
        className={`left w-full lg:w-1/2 flex flex-col justify-center items-center bg-blue-100 ${isSigningIn ? "slide-left" : ""}`}
      >
        <div className="w-3/4 max-w-md">
          <h1 className="text-2xl font-bold text-gray-800">
            {isSigningIn ? "Welcome Back" : "Start your journey"}
          </h1>
          <h2 className="text-lg text-gray-600 mb-6">
            {isSigningIn ? "Sign In to InsideBox" : "Sign Up to InsideBox"}
          </h2>

          <form className="space-y-4" onSubmit={isSigningIn ? handleSignIn : handleSignUp}>
            {/* First and Last Name Fields (Only in Sign Up) */}
            {!isSigningIn && (
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label htmlFor="firstName" className="text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); validateFirstName(e.target.value); }}
                    placeholder="First Name"
                    className="w-full"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                <div className="w-1/2">
                  <label htmlFor="lastName" className="text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); validateLastName(e.target.value); }}
                    placeholder="Last Name"
                    className="w-full"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value); }}
                placeholder="Email"
                className="w-full"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }}
                placeholder="Password"
                className="w-full"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password Field (Only in Sign Up) */}
            {!isSigningIn && (
              <div>
                <label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); validateConfirmPassword(e.target.value); }}
                  placeholder="Confirm Password"
                  className="w-full"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Password Visibility Toggle */}
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                  className="form-checkbox"
                />
                <span className="text-sm text-gray-600">Show Password</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md mt-4"
            >
              {isSigningIn ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Toggle between Sign Up and Sign In */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {isSigningIn
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                className="text-blue-600"
                onClick={() => setIsSigningIn(!isSigningIn)}
              >
                {isSigningIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
