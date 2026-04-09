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
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      if (!email) setErrors(p => ({ ...p, email: "Email is required" }));
      if (!password) setErrors(p => ({ ...p, password: "Password is required" }));
      return;
    }
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) { toast.error(err.message || "Login failed!"); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500 font-sans">
      <Navbar />
      <div className="flex-grow flex items-center justify-center pt-[120px] pb-20 px-4">
        <div className="w-full max-w-md p-10 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800">
          <h1 className="text-4xl font-black text-center mb-2 uppercase italic tracking-tighter">Welcome Back</h1>
          <p className="text-gray-500 text-center mb-10 font-medium">Log in to your account</p>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-4">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 font-medium" />
              {errors.email && <p className="text-red-500 text-[10px] pl-4 mt-1">{errors.email}</p>}
            </div>
            <div className="relative">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-4">Password</label>
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 font-medium" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-[72%] -translate-y-1/2 text-[10px] font-black text-gray-400">SHOW</button>
            </div>
            <button className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-sm" disabled={isLoading}>{isLoading ? "Verifying..." : "Login"}</button>
          </form>
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-sm font-medium">New here? <a href="/signup" className="text-blue-600 font-black uppercase text-xs ml-1">Sign Up</a></div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;