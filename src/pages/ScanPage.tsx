import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, ArrowRight, UploadCloud, ShieldAlert, Sparkles, FileCode, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CustomSwitch } from '../components/ui/CustomSwitch';
import { ProgressStep } from '../components/ui/ProgressStep';
import { StepStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { joinDocumentScanRoom, leaveDocumentScanRoom, ScanEventData } from '../api/socketClient';
import { documentsApi } from '../api/documentsApi';

const DEFAULT_SCAN_STEPS = [
  { stepNumber: 1, title: 'Sənədin Yüklənməsi', description: 'Fayl təhlükəsiz sandbox mühitinə daxil edilir...' },
  { stepNumber: 2, title: 'PDF Mətninin Çıxarılması', description: 'Daxili mətn qatı və strukturu oxunur...' },
  { stepNumber: 3, title: 'OCR Vizual Analiz', description: 'Vizual görüntüdən insan tərəfindən görünən mətn çıxarılır...' },
  { stepNumber: 4, title: 'Mətn Müqayisəsi', description: 'OCR və PDF mətn qatları fərqləri analiz edilir...' },
  { stepNumber: 5, title: 'Gizli Mətn Aşkarlanması', description: 'İnsan gözünə görünməyən yazılar yoxlanılır...' },
  { stepNumber: 6, title: 'Prompt Injection Analizi', description: 'AI modeli tərəfindən prompt injection yoxlaması edilir...' },
  { stepNumber: 7, title: 'Risk Qiymətləndirilməsi', description: 'Risk balı hesablanır və sənəd statusu müəyyən edilir...' }
];

const formatActiveMessage = (msg?: string) => {
  if (!msg) return msg;
  return msg
    .replace(/çıxarıldı/g, 'çıxarılır...')
    .replace(/oxundu/g, 'oxunur...')
    .replace(/daxil oldu/g, 'daxil edilir...')
    .replace(/analiz edildi/g, 'analiz edilir...')
    .replace(/yoxlanıldı/g, 'yoxlanılır...')
    .replace(/hesablandı/g, 'hesablanır...');
};

const getStepDescription = (stepIdx: number, status: StepStatus, socketMsg?: string, isActiveStep: boolean = false): string => {
  if (stepIdx === 4) {
    if (status === 'warning' || status === 'failed') {
      return 'İnsan gözünə görünməyən yazılar aşkarlandı';
    }
    if (status === 'completed') {
      return 'İnsan gözünə görünməyən yazılar tapılmadı';
    }
    return 'İnsan gözünə görünməyən yazılar yoxlanılır...';
  }

  if (stepIdx === 5) {
    if (status === 'warning' || status === 'failed') {
      return 'Prompt injection hücumu aşkarlandı';
    }
    if (status === 'completed') {
      return 'Prompt injection təhdidi tapılmadı';
    }
    return 'AI modeli tərəfindən prompt injection yoxlaması edilir...';
  }

  return formatActiveMessage(socketMsg) || DEFAULT_SCAN_STEPS[stepIdx]?.description || '';
};

// Global state to persist scan pipeline across route changes
let globalDocId: string | null = null;
let globalFileName: string | null = null;
let globalSteps: any[] | null = null;
let globalCurrentStepIndex: number = 0;
let globalIsScanning: boolean = false;

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlDocId = searchParams.get('docId');
  const urlFileName = searchParams.get('name');

  const activeDocId = urlDocId || globalDocId;
  const activeFileName = urlFileName || globalFileName || 'Sənəd.pdf';

  useEffect(() => {
    if (urlDocId) {
      globalDocId = urlDocId;
      globalFileName = urlFileName;
    }
  }, [urlDocId, urlFileName]);

  const [currentStepIndex, setCurrentStepIndex] = useState(globalCurrentStepIndex);
  const [isScanning, setIsScanning] = useState(globalIsScanning);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const [isConfidential, setIsConfidential] = useState(() => {
    const saved = localStorage.getItem('myguard_confidential_mode');
    return saved !== null ? saved === 'true' : false;
  });

  const handleConfidentialChange = (val: boolean) => {
    setIsConfidential(val);
    localStorage.setItem('myguard_confidential_mode', String(val));
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('myguard_confidential_mode');
      if (saved !== null) setIsConfidential(saved === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [steps, setSteps] = useState(
    globalSteps || DEFAULT_SCAN_STEPS.map((s, i) => ({
      ...s,
      status: 'pending' as StepStatus
    }))
  );

  useEffect(() => {
    globalCurrentStepIndex = currentStepIndex;
    globalIsScanning = isScanning;
    globalSteps = steps;
  }, [currentStepIndex, isScanning, steps]);

  const clearGlobalState = () => {
    globalDocId = null;
    globalFileName = null;
    globalSteps = null;
    globalCurrentStepIndex = 0;
    globalIsScanning = false;
    setSearchParams({});
    setSteps(DEFAULT_SCAN_STEPS.map(s => ({ ...s, status: 'pending' as StepStatus })));
    setCurrentStepIndex(0);
    setIsScanning(false);
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await documentsApi.uploadDocument(file, isConfidential);
      const newDocId = res.document?.id;
      if (newDocId) {
        globalDocId = newDocId;
        globalFileName = file.name;
        navigate(`/scan?docId=${newDocId}&name=${encodeURIComponent(file.name)}`);
      } else {
        throw new Error('Upload returned invalid document object');
      }
    } catch (err) {
      console.warn('Scan page file upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current += 1;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current -= 1;
      if (dragCounter.current === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        await processFile(e.dataTransfer.files[0]);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [isConfidential]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  // Real-time Socket.IO integration when activeDocId exists
  useEffect(() => {
    if (!activeDocId) {
      setIsScanning(false);
      setSteps(DEFAULT_SCAN_STEPS.map((s) => ({ ...s, status: 'pending' as StepStatus })));
      return;
    }

    if (!globalSteps) {
      setIsScanning(true);
      setSteps(
        DEFAULT_SCAN_STEPS.map((s, i) => ({
          ...s,
          status: i === 0 ? ('processing' as StepStatus) : ('pending' as StepStatus)
        }))
      );
    }

    joinDocumentScanRoom(activeDocId, (data: ScanEventData) => {
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

        setSteps((prevSteps) => {
          let isFinished = false;
          if (data.step === 'COMPLETED' || data.fileData?.currentStep === 'COMPLETED') {
            isFinished = true;
          }

          const getStepFinalStatus = (stepIdx: number): StepStatus => {
            const fd = data.fileData;
            if (!fd) return 'completed';

            if (stepIdx === 3) {
              return fd.layer1_ocrTextMatch?.status === 'suspicious' ? 'warning' : 'completed';
            }
            if (stepIdx === 4) {
              return Boolean(fd.layer1_ocrTextMatch?.hiddenTextDetected) ? 'warning' : 'completed';
            }
            if (stepIdx === 5) {
              const label = fd.layer2_classification?.label?.toLowerCase();
              const isThreat = label === 'injection' || label === 'suspicious' || Boolean(fd.isContainInjection);
              return isThreat ? 'warning' : 'completed';
            }
            if (stepIdx === 6) {
              const finalStatus = fd.finalStatus?.toLowerCase();
              const isHighRisk = finalStatus === 'high_risk' || finalStatus === 'suspicious' || (fd.finalRiskScore ?? 0) >= 30;
              return isHighRisk ? 'warning' : 'completed';
            }
            return 'completed';
          };

          const newSteps = prevSteps.map((step, idx) => {
            if (idx < activeIdx) {
              const finalSt = getStepFinalStatus(idx);
              return { ...step, status: finalSt, description: getStepDescription(idx, finalSt, undefined, false) };
            }
            if (idx === activeIdx) {
              let status: StepStatus = 'processing';
              if (data.fileData?.stepStatus === 'failed') {
                status = 'failed';
              } else if (data.response === 'error') {
                status = 'warning';
              } else if (data.fileData?.stepStatus === 'completed' || data.fileData?.currentStep === 'COMPLETED' || isFinished) {
                status = getStepFinalStatus(idx);
              }

              if (idx === 6 && (status === 'completed' || status === 'warning' || status === 'failed')) {
                isFinished = true;
              }

              return { ...step, status, description: getStepDescription(idx, status, data.message, true) };
            }
            return { ...step, status: 'pending' as StepStatus };
          });

          if (isFinished) {
            setIsScanning(false);
          }

          return newSteps;
        });
      }
    });

    return () => {
      leaveDocumentScanRoom(activeDocId);
    };
  }, [activeDocId]);

  // Shared Drag Overlay Node
  const renderDragOverlay = () => {
    if (!isDragging) return null;
    return createPortal(
      <div className="fixed inset-0 z-[100] bg-surface-container-lowest/85 backdrop-blur-md flex flex-col items-center justify-center p-6 transition-all duration-300 animate-in fade-in zoom-in-95 pointer-events-none">
        <div className="w-full max-w-xl p-10 border-2 border-dashed border-brand-blue/70 rounded-3xl bg-surface/95 flex flex-col items-center justify-center text-center space-y-5 shadow-2xl">
          <div className="relative flex items-center justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-brand-blue/15 text-brand-blue flex items-center justify-center rotate-[-12deg] shadow-md">
              <FileCode className="w-8 h-8" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-brand-purple flex items-center justify-center rotate-[8deg] -ml-6 shadow-md border border-purple-200">
              <FileText className="w-8 h-8" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-title-lg font-bold text-on-surface tracking-tight">Sənədi bura buraxın</h3>
            <p className="text-body-md text-on-surface-variant">
              Skan etmək üçün istənilən faylı bura sürükləyib buraxa bilərsiniz
            </p>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // If no document is selected/being scanned, render the Idle Scan State in exact same layout
  if (!activeDocId) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8 min-h-[80vh] relative">
        {renderDragOverlay()}

        {/* Header spanning full width */}
        <header className="lg:col-span-12 mb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
               <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2">
                 Sənəd Yoxlanış Sistemi
               </h1>
               <p className="text-body-md text-on-surface-variant">
                 Skan ediləcək sənədi seçin və 7 mərhələli təhlükəsizlik yoxlanış etabının fəaliyyətini izləyin
               </p>
             </div>
          </div>
        </header>

        {/* Left Column: Upload Target Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card padding="lg" className="shadow-l1 flex flex-col items-center text-center space-y-6">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-title-lg font-bold text-on-surface">Hədəf Sənəd</h2>
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
                {isUploading ? <Loader2 className="w-8 h-8 text-brand-blue animate-spin" /> : <UploadCloud className="w-8 h-8 text-brand-blue" />}
              </div>
              <p className="text-title-md font-bold text-on-surface mb-1">
                {isUploading ? 'Fayl serverə yüklənir...' : 'Hələ ki skan edilən sənəd yoxdur'}
              </p>
              <p className="text-body-sm text-on-surface-variant max-w-xs mb-4">
                {isUploading ? 'Sənəd təhlükəsiz sandbox mühitinə göndərilir, backend cavabı gözlənilir...' : 'Skan etmək istədiyiniz PDF və ya DOCX faylını bura sürükləyin və ya seçin'}
              </p>
              <Button variant="primary" size="md" className="pointer-events-none shadow-sm" disabled={isUploading}>
                {isUploading ? 'Yüklənir...' : 'Sənəd Seçin'}
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
                  Skan etabı (7 Mərhələ)
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-on-surface select-none">Məxfi Sənəd</span>
                  <CustomSwitch checked={isConfidential} onChange={handleConfidentialChange} />
                </div>
              </div>

              <div className="pl-2 space-y-4">
                {steps.map((step, idx) => (
                  <ProgressStep
                    key={step.stepNumber}
                    stepNumber={step.stepNumber}
                    title={step.title}
                    description={step.description}
                    status={isUploading && idx === 0 ? 'processing' : 'pending'}
                    isLast={idx === steps.length - 1}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Active Scan State (when documentId is present)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8 min-h-[80vh] relative">
      {renderDragOverlay()}

      <header className="lg:col-span-12 mb-2">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2">Sənəd Yoxlanış Sistemi</h1>
          <p className="text-body-md text-on-surface-variant">Skan ediləcək sənədi seçin və 7 mərhələli təhlükəsizlik yoxlanış etabının fəaliyyətini izləyin</p>
        </div>
      </header>

      {/* Upload/Preview Card */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card padding="lg" className="ai-gradient-card shadow-l1 flex flex-col pt-6">
          <div className="aspect-[3/4] bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-center mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(49,116,239,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
            <FileText className="w-20 h-20 text-outline-variant group-hover:scale-105 transition-transform" />
            
            {/* Scanning line animation overlay */}
            {(isScanning || isUploading || steps.some((s) => s.status === 'processing')) && (
              <div className="absolute left-0 right-0 h-[2.5px] bg-brand-blue top-0 shadow-[0_4px_16px_3px_rgba(0,102,255,0.85)] animate-scan-line z-20 pointer-events-none">
                <div className="absolute inset-0 bg-brand-blue shadow-[0_0_10px_2px_rgba(0,102,255,1)] blur-[0.5px]"></div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-label-md font-medium text-on-surface truncate max-w-[200px]">{activeFileName}</span>
              <span className="text-label-sm text-on-surface-variant">Canlı Əlaqə</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
              <div className="bg-brand-blue h-2 rounded-full transition-all duration-500" style={{ width: `${Math.round(((currentStepIndex + 1) / steps.length) * 100)}%` }}></div>
            </div>
            <div className="text-label-sm text-brand-blue text-right mt-1">
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Tamamlandı
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline Status */}
      <div className="lg:col-span-7">
        <Card padding="lg" className="h-full shadow-l1">
          <h2 className="text-title-lg font-medium text-on-surface mb-8">Skan etabı (7 Mərhələ)</h2>
          
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
            <Button variant="outline" size="md" onClick={clearGlobalState}>
              {(isScanning || isUploading) ? 'Ləğv Et' : 'Təmizlə'}
            </Button>
            <Button 
              variant="primary" 
              size="md" 
              disabled={isScanning || isUploading}
              onClick={() => navigate(`/analysis/${activeDocId}`)}
              className={(isScanning || isUploading) ? '!bg-gray-200 !text-gray-400 !border-gray-200 opacity-70 cursor-not-allowed pointer-events-none shadow-none' : ''}
            >
              Hesabata Bax
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScanPage;
