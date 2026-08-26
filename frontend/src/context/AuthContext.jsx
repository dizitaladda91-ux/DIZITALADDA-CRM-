import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  logoutUser, // NEW — assumed export; see note below if this doesn't exist yet
  getProfile,
  updateProfile as updateProfileRequest,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {


  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const restoreSession = async () => {

      // CHANGED: we can no longer check localStorage for a token before
      // deciding whether to call getProfile() — the access token now
      // lives in an httpOnly cookie that JS has no visibility into.
      // Instead, just attempt the call; the browser attaches the cookie
      // automatically (axiosInstance has withCredentials: true), and a
      // 401 here simply means "not logged in."

      try {

        const response = await getProfile();
        const profileUser = response?.data || response?.user || null;

        setUser(profileUser);

      }

      catch {

        // No valid session cookie (or it expired). Just ensure local
        // state is clear — no server call needed here since there's
        // nothing valid to invalidate.
        setUser(null);

      }

      finally {

        setLoading(false);

      }

    };

    restoreSession();

  }, []);

  const login = async (credentials) => {

    const response = await loginUser(credentials);

    // CHANGED: no more reading accessToken/token out of the response body
    // and writing it to localStorage — the backend now sets the access
    // and refresh tokens as httpOnly cookies directly via Set-Cookie.
    // The response body should now only contain the user object (confirm
    // authService.js / authController.js login response shape matches).

    if (response?.success) {
      const payload = response.data || {};
      const userData = payload.user || null;

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }
    }

    return response;

  };

  const logout = async () => {

    // CHANGED: logout must now call the backend, since only the server
    // can clear httpOnly cookies. Clearing local state alone would leave
    // valid cookies sitting in the browser.
    try {
      await logoutUser();
    } catch {
      // Even if the server call fails (e.g. network issue), fall through
      // and clear local state so the UI reflects logged-out immediately.
      // The cookie may persist until it expires naturally in this edge case.
    }

    localStorage.removeItem("user");

    setUser(null);

  };

  const updateProfile = async (profile) => {
    const response = await updateProfileRequest(profile);
    const updatedUser = response?.data || response?.user || null;

    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }

    return response;
  };
  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateProfile,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () =>
  useContext(AuthContext);