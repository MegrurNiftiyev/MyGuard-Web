import { 
  mockDocuments, 
  mockPipelines, 
  mockDetailedAnalysis, 
  mockRiskReports 
} from '../data/mockData';
import { AnalysisPipeline, DetailedAnalysis, RiskReportMetrics } from '../types';
import { documentsApi } from './documentsApi';
import { reportsApi } from './reportsApi';

// Helper for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let latestPipelineResult: any = null;

export const mockApi = {
  async uploadDocument(file: File): Promise<{ documentId: string }> {
    try {
      const response = await documentsApi.uploadDocument(file);
      if (response.success && response.document?.id) {
        return { documentId: response.document.id };
      }
      throw new Error('Upload unsuccessful');
    } catch (error) {
      console.warn('[Api Fallback] Upload document live endpoint unavailable, using fallback mock...', error);
      await delay(1200);
      return { documentId: mockDocuments[0].id };
    }
  },

  async getAnalysisPipeline(documentId: string): Promise<AnalysisPipeline | undefined> {
    if (latestPipelineResult && latestPipelineResult.documentId === documentId) {
      return latestPipelineResult;
    }
    try {
      const doc = await documentsApi.getDocumentById(documentId);
      if (doc && doc.id) {
        return {
          documentId: doc.id,
          layer1_ocrTextMatch: {
            matchPercent: doc.layer1_ocrTextMatch?.matchPercent ?? 85,
            hiddenTextDetected: doc.layer1_ocrTextMatch?.hiddenTextDetected ?? true,
            extraTextSegments: doc.layer1_ocrTextMatch?.extraTextSegments
          },
          layer2_classification: {
            confidence: doc.layer2_classification?.confidence ?? 0.96,
            label: (doc.layer2_classification?.label as any) || 'injection',
            categories: doc.layer2_classification?.categories || ['Instruction Override']
          },
          layer3_llmReview: {
            used: doc.layer3_llmReview?.used ?? true,
            explanation: doc.layer3_llmReview?.explanation || null
          },
          finalRiskScore: doc.finalRiskScore ?? 92,
          finalStatus: (doc.finalStatus as any) || 'high_risk'
        };
      }
    } catch (err) {
      console.warn('[Api Fallback] Pipeline endpoint fallback to mock data:', err);
    }
    await delay(500);
    return mockPipelines.find(p => p.documentId === documentId) || mockPipelines[0];
  },

  async getAnalysisResult(documentId: string): Promise<DetailedAnalysis | undefined> {
    try {
      const doc = await documentsApi.getDocumentById(documentId);
      if (doc && doc.id) {
        return {
          ...mockDetailedAnalysis,
          documentId: doc.id,
          documentName: doc.fileName,
          riskScore: doc.finalRiskScore ?? mockDetailedAnalysis.riskScore,
          ocrPdfMatch: doc.layer1_ocrTextMatch?.matchPercent ?? mockDetailedAnalysis.ocrPdfMatch,
          hiddenTextDetected: doc.layer1_ocrTextMatch?.hiddenTextDetected ?? mockDetailedAnalysis.hiddenTextDetected,
          flaggedSnippet: doc.layer1_ocrTextMatch?.extraTextSegments?.[0] || mockDetailedAnalysis.flaggedSnippet,
          plainExplanation: doc.layer3_llmReview?.explanation || mockDetailedAnalysis.plainExplanation
        };
      }
    } catch (err) {
      console.warn('[Api Fallback] Analysis result fallback to mock:', err);
    }
    await delay(600);
    return mockDetailedAnalysis;
  },

  async getRiskReports(range: string): Promise<RiskReportMetrics> {
    try {
      const liveMetrics = await reportsApi.getRiskSummary();
      if (liveMetrics) {
        return {
          totalScanned: liveMetrics.totalScanned,
          safeCount: liveMetrics.safeCount,
          suspiciousCount: liveMetrics.suspiciousCount,
          blockedCount: liveMetrics.blockedCount,
          detectedInjectionsCount: liveMetrics.detectedInjectionsCount,
          riskTrend: liveMetrics.riskTrend,
          injectionTypes: liveMetrics.injectionTypes,
          departmentRisks: liveMetrics.departmentRisks
        };
      }
    } catch (err) {
      console.warn('[Api Fallback] Risk summary fallback to mock:', err);
    }
    await delay(400);
    return mockRiskReports;
  },

  async submitReviewFeedback(documentId: string, isInjection: boolean): Promise<void> {
    try {
      await documentsApi.labelByUser(documentId, isInjection);
    } catch (err) {
      console.warn('[Api Fallback] Feedback submit fallback:', err);
    }
  }
};
