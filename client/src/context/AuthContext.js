import React, { createContext, useState, useContext, useEffect } from "react";
import {
  login as loginApi,
  register as registerApi,
  getCurrentUser,
} from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          try {
            // First set the stored user to prevent flicker
            setUser(JSON.parse(storedUser));

            // Then fetch fresh user data
            const response = await getCurrentUser();
            const freshUserData = response.data;

            setUser(freshUserData);
            localStorage.setItem("user", JSON.stringify(freshUserData));
          } catch (e) {
            console.error("Error fetching user data:", e);
            // Clear invalid data
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      } catch (e) {
        console.error("Error accessing localStorage:", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await loginApi(email, password);
      console.log("Login response:", response);

      // The response data contains user info and token directly
      const { token, ...userData } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update state with user data (everything except token)
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      setError(null);
      setLoading(true);

      const response = await registerApi(name, email, password, phone);
      // The response data contains user info and token directly
      const { token, ...userData } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update state with user data (everything except token)
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear state
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
