import { create } from "zustand";
import axios from "axios";

// Set withCredentials to true to allow credentials with requests
axios.defaults.withCredentials = true;

const API_URL = "http://localhost:5000/api/auth";

// Handle error messages
const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "An unexpected error occurred.";
  }
  return error.message || "An unexpected error occurred.";
};

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        firstName,
        lastName,
      });

      localStorage.setItem("token", response.data.token); // Store the JWT token in localStorage
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      return true;
    } catch (error) {
      const errorMessage = handleError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token); // Store the JWT token in localStorage
      }

      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });

      return true;
    } catch (error) {
      const errorMessage = handleError(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  logout: async () => {
    localStorage.clear();
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isCheckingAuth: false, isAuthenticated: false });
      return;
    }
  
    set({ isCheckingAuth: true });
  
    try {
      const response = await axios.get(`${API_URL}/check-auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Check if the response contains a valid user object
      const user = response?.data?.user || null;
  
      set({
        user: user,
        isAuthenticated: Boolean(user),
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        error: handleError(error),
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  }  
}));