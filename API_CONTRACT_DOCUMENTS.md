# 🌐 MyGuard — Full Web Frontend API Integration & Contract Guide

Bu sənəd **MyGuard Web Frontend** tətbiqini Canlı (Production) Backend REST API və Real-Time Socket.IO servisi ilə 100% inteqrasiya etmək üçün hazırlanmış geniş bələdçidir.

---

## 📌 1. Baza Server Məlumatları və Canlı Linklər

- **Canlı Backend URL (Production Base URL):**  
  `https://myguard-backend-i4ll.onrender.com`
- **İnteraktiv Swagger Sənədləşməsi (API Docs):**  
  `https://myguard-backend-i4ll.onrender.com/api-docs`
- **Real-Time WebSocket (Socket.IO):**  
  `https://myguard-backend-i4ll.onrender.com`
- **Standart Sorğu Başlıqları (Headers):**
  ```http
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer <Access_Token>
  Accept-Language: az
  ```

---

## 🔒 2. Autentifikasiya və İstifadəçi Sistemləri (`/api/auth` & `/api/users`)

*(Qeyd: İstəyinizə uyğun olaraq SİMA və myGov sistemləri çıxarılmışdır, standart FİN Kod / Email ilə giriş dəstəklənir).*

### 🔹 2.1 POST `/api/auth/register` (Qeydiyyat)
- **URL:** `https://myguard-backend-i4ll.onrender.com/api/auth/register`
- **Method:** `POST`
- **Request Body (JSON):**
```json
{
  "fullName": "Samir Əliyev",
  "finCode": "7AB1234",
  "email": "e.mammadov@soc.gov.az",
  "phone": "+994 50 123 45 67",
  "password": "SecretPassword123!",
  "department": "Təhlükəsizlik və İnformasiya İdarəsi"
}
```

---

### 🔹 2.2 POST `/api/auth/login` (Daxil ol)
- **URL:** `https://myguard-backend-i4ll.onrender.com/api/auth/login`
- **Method:** `POST`
- **Request Body (JSON):**
```json
{
  "finCode": "7AB1234",
  "password": "SecretPassword123!",
  "rememberMe": true
}
```

---

### 🔹 2.3 POST `/api/auth/refresh` (Token Yenilənməsi)
- **URL:** `https://myguard-backend-i4ll.onrender.com/api/auth/refresh`
- **Method:** `POST`
- **Request Body (JSON):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🔹 2.4 GET `/api/users/me` (Cari Profil)
- **URL:** `https://myguard-backend-i4ll.onrender.com/api/users/me`
- **Method:** `GET`
- **Response (200 OK):**
```json
{
  "user": {
    "uid": "usr-admin-001",
    "fullName": "Samir Əliyev",
    "finCode": "7AB1234",
    "email": "e.mammadov@soc.gov.az",
    "phone": "+994 50 123 45 67",
    "role": "admin",
    "department": "Təhlükəsizlik və İnformasiya İdarəsi"
  }
}
```

---

## 📄 3. Sənəd Yükləmə, Skan və Analiz (`/api/documents`)

### 🔹 3.1 POST `/api/documents/upload` (Sənəd Yükləmək və Skana Başlamaq)
- **URL:** `https://myguard-backend-i4ll.onrender.com/api/documents/upload`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Form Data:** `document`: File (PDF, DOCX, TXT və ya şəkil faylı)

---

### 🔹 3.2 GET `/api/documents` (Bütün Sənədlər Siyahısı)
- **URL:** `https://myguard-backend-i4ll.onrender.com/api/documents`
- **Method:** `GET`

---

### 🔹 3.3 GET `/api/documents/:id` (Dərin Analiz Hesabatı)
- **URL:** `https://myguard-backend-i4ll.onrender.com/api/documents/doc-1724750000-123`
- **Method:** `GET`

---

### 🔹 3.4 GET `/api/documents/:id/comparison` (OCR və PDF Müqayisəsi)
- **URL:** `https://myguard-backend-i4ll.onrender.com/api/documents/doc-1724750000-123/comparison`
- **Method:** `GET`

---

### 🔹 3.5 POST `/api/documents/:id/clean-injection` (Təhdid Təmizləmə)
- **URL:** `https://myguard-backend-i4ll.onrender.com/api/documents/doc-1724750000-123/clean-injection`
- **Method:** `POST`

---

### 🔹 3.6 PATCH `/api/documents/:id/label-by-user` (İstifadəçi Qərarı Düzəlişi)
- **URL:** `https://myguard-backend-i4ll.onrender.com/api/documents/doc-1724750000-123/label-by-user`
- **Method:** `PATCH`

---

## ⚡ 4. Real-Time Skan Animasiyası və WebSockets (`Socket.IO Integration`)

- **Socket Server URL:** `https://myguard-backend-i4ll.onrender.com`
- **Room Join:** `socket.emit('join_document', documentId)`
- **Event Listener:** `socket.on('scan_event', (data) => ...)`

```typescript
export type ScanStep =
  | 'DOCUMENT_UPLOADED'
  | 'PDF_TEXT_EXTRACTION'
  | 'OCR_ANALYSIS'
  | 'TEXT_COMPARISON'
  | 'HIDDEN_TEXT_DETECTION'
  | 'PROMPT_INJECTION_ANALYSIS'
  | 'RISK_ASSESSMENT';

export type StepStatus = 'pending' | 'active' | 'completed' | 'error';
```

---

## 🤖 5. AI Assistant & Çat Sistemləri (`/api/chat`)

- **POST `/api/chat/session`** — Yeni Çat Sessiyası
- **GET `/api/chat/history/:sessionId`** — Mesaj Tarixçəsi
- **POST `/api/chat/message`** — AI Asistentə Mesaj Göndərmək (`chatMode: "LARGE_CHAT" | "SMALL_CHAT"`)

---

## 🛡️ 6. Agent Monitorinqi və Təhlükəsizlik Əməliyyatları (`/api/security`)

- **GET `/api/security/actions`** — Agent Əməliyyatları Siyahısı
- **PATCH `/api/security/actions/:id/decision`** — Qərarın Dəyişdirilməsi (`ALLOWED` | `BLOCKED`)

---

## 📊 7. Analitika və Hesabatlar (`/api/reports`)

- **GET `/api/reports/risk-summary`** — Risk Xülasəsi Və Dashboard Metrikaları

---

## ⚙️ 8. AI Model İdarəetməsi (`/api/admin`)

- **GET `/api/admin/models`** — Aktiv Müdafiə Modelləri Siyahısı

---

## 🐍 11. Python FastAPI ML Mikroxidmət İnteqrasiyası (`Ai-Models`)

Node.js Backend Layer 2 skan mərhələsində `FASTAPI_ANALYSIS_URL` vasitəsilə Python FastAPI ML mikroxidməti (`Ai-Models`) ilə birbaşa əlaqə qurur.

- **FastAPI Server URL:** `http://localhost:8000` (Canlıda: `https://myguard-ai-backend.onrender.com`)
- **Daxili Təhlükəsizlik Tokeni Header-i:** `X-Internal-Token: <INTERNAL_SERVICE_TOKEN>`

---

## 🤖 12. Layer 3 LLM Təhlükəsizlik Təhlili Və Prompt Mühəndisliyi (`llmSecurityReview.service.ts`)

Layer 3 skanında LLM modelinin prompt injection cəhdlərinə qarşı immunitet qazanması üçün sənəd mətni `<untrusted_document_context>` teqi daxilində təcrid edilir.

---

## 🌍 13. Çoxdilli Dəstək Və Lokallaşdırma (`i18n` — Multi-language Support)

MyGuard backend serveri bütün status mesajlarını, mərhələ təsvirlərini, xəbərdarlıqları və LLM/ML tövsiyələrini avtomatik olaraq sorğu verən istifadəçinin dilinə lokallaşdıraraq qaytarır.

- **Dəstəklənən Dillər:** `az` (Azərbaycan dili - Standart), `en` (İngilis dili), `ru` (Rus dili), `tr` (Türk dili).
- **Request Header-i:** `Accept-Language: az` | `en` | `ru` | `tr`
