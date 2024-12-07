import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

axios.defaults.withCredentials = true;

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

      localStorage.setItem("token", response.data.token);
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
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
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
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/check-auth`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      set({
        user: response.data.user || null,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      const errorMessage = handleError(error);
      set({
        error: errorMessage,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },
}));