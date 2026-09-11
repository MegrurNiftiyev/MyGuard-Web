import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldAlert, Eye, FileCode, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { HumanReviewBox } from '../components/ui/HumanReviewBox';
import { documentsApi, DocumentComparisonData } from '../api/documentsApi';
import { renderWithFerqliTags } from '../utils/textHighlight';
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

  const extractFerqliSnippets = (text?: string): string[] => {
    if (!text || !text.includes('<ferqli>')) return [];
    const matches = text.match(/<ferqli>([\s\S]*?)<\/ferqli>/g);
    if (!matches) return [];
    return matches.map(m => m.replace(/<\/?ferqli>/g, '').trim()).filter(Boolean);
  };

  const highlightDiff = (ocrText: string, pdfText: string, snippets?: string[]) => {
    if (!pdfText) return <span className="opacity-50 italic">PDF daxili mətn qatı mövcud deyil</span>;

    if (pdfText.includes('<ferqli>')) {
      return renderWithFerqliTags(pdfText);
    }

    const ferqliExtracted = extractFerqliSnippets(ocrText);
    const allSnippets = Array.from(new Set([...(snippets || []), ...ferqliExtracted]));
    const validSnippets = allSnippets.filter(s => s && s.trim().length > 0 && s.trim() !== pdfText.trim());

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

    const cleanOcr = ocrText.replace(/<\/?ferqli>/g, '');
    if (!cleanOcr || cleanOcr.trim() === pdfText.trim()) {
      return <span>{pdfText}</span>;
    }

    const ocrCleanWords = new Set(
      cleanOcr
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

  const hasThreats = Boolean(
    liveComparison?.hiddenTextDetected ||
    liveComparison?.textDifferenceFound ||
    (liveComparison?.hiddenTexts && liveComparison.hiddenTexts.length > 0) ||
    (liveComparison?.flaggedSnippets && liveComparison.flaggedSnippets.length > 0) ||
    liveComparison?.ocrText?.includes('<ferqli>')
  );

  const activeSnippets = liveComparison?.hiddenTexts?.length
    ? liveComparison.hiddenTexts
    : liveComparison?.flaggedSnippets;

  return (
    <div className="space-y-6 pt-4 sm:pt-6 pb-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface leading-tight font-sans">
            OCR ↔ PDF Mətn Qatının Müqayisəsi
          </h1>
          <p className="text-body-md text-on-surface-variant">
            İnsan gözünün gördüyü fiziki mətn (OCR) ilə AI modelinin oxuduğu daxili PDF kodu (Mətn Qatı) arasındakı fərqlər.
          </p>
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
        ) : !hasReviewed && hasThreats ? (
          <HumanReviewBox 
            onPrimaryClick={() => handleReviewFeedback(true)}
            onSecondaryClick={() => handleReviewFeedback(false)}
            primaryLabel="Təhdiddir"
            secondaryLabel="Təhlükəsizdir"
            primaryIcon={<AlertTriangle className="w-4 h-4" />}
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
              <div className="opacity-90">{renderWithFerqliTags(liveComparison.ocrText)}</div>
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
            <div className={`text-label-sm font-bold tracking-wide uppercase ${hasThreats ? 'text-error' : 'text-emerald-600'}`}>
              {isLoading ? (
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              ) : hasThreats ? (
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
              <div className="opacity-90">{highlightDiff(liveComparison.ocrText || '', liveComparison.pdfTextLayer, activeSnippets)}</div>
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


