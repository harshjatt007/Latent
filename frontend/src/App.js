import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import AdminDashboard from "./admindash";
import SignInPage from "./SignInPage";
import Battle from "./components/Battle";
import FormComponent from "./components/form";
import Contact from './pages/Contact'; // Import the new Contact page

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/signup" element={<SignupForm />} />
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dash" element={<AdminDashboard />} />

        {/* Additional Routes */}
        <Route path="/battle" element={<Battle />} />
        <Route path="/form" element={<FormComponent />} />

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} /> {/* Add the Contact page */}

        {/* Signin Routes */}
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </Router>
  );
}

export default App;
