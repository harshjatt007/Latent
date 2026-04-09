import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500 font-quicksand">
      <Navbar />
      <div className="flex-grow flex items-center justify-center pt-[120px] pb-20 px-4">
        <div className="w-full max-w-md p-10 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic text-center mb-2">Welcome Back</h1>
          <h2 className="text-gray-500 dark:text-gray-400 text-center mb-10 font-medium tracking-tight">Log in to your account</h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-4">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                placeholder="Enter your email address"
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium dark:text-white"
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-[10px] font-bold pl-4 uppercase tracking-wider">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-4">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  placeholder="Enter password"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium dark:text-white"
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold pl-4 uppercase tracking-wider">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20 uppercase tracking-widest text-sm mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Validating..." : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              New user? <a href="/signup" className="text-blue-600 font-black hover:underline uppercase text-xs tracking-widest ml-1">Sign Up</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;