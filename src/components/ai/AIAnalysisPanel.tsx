import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import {
  Send,
  Sparkles,
  BookOpen,
  Save,
  Download,
  RefreshCw,
  Copy,
  Check,
  Bot,
  User,
  Trash2,
} from "lucide-react";
import { apiService, AnalysisRequest } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAnalysisPanelProps {
  isLoading?: boolean;
  onSubmitPrompt?: (prompt: string, template: string) => void;
  analysisResults?: string;
  promptTemplates?: Array<{ id: string; name: string; prompt: string }>;
  data?: any[];
}

const AIAnalysisPanel = ({
  isLoading: externalIsLoading = false,
  onSubmitPrompt = () => {},
  analysisResults: externalResults = "",
  promptTemplates = [
    {
      id: "1",
      name: "Data Summary",
      prompt: "Provide a summary of the key insights from this dataset.",
    },
    {
      id: "2",
      name: "Correlation Analysis",
      prompt: "Identify correlations between variables in this dataset.",
    },
    {
      id: "3",
      name: "Trend Detection",
      prompt: "Detect and explain any trends visible in this dataset.",
    },
    {
      id: "4",
      name: "Anomaly Detection",
      prompt: "Identify any anomalies or outliers in this dataset.",
    },
    {
      id: "5",
      name: "Recommendations",
      prompt: "Based on this data, what recommendations would you make?",
    },
    {
      id: "6",
      name: "Forecast Future Trends",
      prompt: "Based on this data, can you forecast potential future trends?",
    },
    {
      id: "7",
      name: "Segment Analysis",
      prompt: "Can you identify any natural segments or clusters in this data?",
    },
    {
      id: "8",
      name: "Comparative Analysis",
      prompt:
        "Compare the performance across different time periods in this dataset.",
    },
  ],
  data = [],
}: AIAnalysisPanelProps) => {
  const [promptText, setPromptText] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(externalIsLoading);
  const [isCopied, setIsCopied] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial system message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "system-1",
          role: "assistant",
          content:
            "Hello! I'm your AI data analysis assistant. I can help you analyze your dataset and provide insights. What would you like to know about your data?",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    setIsLoading(externalIsLoading);
  }, [externalIsLoading]);

  useEffect(() => {
    if (
      externalResults &&
      !messages.some((m) => m.content === externalResults)
    ) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: externalResults,
          timestamp: new Date(),
        },
      ]);
    }
  }, [externalResults]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    const template = promptTemplates.find((t) => t.id === value);
    if (template) {
      setPromptText(template.prompt);
      // Focus the input after selecting a template
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSubmit = async () => {
    if (!promptText.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Clear input after sending
    setPromptText("");
    setSelectedTemplate("");

    // Use the external handler if provided
    if (onSubmitPrompt) {
      onSubmitPrompt(userMessage.content, selectedTemplate);
    }

    try {
      // In a real implementation, this would call the Python backend
      // const request: AnalysisRequest = {
      //   data,
      //   prompt: userMessage.content,
      // };
      // const response = await apiService.getAnalysis(request);

      // For now, simulate a response
      setTimeout(() => {
        const responseContent = generateResponse(userMessage.content);

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error getting analysis:", error);

      const errorMessage: Message = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content:
          "I'm sorry, but I encountered an error while analyzing your data. Please try again or rephrase your question.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const generateResponse = (prompt: string): string => {
    // Simple response generation based on keywords in the prompt
    if (
      prompt.toLowerCase().includes("summary") ||
      prompt.toLowerCase().includes("overview")
    ) {
      return "Based on my analysis of your dataset:\n\n**Key Summary:**\n1. The dataset shows a consistent upward trend in sales from January to June, with a 150% increase over the period.\n2. The highest sales growth was observed between February and March (33%).\n3. Expenses have also increased proportionally, maintaining approximately a 75-80% ratio to sales.\n4. The profit margin has remained relatively stable throughout the period.";
    } else if (
      prompt.toLowerCase().includes("trend") ||
      prompt.toLowerCase().includes("pattern")
    ) {
      return "I've analyzed the trends in your data:\n\n**Trend Analysis:**\n- Sales show a strong positive trend with an average monthly growth rate of 20.5%\n- There was a slight dip in April (12.5% decrease from March), but the upward trend resumed in May\n- Expenses follow a similar pattern to sales, suggesting they are directly correlated\n- The growth rate appears to be stabilizing in the most recent months, potentially indicating market saturation";
    } else if (
      prompt.toLowerCase().includes("recommend") ||
      prompt.toLowerCase().includes("suggest")
    ) {
      return "Based on the data analysis, here are my recommendations:\n\n**Strategic Recommendations:**\n1. **Continue Growth Investment**: The consistent sales growth suggests your current strategy is effective\n2. **Cost Optimization**: While expenses track with sales, look for opportunities to improve efficiency\n3. **April Investigation**: Investigate the factors behind April's sales dip to prevent future occurrences\n4. **Forecasting**: Implement more sophisticated forecasting to prepare for potential growth plateau\n5. **Diversification**: Consider expanding product/service lines to maintain growth momentum";
    } else if (
      prompt.toLowerCase().includes("forecast") ||
      prompt.toLowerCase().includes("predict") ||
      prompt.toLowerCase().includes("future")
    ) {
      return "Here's my forecast based on the current data trends:\n\n**6-Month Forecast:**\n- Sales are projected to reach 300-325 by December if current growth rates continue\n- However, the growth rate is showing signs of deceleration, suggesting a potential plateau\n- Expenses will likely continue to track at 75-80% of sales\n- Seasonal factors may impact Q4 performance, with potential for higher than average growth\n\nThis forecast assumes no major market disruptions or significant changes to business operations.";
    } else if (
      prompt.toLowerCase().includes("compare") ||
      prompt.toLowerCase().includes("difference")
    ) {
      return "Comparing performance across different periods:\n\n**Comparative Analysis:**\n- **Q1 vs Q2**: Q2 shows a 28% higher average monthly sales than Q1\n- **Month-over-Month**: The highest growth was Feb→Mar (33%), while Apr showed negative growth (-12.5%)\n- **Sales vs Expenses**: Sales grew at a slightly faster rate (150%) than expenses (166%) over the period\n- **Profit Margins**: Despite growth in both metrics, profit margins remained relatively stable at 25-30%";
    } else {
      return "I've analyzed your dataset and found several interesting insights:\n\n1. Sales have shown consistent growth from January to June, increasing by 150% overall\n2. Expenses track closely with sales, maintaining a consistent ratio\n3. The strongest performance was in March and May\n4. There appears to be a cyclical pattern with stronger performance every other month\n\nWould you like me to explore any specific aspect of this data in more detail?";
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClearChat = () => {
    // Keep only the initial system message
    setMessages([
      {
        id: "system-1",
        role: "assistant",
        content:
          "Hello! I'm your AI data analysis assistant. I can help you analyze your dataset and provide insights. What would you like to know about your data?",
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="h-full w-full bg-card shadow-md border-0 overflow-hidden flex flex-col transition-colors duration-300">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              AI Analysis Chat
            </CardTitle>
            <CardDescription>
              Ask questions about your data or use a template
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearChat}
              title="Clear chat history"
              className="hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden pt-4 px-4">
        <ScrollArea className="h-[calc(100%-2rem)] pr-4">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"} max-w-[85%] gap-2`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Avatar
                      className={
                        message.role === "assistant"
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-secondary border border-secondary/20"
                      }
                    >
                      {message.role === "assistant" ? (
                        <Bot className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5 text-secondary-foreground" />
                      )}
                      <AvatarFallback>
                        {message.role === "assistant" ? "AI" : "You"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`relative p-3 rounded-lg ${
                      message.role === "assistant"
                        ? "bg-primary/5 border border-primary/10 text-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyMessage(message.content)}
                          className="h-6 w-6 hover:bg-background/50"
                        >
                          {isCopied ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    )}
                    <div className="whitespace-pre-line">{message.content}</div>
                    <div className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex flex-row max-w-[85%] gap-2">
                  <Avatar className="bg-primary/10 border border-primary/20">
                    <Bot className="h-5 w-5 text-primary" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                      <div
                        className="h-2 w-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-primary rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t bg-muted/20 p-4">
        <div className="flex flex-col w-full space-y-2">
          <div className="w-full">
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger className="w-full bg-card hover:bg-accent/50 transition-colors">
                <SelectValue placeholder="Select a prompt template or type your own question" />
              </SelectTrigger>
              <SelectContent>
                {promptTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Textarea
              ref={inputRef}
              className="flex-grow resize-none min-h-[60px] p-3 bg-card border-muted focus:border-primary transition-colors"
              placeholder="Ask a question about your data..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !promptText.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground self-end transition-colors"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Press Enter to send, Shift+Enter for a new line
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIAnalysisPanel;
