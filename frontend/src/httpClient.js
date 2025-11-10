import axios from "axios";

// Get API URL from environment variable
// In production, this should be set to your Render backend URL
// Example: https://medhealth-backend.onrender.com
const url = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'development' ? "http://localhost:5000" : "http://localhost:5000");

const httpClient = axios.create({
  baseURL: url,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default httpClient; 