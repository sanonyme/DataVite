import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const AuthPage = () => {
  const { signIn, signUp, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    const response = await signIn(email, password);
    if (response.success) {
      navigate("/");
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string,
  ) => {
    const response = await signUp(email, password, name);
    if (response.success) {
      setSuccessMessage(
        "Account created successfully! Please check your email to verify your account.",
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary/5 to-secondary/10 dark:from-primary/10 dark:to-secondary/20 p-4 transition-colors duration-300">
      <motion.div
        className="w-full max-w-md space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {successMessage && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-400">
              Success!
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <AuthForm
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          isLoading={isLoading}
          error={error}
        />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-primary hover:underline transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-primary hover:underline transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
