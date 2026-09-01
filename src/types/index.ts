export type RiskStatus = 'safe' | 'suspicious' | 'high_risk' | 'blocked';
export type StepStatus = 'pending' | 'processing' | 'active' | 'completed' | 'warning' | 'failed' | 'error';
export type ActionDecision = 'ALLOWED' | 'BLOCKED' | 'REQUIRES_CONFIRMATION';
export type SensitivityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type AIModelMode = 'STANDARD AI' | 'CONFIDENTIAL AI';

export interface UserProfile {
  uid: string;
  fullName: string;
  finCode: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin' | 'auditor';
  department?: string;
  authProvider?: string;
  createdAt?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  fileType: string;
  size: string;
  uploadTime: string;
  riskScore: number; // 0 - 100
  status: RiskStatus;
  ocrPdfMatch: number; // percentage
  hiddenTextDetected: boolean;
  promptInjectionProb: number; // percentage
  department: string;
  flaggedCount: number;
  category: string;
}

export interface ScanStep {
  stepNumber: number;
  title: string;
  description: string;
  status: StepStatus;
}

export interface StepHistoryItem {
  step: string;
  startedAt: string;
  finishedAt: string;
  status: StepStatus;
  message: string;
}

export interface ThreatItem {
  id: string;
  type: 'Hidden Text' | 'Instruction Override' | 'Ranking Manipulation' | 'External Action Request';
  title: string;
  snippet: string;
  description: string;
  location: string;
  pageNumber: number;
  fontInfo?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DetailedAnalysis {
  documentId: string;
  documentName: string;
  fileType: string;
  uploadTime: string;
  riskStatus: RiskStatus;
  riskScore: number;
  ocrPdfMatch: number;
  hiddenTextDetected: boolean;
  promptInjectionProb: number;
  plainExplanation: string;
  threats: ThreatItem[];
  ocrText: string;
  pdfTextLayer: string;
  flaggedSnippet: string;
  flaggedSnippets?: string[];
  flaggedMetadata: {
    pageNumber: number;
    visibilityType: string;
    fontInfo: string;
    location: string;
  };
}

export interface StructuredAiAnalysis {
  riskSeverity: string;
  detectedThreat: string;
  confidence: string;
  reason: string;
  recommendation: string;
}

export enum CodeLanguage {
  JSON = 'json',
  TYPESCRIPT = 'typescript',
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  HTML = 'html',
  CSS = 'css',
  BASH = 'bash',
  SQL = 'sql',
  YAML = 'yaml'
}

export type SemanticTone = 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info' | 'purple' | 'indigo';

export type MessageBlockType = 
  | 'header' 
  | 'text' 
  | 'chart' 
  | 'table' 
  | 'analysis' 
  | 'callout' 
  | 'link' 
  | 'file' 
  | 'image' 
  | 'code' 
  | 'quote' 
  | 'list';

export interface MessageBlock {
  type: MessageBlockType;
  title?: string;
  subtitle?: string;
  content?: string;
  // Chart fields (All 6 chart types)
  chartType?: 'area' | 'bar' | 'line' | 'pie' | 'donut' | 'horizontal_bar';
  chartData?: Record<string, string | number>[];
  chartKeys?: { 
    nameKey?: string; 
    valueKey?: string; 
    dataKeys?: { key: string; tone?: SemanticTone | string; color?: string; label?: string }[] 
  };
  // Image & File fields
  imageUrl?: string;
  imageAlt?: string;
  name?: string;
  sizeLabel?: string;
  actionLabel?: string;
  actionUrl?: string;
  description?: string;
  // Table fields
  tableData?: { headers: string[]; rows: (string | number)[][] };
  headers?: string[];
  rows?: (string | number)[][];
  analysisData?: StructuredAiAnalysis;
  // Callout fields
  tone?: 'danger' | 'warning' | 'info' | 'success' | SemanticTone;
  // Link fields
  url?: string;
  label?: string;
  // Code block fields
  code?: string;
  language?: string;
  // Quote block fields
  author?: string;
  date?: string;
  // List block fields
  items?: string[];
  listType?: 'numbered' | 'bulleted' | 'bullet';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  structuredAnalysis?: StructuredAiAnalysis;
  blocks?: MessageBlock[];
}

export interface ModelConfig {
  id: string;
  name: string;
  mode: AIModelMode;
  status: 'Active' | 'Standby' | 'Offline';
  isLocal: boolean;
  lastUpdate: string;
  provider: string;
  description: string;
  latency: string;
  maxContext: string;
}

export interface AgentAction {
  id: string;
  agent?: string;
  action: string;
  file: string;
  destination: string;
  sensitivity: SensitivityLevel;
  decision: ActionDecision;
  timestamp: string;
  reason: string;
}

export interface RiskReportMetrics {
  totalScanned: number;
  safeCount: number;
  suspiciousCount: number;
  blockedCount: number;
  detectedInjectionsCount: number;
  riskTrend: Array<{ date: string; safe: number; suspicious: number; blocked: number }>;
  injectionTypes: Array<{ type: string; count: number; percentage: number }>;
  departmentRisks: Array<{ department: string; scanned: number; riskRate: number }>;
}

export interface Layer1Metrics {
  matchPercent: number;
  hiddenTextDetected: boolean;
  extraTextSegments?: string[];
  status?: 'clean' | 'suspicious';
}

export interface AnalysisPipeline {
  documentId: string;
  layer1_ocrTextMatch: Layer1Metrics;
  layer2_classification: {
    confidence: number;
    label: 'safe' | 'suspicious' | 'injection';
    categories: string[];
  };
  layer3_llmReview: {
    used: boolean;
    isMalicious?: boolean;
    confidence?: number;
    explanation: string | null;
    recommendedAction?: string;
    attackVector?: string;
    reasoning?: string;
    mitigationSteps?: string[];
  };
  finalRiskScore: number;
  finalStatus: 'safe' | 'suspicious' | 'high_risk' | 'blocked';
  isContainInjection?: boolean;
}

export interface Intervention {
  id: string;
  action: string;
  file: string;
  destination: string;
  agent: string;
  status: 'blocked' | 'allowed';
  timestamp: string;
}

export type AiMessage = ChatMessage;
export type AiMessageBlock = MessageBlock;

