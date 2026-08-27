import { apiClient } from './apiClient';

export interface RiskSummaryMetrics {
  totalScanned: number;
  safeCount: number;
  suspiciousCount: number;
  blockedCount: number;
  detectedInjectionsCount: number;
  riskTrend: Array<{
    date: string;
    safe: number;
    suspicious: number;
    blocked: number;
  }>;
  injectionTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  departmentRisks: Array<{
    department: string;
    scanned: number;
    riskRate: number;
  }>;
}

export const reportsApi = {
  async getRiskSummary(): Promise<RiskSummaryMetrics> {
    return apiClient<RiskSummaryMetrics>('/reports/risk-summary');
  }
};
