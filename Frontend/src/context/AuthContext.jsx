/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, onAuthEvent } from "../services/api";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isVerifying, setIsVerifying] = useState(true);

  // Issue #15: Verify auth state from server on mount, not just localStorage.
  // This prevents a user from editing localStorage to set role: "admin".
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .getMe()
        .then((response) => {
          setUser(response.user);
          localStorage.setItem("user", JSON.stringify(response.user));
        })
        .catch(() => {
          // Token is invalid or expired — clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        })
        .finally(() => setIsVerifying(false));
    } else {
      setIsVerifying(false);
    }
  }, []);

  // Issue #16: Listen for 401 session_expired events from the API layer
  useEffect(() => {
    const unsubscribe = onAuthEvent((event) => {
      if (event === "session_expired") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email, password, role) => {
    const response = await api.login({ email, password, role });
    localStorage.setItem("token", response.token);
    setUser(response.user);
    return true;
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const updateUser = (nextUser) => {
    setUser(nextUser);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isVerifying,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
