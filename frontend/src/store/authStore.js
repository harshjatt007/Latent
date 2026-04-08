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
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isCheckingAuth: false, // start false so persisted state shows immediately

      signup: async (email, password, firstName, lastName, role = 'user') => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_URL}/signup`, { email, password, firstName, lastName, role });
          if (res.data.token) localStorage.setItem("token", res.data.token);
          // Backend now returns user + token on signup
          if (res.data.user) {
            set({ user: res.data.user, isAuthenticated: true, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (err) {
          const msg = handleError(err);
          console.error("Signup error:", msg);
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_URL}/login`, { email, password });
          if (res.data.token) localStorage.setItem("token", res.data.token);
          set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const msg = handleError(err);
          console.error("Login error:", msg);
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isCheckingAuth: false, isAuthenticated: false, user: null });
          return;
        }
        // Don't reset isAuthenticated here — keep persisted state visible
        set({ isCheckingAuth: true });
        try {
          const res = await axios.get(`${API_URL}/check-auth`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = res.data.user;
          set({ user, isAuthenticated: !!user, isCheckingAuth: false });
        } catch (err) {
          // Token expired/invalid — clear it
          localStorage.removeItem("token");
          set({ error: null, isCheckingAuth: false, isAuthenticated: false, user: null });
        }
      },
    }),
    {
      name: "auth-storage",
      // Only persist user + isAuthenticated so it shows instantly on load
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
