import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Navbar from './components/Navbar';
import BodySection from './components/BodySection';
import Work from './components/Work';
import Review from './components/Review';
import PartnershipSection from './components/PartnershipSection';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import Profile from './pages/Profile.js'

import Login from './pages/auth/login.js';
import Signup from './pages/auth/signup.js';

import GoogleAuthRedirect from './GoogleAuthRedirect';
import Dashboard from './pages/Dashboard.js';
import UserDashboard from "./admindash";
import Battle from "./pages/Battle.js";
import FormComponent from "./components/form";
import Contact from './pages/Contact';
import Ratings from "./pages/Ratings";
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/TermsOfService";
import VideoPlayer from "./pages/VideoPlayer.js";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

import { useAuthStore } from "./store/authStore.js";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access this page", { id: 'login-required' });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
        {/* Authentication Routes */}
        <Route path="/signup" element={<RedirectAuthenticatedUser><Signup /></RedirectAuthenticatedUser>} />
        <Route path="/google-auth-redirect" element={<GoogleAuthRedirect />} />

        {/* Main Routes */}
        <Route
          path="/"
          element={
            <div className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-500">
              <Navbar />
              <div className="pt-[80px]">
                <BodySection />
                <Work />
                <Review />
                <PartnershipSection />
                <BlogSection />
                <Footer />
              </div>
            </div>
          }
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dash"
          element={
            <AdminRoute>
              <UserDashboard />
            </AdminRoute>
          }
        />

        {/* Additional Routes */}
        <Route path="/battle" element={<Battle />} />
        <Route path="/form" element={<ProtectedRoute><FormComponent /></ProtectedRoute>} />
        <Route path="/video/:filename" element={<VideoPlayer />} />
        <Route path="/ratings" element={<ProtectedRoute><Ratings /></ProtectedRoute>} />

        {/* Contact Page */}
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

        {/* Quick Links Pages */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Signin Routes */}
        <Route path="/login" element={<RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;