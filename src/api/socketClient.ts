import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://mygurad-backend-v2.onrender.com';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export type ScanStepName =
  | 'DOCUMENT_UPLOADED'
  | 'PDF_TEXT_EXTRACTION'
  | 'OCR_ANALYSIS'
  | 'TEXT_COMPARISON'
  | 'HIDDEN_TEXT_DETECTION'
  | 'PROMPT_INJECTION_ANALYSIS'
  | 'RISK_ASSESSMENT';

export type StepStatusState = 'pending' | 'active' | 'completed' | 'failed' | 'error' | 'warning';

export interface ScanSocketEvent {
  response?: 'success' | 'error';
  step: ScanStepName | string;
  message: string;
  fileData: {
    currentStep?: ScanStepName | 'COMPLETED' | 'FAILED' | string;
    stepStatus?: StepStatusState;
    layer1_ocrTextMatch?: {
      matchPercent: number;
      hiddenTextDetected: boolean;
      extraTextSegments: string[];
      status: 'clean' | 'suspicious' | string;
    } | null;
    layer2_classification?: {
      label: 'safe' | 'suspicious' | 'injection' | string;
      confidence: number;
      categories: string[];
    } | null;
    layer3_llmReview?: {
      used: boolean;
      explanation: string | null;
    } | null;
    finalRiskScore?: number | null;
    finalStatus?: 'safe' | 'suspicious' | 'high_risk' | string | null;
    isContainInjection?: boolean;
    scanStartedAt?: string | null;
    scanFinishedAt?: string | null;
    scanDurationMs?: number | null;
    [key: string]: any;
  };
}

export type ScanEventData = ScanSocketEvent;

export const joinDocumentScanRoom = (
  documentId: string, 
  onScanEvent?: (data: ScanSocketEvent) => void
) => {
  const sock = getSocket();
  sock.emit('join_document', documentId);
  if (onScanEvent) {
    sock.off('scan_event');
    sock.on('scan_event', onScanEvent);
  }
};

export const leaveDocumentScanRoom = (documentId: string) => {
  if (socket) {
    socket.emit('leave_document', documentId);
    socket.off('scan_event');
  }
};
