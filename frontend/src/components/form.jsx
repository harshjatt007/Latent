import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, API_BASE_URL } from "../config/api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import toast from "react-hot-toast";

const FormComponent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
  const [hasParticipated, setHasParticipated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  React.useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) { navigate("/login"); return; }
    if (user && user.role !== 'contestant') { navigate("/dashboard"); return; }
  }, [isAuthenticated, isCheckingAuth, navigate, user]);

  React.useEffect(() => {
    async function checkParticipation() {
      if (isCheckingAuth) return;
      if (user && user.role === 'contestant') {
        const userId = user._id || user.id;
        try {
          const res = await fetch(`${API_BASE_URL}/api/check-participation/${userId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.participated) setHasParticipated(true);
          }
        } catch (e) {
          console.error("Error checking participation:", e);
        } finally { setIsChecking(false); }
      } else if (!isCheckingAuth) { setIsChecking(false); }
    }
    checkParticipation();
  }, [user, isCheckingAuth]);

  const [formData, setFormData] = useState({
    name: "", address: "", age: "", rating: "", video: null, aboutPoints: [], paymentStatus: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aboutInput, setAboutInput] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age || formData.age < 1) newErrors.age = "Invalid age";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.rating) newErrors.rating = "Rating is required";
    if (!formData.video) newErrors.video = "Video is required";
    if (formData.aboutPoints.length === 0) newErrors.aboutPoints = "Add at least one point";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) { toast.error("Please fill all fields first."); return; }
    try {
      const response = await fetch(`${API_BASE_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1 }),
      });
      const data = await response.json();
      const options = {
        key: "rzp_test_jX0Zhni0nTh4Wp",
        amount: data.amount,
        currency: "INR",
        name: "Latent Platform",
        description: "Contest Entry Fee",
        order_id: data.id,
        handler: function (response) {
          toast.success("Payment successful");
          setFormData(prev => ({ ...prev, paymentStatus: true }));
        },
        prefill: { name: formData.name, email: user.email },
        theme: { color: "#2563eb" },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) { toast.error("Payment initiation failed."); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.paymentStatus) { toast.error("Payment required."); return; }
    setIsSubmitting(true);
    try {
      const fData = new FormData();
      fData.append("uploadfile", formData.video);
      fData.append("name", formData.name);
      fData.append("address", formData.address);
      fData.append("age", formData.age);
      fData.append("rating", formData.rating);
      fData.append("aboutPoints", JSON.stringify(formData.aboutPoints));
      fData.append("userId", user?._id || user?.id);

      const response = await fetch(API_ENDPOINTS.fileUpload, { method: "POST", body: fData });
      const data = await response.json();
      if (data.success) {
        toast.success("Uploaded successfully!");
        navigate("/battle");
      } else { throw new Error(data.error); }
    } catch (error) { toast.error(error.message); } finally { setIsSubmitting(false); }
  };

  if (isChecking) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-gray-400">Loading...</div>;

  if (hasParticipated) return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Navbar />
      <div className="flex-grow pt-[120px] pb-20 flex justify-center items-center px-4">
        <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-[3rem] p-10 w-full max-w-2xl border border-gray-100 dark:border-gray-800 text-center">
          <h2 className="text-4xl font-black text-blue-600 mb-4 uppercase italic">LIMIT REACHED</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 font-bold">You've already entered today's contest. Try again tomorrow!</p>
          <button onClick={() => navigate('/dashboard')} className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl">Dashboard</button>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-500">
      <Navbar />
      <div className="flex-grow pt-[120px] pb-20 flex justify-center items-center px-4">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 shadow-2xl rounded-[3rem] p-10 w-full max-w-2xl border border-gray-100 dark:border-gray-800 space-y-6">
          <h2 className="text-4xl font-black text-center text-blue-600 mb-8 uppercase italic">Submit Talent</h2>
          
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Age" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              <input type="number" step="0.1" placeholder="Self Rating (0-5)" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} />
            </div>
            <textarea placeholder="Address" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            
            <div>
              <div className="flex gap-2">
                <input type="text" placeholder="Add a point about yourself" className="flex-1 px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700" value={aboutInput} onChange={e => setAboutInput(e.target.value)} />
                <button type="button" onClick={() => { if(aboutInput.trim()) setFormData({...formData, aboutPoints: [...formData.aboutPoints, aboutInput]}); setAboutInput(""); }} className="px-4 bg-blue-600 text-white rounded-2xl font-black">Add</button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.aboutPoints.map((p, i) => <span key={i} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">{p}</span>)}
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] p-8 text-center">
              <input type="file" onChange={e => { const f = e.target.files[0]; setFormData({...formData, video: f}); setVideoPreview(URL.createObjectURL(f)); }} className="hidden" id="video-upload" />
              <label htmlFor="video-upload" className="cursor-pointer text-blue-600 font-black uppercase text-xs">Click to upload video</label>
              {videoPreview && <video src={videoPreview} controls className="mt-4 rounded-xl max-h-40 mx-auto" />}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={handlePayment} disabled={formData.paymentStatus} className={`flex-1 py-4 font-black rounded-2xl uppercase text-xs ${formData.paymentStatus ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"}`}>{formData.paymentStatus ? "✓ Paid" : "Pay Entry Fee"}</button>
            <button type="submit" disabled={!formData.paymentStatus || isSubmitting} className="flex-1 py-4 font-black rounded-2xl uppercase text-xs bg-gray-900 text-white disabled:opacity-50">{isSubmitting ? "Uploading..." : "Submit Entry"}</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default FormComponent;