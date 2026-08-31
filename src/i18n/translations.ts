export type Language = 'az' | 'en';

export const translations = {
  az: {
    // Navigation
    home: 'Əsas səhifə',
    documents: 'Sənədlər',
    risks: 'Risklər',
    assistant: 'AI Assistant',
    settings: 'Parametrlər',
    
    // TopBar
    brandName: 'MyGuard',
    userRole: 'SOC Security Lead',
    
    // Dashboard
    heroTitle: 'Korporativ AI Sənəd Təhlükəsizliyi',
    heroSubtitle: 'Sənədlər daxilində gizlədilmiş prompt injection hücumlarını real-vaxt rejimində aşkarlayın və zərərsizləşdirin.',
    uploadTitle: 'Sənədinizi yükləyin və analiz edin',
    uploadSubtitle: 'Sənədinizdə gizli prompt injection risklərini aşkarlayın. PDF və DOCX faylları dəstəklənir.',
    dragDropText: 'Faylı bura sürükləyin və ya kompyuterinizdən seçin',
    maxSize: 'Maksimum fayl ölçüsü: 50MB (PDF, DOCX)',
    selectFile: 'Fayl seç',
    scanDocument: 'Sənəd Skan et',
    agentProtectionBtn: 'Agent Mühafizəsi',
    recentDocs: 'Son yoxlanılan sənədlər',
    viewAll: 'Bütün sənədlər',
    riskScore: 'Risk Balı',

    // Scan Pipeline
    scanTitle: 'Sənəd Skan Edilir və Analiz Olunur',
    scanSubtitle: 'Sənədin vizual görünüşü ilə daxili koda gizlədilmiş mətnlər piksel-piksel müqayisə edilir.',
    rescan: 'Yenidən Skan Et',
    viewAnalysis: 'Analiz Nəticəsinə Bax',
    pipelineTitle: 'Skan Borusu (7 Mərhələ)',
    completed: 'Tamamlandı',
    processing: 'İcraya alındı...',
    warning: 'Xəbərdarlıq',
    failed: 'Xəta',

    // Analysis Result
    analysisReportTitle: 'Detallı Təhlükəsizlik Analizi Hesabatı',
    ocrPdfMatch: 'OCR ↔ PDF Uyğunluğu',
    hiddenText: 'Gizli Mətn (Hidden Text)',
    detected: 'Aşkarlandı',
    promptInjectionProb: 'Prompt Injection Ehtimalı',
    explanationTitle: 'Aşkar Edilmiş Təhlükənin Təsviri (Açıq Mətnlə İzah)',
    blockBtn: 'Blokla',
    blockedStatus: 'Bloklandı',
    createSafeVersion: 'Təhlükəsiz versiya yarat',
    textComparisonBtn: 'Mətn Müqayisəsinə Bax',

    // Text Comparison
    proofTitle: 'OCR ↔ PDF Layer Text Comparison',
    proofSubtitle: 'İnsan gözünün gördüyü fiziki mətn (OCR) ilə AI modelinin oxuduğu daxili PDF kodu arasındakı fərqlər.',
    ocrVisual: 'OCR Vizual Nəticə (İnsan Vizualı)',
    pdfLayer: 'PDF Kod Qatı (AI tərəfindən Oxunan)',
    backToAnalysis: 'Detallı Analiz Səhifəsinə Qayıt',

    // Assistant
    aiAssistantTitle: 'AI Təhlükəsizlik Köməkçisi',
    aiAssistantSubtitle: 'Sənədlərdəki prompt injection risklərinin təhlil izahı və təhlükəsizlik tövsiyələri',
    askPlaceholder: 'Sənəd təhlükəsizliyi haqqında soruşun...',
    suggestedQuestionsTitle: 'Tez-tez soruşulan suallar:',

    // Model Management
    modelTitle: 'Model Operating Modes',
    standardAi: 'STANDARD AI',
    confidentialAi: 'CONFIDENTIAL AI',
    activeMode: 'Cari Aktiv Rejim',

    // Settings
    settingsTitle: 'Təhlükəsizlik və Skan Parametrləri',
    saveBtn: 'Yadda Saxla',
    ocrThreshold: 'OCR ↔ PDF Uyğunluq Eşik Dərəcəsi',
    sensitivity: 'Injection Həssaslığı',

    // Actions
    agentProtectionTitle: 'Agent Protection',
    agentProtectionSubtitle: 'AI Agentlərin icra etməyə çalışdıqları avtonom əməliyyatların real-vaxt audit jurnalı və bloka alınması.',
    agentActionsTitle: 'Autonomous Agent Action Protection',
    blockedActionCount: 'Agent Əməliyyatı Bloka Alındı',
    recentInterventions: 'Son Müdaxilələr',
    policyEngineStatus: 'Policy Engine Status',
    
    // Risk Reports
    securityOverview: 'Təhlükəsizlik Vəziyyəti İcmalı',
    riskTitle: 'Korporativ Risk və Təhlükə Analitikası',
    riskSubtitle: 'Prompt injection hücumlarının həftəlik tendensiyası və departamentlər üzrə risk paylanması.',
    fromLastWeek: 'keçən həftədən',
    totalScanned: 'Ümumi Skan',
    safeDocs: 'Təhlükəsiz',
    suspiciousDocs: 'Şübhəli',
    blockedDocs: 'Bloklanan',
    safe: 'Təhlükəsiz',
    suspicious: 'Şübhəli',
    blocked: 'Bloklanmış',

    // Review Loop
    isPromptInjectionReview: 'Bu, sizcə prompt injection-dur?',
    reviewThanks: 'Rəyiniz üçün təşəkkürlər, bu material təlim datasına əlavə olundu.',
    yes: 'Bəli',
    no: 'Xeyr',

    // Pipeline
    layer1: 'Layer 1: OCR ↔ Text (Local)',
    layer2: 'Layer 2: Classification (Local)',
    layer3: 'Layer 3: LLM Review (External)',

    // Additional Static Localization
    documentsPageTitle: 'Sənəd İdarəetmə Mərkəzi',
    documentsPageSubtitle: 'Skan edilmiş korporativ sənədlərin siyahısı, risk dərəcələri və təhlükəsizlik statusları',
    newDocumentScan: 'Yeni Sənəd Skan Et',
    filterAll: 'Bütün',
    filterSafe: 'Təhlükəsiz',
    filterSuspicious: 'Şübhəli',
    filterHighRisk: 'Yüksək riskli',
    filterBlocked: 'Bloklanan',
    searchPlaceholder: 'Sənəd adı və ya departament üzrə axtarış...',
    profileSection: 'Profil',
    securitySection: 'Təhlükəsizlik',
    interfaceLanguage: 'Dil',
    selectInterfaceLanguage: 'Sistemin istifadəçi interfeysi dilini seçin',
    scanParameters: '1. Skan Parametrləri',
    privacyIsolation: '2. Məxfilik və İzolyasiya',
    autoScanMode: 'Avtomatik Skan Rejimi',
    autoScanDesc: 'Bütün yüklənən sənədlər dərhal borudan (pipeline) keçirilsin.',
    confidentialModeTitle: 'Konfidensial Rejim',
    confidentialModeDesc: 'Sənəd məlumatları heç bir halda lokal şəbəkədən kənara çıxarılmasın.',
    externalAiTitle: 'Xarici AI Modellərindən İstifadə',
    externalAiDesc: 'Aşağı həssaslıqlı sənədlər üçün bulud əsaslı modellərdən istifadəyə icazə verilir.',
    policyEngine: 'Policy Engine',
    activeEnforcement: 'Aktiv İcra Rejimi',
    agentsMonitored: 'İzlənilən Agentlər',
    actionsBlocked: 'Bloklanmış Əməliyyatlar',
    settingsSaved: 'Parametrlər uğurla yadda saxlanıldı və platformaya tətbiq edildi.',
    highRiskDocs: 'Yüksək Riskli Sənədlər',
    highRiskPolicyDesc: 'Korporativ AI modellərinə ötürülməsi qadağan edilir. Sənəd dərhal dayandırılır və audit jurnallarına qeyd edilir.',
    suspiciousDocsPolicy: 'Şübhəli Sənədlər',
    suspiciousPolicyDesc: 'İzolyasiya edilmiş gücləndirilmiş modelə yönləndirilir. Bütün ehtimal olunan zərərli kodlar süzgəcdən keçirilir.',
    safeDocsPolicy: 'Təhlükəsiz Sənədlər',
    safePolicyDesc: 'Əsas korporativ AI modelinə birbaşa yönəldilir. Gecikməsiz və ən yüksək performansla emal prosesi başa çatır.'
  },
  en: {
    // Navigation
    home: 'Home',
    documents: 'Documents',
    risks: 'Risk Reports',
    assistant: 'AI Assistant',
    settings: 'Settings',

    // TopBar
    brandName: 'MyGuard',
    userRole: 'SOC Security Lead',

    // Dashboard
    heroTitle: 'Enterprise AI Document Security',
    heroSubtitle: 'Detect and neutralize hidden prompt injection attacks in corporate documents in real time.',
    uploadTitle: 'Upload and analyze your document',
    uploadSubtitle: 'Detect hidden prompt injection risks in your document. PDF and DOCX supported.',
    dragDropText: 'Drag and drop file here or choose from your computer',
    maxSize: 'Max file size: 50MB (PDF, DOCX)',
    selectFile: 'Select File',
    scanDocument: 'Scan Document',
    agentProtectionBtn: 'Agent Protection',
    recentDocs: 'Recently Scanned Documents',
    viewAll: 'View All',
    riskScore: 'Risk Score',

    // Scan Pipeline
    scanTitle: 'Scanning and Analyzing Document',
    scanSubtitle: 'Comparing visible text with hidden PDF internal layer code pixel by pixel.',
    rescan: 'Rescan Document',
    viewAnalysis: 'View Analysis Result',
    pipelineTitle: 'Scan Pipeline (7 Steps)',
    completed: 'Completed',
    processing: 'Processing...',
    warning: 'Warning',
    failed: 'Failed',

    // Analysis Result
    analysisReportTitle: 'Detailed Security Analysis Report',
    ocrPdfMatch: 'OCR ↔ PDF Match',
    hiddenText: 'Hidden Text',
    detected: 'Detected',
    promptInjectionProb: 'Prompt Injection Probability',
    explanationTitle: 'Detected Threat Summary (Plain Language)',
    blockBtn: 'Block',
    blockedStatus: 'Blocked',
    createSafeVersion: 'Create Safe Version',
    textComparisonBtn: 'View Text Comparison',

    // Text Comparison
    proofTitle: 'OCR ↔ PDF Layer Text Comparison',
    proofSubtitle: 'Comparing human-visible text (OCR) against internal raw PDF code read by AI models.',
    ocrVisual: 'OCR Visual Layer (Human View)',
    pdfLayer: 'PDF Raw Layer (AI View)',
    backToAnalysis: 'Back to Detailed Analysis',

    // Assistant
    aiAssistantTitle: 'AI Security Assistant',
    aiAssistantSubtitle: 'Security explanations and remediation recommendations for document threats',
    askPlaceholder: 'Ask about document security...',
    suggestedQuestionsTitle: 'Suggested Questions:',

    // Model Management
    modelTitle: 'Model Operating Modes',
    standardAi: 'STANDARD AI',
    confidentialAi: 'CONFIDENTIAL AI',
    activeMode: 'Current Active Mode',

    // Settings
    settingsTitle: 'Security & Scan Parameters',
    saveBtn: 'Save Settings',
    ocrThreshold: 'OCR ↔ PDF Match Threshold',
    sensitivity: 'Injection Sensitivity',

    // Actions
    agentProtectionTitle: 'Agent Protection',
    agentProtectionSubtitle: 'Real-time monitoring and enforcement of security policies for autonomous AI agents. Preventing unauthorized data exfiltration and maintaining strict boundary controls.',
    agentActionsTitle: 'Autonomous Agent Action Protection',
    blockedActionCount: 'Agent Actions Blocked',
    recentInterventions: 'Recent Interventions',
    policyEngineStatus: 'Policy Engine Status',

    // Risk Reports
    securityOverview: 'Security Overview',
    riskTitle: 'Corporate Risk and Threat Analytics',
    riskSubtitle: 'Weekly trend of prompt injection attacks and risk distribution by department.',
    fromLastWeek: 'from last week',
    totalScanned: 'Total Scanned',
    safeDocs: 'Safe',
    suspiciousDocs: 'Suspicious',
    blockedDocs: 'Blocked',
    safe: 'Safe',
    suspicious: 'Suspicious',
    blocked: 'Blocked',

    // Review Loop
    isPromptInjectionReview: 'Do you think this is a prompt injection?',
    reviewThanks: 'Thank you for your feedback. This material has been added to the training data.',
    yes: 'Yes',
    no: 'No',

    // Pipeline
    layer1: 'Layer 1: OCR ↔ Text (Local)',
    layer2: 'Layer 2: Classification (Local)',
    layer3: 'Layer 3: LLM Review (External)',

    // Additional Static Localization
    documentsPageTitle: 'Document Management Center',
    documentsPageSubtitle: 'List of scanned corporate documents, risk levels, and security statuses',
    newDocumentScan: 'Scan New Document',
    filterAll: 'All',
    filterSafe: 'Safe',
    filterSuspicious: 'Suspicious',
    filterHighRisk: 'High Risk',
    filterBlocked: 'Blocked',
    searchPlaceholder: 'Search by document name or department...',
    profileSection: 'Profile',
    securitySection: 'Security',
    interfaceLanguage: 'Language',
    selectInterfaceLanguage: 'Select system user interface language',
    scanParameters: '1. Scan Parameters',
    privacyIsolation: '2. Privacy & Isolation',
    autoScanMode: 'Auto Scan Mode',
    autoScanDesc: 'All uploaded documents are immediately processed through the pipeline.',
    confidentialModeTitle: 'Confidential Mode',
    confidentialModeDesc: 'Document data must never leave the local network under any circumstance.',
    externalAiTitle: 'External AI Models Usage',
    externalAiDesc: 'Cloud-based models permitted for low-sensitivity documents.',
    policyEngine: 'Policy Engine',
    activeEnforcement: 'Active Enforcement Mode',
    agentsMonitored: 'Agents Monitored',
    actionsBlocked: 'Actions Blocked',
    settingsSaved: 'Settings saved successfully and applied to platform.',
    highRiskDocs: 'High Risk Documents',
    highRiskPolicyDesc: 'Forbidden from corporate AI models. Immediately halted and logged to audit journals.',
    suspiciousDocsPolicy: 'Suspicious Documents',
    suspiciousPolicyDesc: 'Routed to isolated hardened model. All probable malicious prompts filtered.',
    safeDocsPolicy: 'Safe Documents',
    safePolicyDesc: 'Directly routed to main corporate AI model. Processed without delay at top performance.'
  }
};
