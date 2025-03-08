import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface VisualizationRequest {
  data: any[];
  chartType: string;
  dataField: string;
  options?: Record<string, any>;
}

export interface AnalysisRequest {
  data: any[];
  prompt: string;
  options?: Record<string, any>;
}

export const apiService = {
  // Data processing and visualization endpoints
  async uploadDataset(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async getVisualization(request: VisualizationRequest) {
    return api.post("/api/visualize", request);
  },

  async getAnalysis(request: AnalysisRequest) {
    return api.post("/api/analyze", request);
  },

  async exportVisualization(chartId: string, format: string = "png") {
    return api.get(`/api/export/visualization/${chartId}?format=${format}`, {
      responseType: "blob",
    });
  },

  async exportAnalysis(analysisId: string, format: string = "pdf") {
    return api.get(`/api/export/analysis/${analysisId}?format=${format}`, {
      responseType: "blob",
    });
  },

  // User data management
  async getSavedVisualizations() {
    return api.get("/api/user/visualizations");
  },

  async getSavedAnalyses() {
    return api.get("/api/user/analyses");
  },

  async saveVisualization(data: any) {
    return api.post("/api/user/visualizations", data);
  },

  async saveAnalysis(data: any) {
    return api.post("/api/user/analyses", data);
  },
};
