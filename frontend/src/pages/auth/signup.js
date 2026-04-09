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
  const { signup, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", role: "user" });
  const [errors, setErrors] = useState({});

  const capitalizeWords = (value) => value.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");

  const validateField = (field, value) => {
    let message = "";
    if (!value && field !== "lastName") message = `${field} is required`;
    else if (field === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com)$/i;
      if (!emailRegex.test(value)) message = "Enter a valid @gmail.com, @hotmail.com, or @yahoo.com address";
    } else if (["firstName", "lastName"].includes(field) && value) {
      if (!/^[a-zA-Z ]+$/.test(value)) message = "Only letters allowed";
    } else if (field === "password" && value.length < 6) message = "Password too short";
    else if (field === "confirmPassword" && value !== password) message = "Passwords do not match";
    
    setErrors(prev => ({ ...prev, [field]: message }));
    return message === "";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const isValid = ["firstName", "email", "password", "confirmPassword"].every(f => validateField(f, f === "password" ? password : f === "confirmPassword" ? confirmPassword : formData[f]));
    if (!isValid) return;

    try {
      await signup(formData.email, password, capitalizeWords(formData.firstName), capitalizeWords(formData.lastName), formData.role);
      toast.success("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500 font-sans">
      <Navbar />
      <div className="flex-grow flex items-center justify-center pt-[120px] pb-20 px-4">
        <div className="w-full max-w-xl p-10 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800">
          <h1 className="text-4xl font-black text-center mb-2 uppercase italic tracking-tighter">Start Journey</h1>
          <p className="text-gray-500 text-center mb-10 font-medium">Join the Latent Arena</p>
          <form className="space-y-6" onSubmit={handleSignUp}>
            <div className="grid grid-cols-2 gap-4">
              {["firstName", "lastName"].map(f => (
                <div key={f}>
                  <input type="text" placeholder={f === "firstName" ? "First Name" : "Last Name"} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 font-medium" onChange={e => setFormData({...formData, [f]: e.target.value})} />
                  {errors[f] && <p className="text-red-500 text-[10px] pl-4 mt-1">{errors[f]}</p>}
                </div>
              ))}
            </div>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 font-medium"><option value="user">Audience</option><option value="contestant">Contestant</option></select>
            <input type="email" placeholder="Email Address" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 font-medium" onChange={e => setFormData({...formData, email: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 font-medium" onChange={e => setPassword(e.target.value)} />
              <input type={showPassword ? "text" : "password"} placeholder="Confirm" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 font-medium" onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <div className="flex gap-2 items-center px-4"><input type="checkbox" onChange={() => setShowPassword(!showPassword)} /><span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reveal</span></div>
            <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-sm" disabled={isLoading}>{isLoading ? "Processing..." : "Create Account"}</button>
          </form>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm font-medium">Already a legend? <a href="/login" className="text-blue-600 font-black uppercase text-xs ml-1">Log In</a></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
