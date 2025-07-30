import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate instead of useHistory

const GoogleAuthRedirect = () => {
  const navigate = useNavigate(); // useNavigate hook to navigate programmatically

  useEffect(() => {
    // Fetch user data after authentication
    const fetchUserData = async () => {
      const response = await fetch("https://latent-kk5m.onrender.com/auth/google/callback", {
        method: "GET",
        credentials: "include", // Include cookies for session management
      });
      const user = await response.json();

      if (user) {
        console.log("Logged in user:", user);
        // Redirect to profile page
        navigate("/profile"); // Use navigate instead of history.push
      }
    };

    fetchUserData();
  }, [navigate]); // Add navigate as a dependency

  return (
    <div>
      <h1>Loading...</h1>
      <p>Please wait while we authenticate your Google account...</p>
    </div>
  );
};

export default GoogleAuthRedirect;
