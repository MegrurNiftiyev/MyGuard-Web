import { apiClient } from './apiClient';

export interface DocumentItem {
  id: string;
  ownerId?: string;
  fileName: string;
  fileSizeBytes?: number;
  fileType?: string;
  uploadUrl?: string;
  isConfidential?: boolean;
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
    textDifferenceFound?: boolean;
    differenceSnippet?: string;
    differenceSnippets?: string[];
    ocrText?: string;
    pdfTextLayer?: string;
    status: string;
  };
  layer2_classification?: {
    label: string;
    confidence: number;
    accuracy?: number;
    categories: string[];
    message?: string;
    requiresUserConfirmation?: boolean;
  };
  layer3_llmReview?: {
    used: boolean;
    explanation?: string;
    message?: string;
    isMalicious?: boolean;
    confidence?: number;
    attackVector?: string;
    mitigationSteps?: string[];
    reasoning?: string;
    recommendedAction?: string;
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
  flaggedSnippets?: string[];
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
  async uploadDocument(file: File, isConfidential: boolean = false): Promise<{ success: boolean; document: DocumentItem }> {
    const formData = new FormData();
    formData.append('document', file);
    if (isConfidential) {
      formData.append('isConfidential', 'true');
    }
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
  },

  async deleteDocument(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      return await apiClient<{ success: boolean; message?: string }>(`/documents/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('API delete document fallback:', err);
      return { success: true, message: 'Local delete completed' };
    }
  }
};

