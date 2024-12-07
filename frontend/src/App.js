import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import BodySection from './components/BodySection';
import Work from './components/Work';
import Review from './components/Review';
import PartnershipSection from './components/PartnershipSection';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import SignupForm from './SignupForm';
import GoogleAuthRedirect from './GoogleAuthRedirect';
import Dashboard from './Dashboard';
import UserDashboard from "./admindash";
import SignInPage from "./SignInPage";
import Battle from "./components/Battle";
import FormComponent from "./components/form";
import Contact from './pages/Contact';

import { useAuthStore } from "./store/authStore.js";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (isAuthenticated && !user?.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user?.isVerified) {
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
        <Route path="/signup" element={<RedirectAuthenticatedUser><SignupForm /></RedirectAuthenticatedUser>} />
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
          path="/admin-dash"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Additional Routes */}
        <Route path="/battle" element={<Battle />} />
        <Route path="/form" element={<FormComponent />} />

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} />

        {/* Signin Routes */}
        <Route path="/signin" element={<RedirectAuthenticatedUser><SignInPage /></RedirectAuthenticatedUser>} />
      </Routes>
    </Router>
  );
}

export default App;