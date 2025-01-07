import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useSecureStorage } from "./useSecureStorage";

const AuthContext = createContext({
  signIn: () => null,
  signOut: () => null,
  session: null,
  user: null,
  isLoading: false,
});

// Custom hook for accessing auth data
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a SessionProvider");
  }
  return context;
}

// SessionProvider component to manage the session and user data
export function SessionProvider({ children }) {
  const { saveToSecureStore, getFromSecureStore, deleteFromSecureStore } =
    useSecureStorage();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null); // Store user data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const storedSession = await getFromSecureStore("session");
      const storedUser = await getFromSecureStore("user");
      if (storedSession) {
        setSession(storedSession);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse the stored user object
      }
      setIsLoading(false);
    };
    loadSession();
  }, []);

  const signIn = async (token, userData) => {
    // Store session and user data
    await saveToSecureStore("session", token);
    await saveToSecureStore("user", JSON.stringify(userData)); // Save user data as stringified JSON
    setSession(token);
    setUser(userData);
  };

  const signOut = async () => {
    // Clear session and user data
    await deleteFromSecureStore("session");
    await deleteFromSecureStore("user");
    setSession(null);
    setUser(null);
  };

  // Create an Axios instance with the token in headers
  const axiosInstance = axios.create({
    baseURL:
      process.env.EXPO_PUBLIC_API_URL ||
      "https://bharatloads-be-cd9fce57f28d.herokuapp.com/api/v1",
    headers: {
      Authorization: session ? `Bearer ${session}` : "",
    },
  });

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, session, user, isLoading, axiosInstance }}>
      {children}
    </AuthContext.Provider>
  );
}
