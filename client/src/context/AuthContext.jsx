import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import api from "../api/users";

const AuthContext = createContext(null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading for initial auth check
  const [error, setError] = useState(null); // Error for auth operations (logout, token refresh)

  // Initialize auth on mount - call /me endpoint
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.post("/refresh");
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // Request interceptor - add Authorization header to all requests
  useEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      // Don't add header if it's a retry or if no token
      config.headers.Authorization =
        !config._retry && accessToken
          ? `Bearer ${accessToken}`
          : config.headers.Authorization;
      return config;
    });

    // Cleanup: remove interceptor when component unmounts or token changes
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [accessToken]);

  // Response interceptor - handle 401 errors and refresh token
  useEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and we haven't retried yet
        if (
          error.response?.status === 401 &&
          error.response?.data?.message === "Invalid or expired token" &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            // Call refresh endpoint to get new access token
            const response = await api.post("/refresh");

            // Update token in state
            setAccessToken(response.data.accessToken);
            setUser(response.data.user);

            // Update Authorization header for the retry
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

            // Retry the original request
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed - log user out
            setAccessToken(null);
            setUser(null);
            setError("Session expired. Please log in again.");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup: remove interceptor when component unmounts or token changes
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [accessToken]);

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      setError(null);
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
      setError("Logout request failed, but you've been logged out locally.");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  const value = {
    accessToken,
    user,
    loading,
    error,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };
