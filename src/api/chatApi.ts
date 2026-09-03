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
  userMessage?: string;
  sessionId?: string;
  documentId?: string;
  files?: Array<{
    name: string;
    content: string;
  }>;
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
    const rawRes = await apiClient<any>('/chat/message', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    // 1) Handle nested data wrapper if present
    const data = rawRes?.data || (rawRes?.message && typeof rawRes.message === 'object' ? rawRes.message : rawRes);

    // 2) If response already contains structured blocks array, return formatted ChatMessage
    if (data?.blocks && Array.isArray(data.blocks) && data.blocks.length > 0) {
      return {
        id: data.id || `msg-${Date.now()}`,
        sender: data.sender || 'assistant',
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        blocks: data.blocks
      };
    }

    // 3) Extract text string from backend response keys: text, message, reply, content, answer
    const textContent =
      (typeof data?.text === 'string' && data.text) ||
      (typeof data?.message === 'string' && data.message) ||
      (typeof data?.reply === 'string' && data.reply) ||
      (typeof data?.content === 'string' && data.content) ||
      (typeof data?.answer === 'string' && data.answer) ||
      (typeof rawRes?.text === 'string' && rawRes.text) ||
      (typeof rawRes?.message === 'string' && rawRes.message) ||
      'Sistem sorğunuzu emal etdi.';

    return {
      id: rawRes?.id || `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      blocks: [
        {
          type: 'text',
          content: textContent
        }
      ]
    };
  }
};
