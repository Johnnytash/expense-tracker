import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        api.defaults.headers["Authorization"] = `Bearer ${token}`;
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData.user));
    api.defaults.headers["Authorization"] = `Bearer ${userData.token}`;
    console.log("Token set in localStorage and api defaults:", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers["Authorization"];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
