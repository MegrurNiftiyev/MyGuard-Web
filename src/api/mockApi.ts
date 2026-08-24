import { 
  mockDocuments, 
  mockPipelines, 
  mockDetailedAnalysis, 
  mockRiskReports 
} from '../data/mockData';
import { AnalysisPipeline, DetailedAnalysis, RiskReportMetrics } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let latestPipelineResult: AnalysisPipeline | null = null;

export const mockApi = {
  async uploadDocument(file: File): Promise<{ documentId: string }> {
    try {
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Backend error');
      }
      
      const result = await response.json();
      latestPipelineResult = result;
      return { documentId: result.documentId };
    } catch (error) {
      console.warn('[MockApi] Backend əlçatan deyil, mock dataya qayıdılır...', error);
      await delay(1500); // mock upload time
      return { documentId: mockDocuments[0].id };
    }
  },

  async getAnalysisPipeline(documentId: string): Promise<AnalysisPipeline | undefined> {
    if (latestPipelineResult && latestPipelineResult.documentId === documentId) {
      return latestPipelineResult;
    }
    await delay(800);
    return mockPipelines.find(p => p.documentId === documentId) || mockPipelines[0];
  },

  async getAnalysisResult(documentId: string): Promise<DetailedAnalysis | undefined> {
    await delay(1000);
    // In a real app we'd fetch by ID. Here we just return our detailed mock.
    return mockDetailedAnalysis;
  },

  async getRiskReports(range: string): Promise<RiskReportMetrics> {
    await delay(500);
    return mockRiskReports;
  },

  async submitReviewFeedback(documentId: string, isInjection: boolean): Promise<void> {
    await delay(800);
    console.log(`[Mock API] Feedback submitted for ${documentId}: isInjection=${isInjection}`);
    // In a real app, this would send data to the backend.
  }
};
