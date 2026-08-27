# 🌐 MyGuard Web Frontend — Yekun Vahid API Müqaviləsi və Model Sənədi (Final Full API Contract)

Bu sənəd **MyGuard Web Frontend** tətbiqində olan bütün 9 əsas ekranın (Dashboard, Documents, Analysis Result, Text Comparison, AI Assistant Chat, Agent Security, Risk Reports, Model Management, Settings) 100% rəvan işləməsi üçün backend tərəfindən təmin edilməli olan **bütün REST API endpoint-ləri, WebSocket event-ləri və onların dəqiq JSON/TypeScript modellərini** əks etdirir.

---

## 📌 1. Baza Konfiqurasiya Və Ümumi Modellər

- **Base URL:** `https://myguard-backend-i4ll.onrender.com/api`
- **WebSocket URL:** `https://myguard-backend-i4ll.onrender.com`
- **Standart Başlıqlar (Headers):**
  ```http
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer <Access_Token>
  Accept-Language: az | en | ru | tr
  ```

---

## 🔒 2. Autentifikasiya və Profil Sistemləri (`/api/auth` & `/api/users`)

### 🔹 2.1 POST `/api/auth/login` — Daxil olmaq
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Request Model:**
```typescript
interface LoginRequest {
  finCode: string;     // məs: "7AB1234"
  password: string;    // məs: "Secret123!"
  rememberMe?: boolean;
}
```
- **Response Model (200 OK):**
```typescript
interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: UserProfile;
}

interface UserProfile {
  uid: string;
  fullName: string;
  finCode: string;
  email: string;
  phone?: string;
  role: 'admin' | 'auditor' | 'user';
  department: string;
  authProvider?: 'local' | 'mygov' | 'sima';
  createdAt?: string;
}
```

---

### 🔹 2.2 POST `/api/auth/register` — Qeydiyyat
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Request Model:**
```typescript
interface RegisterRequest {
  fullName: string;
  finCode: string;
  email: string;
  phone?: string;
  password: string;
  department?: string;
}
```
- **Response Model (201 Created):** `AuthResponse` (Token + RefreshToken + UserProfile)

---

### 🔹 2.3 POST `/api/auth/refresh` — Token Yenilənməsi
- **URL:** `/api/auth/refresh`
- **Method:** `POST`
- **Request Model:** `{ refreshToken: string }`
- **Response Model (200 OK):** `{ success: true, token: string }`

---

### 🔹 2.4 GET `/api/users/me` — Cari Profil Məlumatları
- **URL:** `/api/users/me`
- **Method:** `GET`
- **Response Model (200 OK):** `{ user: UserProfile }`

---

## 📄 3. Sənəd İdarəetməsi Və Skan Borusu (`/api/documents`)

### 🔹 3.1 POST `/api/documents/upload` — Sənəd Yükləmə Və Skana Başlama
- **URL:** `/api/documents/upload`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Request Data:** `document`: File (PDF, DOCX, TXT, PNG/JPG)
- **Response Model (200 OK):**
```typescript
interface DocumentUploadResponse {
  success: boolean;
  document: DocumentItem;
}

interface DocumentItem {
  id: string;
  ownerId: string;
  fileName: string;
  fileSizeBytes: number;
  fileType: 'pdf' | 'docx' | 'txt' | 'png' | 'jpg';
  uploadUrl: string;
  uploadedAt: string;
  currentStep: ScanStep | 'COMPLETED' | 'FAILED';
  stepStatus: 'pending' | 'active' | 'completed' | 'error';
  finalRiskScore: number | null;
  finalStatus: RiskStatus | null;
  isContainInjection: boolean;
}

type RiskStatus = 'safe' | 'suspicious' | 'high_risk' | 'blocked';
```

---

### 🔹 3.2 GET `/api/documents` — Bütün Sənədlər Siyahısı (`DocumentsPage`)
- **URL:** `/api/documents`
- **Method:** `GET`
- **Response Model (200 OK):** `{ documents: DocumentItem[] }`

---

### 🔹 3.3 GET `/api/documents/:id` — Dərin Analiz Hesabatı (`AnalysisResultPage`)
- **URL:** `/api/documents/:id`
- **Method:** `GET`
- **Response Model (200 OK):**
```typescript
interface DetailedDocumentReport extends DocumentItem {
  scanStartedAt: string | null;
  scanFinishedAt: string | null;
  scanDurationMs: number | null;
  layer1_ocrTextMatch: {
    matchPercent: number;
    hiddenTextDetected: boolean;
    extraTextSegments: string[];
    textDifferenceFound: boolean;
    differenceSnippet: string;
    ocrText: string;
    pdfTextLayer: string;
    status: 'clean' | 'suspicious';
  } | null;
  layer2_classification: {
    label: 'safe' | 'suspicious' | 'injection';
    confidence: number;
    accuracy: number;
    message: string;
    categories: string[];
    requiresUserConfirmation: boolean;
  } | null;
  layer3_llmReview: {
    used: boolean;
    explanation: string;
    message: string;
    recommendedAction: string;
    attackVector?: string;
    reasoning?: string;
    mitigationSteps?: string[];
  } | null;
  reviewedByUser: boolean;
  userReviewLabel: boolean | null;
}
```

---

### 🔹 3.4 GET `/api/documents/:id/comparison` — OCR vs PDF Müqayisəsi (`TextComparisonPage`)
- **URL:** `/api/documents/:id/comparison`
- **Method:** `GET`
- **Response Model (200 OK):**
```typescript
interface TextComparisonResponse {
  documentId: string;
  documentName: string;
  ocrText: string;
  pdfTextLayer: string;
  ocrPdfMatch: number;
  hiddenTextDetected: boolean;
  flaggedSnippet: string;
  flaggedMetadata: {
    pageNumber: number;
    visibilityType: string;
    location: string;
  };
}
```

---

### 🔹 3.5 POST `/api/documents/:id/clean-injection` — Zərərli Injection Təmizlənməsi
- **URL:** `/api/documents/:id/clean-injection`
- **Method:** `POST`
- **Request Body:** `{ preserveFormatting: boolean }`
- **Response Model (200 OK):**
```typescript
interface CleanDocumentResponse {
  success: boolean;
  message: string;
  cleanedDocumentId: string;
  downloadUrl: string;
}
```

---

### 🔹 3.6 PATCH `/api/documents/:id/label-by-user` — Manual Düzəliş (User Labeling)
- **URL:** `/api/documents/:id/label-by-user`
- **Method:** `PATCH`
- **Request Body:** `{ isContainInjection: boolean }`
- **Response Model (200 OK):** `{ success: boolean; message: string; document: DocumentItem }`

---

## ⚡ 4. Real-Time WebSockets (Socket.IO Skan Event-ləri)

Sənəd yükləndikdən sonra 7 animasiyalı addım üzrə WebSocket event-ləri ötürülür.

- **Client Emit:** `socket.emit('join_document', documentId)`
- **Server Broadcast Listen:** `socket.on('scan_event', (payload: ScanSocketEvent) => ...)`

```typescript
type ScanStep =
  | 'DOCUMENT_UPLOADED'
  | 'PDF_TEXT_EXTRACTION'
  | 'OCR_ANALYSIS'
  | 'TEXT_COMPARISON'
  | 'HIDDEN_TEXT_DETECTION'
  | 'PROMPT_INJECTION_ANALYSIS'
  | 'RISK_ASSESSMENT';

interface ScanSocketEvent {
  response: 'success' | 'error';
  step: ScanStep;
  message: string;
  fileData: Partial<DetailedDocumentReport>;
}
```

---

## 🤖 5. AI Assistant & Çox-Bloklu Çat Sistemi (`/api/chat`)

### 🔹 5.1 POST `/api/chat/session` — Yeni Çat Sessiyası
- **URL:** `/api/chat/session`
- **Method:** `POST`
- **Request Body:** `{ title: string }`
- **Response Model:**
```typescript
interface ChatSessionResponse {
  success: boolean;
  session: {
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  };
}
```

---

### 🔹 5.2 GET `/api/chat/history/:sessionId` — Mesaj Tarixçəsi
- **URL:** `/api/chat/history/:sessionId`
- **Method:** `GET`
- **Response Model:** `{ sessionId: string; messages: AiMessage[] }`

---

### 🔹 5.3 POST `/api/chat/message` — Mesaj Göndərmək (Zəngin UI Blokları ilə)
- **URL:** `/api/chat/message`
- **Method:** `POST`
- **Request Model:**
```typescript
interface SendChatMessageRequest {
  chatMode: 'SMALL_CHAT' | 'LARGE_CHAT';
  screenDestination: 'HOME_SCREEN' | 'DOCUMENTS_SCREEN' | 'SCAN_SCREEN' | 'SETTINGS_SCREEN' | 'AI_SCREEN';
  message: string;
  sessionId?: string;
}
```
- **Response Model (Zəngin Dinamik AI Mesajı):**
```typescript
interface AiMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  blocks: MessageBlock[];
}

type MessageBlock =
  | { type: 'header'; title: string; subtitle?: string }
  | { type: 'text'; content: string }
  | { type: 'callout'; title: string; content: string; tone?: 'danger' | 'warning' | 'info' | 'success' }
  | { type: 'table'; title?: string; headers: string[]; rows: string[][] }
  | { type: 'chart'; title?: string; chartType: 'area' | 'bar' | 'line' | 'pie'; chartKeys: { nameKey: string; dataKeys: { key: string; tone: string; label: string }[] }; chartData: Record<string, any>[] }
  | { type: 'file'; name: string; sizeLabel: string; url: string };
```

---

## 🛡️ 6. Agent Təhlükəsizliyi Və Siyasət Monitorinqi (`/api/security`)

### 🔹 6.1 GET `/api/security/actions` — Agent Əməliyyatları Siyahısı (`ActionSecurityPage`)
- **URL:** `/api/security/actions`
- **Method:** `GET`
- **Response Model:** `{ actions: AgentSecurityAction[] }`

```typescript
interface AgentSecurityAction {
  id: string;
  agent: string;
  action: string;
  file: string;
  destination: string;
  sensitivity: 'Low' | 'Medium' | 'High';
  decision: 'ALLOWED' | 'BLOCKED';
  timestamp: string;
  reason?: string;
}
```

---

### 🔹 6.2 PATCH `/api/security/actions/:id/decision` — Qərarın Dəyişdirilməsi
- **URL:** `/api/security/actions/:id/decision`
- **Method:** `PATCH`
- **Request Body:** `{ decision: 'ALLOWED' | 'BLOCKED' }`
- **Response Model:** `{ success: boolean; action: AgentSecurityAction }`

---

## 📊 7. Analitika Və Risk Hesabatları (`/api/reports`)

### 🔹 7.1 GET `/api/reports/risk-summary` — Dashboard Və Risk Hesabat Metrikaları
- **URL:** `/api/reports/risk-summary`
- **Method:** `GET`
- **Response Model (200 OK):**
```typescript
interface RiskSummaryReport {
  totalScanned: number;
  safeCount: number;
  suspiciousCount: number;
  blockedCount: number;
  detectedInjectionsCount: number;
  riskTrend: { date: string; safe: number; suspicious: number; blocked: number }[];
  injectionTypes: { type: string; count: number; percentage: number }[];
  departmentRisks: { department: string; scanned: number; riskRate: number }[];
}
```

---

## ⚙️ 8. AI Modellərinin İdarə Edilməsi (`/api/admin`)

### 🔹 8.1 GET `/api/admin/models` — Müdafiə Modelləri Siyahısı (`ModelManagementPage`)
- **URL:** `/api/admin/models`
- **Method:** `GET`
- **Response Model (200 OK):**
```typescript
interface DefenseModelItem {
  id: string;
  name: string;
  mode: string;
  status: 'Active' | 'Inactive' | 'Training';
  isLocal: boolean;
  lastUpdate: string;
  provider: string;
  description: string;
  latency: string;
  maxContext: string;
}
```

---

## 🔧 9. Tətbiq Parametrləri Və Siyasətlər (`/api/settings`)

### 🔹 9.1 GET `/api/settings` — Parametrlərin Oxunması
- **URL:** `/api/settings`
- **Method:** `GET`
- **Response Model:** `PlatformSettings`

### 🔹 9.2 PUT `/api/settings` — Parametrlərin Yenilənməsi (`SettingsPage`)
- **URL:** `/api/settings`
- **Method:** `PUT`
- **Request / Response Model:**
```typescript
interface PlatformSettings {
  ocrThreshold: number;                            // 70 - 100%
  sensitivity: 'Low' | 'Medium' | 'High';
  autoScan: boolean;
  confidentialMode: boolean;
  allowExternalAi: boolean;
}
```

---

*MyGuard Frontend Komandası tərəfindən hazırlanmış yekun interfeys API müqaviləsi.*
