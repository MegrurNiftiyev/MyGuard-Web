import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, ArrowRight, UploadCloud, ShieldAlert, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressStep } from '../components/ui/ProgressStep';
import { StepStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { joinDocumentScanRoom, leaveDocumentScanRoom, ScanEventData } from '../api/socketClient';
import { documentsApi } from '../api/documentsApi';

const DEFAULT_SCAN_STEPS = [
  { stepNumber: 1, title: 'Sənəd yükləndi', description: 'Fayl təhlükəsiz sandbox mühitinə daxil olur' },
  { stepNumber: 2, title: 'PDF Text Extraction', description: 'Daxili mətn qatı və strukturu oxunur' },
  { stepNumber: 3, title: 'OCR Analysis', description: 'Vizual görüntüdən oxunmuş mətn çıxarılır' },
  { stepNumber: 4, title: 'Text Comparison', description: 'OCR və PDF mətn qatları fərqləri analiz edilir' },
  { stepNumber: 5, title: 'Hidden Text Detection', description: 'Görünməyən şrift ölçüləri və opacity 0% mətnlər tapılır' },
  { stepNumber: 6, title: 'Prompt Injection Analysis', description: 'ML/AI detector tərəfindən override cəhdləri yoxlanılır' },
  { stepNumber: 7, title: 'Risk Assessment', description: 'Risk balı hesablanır və sənəd statusu müəyyən edilir' }
];

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const documentId = searchParams.get('docId');
  const fileName = searchParams.get('name') || 'Sənəd.pdf';

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [steps, setSteps] = useState(
    DEFAULT_SCAN_STEPS.map((s, i) => ({
      ...s,
      status: 'pending' as StepStatus
    }))
  );

  // Handle direct file upload from idle scan page
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);
      try {
        const res = await documentsApi.uploadDocument(file);
        const newDocId = res.document?.id || `doc-${Date.now()}`;
        navigate(`/scan?docId=${newDocId}&name=${encodeURIComponent(file.name)}`);
      } catch (err) {
        console.warn('Scan page file upload fallback:', err);
        navigate(`/scan?docId=doc-${Date.now()}&name=${encodeURIComponent(file.name)}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Real-time Socket.IO integration when documentId exists
  useEffect(() => {
    if (!documentId) {
      setIsScanning(false);
      setSteps(DEFAULT_SCAN_STEPS.map((s) => ({ ...s, status: 'pending' as StepStatus })));
      return;
    }

    setIsScanning(true);
    setSteps(
      DEFAULT_SCAN_STEPS.map((s, i) => ({
        ...s,
        status: i === 0 ? ('processing' as StepStatus) : ('pending' as StepStatus)
      }))
    );

    joinDocumentScanRoom(documentId, (data: ScanEventData) => {
      console.log('Live Socket Scan Event:', data);
      if (data.step) {
        const stepNameMap: Record<string, number> = {
          DOCUMENT_UPLOADED: 0,
          PDF_TEXT_EXTRACTION: 1,
          OCR_ANALYSIS: 2,
          TEXT_COMPARISON: 3,
          HIDDEN_TEXT_DETECTION: 4,
          PROMPT_INJECTION_ANALYSIS: 5,
          RISK_ASSESSMENT: 6,
        };
        const activeIdx = stepNameMap[data.step] ?? currentStepIndex;
        setCurrentStepIndex(activeIdx);

        if (activeIdx >= 6 || data.fileData?.currentStep === 'COMPLETED') {
          setIsScanning(false);
        }

        setSteps((prevSteps) =>
          prevSteps.map((step, idx) => {
            if (idx < activeIdx) {
              return { ...step, status: 'completed' as StepStatus };
            }
            if (idx === activeIdx) {
              const status: StepStatus = data.fileData?.stepStatus === 'failed' ? 'failed' : 'processing';
              return { ...step, status, description: data.message || step.description };
            }
            return { ...step, status: 'pending' as StepStatus };
          })
        );
      }
    });

    return () => {
      leaveDocumentScanRoom(documentId);
    };
  }, [documentId]);

  // If no document is selected/being scanned, render the Idle Scan State in exact same layout
  if (!documentId) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8">
        {/* Header spanning full width */}
        <header className="lg:col-span-12 mb-2">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2">
            {t('scanTitle') || 'Real-Time Sənəd Skanı'}
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Skan ediləcək sənədi seçin və 7 mərhələli təhlükəsizlik borusunun fəaliyyətini izləyin
          </p>
        </header>

        {/* Left Column: Upload Target Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card padding="lg" className="shadow-l1 flex flex-col items-center text-center space-y-6">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-title-lg font-bold text-on-surface">Target File</h2>
              <span className="bg-surface-container-high text-on-surface-variant text-label-sm px-3 py-1 rounded-full border border-outline-variant font-medium">
                Gözləmə Rejimi
              </span>
            </div>

            {/* Upload Zone Drop Target */}
            <label
              htmlFor="idle-file-upload"
              className="w-full aspect-[3/4] max-h-[320px] bg-surface-bright border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:border-brand-blue hover:bg-surface-variant/20 transition-all cursor-pointer group"
            >
              <input
                id="idle-file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-brand-blue/30 flex items-center justify-center text-brand-blue shadow-md mb-4 group-hover:scale-110 group-hover:bg-blue-100 transition-transform">
                <UploadCloud className="w-8 h-8 text-brand-blue" />
              </div>
              <p className="text-title-md font-bold text-on-surface mb-1">
                {isUploading ? 'Fayl yüklənir...' : 'Hələ ki skan edilən sənəd yoxdur'}
              </p>
              <p className="text-body-sm text-on-surface-variant max-w-xs mb-4">
                Skan etmək istədiyiniz PDF və ya DOCX faylını bura sürükləyin və ya seçin
              </p>
              <Button variant="primary" size="md" className="pointer-events-none shadow-sm">
                Sənəd Seçin
              </Button>
            </label>
          </Card>
        </div>

        {/* Right Column: Pipeline Idle Status */}
        <div className="lg:col-span-7">
          <Card padding="lg" className="h-full shadow-l1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant/50">
                <h2 className="text-title-lg font-bold text-on-surface">
                  {t('pipelineTitle') || '7 Addımlı Skan Borusu (Pipeline)'}
                </h2>
                <span className="text-label-sm text-on-surface-variant font-mono">Status: İdle</span>
              </div>

              <div className="pl-2 space-y-4">
                {steps.map((step, idx) => (
                  <ProgressStep
                    key={step.stepNumber}
                    stepNumber={step.stepNumber}
                    title={step.title}
                    description={step.description}
                    status="pending"
                    isLast={idx === steps.length - 1}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-medium">
                ⓘ Sənəd yükləndikdən sonra 7 mərhələli analiz borusu avtomatik başladılacaqdır.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Active Scan State (when documentId is present)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8">
      {/* Header spanning full width */}
      <header className="lg:col-span-12 mb-2 flex justify-between items-end">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2">{t('scanTitle')}</h1>
          <p className="text-body-md text-on-surface-variant">{t('scanSubtitle')}</p>
        </div>
        {!isScanning && (
          <Button variant="primary" size="md" onClick={() => navigate(`/analysis/${documentId}`)} icon={<ArrowRight className="w-4 h-4" />}>
            {t('viewAnalysis')}
          </Button>
        )}
      </header>

      {/* Upload/Preview Card */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card padding="lg" className="ai-gradient-card shadow-l1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-lg font-medium text-on-surface">Target File</h2>
            <span className="bg-primary-container text-on-primary-container text-label-sm px-3 py-1 rounded-full border border-primary-fixed-dim">
              {isScanning ? 'Real-Time Scanning' : 'Analysis Complete'}
            </span>
          </div>
          
          <div className="aspect-[3/4] bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-center mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(49,116,239,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
            <FileText className="w-20 h-20 text-outline-variant group-hover:scale-105 transition-transform" />
            
            {/* Scanning line animation overlay */}
            {isScanning && (
              <div className="absolute left-0 right-0 h-1 bg-brand-blue/50 blur-[2px] top-0 shadow-[0_0_10px_rgba(49,116,239,0.8)] animate-[scan_2s_linear_infinite]"></div>
            )}
            <style>{`
              @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
              }
            `}</style>
          </div>
          
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-label-md font-medium text-on-surface truncate max-w-[200px]">{fileName}</span>
              <span className="text-label-sm text-on-surface-variant">Socket.IO Live</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
              <div className="bg-brand-blue h-2 rounded-full transition-all duration-500" style={{ width: `${Math.round(((currentStepIndex + 1) / steps.length) * 100)}%` }}></div>
            </div>
            <div className="text-label-sm text-brand-blue text-right mt-1">
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline Status */}
      <div className="lg:col-span-7">
        <Card padding="lg" className="h-full shadow-l1">
          <h2 className="text-title-lg font-medium text-on-surface mb-8">{t('pipelineTitle')}</h2>
          
          <div className="pl-2">
            {steps.map((step, idx) => (
              <ProgressStep
                key={step.stepNumber}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                status={step.status}
                isLast={idx === steps.length - 1}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-end gap-4 border-t border-outline-variant pt-6">
            <Button variant="outline" size="md" onClick={() => navigate('/documents')}>
              Ləğv Et
            </Button>
            {!isScanning && (
              <Button variant="primary" size="md" onClick={() => navigate(`/analysis/${documentId}`)}>
                Hesabata Bax
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScanPage;
