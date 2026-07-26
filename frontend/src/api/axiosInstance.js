import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .trim();

const normalizedBaseURL = apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`;

const axiosInstance = axios.create({

  baseURL: normalizedBaseURL,

  headers: {

    "Content-Type": "application/json",

  },

  timeout: 15000,

});

axiosInstance.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;

  }

  return config;

});

axiosInstance.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/";

    }

    return Promise.reject(error);

  }

);

export default axiosInstance;
