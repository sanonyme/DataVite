import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  Download,
  RefreshCw,
  Sliders,
  AreaChart,
  Activity as RadarChartIcon,
  TrendingUp,
  Layers,
} from "lucide-react";
import { apiService, VisualizationRequest } from "@/lib/api";
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ScatterChart as RechartsScatterChart,
  AreaChart as RechartsAreaChart,
  RadarChart as RechartsRadarChart,
  Bar,
  Line,
  Pie,
  Scatter,
  Area,
  Radar,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Treemap,
} from "recharts";

interface VisualizationPanelProps {
  data?: any[];
  title?: string;
  onExport?: () => void;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
];

const VisualizationPanel = ({
  data = [
    { month: "Jan", sales: 100, expenses: 75 },
    { month: "Feb", sales: 150, expenses: 100 },
    { month: "Mar", sales: 200, expenses: 125 },
    { month: "Apr", sales: 175, expenses: 150 },
    { month: "May", sales: 225, expenses: 175 },
    { month: "Jun", sales: 250, expenses: 200 },
  ],
  title = "Data Visualization",
  onExport = () => {},
}: VisualizationPanelProps) => {
  const [chartType, setChartType] = useState("bar");
  const [dataField, setDataField] = useState("sales");
  const [secondaryDataField, setSecondaryDataField] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>(data);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  useEffect(() => {
    // Extract available fields from data
    if (data && data.length > 0) {
      console.log("VisualizationPanel processing data:", data);

      // Check if data is valid
      if (!Array.isArray(data)) {
        console.error("Data is not an array");
        return;
      }

      if (typeof data[0] !== "object") {
        console.error("First item in data is not an object");
        return;
      }

      // Find all numeric fields in the data
      const numericFields = Object.keys(data[0]).filter(
        (key) => typeof data[0][key] === "number",
      );

      // If no numeric fields found, try to identify fields that might be numeric
      let fields = numericFields;
      if (fields.length === 0) {
        console.warn(
          "No numeric fields found, looking for potential numeric fields",
        );

        // Look for fields that might contain numeric data as strings
        fields = Object.keys(data[0]).filter((key) => {
          // Skip obvious non-numeric fields
          if (
            key.toLowerCase().includes("id") ||
            key.toLowerCase().includes("code") ||
            key.toLowerCase().includes("name") ||
            key.toLowerCase().includes("category")
          ) {
            return false;
          }

          // Check if any values in this field look like numbers
          return data.some((item) => {
            const value = item[key];
            if (typeof value === "string") {
              const trimmed = value.trim();
              return (
                !isNaN(parseFloat(trimmed)) && /^-?\d*\.?\d+$/.test(trimmed)
              );
            }
            return false;
          });
        });
      }

      console.log("Available fields for visualization:", fields);
      setAvailableFields(fields);

      // Only set dataField if it's not already set or if current dataField is not valid
      if (fields.length > 0 && (!dataField || !fields.includes(dataField))) {
        // Try to find the most appropriate field for primary visualization
        // Look for fields that might represent values (amount, value, total, etc.)
        const valueFields = fields.filter((field) => {
          const fieldLower = field.toLowerCase();
          return (
            fieldLower.includes("value") ||
            fieldLower.includes("amount") ||
            fieldLower.includes("total") ||
            fieldLower.includes("sum") ||
            fieldLower.includes("count")
          );
        });

        if (valueFields.length > 0) {
          setDataField(valueFields[0]);
          console.log(
            "Setting primary data field to value field:",
            valueFields[0],
          );
        } else {
          setDataField(fields[0]);
          console.log("Setting primary data field to:", fields[0]);
        }

        // Set secondary field if there's more than one field
        if (fields.length > 1) {
          // Try to find a field that might represent a different metric
          const secondaryField = fields.find((f) => f !== dataField);
          if (secondaryField) {
            setSecondaryDataField(secondaryField);
            console.log("Setting secondary data field to:", secondaryField);
          }
        }
      }
    }
  }, [data, dataField]);

  useEffect(() => {
    // When chart type or data field changes, fetch visualization from Python backend
    const fetchVisualization = async () => {
      if (!data || data.length === 0) return;

      setIsLoading(true);
      try {
        const request: VisualizationRequest = {
          data,
          chartType,
          dataField,
          options: {
            // Additional options can be added here
          },
        };

        // In a real implementation, this would call the Python backend
        // const response = await apiService.getVisualization(request);
        // setChartData(response.data);

        // For now, we'll just use the original data
        setChartData(data);
      } catch (error) {
        console.error("Error fetching visualization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisualization();
  }, [chartType, dataField, data]);

  // Handle secondary data field changes
  useEffect(() => {
    // When secondaryDataField is set to "none", treat it as empty string internally
    if (secondaryDataField === "none") {
      // This is just for internal state management
      // We keep the Select value as "none" but use empty string for chart rendering
    }
  }, [secondaryDataField]);

  const handleExport = async () => {
    try {
      // In a real implementation, this would call the Python backend
      // const response = await apiService.exportVisualization("chart-id", "png");
      // const url = URL.createObjectURL(response.data);
      // const link = document.createElement("a");
      // link.href = url;
      // link.download = `${title.toLowerCase().replace(/ /g, "_")}_${chartType}.png`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);

      onExport();
    } catch (error) {
      console.error("Error exporting visualization:", error);
    }
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-80">
          <RefreshCw className="w-12 h-12 animate-spin text-primary/50" />
          <p className="mt-4 text-muted-foreground">
            Generating visualization...
          </p>
        </div>
      );
    }

    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-80">
          <p className="text-muted-foreground">
            No data available for visualization
          </p>
        </div>
      );
    }

    // Find the best category key for the x-axis or labels
    let categoryKey;

    // First, look for common category field names
    const potentialCategoryFields = [
      "category",
      "name",
      "label",
      "date",
      "month",
      "year",
      "quarter",
      "period",
      "region",
      "country",
      "state",
      "city",
    ];

    // Try to find a field that matches common category names
    for (const field of potentialCategoryFields) {
      const match = Object.keys(chartData[0]).find(
        (key) =>
          key.toLowerCase() === field || key.toLowerCase().includes(field),
      );
      if (match) {
        categoryKey = match;
        break;
      }
    }

    // If no match found, use the first string field
    if (!categoryKey) {
      categoryKey = Object.keys(chartData[0]).find(
        (key) => typeof chartData[0][key] === "string",
      );
    }

    // If still no match, use the first field
    if (!categoryKey) {
      categoryKey = Object.keys(chartData[0])[0];
    }

    console.log("Using category key for visualization:", categoryKey);

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsBarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={categoryKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={dataField}
                fill="#0088FE"
                name={dataField.charAt(0).toUpperCase() + dataField.slice(1)}
              />
              {secondaryDataField && (
                <Bar
                  dataKey={secondaryDataField}
                  fill="#00C49F"
                  name={
                    secondaryDataField.charAt(0).toUpperCase() +
                    secondaryDataField.slice(1)
                  }
                />
              )}
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsLineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={categoryKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataField}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name={dataField.charAt(0).toUpperCase() + dataField.slice(1)}
              />
              {secondaryDataField && (
                <Line
                  type="monotone"
                  dataKey={secondaryDataField}
                  stroke="#82ca9d"
                  activeDot={{ r: 6 }}
                  name={
                    secondaryDataField.charAt(0).toUpperCase() +
                    secondaryDataField.slice(1)
                  }
                />
              )}
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsAreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={categoryKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey={dataField}
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                name={dataField.charAt(0).toUpperCase() + dataField.slice(1)}
              />
              {secondaryDataField && (
                <Area
                  type="monotone"
                  dataKey={secondaryDataField}
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  name={
                    secondaryDataField.charAt(0).toUpperCase() +
                    secondaryDataField.slice(1)
                  }
                />
              )}
            </RechartsAreaChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsPieChart
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={120}
                fill="#8884d8"
                dataKey={dataField}
                nameKey={categoryKey}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsScatterChart
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey={secondaryDataField || availableFields[0] || "x"}
                name={secondaryDataField || availableFields[0] || "x"}
              />
              <YAxis type="number" dataKey={dataField} name={dataField} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter
                name={`${dataField} vs ${secondaryDataField || availableFields[0]}`}
                data={chartData}
                fill="#8884d8"
              />
            </RechartsScatterChart>
          </ResponsiveContainer>
        );
      case "radar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <RechartsRadarChart
              cx="50%"
              cy="50%"
              outerRadius={150}
              data={chartData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey={categoryKey} />
              <PolarRadiusAxis />
              <Radar
                name={dataField.charAt(0).toUpperCase() + dataField.slice(1)}
                dataKey={dataField}
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              {secondaryDataField && (
                <Radar
                  name={
                    secondaryDataField.charAt(0).toUpperCase() +
                    secondaryDataField.slice(1)
                  }
                  dataKey={secondaryDataField}
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
              )}
              <Legend />
              <Tooltip />
            </RechartsRadarChart>
          </ResponsiveContainer>
        );
      case "composed":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={categoryKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={dataField}
                barSize={20}
                fill="#413ea0"
                name={dataField.charAt(0).toUpperCase() + dataField.slice(1)}
              />
              {secondaryDataField && (
                <Line
                  type="monotone"
                  dataKey={secondaryDataField}
                  stroke="#ff7300"
                  name={
                    secondaryDataField.charAt(0).toUpperCase() +
                    secondaryDataField.slice(1)
                  }
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );
      case "treemap":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <Treemap
              data={chartData.map((item) => ({
                name: item[categoryKey],
                size: item[dataField],
                value: item[dataField],
              }))}
              dataKey="value"
              aspectRatio={4 / 3}
              stroke="#fff"
              fill="#8884d8"
            >
              <Tooltip
                formatter={(value) => [`${value}`, dataField]}
                labelFormatter={(name) => `Category: ${name}`}
              />
            </Treemap>
          </ResponsiveContainer>
        );
      default:
        return (
          <div className="h-80 flex items-center justify-center">
            Select a chart type
          </div>
        );
    }
  };

  return (
    <Card className="w-full h-full bg-background shadow-md border-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              <Sliders className="h-4 w-4 mr-2" />
              Options
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="w-full">
              <Tabs defaultValue="chart-type" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="chart-type" className="flex-1">
                    Chart Type
                  </TabsTrigger>
                  <TabsTrigger value="data-field" className="flex-1">
                    Data Field
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chart-type" className="space-y-2 pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Button
                      variant={chartType === "bar" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setChartType("bar")}
                    >
                      <BarChart className="h-4 w-4" />
                      Bar
                    </Button>
                    <Button
                      variant={chartType === "line" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setChartType("line")}
                    >
                      <LineChart className="h-4 w-4" />
                      Line
                    </Button>
                    <Button
                      variant={chartType === "area" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setChartType("area")}
                    >
                      <AreaChart className="h-4 w-4" />
                      Area
                    </Button>
                    <Button
                      variant={chartType === "pie" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setChartType("pie")}
                    >
                      <PieChart className="h-4 w-4" />
                      Pie
                    </Button>
                    <Button
                      variant={chartType === "scatter" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setChartType("scatter")}
                    >
                      <ScatterChart className="h-4 w-4" />
                      Scatter
                    </Button>
                    <Button
                      variant={chartType === "radar" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setChartType("radar")}
                    >
                      <RadarChartIcon className="h-4 w-4" />
                      Radar
                    </Button>
                    <Button
                      variant={chartType === "composed" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setChartType("composed")}
                    >
                      <Layers className="h-4 w-4" />
                      Composed
                    </Button>
                    <Button
                      variant={chartType === "treemap" ? "default" : "outline"}
                      className="flex items-center gap-2"
                      onClick={() => setChartType("treemap")}
                    >
                      <TrendingUp className="h-4 w-4" />
                      Treemap
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="data-field" className="space-y-2 pt-2">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Primary Data Field
                      </label>
                      <Select
                        defaultValue={dataField}
                        onValueChange={setDataField}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select primary data field" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableFields.map((field) => (
                            <SelectItem key={field} value={field}>
                              {field.charAt(0).toUpperCase() + field.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(chartType === "bar" ||
                      chartType === "line" ||
                      chartType === "area" ||
                      chartType === "scatter" ||
                      chartType === "radar" ||
                      chartType === "composed") && (
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Secondary Data Field (Optional)
                        </label>
                        <Select
                          value={secondaryDataField || "none"}
                          onValueChange={setSecondaryDataField}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select secondary data field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {availableFields
                              .filter((field) => field !== dataField)
                              .map((field) => (
                                <SelectItem key={field} value={field}>
                                  {field.charAt(0).toUpperCase() +
                                    field.slice(1)}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {showAdvancedOptions && (
            <div className="p-4 border rounded-lg bg-muted/10">
              <h3 className="text-sm font-medium mb-2">Advanced Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Chart Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 text-sm border rounded-md"
                    placeholder="Enter chart title"
                    value={title}
                    onChange={(e) => {}}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Color Scheme
                  </label>
                  <Select defaultValue="default">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="monochrome">Monochrome</SelectItem>
                      <SelectItem value="pastel">Pastel</SelectItem>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Animation Duration (ms)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 text-sm border rounded-md"
                    placeholder="1000"
                    min="0"
                    max="5000"
                    step="100"
                    defaultValue="1000"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Legend Position
                  </label>
                  <Select defaultValue="bottom">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select legend position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-muted-foreground block mb-1">
                    Grid Lines
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="show-x-grid"
                        className="mr-2"
                        defaultChecked
                      />
                      <label htmlFor="show-x-grid" className="text-sm">
                        Show X Grid
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="show-y-grid"
                        className="mr-2"
                        defaultChecked
                      />
                      <label htmlFor="show-y-grid" className="text-sm">
                        Show Y Grid
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border rounded-lg p-4 bg-white">{renderChart()}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizationPanel;
