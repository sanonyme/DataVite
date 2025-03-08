import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

const DarkModeStoryboard = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 gap-6 p-6 bg-background min-h-screen transition-colors duration-300">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-8">
            <motion.h1 
              className="text-3xl font-bold text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Dark Mode Toggle Demo
            </motion.h1>
            
            <motion.div 
              className="w-full max-w-md h-64 bg-card rounded-lg shadow-lg border border-border flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-center">
                <p className="text-xl mb-4">Current theme: <span className="font-bold">{theme}</span></p>
                <Button 
                  onClick={toggleTheme}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="mr-2 h-5 w-5" />
                      Switch to Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="mr-2 h-5 w-5" />
                      Switch to Light Mode
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
              <motion.div 
                className="p-4 bg-primary text-primary-foreground rounded-lg shadow-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <h3 className="font-bold mb-2">Primary Color</h3>
                <p className="text-sm">This uses the primary color scheme</p>
              </motion.div>
              
              <motion.div 
                className="p-4 bg-secondary text-secondary-foreground rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{