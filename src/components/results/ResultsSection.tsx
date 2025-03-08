import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import {
  Download,
  Save,
  FileText,
  Image,
  Share,
  Printer,
  Mail,
  Copy,
  Check,
} from "lucide-react";
import VisualizationPanel from "../visualization/VisualizationPanel";
import AIAnalysisPanel from "../ai/AIAnalysisPanel";

interface ResultsSectionProps {
  visualizationData?: any[];
  analysisResults?: string;
  onExportVisualization?: () => void;
  onExportAnalysis?: () => void;
  onSaveReport?: () => void;
}

const ResultsSection = ({
  visualizationData = [
    { month: "Jan", sales: 100, expenses: 75 },
    { month: "Feb", sales: 150, expenses: 100 },
    { month: "Mar", sales: 200, expenses: 125 },
    { month: "Apr", sales: 175, expenses: 150 },
    { month: "May", sales: 225, expenses: 175 },
    { month: "Jun", sales: 250, expenses: 200 },
  ],
  analysisResults = "This dataset shows a consistent upward trend in both sales and expenses over the six-month period. Sales have grown from 100 in January to 250 in June, representing a 150% increase. Expenses have also increased from 75 to 200, showing a 166% growth. The profit margin (calculated as sales minus expenses) has remained relatively stable, ranging from 25 to 50 units throughout the period.",
  onExportVisualization = () => console.log("Export visualization"),
  onExportAnalysis = () => console.log("Export analysis"),
  onSaveReport = () => console.log("Save complete report"),
}: ResultsSectionProps) => {
  const [activeView, setActiveView] = useState("split");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyResults = () => {
    if (!analysisResults) return;
    navigator.clipboard.writeText(analysisResults);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="w-full bg-card shadow-md border-0 transition-colors duration-300">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Results & Insights
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveReport}
              className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs
          defaultValue="split"
          onValueChange={setActiveView}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="split">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Split View</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="visualization">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span>Visualization</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Analysis</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              {activeView === "visualization" || activeView === "split" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportVisualization}
                  className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Chart
                </Button>
              ) : null}

              {activeView === "analysis" || activeView === "split" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportAnalysis}
                  className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Analysis
                </Button>
              ) : null}

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyResults}
                className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <TabsContent value="split" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[500px]">
                <VisualizationPanel
                  data={visualizationData}
                  title="Visualization"
                  onExport={onExportVisualization}
                />
              </div>
              <div className="h-[500px]">
                <AIAnalysisPanel analysisResults={analysisResults} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visualization" className="mt-0">
            <div className="h-[600px]">
              <VisualizationPanel
                data={visualizationData}
                title="Visualization"
                onExport={onExportVisualization}
              />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0">
            <div className="h-[600px]">
              <AIAnalysisPanel analysisResults={analysisResults} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResultsSection;
