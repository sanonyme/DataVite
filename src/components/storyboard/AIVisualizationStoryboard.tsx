import React from "react";
import { Card, CardContent } from "../ui/card";
import AIAnalysisPanel from "../ai/AIAnalysisPanel";
import VisualizationPanel from "../visualization/VisualizationPanel";

const AIVisualizationStoryboard = () => {
  // Sample data for visualization
  const sampleData = [
    { month: "Jan", sales: 100, expenses: 75, profit: 25, customers: 120 },
    { month: "Feb", sales: 150, expenses: 100, profit: 50, customers: 145 },
    { month: "Mar", sales: 200, expenses: 125, profit: 75, customers: 190 },
    { month: "Apr", sales: 175, expenses: 150, profit: 25, customers: 170 },
    { month: "May", sales: 225, expenses: 175, profit: 50, customers: 210 },
    { month: "Jun", sales: 250, expenses: 200, profit: 50, customers: 230 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 min-h-screen">
      <Card className="shadow-md">
        <CardContent className="p-0 h-[600px]">
          <VisualizationPanel
            data={sampleData}
            title="Enhanced Visualization"
          />
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-0 h-[600px]">
          <AIAnalysisPanel data={sampleData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AIVisualizationStoryboard;
