import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate after login
import axios from 'axios';

const SignInPage = () => {
  // State management for form data and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // loading state for button

  const navigate = useNavigate(); // For navigating to other pages

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the form from submitting in the default way

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true); // Set loading to true when submitting

    try {
      // Send POST request to backend for sign-in
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email,
        password,
      });

      // On success, save the JWT token and user name to localStorage, then navigate
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); // Save token to localStorage
        // Save user's name in localStorage for use on dashboard
        localStorage.setItem('userName', `${response.data.firstName} ${response.data.lastName}`);

        navigate('/dashboard'); // Redirect to dashboard
      }
    } catch (error) {
      setLoading(false); // Reset loading state
      if (error.response) {
        // If the error is from the backend, show the error message
        setError(error.response.data.message || 'An error occurred');
      } else {
        setError('Server error');
      }
    }
  };

  return (
    <div className="sign-in-page">
      <h2>Sign In</h2>

      {/* Show error message if any */}
      {error && <div className="error">{error}</div>}

      {/* Form starts here */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {/* If loading, show a different text */}
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>

      <p>
        {/* Link to sign-up page */}
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default SignInPage;
