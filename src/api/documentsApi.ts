import { apiClient } from './apiClient';

export interface DocumentItem {
  id: string;
  ownerId?: string;
  fileName: string;
  fileSizeBytes?: number;
  fileType?: string;
  uploadUrl?: string;
  uploadedAt: string;
  currentStep?: string;
  stepStatus?: string;
  finalRiskScore?: number | null;
  finalStatus?: 'safe' | 'suspicious' | 'high_risk' | 'blocked' | null;
  isContainInjection?: boolean;
}

export interface DetailedDocumentReport extends DocumentItem {
  scanStartedAt?: string;
  scanFinishedAt?: string;
  scanDurationMs?: number;
  layer1_ocrTextMatch?: {
    matchPercent: number;
    hiddenTextDetected: boolean;
    extraTextSegments: string[];
    status: string;
  };
  layer2_classification?: {
    label: string;
    confidence: number;
    categories: string[];
  };
  layer3_llmReview?: {
    used: boolean;
    explanation: string;
  };
  reviewedByUser?: boolean;
  userReviewLabel?: boolean | null;
}

export interface DocumentComparisonData {
  documentId: string;
  documentName: string;
  ocrText: string;
  pdfTextLayer: string;
  ocrPdfMatch: number;
  hiddenTextDetected: boolean;
  flaggedSnippet?: string;
  flaggedMetadata?: {
    pageNumber?: number;
    visibilityType?: string;
    location?: string;
  };
}

export interface CleanInjectionResponse {
  success: boolean;
  message: string;
  cleanedDocumentId: string;
  downloadUrl: string;
}

export const documentsApi = {
  async uploadDocument(file: File): Promise<{ success: boolean; document: DocumentItem }> {
    const formData = new FormData();
    formData.append('document', file);
    return apiClient<{ success: boolean; document: DocumentItem }>('/documents/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async getDocuments(): Promise<DocumentItem[]> {
    const res = await apiClient<{ documents: DocumentItem[] }>('/documents');
    return res.documents || [];
  },

  async getDocumentById(id: string): Promise<DetailedDocumentReport> {
    return apiClient<DetailedDocumentReport>(`/documents/${id}`);
  },

  async getDocumentComparison(id: string): Promise<DocumentComparisonData> {
    return apiClient<DocumentComparisonData>(`/documents/${id}/comparison`);
  },

  async cleanInjection(id: string, preserveFormatting: boolean = true): Promise<CleanInjectionResponse> {
    return apiClient<CleanInjectionResponse>(`/documents/${id}/clean-injection`, {
      method: 'POST',
      body: JSON.stringify({ preserveFormatting }),
    });
  },

  async labelByUser(id: string, isContainInjection: boolean): Promise<{ success: boolean; message: string; document?: DocumentItem }> {
    return apiClient<{ success: boolean; message: string; document?: DocumentItem }>(`/documents/${id}/label-by-user`, {
      method: 'PATCH',
      body: JSON.stringify({ isContainInjection }),
    });
  }
};
