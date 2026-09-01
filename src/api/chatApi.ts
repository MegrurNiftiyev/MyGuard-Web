import { apiClient } from './apiClient';

export type ChatMode = 'SMALL_CHAT' | 'LARGE_CHAT';
export type ScreenDestination = 'HOME_SCREEN' | 'DOCUMENTS_SCREEN' | 'SCAN_SCREEN' | 'SETTINGS_SCREEN' | 'AI_SCREEN';

export interface ChatBlock {
  type: 'header' | 'text' | 'chart' | 'table' | 'callout' | 'metrics';
  title?: string;
  subtitle?: string;
  content?: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  chartType?: 'area' | 'bar' | 'line' | 'pie';
  chartKeys?: {
    nameKey: string;
    dataKeys: Array<{ key: string; tone: string; label: string }>;
  };
  chartData?: Array<Record<string, any>>;
  headers?: string[];
  rows?: string[][];
  items?: Array<{ label: string; value: string; change?: string }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  blocks: ChatBlock[];
}

export interface ChatSession {
  id: string;
  userId?: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessagePayload {
  chatMode: ChatMode;
  screenDestination: ScreenDestination;
  message: string;
  sessionId?: string;
  documentId?: string;
  attachedDocument?: {
    fileName: string;
    text: string;
  };
}

export const chatApi = {
  async createSession(title?: string): Promise<ChatSession> {
    const res = await apiClient<{ success: boolean; session: ChatSession }>('/chat/session', {
      method: 'POST',
      body: JSON.stringify({ title: title || 'Sənəd Təhlükəsizliyi və Risk Analizi' }),
    });
    return res.session;
  },

  async getHistory(sessionId: string): Promise<ChatMessage[]> {
    const res = await apiClient<{ sessionId: string; messages: ChatMessage[] }>(`/chat/history/${sessionId}`);
    return res.messages || [];
  },

  async sendMessage(payload: SendMessagePayload): Promise<ChatMessage> {
    return apiClient<ChatMessage>('/chat/message', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};
