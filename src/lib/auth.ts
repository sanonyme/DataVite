import { supabase } from "./supabase";

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
}

export const signIn = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    // For development without Supabase credentials, use a mock response
    if (!import.meta.env.VITE_SUPABASE_URL) {
      console.log("Using mock sign-in for development");
      return {
        success: true,
        user: {
          id: "mock-user-id",
          email,
          user_metadata: {
            full_name: "Demo User",
          },
        },
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to sign in" };
  }
};

export const signUp = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> => {
  try {
    // For development without Supabase credentials, use a mock response
    if (!import.meta.env.VITE_SUPABASE_URL) {
      console.log("Using mock sign-up for development");
      return {
        success: true,
        user: {
          id: "mock-user-id",
          email,
          user_metadata: {
            full_name: name,
          },
        },
      };
    }

    // First create the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;

    // Send verification email using Resend (this would be handled by a serverless function)
    // For now, we'll just return success and assume the email is sent
    return { success: true, user: data.user };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create account",
    };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    // For development without Supabase credentials, use a mock response
    if (!import.meta.env.VITE_SUPABASE_URL) {
      console.log("Using mock sign-out for development");
      return { success: true };
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to sign out" };
  }
};

export const getCurrentUser = async (): Promise<any | null> => {
  try {
    // For development without Supabase credentials, use a mock user
    if (!import.meta.env.VITE_SUPABASE_URL) {
      console.log("Using mock current user for development");
      return {
        id: "mock-user-id",
        email: "user@example.com",
        user_metadata: {
          full_name: "Demo User",
        },
      };
    }

    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};
