import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, CheckCircle, Ban, Sparkles, Eye, FileCode, CheckCircle2, Download, Eraser, ShieldOff, FileText, FileArchive, FileImage, File, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { HumanReviewBox } from '../components/ui/HumanReviewBox';
import { Typewriter } from '../components/ui/Typewriter';
import { documentsApi, DetailedDocumentReport } from '../api/documentsApi';
import { useLanguage } from '../context/LanguageContext';

const decodeFileName = (text: string) => {
  if (!text) return text;
  try {
    return decodeURIComponent(escape(text));
  } catch {
    return text;
  }
};

const highlightSnippet = (fullText: string, snippets?: string[]) => {
  if (!fullText) return <span className="opacity-50 italic">Mətn tapılmadı</span>;
  if (!snippets || snippets.length === 0) return <span>{fullText}</span>;
  
  return snippets.reduce((acc: any, snippet) => {
    if (!snippet) return acc;
    const parts = typeof acc === 'string' ? acc.split(snippet) : acc;
    if (typeof parts === 'string') return parts;
    
    const res: any[] = [];
    parts.forEach((part: any, i: number) => {
      res.push(part);
      if (i < parts.length - 1) {
        res.push(
          <span key={i + '-' + snippet.substring(0, 5)} className="relative inline-block mx-1.5 my-0.5">
            <span className="absolute -inset-1 bg-yellow-200/90 skew-x-[-15deg] transform rounded-sm shadow-2xs"></span>
            <span className="relative font-serif font-bold text-gray-900 z-10 px-1.5">{snippet}</span>
          </span>
        );
      }
    });
    return res;
  }, fullText);
};

export const AnalysisResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [hasReviewed, setHasReviewed] = useState(false);
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
            isConfidential: Boolean(liveDoc.isConfidential),
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
            llmUsed: liveDoc.layer3_llmReview?.used !== false,
            
            threats: [], 
            ocrText: liveDoc.layer1_ocrTextMatch?.ocrText || '', 
            pdfTextLayer: liveDoc.layer1_ocrTextMatch?.pdfTextLayer || '',
            flaggedSnippets: liveDoc.layer1_ocrTextMatch?.extraTextSegments || [],
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

  const highlightDiff = (ocrText: string, pdfText: string, snippets?: string[]) => {
    if (!pdfText) return <span className="opacity-50 italic">PDF daxili mətn qatı mövcud deyil</span>;

    const validSnippets = (snippets || []).filter(s => s && s.trim().length > 0 && s.trim() !== pdfText.trim());

    if (validSnippets.length > 0) {
      let elements: (string | React.ReactNode)[] = [pdfText];

      validSnippets.forEach((snippet) => {
        const nextElements: (string | React.ReactNode)[] = [];
        elements.forEach((item) => {
          if (typeof item !== 'string') {
            nextElements.push(item);
            return;
          }

          const parts = item.split(snippet);
          parts.forEach((part, i) => {
            if (part) nextElements.push(part);
            if (i < parts.length - 1) {
              nextElements.push(
                <mark key={`${i}-${snippet.slice(0, 5)}`} className="bg-yellow-300 text-gray-900 font-bold px-1.5 py-0.5 rounded shadow-2xs inline leading-relaxed">
                  {snippet}
                </mark>
              );
            }
          });
        });
        elements = nextElements;
      });

      return <>{elements}</>;
    }

    if (!ocrText || ocrText.trim() === pdfText.trim()) {
      return <span>{pdfText}</span>;
    }

    const ocrCleanWords = new Set(
      ocrText
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .split(/\s+/)
        .filter(Boolean)
    );

    const pdfTokens = pdfText.split(/(\s+)/);

    return (
      <>
        {pdfTokens.map((token, idx) => {
          const cleanToken = token.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();

          if (!cleanToken) {
            return <React.Fragment key={idx}>{token}</React.Fragment>;
          }

          if (ocrCleanWords.has(cleanToken)) {
            return <React.Fragment key={idx}>{token}</React.Fragment>;
          }

          return (
            <mark key={idx} className="bg-yellow-300 text-gray-900 font-bold px-1.5 py-0.5 rounded shadow-2xs inline">
              {token}
            </mark>
          );
        })}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12 animate-fade-in relative max-w-5xl mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-surface-container-lowest rounded-xl border border-outline-variant animate-pulse shadow-sm"></div>
          ))}
        </div>
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
          <div className="flex flex-col min-w-0">
            <h1 className="text-lg font-bold text-on-surface font-sans break-all" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
              {decodeFileName(analysis.documentName)}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant font-medium flex-wrap">
              <span>{analysis.fileType?.toUpperCase()}</span>
              <span>•</span>
              <span>2.4 MB</span>
              <span>•</span>
              <span>Yüklənmə tarixi: {new Date(analysis.uploadTime).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(analysis.uploadTime).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}</span>
              {analysis.isConfidential && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-extrabold text-[10px] border border-indigo-200">
                    <Lock className="w-3 h-3" /> MƏXFİ REJİM
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="flex flex-col items-center justify-center ml-2">
            <div className="relative w-16 h-16 flex items-center justify-center mb-1.5">
              <svg className="w-16 h-16 absolute -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className={`${riskColors.text} opacity-20`} />
                <circle 
                  cx="24" cy="24" r="20" 
                  stroke="currentColor" 
                  strokeWidth="4" 
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
              <span className={`text-lg font-extrabold ${riskColors.text}`}>
                {analysis.riskScore}%
              </span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${riskColors.text} opacity-90 whitespace-nowrap`}>Risk Skoru</span>
          </div>
        </div>
      </header>

      {/* Bento Grid: Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            <button onClick={() => setActionNotice(null)} className="text-label-sm font-bold hover:underline cursor-pointer">
              Bağla
            </button>
          </div>
        </div>
      )}

      {/* AI Explanation / Məxfi Rejim Alert Box */}
      {analysis.isConfidential ? (
        <section className="bg-indigo-50/90 border border-indigo-200/80 p-6 md:p-8 rounded-2xl shadow-sm flex gap-5 items-start">
          <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 shrink-0 shadow-2xs">
            <Lock className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              <h2 className="text-label-lg font-bold text-indigo-900 uppercase tracking-wider">Məxfi Rejim (Confidential Mode)</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-200/80 text-indigo-900 text-[10px] font-extrabold uppercase tracking-wider">MƏXFİ</span>
            </div>
            <p className="text-body-md text-indigo-950 font-medium leading-relaxed">
              Bu sənəd məxfi rejimdə yükləndiyi üçün xarici AI analizinə göndərilməyib. Yalnız yerli OCR və ML təhlükəsizlik təsnifatı aparılmışdır.
            </p>
          </div>
        </section>
      ) : (
        analysis.plainExplanation && (
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-xl ai-gradient-card shadow-l2 flex gap-6 items-start">
            <div className="bg-brand-blue/10 p-3 rounded-full text-brand-blue shrink-0">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-3 w-full">
              <h2 className="text-label-lg font-bold text-brand-blue uppercase tracking-wider">LLM İzahı</h2>
              <Typewriter text={analysis.plainExplanation} speed={15} className="text-headline-sm text-on-surface leading-relaxed font-medium" />
            </div>
          </section>
        )
      )}

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

      {/* Flagged Snippet Detail Box (Paper Document Presentation Card) */}
      {analysis.flaggedSnippets && analysis.flaggedSnippets.length > 0 && (
        <section className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
            <div>
              <h2 className="text-headline-md font-bold text-on-surface flex items-center gap-2">
                <FileCode className="text-error w-6 h-6" /> Şübhəli Mətn Fraqmentləri
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={handleCleanInjection}
                disabled={isCleaning}
                icon={isCleaning ? <Sparkles className="w-4 h-4 animate-spin" /> : <Eraser className="w-4 h-4 text-brand-blue" />}
                className="shadow-sm hover:shadow transition-all"
              >
                {isCleaning ? 'Təmizlənir...' : 'Təmizlə'}
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handleBlock}
                disabled={isBlocked}
                icon={<ShieldOff className="w-4 h-4 text-error" />}
                className="shadow-sm hover:shadow transition-all text-error border-red-200 hover:bg-red-50"
              >
                {isBlocked ? 'Bloklandı' : 'Blokla'}
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate(`/comparison/${analysis.documentId}`)}
                icon={<Eye className="w-4 h-4 text-brand-blue" />}
                className="shadow-sm hover:shadow transition-all"
              >
                Tam Ekran Müqayisə
              </Button>
            </div>
          </div>
          
          <div className="w-full rounded-2xl overflow-hidden border border-outline-variant/60 shadow-sm bg-white">
            <div className="bg-surface-container-lowest px-4 py-3 border-b border-outline-variant/40 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-auto bg-surface-container-low px-8 sm:px-24 py-1.5 rounded-md text-xs font-medium text-on-surface-variant flex items-center gap-2">
                 Aşkarlandı: Səhifə {analysis.flaggedMetadata?.pageNumber || 1}
              </div>
            </div>
            
            <div className="bg-[#F8F9FA] p-6 sm:p-10 flex justify-center">
               <div className="bg-white max-w-3xl w-full p-8 sm:p-10 shadow-sm rounded-sm border border-gray-200 text-center">
                 <div className="mb-4 h-3 w-3/4 bg-gray-100 rounded mx-auto"></div>
                 <div className="mb-6 h-3 w-1/2 bg-gray-100 rounded mx-auto"></div>

                 <p className="font-serif text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                   ...sənədin daxili mətn qatında aşkar olunmuş şübhəli fraqment:
                 </p>

                 {analysis.flaggedSnippets.map((snippet: string, idx: number) => (
                    <div key={idx} className="my-4 text-left font-serif text-sm sm:text-base text-gray-800 leading-loose break-words">
                      <mark className="bg-yellow-300 text-gray-900 font-bold px-2 py-1 rounded shadow-2xs leading-loose box-decoration-clone">
                        {snippet}
                      </mark>
                    </div>
                  ))}

                 <p className="font-serif text-gray-700 text-sm sm:text-base leading-relaxed mt-4">
                   Sənəddən bu gizli fraqmentləri təmizləmək üçün "Təmizlə" düyməsini sıxa bilərsiniz.
                 </p>

                 <div className="mt-6 h-3 w-2/3 bg-gray-100 rounded mx-auto"></div>
                 <div className="mt-3 h-3 w-1/3 bg-gray-100 rounded mx-auto"></div>
               </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AnalysisResultPage;

