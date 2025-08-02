import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:5000") + "/api/auth";

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
          const res = await axios.post(`${API_URL}/signup`, { email, password, firstName, lastName });
          if (res.data.token) localStorage.setItem("token", res.data.token);
          set({ user: res.data.user, isAuthenticated: true, isLoading: false });
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
