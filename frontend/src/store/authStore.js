import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { API_BASE_URL } from '../config/api.js';

axios.defaults.withCredentials = true;

const API_URL = API_BASE_URL + "/api/auth";

const handleError = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "An unexpected error occurred.";
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
          console.log("API URL:", API_URL);
          const res = await axios.post(`${API_URL}/signup`, { email, password, firstName, lastName });
          console.log("Signup response:", res.data);
          if (res.data.token) localStorage.setItem("token", res.data.token);
          set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const msg = handleError(err);
          console.error("Signup error:", err);
          console.error("Signup error message:", msg);
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Attempting login with:", { email });
          console.log("API URL:", API_URL);
          const res = await axios.post(`${API_URL}/login`, { email, password });
          console.log("Login response:", res.data);
          if (res.data.token) localStorage.setItem("token", res.data.token);
          set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const msg = handleError(err);
          console.error("Login error:", err);
          console.error("Login error message:", msg);
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
          const res = await axios.get(`${API_URL}/check-auth`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = res.data.user;
          set({ user, isAuthenticated: !!user, isCheckingAuth: false });
        } catch (err) {
          const msg = handleError(err);
          console.error("Check auth error:", msg);
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
