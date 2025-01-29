import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { useThemeColor } from "../hooks/useThemeColor";

const AuthContext = createContext({});

const SECURE_STORE_KEYS = {
  USER: "auth_user",
  TOKEN: "auth_token",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [colour, setColour] = useState("transporter");

  // Call the hook outside of useEffect, at the top level
  const colourFromTheme = useThemeColor(user?.userType);

  // Load stored auth state on startup
  useEffect(() => {
    loadStoredAuthState();
  }, []);

  // Update colour when user changes
  useEffect(() => {
    if (colourFromTheme) {
      setColour(colourFromTheme);
    }
  }, [colourFromTheme]); // Re-run this effect when colourFromTheme changes

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    return () => {};
  }, [isAuthenticated]);

  // Load the stored user and token from secure storage
  const loadStoredAuthState = async () => {
    try {
      const [storedUser, storedToken] = await Promise.all([
        SecureStore.getItemAsync(SECURE_STORE_KEYS.USER),
        SecureStore.getItemAsync(SECURE_STORE_KEYS.TOKEN),
      ]);

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) {
        setToken(storedToken);
        // Update API authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

        // Check if the token is valid by calling /auth route
        await validateToken(storedToken);
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Validate token by hitting the /auth route
  const validateToken = async (authToken) => {
    try {
      console.log("authToken", authToken);
      const response = await api.get("/auth", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.status === 200) {
        console.log("Token is valid");
        // Token is valid, user is authenticated
        setIsAuthenticated(true);
        setUser(response.data.user);  
      }
    } catch (error) {
      // Token is invalid, navigate to Login
      console.error("Token validation error:", error);
      setIsAuthenticated(false);
      await clearAuthState();
    }
  };

  const persistAuthState = async (userData, authToken) => {
    try {
      if (userData) {
        await SecureStore.setItemAsync(
          SECURE_STORE_KEYS.USER,
          JSON.stringify(userData)
        );
      }
      if (authToken) {
        await SecureStore.setItemAsync(SECURE_STORE_KEYS.TOKEN, authToken);
        // Update API authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.error("Error persisting auth state:", error);
    }
  };

  const clearAuthState = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(SECURE_STORE_KEYS.USER),
        SecureStore.deleteItemAsync(SECURE_STORE_KEYS.TOKEN),
      ]);
      // Clear API authorization header
      delete api.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Error clearing auth state:", error);
    }
  };

  const signup = async (form) => {
    try {
      await api.post("/signup", {
        name: form.name,
        mobile: {
          countryCode: "91",
          phone: form.phoneNumber
        },
        userType: form.userType.toUpperCase(),
        companyName: form.companyName,
        companyLocation: form.companyLocation
      });
      
      router.push({
        pathname: "/(auth)/verify",
        params: { phoneNumber: form.phoneNumber },
      });
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (phoneNumber) => {
    try {
      await api.post("/login", {
        mobile: {
          countryCode: "91",
          phone: phoneNumber,
        },
      });

      router.push({
        pathname: "/(auth)/verify",
        params: { phoneNumber },
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const verifyOTP = async (otp, phoneNumber) => {
    try {
      const response = await api.post("/verify-otp", {
        otp,
        phone: phoneNumber,
      });

      const userData = response.data.user;
      const authToken = response.data.token;

      setUser(userData);
      setToken(authToken);

      // Persist the auth state
      await persistAuthState(userData, authToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);

      // Clear stored auth state
      await clearAuthState();

      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    // You might want to return a loading screen here
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isAuthenticated,
        login,
        verifyOTP,
        logout,
        colour,
        signup,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
