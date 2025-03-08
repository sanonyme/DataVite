import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
  AuthResponse,
} from "@/lib/auth";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  signIn: () => Promise.resolve({ success: false }),
  signUp: () => Promise.resolve({ success: false }),
  signOut: () => Promise.resolve({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        // For development without Supabase credentials, use a mock user
        if (!import.meta.env.VITE_SUPABASE_URL) {
          console.log("Using mock user for development");
          setUser({
            id: "mock-user-id",
            email: "user@example.com",
            user_metadata: {
              full_name: "Demo User",
            },
          });
        } else {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signIn(email, password);
      if (response.success) {
        setUser(response.user);
      } else {
        setError(response.error || "Failed to sign in");
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signUp(email, password, name);
      if (response.success) {
        // Don't set user here as they need to verify email first
        // Instead show a success message
      } else {
        setError(response.error || "Failed to create account");
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await signOut();
      if (response.success) {
        setUser(null);
      } else {
        setError(response.error || "Failed to sign out");
      }
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
