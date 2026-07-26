import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
  .trim();

const normalizedBaseURL = apiBaseUrl
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

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

  if (
    config.url &&
    !config.url.startsWith("http://") &&
    !config.url.startsWith("https://") &&
    config.url.startsWith("/")
  ) {
    config.url = config.url.startsWith("/api")
      ? config.url
      : `/api${config.url}`;
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
