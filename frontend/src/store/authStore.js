import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Enable credentials with axios
axios.defaults.withCredentials = true;

const API_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:5000") + "/api/auth";

console.log("API_URL configured as:", API_URL);

// Error handling utility
const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "An unexpected error occurred.";
  }
  return error.message || "An unexpected error occurred.";
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isCheckingAuth: true,
      message: null,
      pendingRequests: [],

      // Signup method
      signup: async (email, password, firstName, lastName, role) => {
        set({ isLoading: true, error: null });

        try {
          console.log("Attempting signup with:", { email, firstName, lastName, role });
          const response = await axios.post(`${API_URL}/signup`, {
            email,
            password,
            firstName,
            lastName,
            role,
          });

          console.log("Signup response:", response.data); // Debugging response data

          // Save token and update store
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
          }
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            message: response.data.message,
          });

          return true;
        } catch (error) {
          const errorMessage = handleError(error);
          console.error("Signup error:", errorMessage); // Debugging error
          console.error("Signup error details:", error.response?.data); // More detailed error
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Login method
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          console.log("Attempting login with:", { email });
          const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
          });

          console.log("Login response:", response.data); // Debugging response data

          // Save token and update store
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
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
          console.error("Login error:", errorMessage); // Debugging error
          console.error("Login error details:", error.response?.data); // More detailed error
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Logout method
      logout: async () => {
        console.log("Logging out..."); // Debugging logout
        localStorage.clear();
        set({ user: null, isAuthenticated: false, error: null, pendingRequests: [] });
      },

      // Check authentication method
      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found in localStorage."); // Debugging token absence
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

          console.log("Check auth response:", response.data); // Debugging response data

          const user = response?.data?.user || null;

          set({
            user: user,
            isAuthenticated: Boolean(user),
            isCheckingAuth: false,
          });
        } catch (error) {
          const errorMessage = handleError(error);
          console.error("Check auth error:", errorMessage); // Debugging error
          set({
            error: errorMessage,
            isCheckingAuth: false,
            isAuthenticated: false,
          });
        }
      },

      // Admin functions
      getPendingRequests: async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const response = await axios.get(`${API_URL}/pending-requests`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          set({ pendingRequests: response.data.pendingRequests });
          return response.data.pendingRequests;
        } catch (error) {
          const errorMessage = handleError(error);
          console.error("Error getting pending requests:", errorMessage);
          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      approveUser: async (userId, approve) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        set({ isLoading: true });

        try {
          const response = await axios.post(`${API_URL}/approve-user`, {
            userId,
            approve
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Refresh pending requests
          await get().getPendingRequests();
          
          set({ isLoading: false, message: response.data.message });
          return response.data;
        } catch (error) {
          const errorMessage = handleError(error);
          console.error("Error approving user:", errorMessage);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: "auth-storage", // Name for persisted storage
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);
