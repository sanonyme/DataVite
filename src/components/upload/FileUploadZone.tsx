import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  Upload,
  File,
  X,
  FileText,
  AlertCircle,
  Database,
  ArrowRight,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { apiService } from "@/lib/api";

interface FileUploadZoneProps {
  onFileUpload?: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number;
  isUploading?: boolean;
  onProcessFile?: () => void;
}

const FileUploadZone = ({
  onFileUpload = () => {},
  acceptedFileTypes = ".csv",
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  isUploading = false,
  onProcessFile = () => {},
}: FileUploadZoneProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.name.endsWith(".csv")) {
      setError("Only CSV files are accepted");
      return false;
    }

    // Check file size
    if (file.size > maxFileSize) {
      setError(
        `File size exceeds the maximum limit of ${maxFileSize / (1024 * 1024)}MB`,
      );
      return false;
    }

    setError(null);
    return true;
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    onFileUpload(file);

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Generate preview for CSV
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        // Clean the data by removing empty rows and trimming values
        const rows = text
          .split("\n")
          .filter((row) => row.trim() !== "")
          .slice(0, 5); // Get first 5 rows for preview

        // Parse CSV more robustly
        const parsedRows = rows.map((row) => {
          // Handle quoted values with commas inside them
          const values = [];
          let inQuotes = false;
          let currentValue = "";

          for (let i = 0; i < row.length; i++) {
            const char = row[i];

            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              values.push(currentValue.trim());
              currentValue = "";
            } else {
              currentValue += char;
            }
          }

          // Add the last value
          values.push(currentValue.trim());
          return values;
        });

        setPreviewData(parsedRows);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [onFileUpload, maxFileSize],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setError(null);
    setUploadProgress(0);
  };

  const handleProcessDataset = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      // In a real implementation, this would call the Python backend
      // await apiService.uploadDataset(selectedFile);

      // Generate preview for CSV again to ensure data is properly loaded
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          if (text) {
            // Process the file and then call onProcessFile
            setTimeout(() => {
              setIsProcessing(false);
              onProcessFile();
            }, 1500);
          }
        } catch (error) {
          console.error("Error parsing CSV:", error);
          setIsProcessing(false);
          setError("Failed to parse CSV file. Please check the file format.");
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
        setIsProcessing(false);
        setError("Failed to read file. Please try again.");
      };

      reader.readAsText(selectedFile);
    } catch (error) {
      console.error("Error processing dataset:", error);
      setIsProcessing(false);
      setError("Failed to process dataset. Please try again.");
    }
  };

  return (
    <Card className="w-full bg-card shadow-md border-0 transition-colors duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Upload Dataset
            </CardTitle>
            <CardDescription>
              Drag and drop your CSV file or click to browse
            </CardDescription>
          </div>
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Database className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedFile ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-all duration-300",
              dragActive
                ? "border-primary bg-primary/5 scale-[1.01] shadow-md"
                : "border-border hover:border-primary/50",
            )}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium mb-2">Drop your file here</p>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Supported format: CSV (Comma Separated Values)
              <br />
              Maximum file size: {maxFileSize / (1024 * 1024)}MB
            </p>
            <label htmlFor="file-upload">
              <Input
                id="file-upload"
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-sm"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <File className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
            </label>
            {error && (
              <div className="mt-4 flex items-center text-destructive gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                disabled={isUploading || isProcessing}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {uploadProgress < 100 ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            ) : null}

            {previewData.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="text-sm font-medium p-3 bg-muted/20 border-b flex justify-between items-center">
                  <span>File Preview</span>
                  <span className="text-xs text-muted-foreground">
                    Showing first 5 rows
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/10">
                        {previewData[0]?.map((header, i) => (
                          <th
                            key={i}
                            className="px-4 py-2 text-left font-medium"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(1).map((row, i) => (
                        <tr key={i} className="border-t">
                          {row.map((cell, j) => (
                            <td key={j} className="px-4 py-2 truncate max-w-xs">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/20 p-4 flex justify-end transition-colors duration-300">
        <Button
          disabled={
            isUploading || isProcessing || !selectedFile || uploadProgress < 100
          }
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-md"
          onClick={handleProcessDataset}
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Process Dataset
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileUploadZone;
