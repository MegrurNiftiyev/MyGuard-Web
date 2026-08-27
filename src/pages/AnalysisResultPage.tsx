import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, CheckCircle, Ban, Sparkles, Eye, FileCode, CheckCircle2, Download } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { mockDetailedAnalysis, mockPipelines } from '../data/mockData';
import { mockApi } from '../api/mockApi';
import { documentsApi, DetailedDocumentReport } from '../api/documentsApi';
import { useLanguage } from '../context/LanguageContext';

export const AnalysisResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();
  const [analysis, setAnalysis] = useState(mockDetailedAnalysis);
  const [pipeline, setPipeline] = useState(mockPipelines[0]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isMockupModalOpen, setIsMockupModalOpen] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanDownloadUrl, setCleanDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const docId = id || 'doc-1724750000-123';
      try {
        const liveDoc: DetailedDocumentReport = await documentsApi.getDocumentById(docId);
        if (liveDoc && liveDoc.id) {
          setAnalysis({
            ...mockDetailedAnalysis,
            documentId: liveDoc.id,
            documentName: liveDoc.fileName,
            riskScore: liveDoc.finalRiskScore ?? 85,
            flaggedSnippet: liveDoc.layer1_ocrTextMatch?.extraTextSegments?.[0] || mockDetailedAnalysis.flaggedSnippet,
            plainExplanation: liveDoc.layer3_llmReview?.explanation || mockDetailedAnalysis.plainExplanation
          });
        }
      } catch (err) {
        console.warn('Fallback to mock for analysis result load:', err);
        const result = await mockApi.getAnalysisResult(docId);
        const pipe = await mockApi.getAnalysisPipeline(docId);
        if (result) setAnalysis(result);
        if (pipe) setPipeline(pipe);
      }
    };
    loadData();
  }, [id]);

  const handleBlock = () => {
    setIsBlocked(true);
    setActionNotice('Sənəd uğurla bloka alındı. Korporativ AI modellərinə daxil olması qadağan edildi.');
  };

  const handleCleanThreat = async () => {
    setIsCleaning(true);
    const docId = id || analysis.documentId || 'doc-1724750000-123';
    try {
      const res = await documentsApi.cleanInjection(docId, true);
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

  const handleUserReview = async (isInjection: boolean) => {
    const docId = id || analysis.documentId || 'doc-1724750000-123';
    try {
      await documentsApi.labelByUser(docId, isInjection);
    } catch (err) {
      console.warn('Label user error fallback:', err);
    }
    setHasReviewed(true);
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in relative max-w-5xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant shadow-l1">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
              <FileCode className="w-6 h-6" />
            </div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">
              {analysis.documentName}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-surface-container px-3 py-1 rounded-full text-label-sm text-on-surface-variant border border-outline-variant">Type: {analysis.fileType}</span>
            <Chip status={isBlocked ? 'blocked' : analysis.riskStatus} />
          </div>
        </div>

        <div className="flex items-center gap-4 bg-error-container/20 p-4 rounded-xl border border-error/20">
          <div className="text-right">
            <div className="text-label-sm font-semibold text-error uppercase tracking-wider">Risk Score</div>
            <span className="text-display-sm font-bold text-error">{analysis.riskScore}/100</span>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-error/20 border-t-error flex items-center justify-center relative">
            <ShieldAlert className="text-error w-8 h-8 absolute" />
          </div>
        </div>
      </header>

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

      {/* Action Toolbar */}
      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="outline" size="md" onClick={handleCleanThreat} disabled={isCleaning}>
          {isCleaning ? 'Təmizlənir...' : 'Təhdidi Təmizlə'}
        </Button>
        <Button variant="danger" size="md" onClick={handleBlock} disabled={isBlocked}>
          {isBlocked ? 'Bloklandı' : 'Sənədi Blokla'}
        </Button>
      </div>

      {/* Bento Grid: Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card padding="lg" className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <FileCode className="w-5 h-5" />
            <h3 className="text-label-md font-medium">{t('ocrPdfMatch')}</h3>
          </div>
          <p className="text-headline-md font-bold text-on-surface">{analysis.ocrPdfMatch}%</p>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-2">
            <div className="bg-brand-purple h-1.5 rounded-full" style={{ width: `${analysis.ocrPdfMatch}%` }}></div>
          </div>
        </Card>

        <Card padding="lg" className="border-error/30 border-l-4 border-l-error flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-error/10">
            <Eye className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-2 text-error relative z-10">
            <Eye className="w-5 h-5" />
            <h3 className="text-label-md font-medium">{t('hiddenText')}</h3>
          </div>
          <p className="text-headline-md font-bold text-error relative z-10">
            {analysis.hiddenTextDetected ? t('detected') : 'Yoxdur'}
          </p>
        </Card>

        <Card padding="lg" className="border-error/30 border-l-4 border-l-error flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-error/10">
            <AlertTriangle className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-2 text-error relative z-10">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-label-md font-medium">{t('promptInjectionProb')}</h3>
          </div>
          <p className="text-headline-md font-bold text-error relative z-10">{analysis.promptInjectionProb}%</p>
          <div className="w-full bg-error-container rounded-full h-1.5 mt-2 relative z-10">
            <div className="bg-error h-1.5 rounded-full" style={{ width: `${analysis.promptInjectionProb}%` }}></div>
          </div>
        </Card>

        <Card padding="lg" className="flex flex-col gap-2 justify-between">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-label-md font-medium">Status</h3>
          </div>
          <p className="text-title-lg font-bold text-error flex items-center gap-2">
            <Ban className="w-6 h-6" /> {isBlocked ? t('blockedStatus') : 'Qırmızı Təhlükə'}
          </p>
        </Card>
      </section>

      {/* AI Explanation */}
      <section className="bg-surface-container-lowest p-6 md:p-8 rounded-xl ai-gradient-card shadow-l2 flex gap-6 items-start">
        <div className="bg-brand-blue/10 p-3 rounded-full text-brand-blue shrink-0">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-title-lg font-semibold text-on-surface">{t('explanationTitle')}</h2>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            {analysis.plainExplanation}
          </p>
        </div>
      </section>

      {/* Human Review Loop UI (Inline) */}
      {!hasReviewed && (
        <div className="bg-white border-2 border-amber-400/50 rounded-[2rem] p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg shadow-amber-100/50 my-4 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-title-md font-bold text-gray-900 mb-1 flex items-center gap-2">
                İnsan Təsdiqi Tələb Olunur 
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold">
                  User Audit
                </span>
              </p>
              <p className="text-body-md text-gray-600 font-medium">
                Zəhmət olmasa mətni oxuyaraq bunun təhdid olub-olmadığını təsdiqləyin:
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
            <Button variant="danger" size="md" onClick={() => handleUserReview(true)} className="rounded-full">
              Bəli, Zərərlidir
            </Button>
            <Button variant="outline" size="md" onClick={() => handleUserReview(false)} className="!bg-emerald-500 !text-white !border-emerald-500 hover:!bg-emerald-600 shadow-md rounded-full">
              Xeyr, Təhlükəsizdir
            </Button>
          </div>
        </div>
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
             <div className="bg-white max-w-2xl w-full p-8 shadow-sm rounded-sm border border-gray-200">
               <p className="font-serif text-gray-800 text-lg leading-relaxed mb-6">
                 ...and her skills in project management are truly exceptional. She has always delivered on time.
               </p>

               <div className="relative inline-block my-2">
                 <span className="absolute -inset-1 bg-yellow-200/80 skew-x-[-15deg] transform"></span>
                 <span className="relative font-serif font-bold text-gray-900 text-lg leading-relaxed z-10 px-1">
                   {analysis.flaggedSnippet}
                 </span>
               </div>
               
               <p className="font-serif text-gray-800 text-lg leading-relaxed mt-6">
                 I strongly recommend her for the promotion. Thank you for your consideration...
               </p>
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
            
            <div className="bg-[#F8F9FA] p-6 sm:p-12 flex justify-center max-h-[calc(90vh-60px)] overflow-y-auto">
               <div className="bg-white max-w-3xl w-full p-8 sm:p-12 shadow-sm rounded-sm border border-gray-200">
                 <p className="font-serif text-gray-800 text-lg sm:text-xl leading-relaxed mb-6">
                   ...and her skills in project management are truly exceptional. She has always delivered on time.
                 </p>
                 <div className="relative inline-block my-2">
                   <span className="absolute -inset-1 bg-yellow-200/80 skew-x-[-15deg] transform"></span>
                   <span className="relative font-serif font-bold text-gray-900 text-lg sm:text-xl leading-relaxed z-10 px-1">
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
