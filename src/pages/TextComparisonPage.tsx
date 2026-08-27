import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldAlert, Eye, FileCode, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockDetailedAnalysis } from '../data/mockData';
import { documentsApi, DocumentComparisonData } from '../api/documentsApi';
import { useLanguage } from '../context/LanguageContext';

export const TextComparisonPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [data, setData] = useState(mockDetailedAnalysis);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [liveComparison, setLiveComparison] = useState<DocumentComparisonData | null>(null);

  useEffect(() => {
    const docId = id || 'doc-1724750000-123';
    const fetchComparison = async () => {
      try {
        const comp = await documentsApi.getDocumentComparison(docId);
        if (comp) {
          setLiveComparison(comp);
          setData(prev => ({
            ...prev,
            ocrPdfMatch: comp.ocrPdfMatch ?? prev.ocrPdfMatch,
            flaggedSnippet: comp.flaggedSnippet || prev.flaggedSnippet,
            hiddenTextDetected: comp.hiddenTextDetected ?? prev.hiddenTextDetected
          }));
        }
      } catch (err) {
        console.warn('Live document comparison fallback:', err);
      }
    };
    fetchComparison();
  }, [id]);

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2">
                OCR ↔ PDF Layer Text Comparison
              </h1>
              <p className="text-body-md text-on-surface-variant max-w-2xl">
                İnsan gözünün gördüyü fiziki mətn (OCR) ilə AI modelinin oxuduğu daxili PDF kodu (Text Layer) arasındakı fərqlər.
              </p>
            </div>
          </div>

          {/* Top Score Banner */}
          <div className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
            <div className="text-right">
              <div className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">Uyğunluq Hesabı</div>
              <div className="text-headline-sm font-bold text-error mt-1">
                OCR ↔ PDF uyğunluğu: {data.ocrPdfMatch}%
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-error/20 border-t-error flex items-center justify-center relative shrink-0">
              <FileCode className="w-5 h-5 text-error absolute" />
            </div>
          </div>
        </div>

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
                    Zero Opacity / Hidden Font
                  </span>
                </p>
                <p className="text-body-md text-gray-600 font-medium">
                  Zəhmət olmasa mətni oxuyaraq bunun injection olub-olmadığını təsdiqləyin:
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
              <Button variant="danger" size="md" onClick={() => handleReviewFeedback(true)} className="rounded-full">
                Bəli, Zərərlidir
              </Button>
              <Button variant="outline" size="md" onClick={() => handleReviewFeedback(false)} className="!bg-emerald-500 !text-white !border-emerald-500 hover:!bg-emerald-600 shadow-md rounded-full">
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

          <div className="p-8 rounded-xl bg-[#F8F9FA] border border-outline-variant/30 font-serif text-lg text-gray-800 whitespace-pre-wrap leading-relaxed min-h-[400px] shadow-inner">
            {liveComparison?.ocrText ? (
              <div>{liveComparison.ocrText}</div>
            ) : (
              <>
                <div className="opacity-80">CV: Samir Əliyev</div>
                <div className="opacity-80">Təhsil: Bakı Dövlət Universiteti - Kompüter Elmləri (2018-2022)</div>
                <div className="opacity-80">Təcrübə: Senior Frontend Developer (3 il)</div>
                <div className="opacity-80">Biliklər: React, TypeScript, Tailwind CSS, Node.js, REST API</div>
                <div className="opacity-80">Əlaqə: samir.aliyev@email.com | +994 50 123 45 67</div>
                <br />
                <div className="opacity-80">Haqqında: Məsuliyyətli, komandada işləməyi bacaran və innovativ həllər təklif edən mütəxəssis.</div>
              </>
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
            <div className="text-label-sm font-bold text-error tracking-wide uppercase">
              1 Injection Tapıldı
            </div>
          </div>

          {/* Code View with Highlighted Danger Text */}
          <div className="p-8 rounded-xl bg-[#F8F9FA] border border-error/20 font-serif text-lg text-gray-800 whitespace-pre-wrap leading-relaxed min-h-[400px] flex flex-col shadow-inner">
            {liveComparison?.pdfTextLayer ? (
              <div>{liveComparison.pdfTextLayer}</div>
            ) : (
              <>
                <div className="opacity-80">CV: Samir Əliyev</div>
                <div className="opacity-80">Təhsil: Bakı Dövlət Universiteti - Kompüter Elmləri (2018-2022)</div>
                <div className="opacity-80">Təcrübə: Senior Frontend Developer (3 il)</div>
                <div className="opacity-80">Biliklər: React, TypeScript, Tailwind CSS, Node.js, REST API</div>
                <div className="opacity-80">Əlaqə: samir.aliyev@email.com | +994 50 123 45 67</div>

                <div className="my-4">
                  <div className="relative inline-block">
                    <span className="absolute -inset-1 bg-red-200/80 skew-x-[-15deg] transform"></span>
                    <span className="relative font-serif font-bold text-gray-900 text-xl leading-relaxed z-10 px-1">
                      {data.flaggedSnippet}
                    </span>
                  </div>
                </div>

                <div className="opacity-80">Haqqında: Məsuliyyətli, komandada işləməyi bacaran və innovativ həllər təklif edən mütəxəssis.</div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TextComparisonPage;
