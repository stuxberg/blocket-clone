import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading for initial auth check
  const [error, setError] = useState(null); // Error for auth operations (logout, token refresh)

  // Ref to hold current token - interceptor reads from this
  const accessTokenRef = useRef(null);

  // Sync ref whenever accessToken changes
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  // Initialize auth on mount - call /me endpoint
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.post("/auth/refresh");
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);

        // initializeSocket(response.data.accessToken);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // Request interceptor - set up ONCE, reads from ref (always up-to-date)
  useEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      // Read current token from ref - always gets latest value
      const currentToken = accessTokenRef.current;
      config.headers.Authorization =
        !config._retry && currentToken
          ? `Bearer ${currentToken}`
          : config.headers.Authorization;
      return config;
    });

    // Cleanup: only eject on unmount (not on token change)
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, []); // Empty deps - only runs once

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
            const response = await api.post("/auth/refresh");

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

    // Cleanup: remove interceptor only on unmount
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []); // Empty deps - only runs once

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      setError(null);
      await api.post("/auth/logout");
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
