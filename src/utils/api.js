import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log("Token attached to request:", token);
  } else {
    console.log("No token found in localStorage");
  }
  return config;
});

export const signup = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

export const addTransaction = async (transaction) => {
  try {
    console.log("Sending transaction data:", transaction);
    const response = await api.post("/transactions", transaction);
    console.log("Response from server:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding transaction:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateTransaction = async (id, transaction) => {
  const response = await api.put(`/transactions/${id}`, transaction);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

export default api;
