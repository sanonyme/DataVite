import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./layout/Header";
import FileUploadZone from "./upload/FileUploadZone";
import Dashboard from "./dashboard/Dashboard";
import ResultsSection from "./results/ResultsSection";
import AuthPage from "./auth/AuthPage";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

const Home = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<
    "upload" | "dashboard" | "results"
  >("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState("");

  // State for the parsed data from uploaded file
  const [sampleData, setSampleData] = useState([
    { month: "Jan", sales: 100, expenses: 75 },
    { month: "Feb", sales: 150, expenses: 100 },
    { month: "Mar", sales: 200, expenses: 125 },
    { month: "Apr", sales: 175, expenses: 150 },
    { month: "May", sales: 225, expenses: 175 },
    { month: "Jun", sales: 250, expenses: 200 },
  ]);

  // If auth is still loading, show nothing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
        />
      </div>
    );
  }

  // If no user is logged in, show auth page
  if (!user) {
    return <AuthPage />;
  }

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
  };

  const handleProcessFile = () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    // Parse the CSV file immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (text) {
          // More robust CSV parsing
          const lines = text
            .split(/\r?\n/)
            .filter((line) => line.trim() !== "");
          if (lines.length === 0) {
            console.error("No data in file");
            setIsProcessing(false);
            return;
          }

          // Parse header row
          const headerLine = lines[0];
          const headers = parseCSVLine(headerLine);

          // Parse data rows
          let parsedData = [];
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === "") continue;

            const values = parseCSVLine(lines[i]);
            if (values.length !== headers.length) {
              console.warn(`Skipping row ${i + 1}: column count mismatch`);
              continue;
            }

            const rowData: Record<string, any> = {};
            headers.forEach((header, index) => {
              // Try to convert numeric values
              const value = values[index];

              // Attempt to identify if this is a numeric field
              // Skip conversion for fields that are likely identifiers or categorical variables
              if (
                header.toLowerCase().includes("id") ||
                header.toLowerCase().includes("code") ||
                header.toLowerCase().includes("name") ||
                header.toLowerCase().includes("category") ||
                header.length <= 3
              ) {
                // Short codes are likely categorical
                rowData[header] = value;
              } else {
                // For other fields, try to convert to numbers if they look numeric
                const trimmedValue = value.trim();
                const numValue = parseFloat(trimmedValue);
                // Only convert if it's a valid number and the entire string is numeric
                rowData[header] =
                  !isNaN(numValue) && /^-?\d*\.?\d+$/.test(trimmedValue)
                    ? numValue
                    : value;
              }
            });

            parsedData.push(rowData);
          }

          // Update the data state with the parsed data
          if (parsedData.length > 0) {
            console.log("Parsed data:", parsedData);

            // Validate that we have at least one numeric field for visualization
            const hasNumericField = Object.values(parsedData[0]).some(
              (value) => typeof value === "number",
            );

            if (!hasNumericField) {
              console.warn(
                "No numeric fields detected, attempting to convert string fields to numbers",
              );
              // Try to convert any string fields that look like numbers
              parsedData = parsedData.map((item) => {
                const newItem = { ...item };
                // Examine each field to see if it can be converted to a number
                Object.keys(newItem).forEach((field) => {
                  if (typeof newItem[field] === "string") {
                    // Skip fields that are likely identifiers or categorical variables
                    if (
                      field.toLowerCase().includes("id") ||
                      field.toLowerCase().includes("code") ||
                      field.toLowerCase().includes("name") ||
                      field.toLowerCase().includes("category")
                    ) {
                      return;
                    }

                    // Try to convert to number
                    const value = newItem[field].trim();
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue) && /^-?\d*\.?\d+$/.test(value)) {
                      newItem[field] = numValue;
                    }
                  }
                });
                return newItem;
              });
            }

            setSampleData(parsedData);
            setTimeout(() => {
              setIsProcessing(false);
              setCurrentStep("dashboard");
            }, 500);
          } else {
            console.error("No valid data rows found");
            setIsProcessing(false);
          }
        }
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      console.error("Error reading file");
      setIsProcessing(false);
    };

    reader.readAsText(selectedFile);
  };

  // Helper function to parse CSV lines properly (handling quoted values)
  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let currentValue = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        // Toggle quote state
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        // End of field
        result.push(currentValue.trim());
        currentValue = "";
      } else {
        // Add character to current field
        currentValue += char;
      }
    }

    // Add the last field
    result.push(currentValue.trim());
    return result;
  };

  const handleNavigateBack = () => {
    if (currentStep === "dashboard") {
      setCurrentStep("upload");
    } else if (currentStep === "results") {
      setCurrentStep("dashboard");
    }
  };

  const handleNavigateNext = () => {
    if (currentStep === "dashboard") {
      // Simulate generating analysis results
      setAnalysisResults(
        "This dataset shows a consistent upward trend in both sales and expenses over the six-month period. Sales have grown from 100 in January to 250 in June, representing a 150% increase. Expenses have also increased from 75 to 200, showing a 166% growth. The profit margin (calculated as sales minus expenses) has remained relatively stable, ranging from 25 to 50 units throughout the period.",
      );
      setCurrentStep("results");
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "upload":
        return (
          <motion.div
            className="max-w-4xl mx-auto py-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FileUploadZone
              onFileUpload={handleFileUpload}
              isUploading={isProcessing}
              onProcessFile={handleProcessFile}
            />
          </motion.div>
        );
      case "dashboard":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <Dashboard
              data={sampleData}
              fileName={selectedFile?.name || "dataset.csv"}
              onBack={handleNavigateBack}
              onNext={handleNavigateNext}
            />
          </motion.div>
        );
      case "results":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full p-4"
          >
            <ResultsSection
              visualizationData={sampleData}
              analysisResults={analysisResults}
            />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Header />
      <main className="flex-1 flex flex-col">{renderCurrentStep()}</main>
    </div>
  );
};

export default Home;
