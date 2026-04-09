import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Zustand state
  const { signup, isLoading } = useAuthStore();

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
      if (field !== "lastName") {
        message = `${field} is required`;
      }
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
    ].every((field) => {
      let val = formData[field];
      if (field === "password") val = password;
      if (field === "confirmPassword") val = confirmPassword;
      return validateField(field, val);
    });

    if (!isValid) return;

    try {
      await signup(
        formData.email,
        password,
        formData.firstName,
        formData.lastName,
        formData.role || 'user'
      );
      toast.success("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex-grow flex items-center justify-center pt-[120px] pb-20 px-4">
        <div className="w-full max-w-xl p-10 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic text-center mb-2">
            Start your journey
          </h1>
          <h2 className="text-gray-500 dark:text-gray-400 text-center mb-10 font-medium">Sign Up to Latent</h2>

          <form className="space-y-6" onSubmit={handleSignUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["firstName", "lastName"].map((field) => (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-4">
                    {field === "firstName" ? "First Name" : "Last Name (Optional)"}
                  </label>
                  <input
                    type="text"
                    id={field}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={field === "firstName" ? "First Name" : "Last Name"}
                    className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium dark:text-white ${
                      errors[field] ? "border-red-500" : ""
                    }`}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-[10px] font-bold pl-4 uppercase tracking-wider">{errors[field]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-4">
                Select Role
              </label>
              <select
                id="role"
                value={formData.role || "user"}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium dark:text-white"
              >
                <option value="user">Audience</option>
                <option value="contestant">Contestant</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-4">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium dark:text-white ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-[10px] font-bold pl-4 uppercase tracking-wider">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-4">
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
                  placeholder="Enter password"
                  className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium dark:text-white ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-[10px] font-bold pl-4 uppercase tracking-wider">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-4">
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
                  placeholder="Confirm password"
                  className={`w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium dark:text-white ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-[10px] font-bold pl-4 uppercase tracking-wider">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-center mt-4 px-4">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  onChange={() => setShowPassword(!showPassword)}
                  className="w-5 h-5 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-blue-600 focus:ring-blue-500 transition-all"
                />
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">Reveal Password</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.5rem] hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20 uppercase tracking-widest text-sm mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">
              Existing user? <a href="/login" className="text-blue-600 font-black hover:underline uppercase text-xs tracking-widest ml-1">Log In</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
