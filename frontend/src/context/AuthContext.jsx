import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  logoutUser,
  getProfile,
  updateProfile as updateProfileRequest,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await getProfile();
        const profileUser = response?.data || response?.user || null;
        setUser(profileUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    if (response?.success) {
      const payload = response.data || {};
      const userData = payload.user || null;
      const accessToken = payload.accessToken || null;

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
    }

    return response;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore network errors during logout
    }

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
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

export const useAuth = () => useContext(AuthContext);