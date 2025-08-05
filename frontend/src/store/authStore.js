import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { API_BASE_URL } from '../config/api.js';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000; // 10 second timeout

// Remove this line since we're using the apiClient with baseURL
// const API_URL = API_BASE_URL + "/api/auth";

// Create axios instance with better error handling
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const handleError = (error) => {
  console.error("Full error object:", error);
  
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || `Server error: ${error.response.status}`;
      console.error("Server error response:", error.response.data);
      return message;
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error - no response:", error.request);
      return "Network error - please check your connection";
    } else {
      // Something else happened
      console.error("Request setup error:", error.message);
      return error.message || "Request configuration error";
    }
  }
  
  return error.message || "An unexpected error occurred.";
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isCheckingAuth: true,

      signup: async (email, password, firstName, lastName) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Attempting signup with:", { email, firstName, lastName });
          const res = await apiClient.post(`/api/auth/signup`, { 
            email, 
            password, 
            firstName, 
            lastName 
          });
          console.log("Signup response:", res.data);
          if (res.data.token) localStorage.setItem("token", res.data.token);
          set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const msg = handleError(err);
          console.error("Signup error:", err.response || err.message || err);
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Attempting login with:", { email });
          const res = await apiClient.post(`/api/auth/login`, { email, password });
          console.log("Login response:", res.data);
          if (res.data.token) localStorage.setItem("token", res.data.token);
          set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const msg = handleError(err);
          console.error("Login error:", err.response || err.message || err);
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      logout: () => {
        localStorage.clear();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) return set({ isCheckingAuth: false, isAuthenticated: false });

        set({ isCheckingAuth: true });
        try {
          console.log("Checking auth with token:", token ? "Present" : "Missing");
          const res = await apiClient.get(`/api/auth/check-auth`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Check auth response:", res.data);
          const user = res.data.user;
          set({ user, isAuthenticated: !!user, isCheckingAuth: false });
        } catch (err) {
          const msg = handleError(err);
          console.error("Check auth error:", err.response || err.message || err);
          localStorage.removeItem("token"); // Clear invalid token
          set({ error: msg, isCheckingAuth: false, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
