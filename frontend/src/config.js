import axios from "axios";

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: "https://mealplan-t.onrender.com/",
});

// Add a request interceptor to include the authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
