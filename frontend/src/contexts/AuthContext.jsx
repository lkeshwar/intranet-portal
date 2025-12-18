import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);

      // Simple admin check from stored login
      const storedEmail = localStorage.getItem("userEmail");

      if (storedEmail === "admin@portal.com") {
        setIsAdmin(true);
      }
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await api.post("/api/auth/login", { username, password });

    if (!res.data.token) {
      throw new Error("Invalid Credentials");
    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userEmail", username);

    setToken(res.data.token);

    if (username === "admin@portal.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    return res.data.token;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
