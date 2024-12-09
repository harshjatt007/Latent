import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error } = useAuthStore(); // Zustand actions and state
  const navigate = useNavigate();

  // Validation functions
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

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      if (!email) setErrors((prev) => ({ ...prev, email: "Email is required" }));
      if (!password) setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }

    try {
      await login(email, password); // Zustand login action
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message || "Login failed!");
    }
  };

  return (
    <div className="relative w-full h-screen flex">
      <div className="left w-full lg:w-1/2 flex flex-col justify-center items-center bg-blue-100">
        <div className="w-3/4 max-w-md">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <h2 className="text-lg text-gray-600 mb-6">Log in to your account</h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                placeholder="Email"
                className="w-full"
                disabled={isLoading}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                placeholder="Password"
                className="w-full"
                disabled={isLoading}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Show Password Checkbox */}
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
              disabled={isLoading}
            >
              {isLoading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account? <a href="/signup" className="text-blue-600">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;