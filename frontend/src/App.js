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

import VideoPlayer from "./pages/VideoPlayer.js";

import { useAuthStore } from "./store/authStore.js";

// Role-based route protection
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is not approved (except for original admin), redirect to pending page
  if (!user.isApproved && user.email !== 'abhishek1161.be22@chitkara.edu.in') {
    return <Navigate to="/pending-approval" replace />;
  }

  // Check if user role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // Redirect based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user.role === 'audience') {
      return <Navigate to="/audience-dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

// Pending Approval Page Component
const PendingApproval = () => {
  const { user, logout } = useAuthStore();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Approval Pending</h2>
          <p className="text-gray-600 mb-4">
            Hello {user?.firstName}, your account is waiting for admin approval.
          </p>
          {user?.requestedRole && user.requestedRole !== 'participant' && (
            <p className="text-sm text-blue-600 mb-4">
              You requested to be an <strong>{user.requestedRole}</strong>. An admin will review your request soon.
            </p>
          )}
          <p className="text-sm text-gray-500">
            You'll receive access once an administrator approves your account.
          </p>
        </div>
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// Unauthorized Page Component
const Unauthorized = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Your current role: <strong>{user?.role}</strong>
          </p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
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
        <Route path="/login" element={<RedirectAuthenticatedUser><Login /></RedirectAuthenticatedUser>} />
        <Route path="/google-auth-redirect" element={<GoogleAuthRedirect />} />
        
        {/* Status Pages */}
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

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

        {/* Role-specific Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['participant']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/audience-dashboard"
          element={
            <ProtectedRoute allowedRoles={['audience']}>
              <Battle />
            </ProtectedRoute>
          }
        />

        {/* Profile Route - accessible to all authenticated users */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Form Route - only for participants */}
        <Route
          path="/form"
          element={
            <ProtectedRoute allowedRoles={['participant']}>
              <FormComponent />
            </ProtectedRoute>
          }
        />

        {/* Battle/Ratings Routes - for audience */}
        <Route
          path="/battle"
          element={
            <ProtectedRoute allowedRoles={['audience', 'admin']}>
              <Battle />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ratings"
          element={
            <ProtectedRoute allowedRoles={['audience', 'admin']}>
              <Ratings />
            </ProtectedRoute>
          }
        />

        {/* Video Player - accessible to all authenticated users */}
        <Route
          path="/video/:filename"
          element={
            <ProtectedRoute>
              <VideoPlayer />
            </ProtectedRoute>
          }
        />

        {/* Contact Page - public */}
        <Route path="/contact" element={<Contact />} />
        
        {/* Legacy admin route redirect */}
        <Route path="/admin-dash" element={<Navigate to="/admin-dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;