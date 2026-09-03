import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldAlert, Eye, FileCode, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HumanReviewBox } from '../components/ui/HumanReviewBox';
import { documentsApi, DocumentComparisonData } from '../api/documentsApi';
import { useLanguage } from '../context/LanguageContext';

export const TextComparisonPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [hasReviewed, setHasReviewed] = useState(false);
  const [liveComparison, setLiveComparison] = useState<DocumentComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getMatchScoreColor = (score: number) => {
    if (score === 100) return { text: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-300' };
    if (score >= 98) return { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-300' };
    return { text: 'text-error', bg: 'bg-error-container', border: 'border-error/40' };
  };

  useEffect(() => {
    const fetchComparison = async () => {
      setIsLoading(true);
      if (!id) {
        setIsLoading(false);
        return;
      }
      try {
        const comp = await documentsApi.getDocumentComparison(id);
        if (comp) {
          setLiveComparison(comp);
        }
      } catch (err) {
        console.error('Failed to load comparison data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComparison();
  }, [id]);

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

  const handleReviewFeedback = async (isInjection: boolean) => {
    const docId = id || 'doc-1724750000-123';
    try {
      await documentsApi.labelByUser(docId, isInjection);
    } catch (err) {
      console.warn('Feedback submit error:', err);
    }
    setHasReviewed(true);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface leading-tight">
              OCR ↔ PDF Layer Text Comparison
            </h1>
            <p className="text-body-md text-on-surface-variant">
              İnsan gözünün gördüyü fiziki mətn (OCR) ilə AI modelinin oxuduğu daxili PDF kodu (Text Layer) arasındakı fərqlər.
            </p>
          </div>

          {/* Top Score Banner */}
          <div className="flex sm:justify-end">
          {isLoading ? (
            <div className="w-full max-w-sm h-20 bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] animate-pulse flex items-center justify-between gap-4">
               <div className="flex flex-col gap-2 w-full items-end">
                 <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                 <div className="h-6 bg-gray-200 rounded w-full"></div>
               </div>
               <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
            </div>
          ) : (() => {
            const matchScore = liveComparison?.ocrPdfMatch ?? 0;
            const matchColors = getMatchScoreColor(matchScore);
            return (
              <div className={`w-full max-w-sm px-5 py-3 rounded-2xl flex items-center justify-between sm:justify-end gap-5 bg-white border ${matchColors.border} shadow-sm`}>
                <div className="flex flex-col items-end justify-center">
                  <span className={`text-[11px] font-bold uppercase tracking-wider mb-0.5 ${matchColors.text} opacity-80`}>
                    Uyğunluq Hesabı
                  </span>
                  <span className={`text-sm font-extrabold leading-none ${matchColors.text}`}>
                    OCR ↔ PDF
                  </span>
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-14 h-14 absolute -rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="none" className={`${matchColors.text} opacity-20`} />
                    <circle 
                      cx="24" cy="24" r="20" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      fill="none" 
                      strokeLinecap="round"
                      className={matchColors.text} 
                      style={{ 
                        strokeDasharray: 2 * Math.PI * 20, 
                        strokeDashoffset: (2 * Math.PI * 20) - ((isMounted ? matchScore : 0) / 100) * (2 * Math.PI * 20),
                        transition: 'stroke-dashoffset 1s ease-out'
                      }} 
                    />
                  </svg>
                  <span className={`absolute text-[11px] font-extrabold ${matchColors.text}`}>{matchScore}%</span>
                </div>
              </div>
            );
          })()}
          </div>
        </div>

        {/* Human Review Loop UI */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-6 shadow-sm border border-outline-variant/40 mt-8 mb-4 animate-pulse">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-surface-container shrink-0"></div>
               <div className="flex flex-col gap-2">
                 <div className="h-4 bg-surface-container rounded w-48"></div>
                 <div className="h-3 bg-surface-container rounded w-64"></div>
               </div>
            </div>
            <div className="h-10 bg-surface-container rounded w-32 shrink-0"></div>
          </div>
        ) : !hasReviewed && (liveComparison?.flaggedSnippets && liveComparison.flaggedSnippets.length > 0) ? (
          <HumanReviewBox 
            onPrimaryClick={() => handleReviewFeedback(true)}
            onSecondaryClick={() => handleReviewFeedback(false)}
            primaryLabel="Təhdiddir"
            secondaryLabel="Təhlükəsizdir"
            primaryIcon={<AlertTriangle className="w-4 h-4" />}
            customLabel={liveComparison.flaggedMetadata?.visibilityType || 'GİZLİ MƏTN'}
            description="Zəhmət olmasa OCR və PDF qatlarını müqayisə edərək bunun təhdid olub-olmadığını təsdiqləyin."
          />
        ) : null}
        
        {hasReviewed && (
          <div className="bg-green-50/80 border border-green-200/60 rounded-xl p-4 sm:p-6 flex items-center gap-3 shadow-sm my-4 text-green-900 text-title-md font-bold">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <span>{t('reviewThanks')}</span>
          </div>
        )}
      </div>

      {/* Split-Screen Comparison (Left: OCR vs Right: PDF Layer) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column: OCR Extracted Text (Human Visible) */}
        <Card padding="lg" className="border border-emerald-200/50 shadow-l1 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/50">
            <div className="flex items-center gap-3">
              <div className="text-emerald-600 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-title-lg font-bold text-on-surface">OCR Vizual Nəticə</h3>
              </div>
            </div>
            <div className="text-label-sm font-bold text-emerald-600 tracking-wide uppercase">
              Normal Görünüş
            </div>
          </div>

          <div className="p-6 md:p-8 rounded-xl bg-[#F8F9FA] border border-outline-variant/30 font-serif text-base md:text-lg text-gray-800 whitespace-pre-wrap leading-relaxed min-h-[400px] shadow-inner">
            {isLoading ? (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : liveComparison?.ocrText ? (
              <div className="opacity-90">{liveComparison.ocrText}</div>
            ) : (
              <div className="opacity-50 italic text-center mt-10">Vizual mətn (OCR) tapılmadı</div>
            )}
          </div>
        </Card>

        {/* Right Column: PDF Text Layer (With Hidden Payload Highlighted) */}
        <Card padding="lg" className="border-error/20 bg-error/5 shadow-l1 flex flex-col gap-4 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-error/10">
            <div className="flex items-center gap-3">
              <div className="text-error flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-title-lg font-bold text-on-surface">PDF Kod Qatı (AI Tərəfindən)</h3>
              </div>
            </div>
            <div className={`text-label-sm font-bold tracking-wide uppercase ${(liveComparison?.flaggedSnippets && liveComparison.flaggedSnippets.length > 0) ? 'text-error' : 'text-emerald-600'}`}>
              {isLoading ? (
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              ) : (liveComparison?.flaggedSnippets && liveComparison.flaggedSnippets.length > 0) ? (
                'Təhdid Tapıldı'
              ) : (
                'Problem yoxdur'
              )}
            </div>
          </div>

          {/* Code View with Highlighted Danger Text */}
          <div className="p-6 md:p-8 rounded-xl bg-[#F8F9FA] border border-error/20 font-serif text-base md:text-lg text-gray-800 whitespace-pre-wrap leading-relaxed min-h-[400px] flex flex-col shadow-inner">
            {isLoading ? (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-4 bg-error/10 rounded w-3/4"></div>
                <div className="h-4 bg-error/10 rounded w-full"></div>
                <div className="h-4 bg-error/20 rounded w-5/6"></div>
                <div className="h-4 bg-error/10 rounded w-2/3"></div>
              </div>
            ) : liveComparison?.pdfTextLayer ? (
              <div className="opacity-90">{highlightDiff(liveComparison.ocrText || '', liveComparison.pdfTextLayer, liveComparison.flaggedSnippets)}</div>
            ) : (
              <div className="opacity-50 italic text-center mt-10">PDF daxili mətn qatı tapılmadı</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TextComparisonPage;


