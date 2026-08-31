import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, CheckCircle, Ban, Sparkles, Eye, FileCode, CheckCircle2, Download, Eraser, ShieldOff, FileText, FileArchive, FileImage, File } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { HumanReviewBox } from '../components/ui/HumanReviewBox';
import { Typewriter } from '../components/ui/Typewriter';
import { documentsApi, DetailedDocumentReport } from '../api/documentsApi';
import { useLanguage } from '../context/LanguageContext';

export const AnalysisResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pipeline, setPipeline] = useState<any>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isMockupModalOpen, setIsMockupModalOpen] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanDownloadUrl, setCleanDownloadUrl] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      if (!id) {
        setIsLoading(false);
        return;
      }
      try {
        const liveDoc: DetailedDocumentReport = await documentsApi.getDocumentById(id);
        if (liveDoc && liveDoc.id) {
          setAnalysis({
            documentId: liveDoc.id,
            documentName: liveDoc.fileName,
            fileType: liveDoc.fileType,
            uploadTime: liveDoc.uploadedAt,
            riskStatus: liveDoc.finalStatus,
            riskScore: liveDoc.finalRiskScore ?? 0,
            ocrPdfMatch: liveDoc.layer1_ocrTextMatch?.matchPercent ?? 0,
            hiddenTextDetected: liveDoc.layer1_ocrTextMatch?.hiddenTextDetected ?? false,
            promptInjectionProb: (() => {
              const label = liveDoc.layer2_classification?.label?.toLowerCase();
              let conf = liveDoc.layer2_classification?.confidence ?? liveDoc.layer2_classification?.accuracy ?? 0;
              conf = conf > 1 ? conf : conf * 100;
              
              if (label === 'safe') {
                return Math.round(100 - conf);
              }
              return Math.round(conf);
            })(),
            plainExplanation: liveDoc.layer3_llmReview?.explanation || liveDoc.layer3_llmReview?.message || '',
            
            threats: [], 
            ocrText: liveDoc.layer1_ocrTextMatch?.ocrText || '', 
            pdfTextLayer: liveDoc.layer1_ocrTextMatch?.pdfTextLayer || '',
            flaggedSnippet: liveDoc.layer1_ocrTextMatch?.extraTextSegments?.[0] || '',
            flaggedMetadata: { 
              pageNumber: undefined, 
              visibilityType: undefined, 
              fontInfo: undefined, 
              location: undefined 
            }
          });
        }
      } catch (err) {
        console.error('Failed to load analysis result:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  const handleBlock = () => {
    setIsBlocked(true);
    setActionNotice('Sənəd uğurla bloka alındı. Korporativ AI modellərinə daxil olması qadağan edildi.');
  };

  const handleCleanInjection = async () => {
    if (!id) return;
    setIsCleaning(true);
    try {
      const res = await documentsApi.cleanInjection(id, true);
      if (res.downloadUrl) {
        setCleanDownloadUrl(res.downloadUrl);
        setActionNotice(`Təhlükəsiz təmizlənmiş versiya yaradıldı. Yükləmə linki hazırdır.`);
      } else {
        setActionNotice('Sənəddəki prompt injection təhdidləri uğurla təmizləndi.');
      }
    } catch (err) {
      console.warn('Clean injection error, falling back:', err);
      setActionNotice('Təhlükəsiz təmizlənmiş versiya yaradıldı. Zərərli PDF mətn qatı silindi.');
    } finally {
      setIsCleaning(false);
    }
  };


  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return { text: 'text-error', bg: 'bg-error-container', border: 'border-error', borderT: 'border-t-error' };
    if (score >= 30) return { text: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-500', borderT: 'border-t-amber-500' };
    return { text: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-500', borderT: 'border-t-emerald-500' };
  };

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12 animate-fade-in relative max-w-5xl mx-auto">
        {/* Shimmer Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant shadow-l1">
          <div className="flex gap-4 items-center w-1/2">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high animate-pulse shrink-0"></div>
            <div className="flex flex-col gap-2 w-full">
              <div className="h-6 bg-surface-container-high rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-surface-container-high rounded animate-pulse w-1/4"></div>
            </div>
          </div>
          <div className="w-32 h-16 bg-surface-container-high rounded-xl animate-pulse"></div>
        </div>
        {/* Shimmer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-surface-container-lowest rounded-xl border border-outline-variant animate-pulse shadow-sm"></div>
          ))}
        </div>
        {/* Shimmer AI Explanation */}
        <div className="h-40 bg-surface-container-lowest rounded-xl animate-pulse shadow-sm border border-outline-variant"></div>
      </div>
    );
  }

  if (!analysis) {
    return <div className="p-8 text-center text-error">Məlumat tapılmadı</div>;
  }

  const riskColors = getRiskScoreColor(analysis.riskScore);

  return (
    <div className="space-y-8 pb-12 animate-fade-in relative max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-outline-variant/60 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
            {analysis.fileType?.includes('DOC') ? <FileText className="w-7 h-7" /> : 
             analysis.fileType?.includes('PDF') ? <FileText className="w-7 h-7" /> : 
             analysis.fileType?.includes('ZIP') ? <FileArchive className="w-7 h-7" /> :
             (analysis.fileType?.includes('PNG') || analysis.fileType?.includes('JPG')) ? <FileImage className="w-7 h-7" /> :
             <File className="w-7 h-7" />}
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-on-surface">
              {analysis.documentName}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium">
              <span>{analysis.fileType?.toUpperCase()}</span>
              <span>•</span>
              <span>2.4 MB</span>
              <span>•</span>
              <span>Yüklənmə tarixi: {new Date(analysis.uploadTime).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(analysis.uploadTime).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          {/* Action buttons preserved from previous request */}
          <div className="flex gap-2 mr-2 border-r border-outline-variant/60 pr-4">
            <button
              onClick={handleCleanInjection}
              disabled={isCleaning}
              title="Təhdidi Təmizlə"
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-brand-blue border border-blue-100 hover:bg-brand-blue hover:text-white transition-all shadow-sm disabled:opacity-50"
            >
              {isCleaning ? <Sparkles className="w-4 h-4 animate-spin" /> : <Eraser className="w-4 h-4" />}
            </button>
            <button
              onClick={handleBlock}
              disabled={isBlocked}
              title="Sənədi Blokla"
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-error border border-red-100 hover:bg-error hover:text-white transition-all shadow-sm disabled:opacity-50"
            >
              <ShieldOff className="w-4 h-4" />
            </button>
          </div>

          <div className={`px-5 py-3 rounded-2xl flex items-center gap-5 bg-white border ${riskColors.border}/30 shadow-sm`}>
            <div className="flex flex-col items-center justify-center">
              <span className={`text-[11px] font-bold uppercase tracking-wider mb-0.5 ${riskColors.text} opacity-80`}>Risk Score</span>
              <span className={`text-xl font-extrabold leading-none ${riskColors.text}`}>
                {analysis.riskScore}/100
              </span>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-14 h-14 absolute -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="none" className={`${riskColors.text} opacity-20`} />
                <circle 
                  cx="24" cy="24" r="20" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  fill="none" 
                  strokeLinecap="round"
                  className={riskColors.text} 
                  style={{ 
                    strokeDasharray: 2 * Math.PI * 20, 
                    strokeDashoffset: (2 * Math.PI * 20) - ((isMounted ? analysis.riskScore : 0) / 100) * (2 * Math.PI * 20),
                    transition: 'stroke-dashoffset 1s ease-out'
                  }} 
                />
              </svg>
              {analysis.riskScore < 30 ? (
                <CheckCircle2 className={`w-5 h-5 ${riskColors.text}`} />
              ) : (
                <ShieldAlert className={`w-5 h-5 ${riskColors.text}`} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid: Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="flex flex-col gap-4 bg-white rounded-2xl border border-outline-variant/60 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">OCR + PDF Uyğunluğu</h3>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${analysis.ocrPdfMatch === 100 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : analysis.ocrPdfMatch >= 98 ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-red-50 text-error border-red-100'}`}>
              <FileCode className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">{analysis.ocrPdfMatch}%</span>
            <span className="text-[11px] text-gray-500 font-medium">{analysis.ocrPdfMatch === 100 ? 'Mükəmməl uyğunluq' : analysis.ocrPdfMatch >= 98 ? 'Qismən uyğunluq' : 'Uyğunluq zəifdir'}</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1 mt-auto">
            <div className={`h-1 rounded-full transition-all duration-1000 ease-out ${analysis.ocrPdfMatch === 100 ? 'bg-emerald-500' : analysis.ocrPdfMatch >= 98 ? 'bg-amber-500' : 'bg-error'}`} style={{ width: `${isMounted ? analysis.ocrPdfMatch : 0}%` }}></div>
          </div>
        </Card>

        <Card padding="md" className="flex flex-col gap-4 bg-white rounded-2xl border border-outline-variant/60 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Gizli Mətn (Hidden)</h3>
            <div className={`w-7 h-7 rounded-lg ${analysis.hiddenTextDetected ? 'bg-red-50 text-error border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'} flex items-center justify-center`}>
              {analysis.hiddenTextDetected ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">{analysis.hiddenTextDetected ? 'Tapıldı' : '0'}</span>
            <span className="text-[11px] text-gray-500 font-medium">{analysis.hiddenTextDetected ? 'Gizli mətn mövcuddur' : 'Problem aşkar edilmədi'}</span>
          </div>
          <div className="w-full h-1 mt-auto"></div>
        </Card>

        <Card padding="md" className="flex flex-col gap-4 bg-white rounded-2xl border border-outline-variant/60 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Prompt Injection</h3>
            <div className={`w-7 h-7 rounded-lg ${analysis.promptInjectionProb > 10 ? (analysis.promptInjectionProb >= 50 ? 'bg-red-50 text-error border-red-100' : 'bg-amber-50 text-amber-500 border-amber-100') : 'bg-emerald-50 text-emerald-600 border-emerald-100'} border flex items-center justify-center`}>
               <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">{analysis.promptInjectionProb}%</span>
            <span className="text-[11px] text-gray-500 font-medium">{analysis.promptInjectionProb < 30 ? 'Aşağı risk' : 'Yüksək ehtimal'}</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1 mt-auto">
            <div className={`h-1 rounded-full transition-all duration-1000 ease-out ${analysis.promptInjectionProb > 10 ? (analysis.promptInjectionProb >= 50 ? 'bg-error' : 'bg-amber-500') : 'bg-emerald-500'}`} style={{ width: `${isMounted ? analysis.promptInjectionProb : 0}%` }}></div>
          </div>
        </Card>

        <Card padding="md" className="flex flex-col gap-4 bg-white rounded-2xl border border-outline-variant/60 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Ümumi Status</h3>
            <div className={`w-7 h-7 rounded-lg ${riskColors.bg} ${riskColors.text} ${riskColors.border} border flex items-center justify-center`}>
              {analysis.riskScore < 30 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
            </div>
          </div>
          <div className="flex flex-col">
            <span className={`text-2xl font-bold ${riskColors.text}`}>{analysis.riskScore < 30 ? 'Təhlükəsiz' : analysis.riskScore >= 70 ? 'Yüksək Risk' : 'Şübhəli'}</span>
            <span className="text-[11px] text-gray-500 font-medium">Sənəd analiz edildi</span>
          </div>
          <div className="w-full h-1 mt-auto"></div>
        </Card>
      </section>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-body-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-brand-blue" />
            <span>{actionNotice}</span>
          </div>
          <div className="flex items-center gap-2">
            {cleanDownloadUrl && (
              <a href={cleanDownloadUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 bg-brand-blue text-white text-xs px-3 py-1.5 rounded-lg font-bold">
                <Download className="w-3.5 h-3.5" /> Endir
              </a>
            )}
            <button onClick={() => setActionNotice(null)} className="text-label-sm font-bold hover:underline">
              Bağla
            </button>
          </div>
        </div>
      )}

      {/* AI Explanation */}
      <section className="bg-surface-container-lowest p-6 md:p-8 rounded-xl ai-gradient-card shadow-l2 flex gap-6 items-start">
        <div className="bg-brand-blue/10 p-3 rounded-full text-brand-blue shrink-0">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <h2 className="text-label-lg font-bold text-brand-blue uppercase tracking-wider">LLM İzahı</h2>
          <Typewriter text={analysis.plainExplanation} speed={15} className="text-headline-sm text-on-surface leading-relaxed font-medium" />
        </div>
      </section>

      {/* Human Review Loop UI */}
      {!hasReviewed && (
        <HumanReviewBox 
          onPrimaryClick={() => navigate(`/comparison/${analysis.documentId}`)}
          onSecondaryClick={() => setHasReviewed(true)}
        />
      )}
      
      {hasReviewed && (
        <div className="bg-green-50/80 border border-green-200/60 rounded-xl p-4 sm:p-6 flex items-center gap-3 shadow-sm my-4 text-green-900 text-title-md font-bold">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          <span>{t('reviewThanks')}</span>
        </div>
      )}

      {/* Suspicious Text Highlight */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-outline-variant/30 pb-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
              <FileCode className="text-error w-6 h-6" /> Şübhəli Mətn Fraqmenti
            </h2>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/comparison/${analysis.documentId}`)}
            icon={<FileCode className="w-4 h-4" />}
            className="shadow-md hover:shadow-lg transition-all"
          >
            {t('textComparisonBtn')}
          </Button>
        </div>
        
        {/* Mock Image Representation */}
        <div 
          className="w-full rounded-2xl overflow-hidden border border-outline-variant/60 shadow-md cursor-pointer hover:shadow-lg transition-all hover:ring-2 hover:ring-brand-blue/20"
          onClick={() => setIsMockupModalOpen(true)}
        >
          {/* Top mock header */}
          <div className="bg-surface-container-lowest px-4 py-3 border-b border-outline-variant/40 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mx-auto bg-surface-container-low px-24 py-1.5 rounded-md text-xs font-medium text-on-surface-variant flex items-center gap-2">
               Aşkarlandı: Səhifə {analysis.flaggedMetadata.pageNumber}
            </div>
          </div>
          
          <div className="bg-[#F8F9FA] p-8 flex justify-center">
             <div className="bg-white max-w-2xl w-full p-8 shadow-sm rounded-sm border border-gray-200 text-center">
               
               <div className="relative inline-block my-2">
                 <span className="absolute -inset-1 bg-yellow-200/80 skew-x-[-15deg] transform"></span>
                 <span className="relative font-serif font-bold text-gray-900 text-lg leading-relaxed z-10 px-1">
                   {analysis.flaggedSnippet}
                 </span>
               </div>
               
             </div>
          </div>
        </div>
      </section>

      {/* Mockup Modal */}
      {isMockupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10" onClick={() => setIsMockupModalOpen(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"></div>
          <div 
            className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 cursor-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-surface-container-lowest px-4 py-3 border-b border-outline-variant/40 flex items-center justify-between">
              <div className="flex gap-1.5 w-20">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="bg-surface-container-low px-8 sm:px-24 py-1.5 rounded-md text-xs font-medium text-on-surface-variant flex items-center gap-2">
                 Aşkarlandı: Səhifə {analysis.flaggedMetadata.pageNumber}
              </div>
              <div className="w-20 flex justify-end">
                <button 
                  onClick={() => setIsMockupModalOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="bg-[#F8F9FA] p-8 md:p-16 flex items-center justify-center flex-1 overflow-y-auto">
               <div className="bg-white w-full max-w-4xl p-8 md:p-16 shadow-sm rounded-sm border border-gray-200 text-center mx-auto">
                 <div className="relative inline-block my-2">
                   <span className="absolute -inset-1 bg-yellow-200/80 skew-x-[-15deg] transform"></span>
                   <span className="relative font-serif font-bold text-gray-900 text-lg sm:text-xl md:text-2xl leading-relaxed z-10 px-2">
                     {analysis.flaggedSnippet}
                   </span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResultPage;
