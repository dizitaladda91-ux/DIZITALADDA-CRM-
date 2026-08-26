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

  // NEW: send httpOnly auth cookies with every request.
  // Required for the backend to see the cookie-based access/refresh tokens.
  withCredentials: true,

});

axiosInstance.interceptors.request.use((config) => {

  // REMOVED: manual Authorization header injection from localStorage.
  // The access token now lives in an httpOnly cookie and is attached
  // automatically by the browser via withCredentials — no JS access to it,
  // which is the whole point (mitigates XSS token theft).

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

      // NEW: no more localStorage.removeItem("token"/"user") — there's
      // nothing to remove client-side anymore. The server clears the
      // cookies on logout/expiry; here we just redirect.
      //
      // NOTE (flagging, not implementing yet): this still hard-redirects
      // on any 401, including a merely-expired access token that a silent
      // refresh-token call could have recovered from. A follow-up upgrade
      // would intercept 401s, call POST /auth/refresh once, retry the
      // original request, and only redirect if the refresh itself fails.
      // Keeping current behavior for this patch to keep the change scoped
      // to storage location, not auth flow behavior.

      window.location.href = "/";

    }

    return Promise.reject(error);

  }

);

export default axiosInstance;