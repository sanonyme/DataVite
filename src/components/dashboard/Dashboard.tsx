import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Save,
  BarChart4,
  LineChart,
  PieChart,
  Grid2X2,
  Sparkles,
} from "lucide-react";
import DashboardCanvas from "./DashboardCanvas";
import { useToast } from "../ui/use-toast";
import { motion } from "framer-motion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import VisualizationPanel from "../visualization/VisualizationPanel";
import AIAnalysisPanel from "../ai/AIAnalysisPanel";

interface DashboardProps {
  data?: any[];
  fileName?: string;
  onBack?: () => void;
  onNext?: () => void;
}

const Dashboard = ({
  data = [
    { month: "Jan", sales: 100, expenses: 75 },
    { month: "Feb", sales: 150, expenses: 100 },
    { month: "Mar", sales: 200, expenses: 125 },
    { month: "Apr", sales: 175, expenses: 150 },
    { month: "May", sales: 225, expenses: 175 },
    { month: "Jun", sales: 250, expenses: 200 },
  ],
  fileName = "sales_data.csv",
  onBack = () => {},
  onNext = () => {},
}: DashboardProps) => {
  const [activeView, setActiveView] = useState("canvas");
  const [aiResults, setAiResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedCharts, setSavedCharts] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmitPrompt = (prompt: string, template: string) => {
    setIsLoading(true);
    // Simulate API call with dynamic analysis based on the actual data
    setTimeout(() => {
      // Generate a dynamic analysis based on the actual data
      let analysis = `Analysis based on your prompt: "${prompt}"

Key Findings:\n`;

      // Extract field names from the data
      const numericFields = [];
      const categoryFields = [];

      if (data && data.length > 0) {
        const firstRow = data[0];
        for (const key in firstRow) {
          if (typeof firstRow[key] === "number") {
            numericFields.push(key);
          } else {
            categoryFields.push(key);
          }
        }
      }

      // Generate insights based on the actual data fields
      if (numericFields.length > 0) {
        // Calculate some basic statistics for each numeric field
        numericFields.forEach((field, index) => {
          const values = data.map((item) => item[field]);
          const sum = values.reduce((a, b) => a + b, 0);
          const avg = sum / values.length;
          const max = Math.max(...values);
          const min = Math.min(...values);
          const maxItem = data.find((item) => item[field] === max);
          const minItem = data.find((item) => item[field] === min);

          analysis += `${index + 1}. The ${field} values range from ${min} to ${max}, with an average of ${avg.toFixed(2)}.\n`;

          if (categoryFields.length > 0 && maxItem && minItem) {
            const categoryField = categoryFields[0];
            analysis += `   - The highest ${field} (${max}) was observed for ${categoryField}: ${maxItem[categoryField]}.\n`;
            analysis += `   - The lowest ${field} (${min}) was observed for ${categoryField}: ${minItem[categoryField]}.\n`;
          }

          // Check for trends if we have a category field that might represent time
          if (categoryFields.length > 0 && data.length > 2) {
            const firstValue = values[0];
            const lastValue = values[values.length - 1];
            const percentChange = ((lastValue - firstValue) / firstValue) * 100;

            if (percentChange > 0) {
              analysis += `   - There is an overall increasing trend in ${field}, with a ${percentChange.toFixed(0)}% increase from beginning to end.\n`;
            } else if (percentChange < 0) {
              analysis += `   - There is an overall decreasing trend in ${field}, with a ${Math.abs(percentChange).toFixed(0)}% decrease from beginning to end.\n`;
            } else {
              analysis += `   - The ${field} values remain relatively stable throughout the dataset.\n`;
            }
          }
        });
      }

      // Add recommendations based on the analysis
      analysis += "\nRecommendations:\n";

      if (numericFields.length > 1) {
        analysis += `- Consider exploring the relationship between ${numericFields.join(" and ")} to identify potential correlations\n`;
      }

      if (categoryFields.length > 0 && numericFields.length > 0) {
        analysis += `- Segment your analysis by ${categoryFields.join(" and ")} to uncover more specific patterns\n`;
      }

      analysis += `- Perform a deeper statistical analysis to validate the observed trends\n`;
      analysis += `- Consider collecting additional data points to strengthen the reliability of insights\n`;

      setAiResults(analysis);
      setIsLoading(false);
    }, 2000);
  };

  const handleSaveChart = () => {
    // In a real implementation, this would save the chart to the backend
    setSavedCharts([...savedCharts, `Chart ${savedCharts.length + 1}`]);

    toast({
      title: "Dashboard saved",
      description: `Your dashboard has been saved successfully.`,
      duration: 3000,
    });
  };

  const renderContent = () => {
    switch (activeView) {
      case "visualization":
        return (
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <VisualizationPanel data={data} title="Data Visualization" />
          </motion.div>
        );
      case "analysis":
        return (
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AIAnalysisPanel
              isLoading={isLoading}
              onSubmitPrompt={handleSubmitPrompt}
              analysisResults={aiResults}
              data={data}
            />
          </motion.div>
        );
      case "canvas":
        return (
          <motion.div
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DndProvider backend={HTML5Backend}>
              <DashboardCanvas data={data} />
            </DndProvider>
          </motion.div>
        );
      case "split":
      default:
        return (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <VisualizationPanel data={data} title="Data Visualization" />
            <AIAnalysisPanel
              isLoading={isLoading}
              onSubmitPrompt={handleSubmitPrompt}
              analysisResults={aiResults}
              data={data}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background transition-colors duration-300">
      {/* Dashboard Header */}
      <motion.div
        className="bg-card p-4 border-b shadow-sm sticky top-0 z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Analyzing: {fileName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveChart}
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button
              size="sm"
              onClick={onNext}
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* View Selector */}
        <div className="mt-4">
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto">
              <TabsTrigger value="canvas" className="flex items-center gap-1">
                <Grid2X2 className="h-4 w-4" />
                <span>Canvas</span>
              </TabsTrigger>
              <TabsTrigger
                value="visualization"
                className="flex items-center gap-1"
              >
                <BarChart4 className="h-4 w-4" />
                <span>Visualization</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>AI Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="split" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                <span>Split View</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Dashboard Content */}
      <div className="flex-grow overflow-auto p-4">{renderContent()}</div>

      {/* Dashboard Footer */}
      <motion.div
        className="bg-card p-3 border-t"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>Data Analysis & Visualization Platform</div>
          <div className="flex items-center gap-2">
            <span>Saved Charts: {savedCharts.length}</span>
            <span>•</span>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
