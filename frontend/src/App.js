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
import AdminDashboard from "./pages/AdminDashboard";
import Battle from "./pages/Battle.js";
import FormComponent from "./components/form";
import Contact from './pages/Contact';
import Ratings from "./pages/Ratings";

import VideoPlayer from "./pages/VideoPlayer.js";

import { useAuthStore } from "./store/authStore.js";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

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
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/signup" element={<RedirectAuthenticatedUser><Signup /></RedirectAuthenticatedUser>} />
        <Route path="/google-auth-redirect" element={<GoogleAuthRedirect />} />

        {/* Main Routes */}
        <Route
          path="/"
          element={
            <div className="bg-gray-50 min-h-screen">
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
            <Profile />
          }
        />
        <Route
          path="/admin-dash"
          element={
            <AdminDashboard />
          }
        />

        {/* Additional Routes */}
        <Route path="/battle" element={<Battle />} />
        <Route path="/form" element={<FormComponent />} />
        <Route path="/video/:filename" element={<VideoPlayer />} />
        <Route path="/ratings" element={<Ratings />} />

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} />

        {/* Signin Routes */}
        <Route path="/login" element={<RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>} />
      </Routes>
    </Router>
  );
}

export default App;