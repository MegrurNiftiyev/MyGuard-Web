import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, ArrowRight, Send, Sparkles, FileCode, Eye, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useLanguage } from '../context/LanguageContext';
import { AiMessage, DocumentItem, RiskStatus } from '../types';
import { Chip } from '../components/ui/Chip';
import { documentsApi } from '../api/documentsApi';
import { chatApi } from '../api/chatApi';
import { formatUploadDate } from '../utils/dateFormatter';
import { AiMessageRenderer } from '../components/assistant/AiMessageRenderer';

const decodeFileName = (text: string) => {
  if (!text) return text;
  try {
    return decodeURIComponent(escape(text));
  } catch {
    return text;
  }
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [aiInput, setAiInput] = useState('');
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; docId: string; docName: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, docId: string, docName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      docId,
      docName,
    });
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    documentsApi.deleteDocument(docId).catch((err) => {
      console.warn('Background delete error:', err);
    });
  };

  useEffect(() => {
    const fetchRecentDocs = async () => {
      setIsLoadingDocs(true);
      try {
        const res = await documentsApi.getDocuments();
        if (res && res.length > 0) {
          const sorted = [...res].sort((a, b) => {
            const timeA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
            const timeB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
            return timeB - timeA;
          });

          const mapped: DocumentItem[] = sorted.map((d) => ({
            id: d.id,
            name: d.fileName || 'Sənəd.pdf',
            fileType: d.fileType?.toUpperCase() || 'PDF',
            size: d.fileSizeBytes ? `${(d.fileSizeBytes / 1024).toFixed(1)} KB` : '1.2 MB',
            uploadTime: formatUploadDate(d.uploadedAt),
            riskScore: d.finalRiskScore || 0,
            status: (d.finalStatus as RiskStatus) || 'safe',
            ocrPdfMatch: 95,
            hiddenTextDetected: !!d.isContainInjection,
            promptInjectionProb: d.finalRiskScore || 0,
            department: 'Təhlükəsizlik',
            flaggedCount: d.isContainInjection ? 1 : 0,
            category: 'Sənəd Analizi'
          }));
          setDocuments(mapped);
        } else {
          setDocuments([]);
        }
      } catch (err) {
        console.warn('Live recent docs fetch error:', err);
        setDocuments([]);
      } finally {
        setIsLoadingDocs(false);
      }
    };
    fetchRecentDocs();
  }, []);

  const processFile = async (file: File) => {
    setIsUploading(true);
    try {
      const res = await documentsApi.uploadDocument(file);
      const docId = res.document?.id || `doc-${Date.now()}`;
      navigate(`/scan?docId=${docId}&name=${encodeURIComponent(file.name)}`);
    } catch (err) {
      console.warn('Live upload failed:', err);
      navigate(`/scan?name=${encodeURIComponent(file.name)}`);
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
  }, []);

  const scrollToBottomChat = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottomChat();
  }, [messages, isAiThinking]);

  const handleAiChatSubmit = async (queryOverride?: string) => {
    const text = queryOverride || aiInput;
    if (!text.trim() || isAiThinking) return;

    const userMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      blocks: [{ type: 'text', content: text }],
      timestamp: 'İndi'
    };
    
    setMessages(prev => [...prev, userMsg]);
    if (!queryOverride) setAiInput('');
    setIsAiThinking(true);

    try {
      const liveRes = await chatApi.sendMessage({
        chatMode: 'SMALL_CHAT',
        screenDestination: 'HOME_SCREEN',
        message: text
      });
      if (liveRes && liveRes.blocks && liveRes.blocks.length > 0) {
        setMessages(prev => [...prev, liveRes as unknown as AiMessage]);
      }
    } catch (err: any) {
      console.warn('Live chat response error on dashboard:', err);
      const errorMsg: AiMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'İndi',
        blocks: [{ type: 'text', content: 'AI xidməti ilə əlaqə qurularkən xəta baş verdi.' }]
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const suggestedQuestions = [
    'Son yüklənən sənədlərin statusu nədir?',
    'Yüksək riskli fayllar varmı?',
    'Bu gün neçə sənəd skan edilib?'
  ];

  return (
    <div className="flex flex-col gap-10 w-full pt-6 md:pt-8 pb-8 min-h-screen relative">
      {isDragging && createPortal(
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
                Analiz etmək üçün istənilən faylı bura sürükləyib buraxa bilərsiniz
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Top Row: Upload & AI Panel */}
      <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
        
        {/* Left: Upload Card */}
        <div className="flex-1 min-w-0 w-full">
          <Card padding="lg" className="flex flex-col gap-6 shadow-l1">
            <div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2">{t('uploadTitle')}</h2>
              <p className="text-body-md text-on-surface-variant">{t('uploadSubtitle')}</p>
            </div>
          
            <label
              htmlFor="file-upload"
              className="border-2 border-dashed border-outline-variant rounded-2xl bg-surface-bright flex flex-col items-center justify-center py-14 px-6 text-center hover:border-brand-blue hover:bg-surface-variant/20 transition-all cursor-pointer group"
            >
              <input id="file-upload" type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} disabled={isUploading} />
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-brand-blue/30 flex items-center justify-center text-brand-blue shadow-md mb-4 group-hover:scale-110 group-hover:bg-blue-100 group-hover:border-brand-blue group-hover:animate-pulse transition-all duration-300">
                <UploadCloud className="w-8 h-8 text-brand-blue" />
              </div>
              <p className="text-title-lg font-medium text-on-surface mb-1">{isUploading ? 'Fayl yüklənir...' : t('dragDropText')}</p>
              <p className="text-body-md text-on-surface-variant mb-6">{t('maxSize')}</p>
              <Button variant="primary" size="md" className="shadow-sm pointer-events-none" disabled={isUploading}>
                {t('selectFile')}
              </Button>
            </label>
          </Card>
        </div>

        {/* Right: Fixed-Height AI Panel with Internal Scrollbar (Hidden on Mobile) */}
        <div className="hidden md:block w-full lg:w-[420px] shrink-0 h-[490px]">
          <aside className="w-full h-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-[0_8px_32px_rgba(0,102,255,0.08)] flex flex-col overflow-hidden p-5">
            {/* AI Widget Header */}
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/50 shrink-0 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shadow-sm shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-title-md font-bold text-on-surface">MyGuard AI</h3>
                  <p className="text-[11px] text-on-surface-variant font-medium">Real-time analysis</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/assistant')}
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                Tam ekran ➔
              </button>
            </div>
            
            {/* Scrollable Internal Message Body */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center gap-2 text-center p-2">
                  <p className="text-xs font-semibold text-on-surface-variant mb-2">Tez-tez soruşulan suallar:</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleAiChatSubmit(q)}
                        className="px-3.5 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/70 text-on-surface-variant hover:text-brand-blue text-xs font-semibold hover:bg-blue-50/50 hover:border-brand-blue/40 transition-all cursor-pointer shadow-2xs text-center"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="flex flex-col gap-1 w-full">
                    {msg.sender === 'user' ? (
                      <div className="bg-brand-blue text-white p-3 rounded-2xl text-xs font-semibold self-end max-w-[85%] shadow-xs rounded-tr-xs">
                        {msg.blocks?.[0]?.content || (msg as any).text || ''}
                      </div>
                    ) : (
                      <div className="bg-surface-container-low border border-outline-variant/50 text-on-surface p-3 rounded-2xl rounded-tl-xs text-xs leading-relaxed max-w-[92%] shadow-2xs self-start">
                        <AiMessageRenderer message={msg} onTyping={scrollToBottomChat} />
                      </div>
                    )}
                  </div>
                ))
              )}

              {isAiThinking && (
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-surface-container-low border border-outline-variant/50 text-brand-blue rounded-2xl rounded-tl-xs w-fit shadow-2xs self-start">
                  <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce"></span>
                </div>
              )}
            </div>
            
            {/* Input Bar Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleAiChatSubmit(); }} className="relative mt-3 shrink-0">
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/80 rounded-full py-2.5 px-4 pr-10 text-xs text-on-surface focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-inner" 
                placeholder={t('askPlaceholder')}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-brand-blue hover:bg-surface-variant rounded-full transition-colors cursor-pointer">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </aside>
        </div>
      </div>

      {/* Bottom Row: Recent Documents */}
      <div className="w-full">
        <Card padding="lg" className="flex flex-col gap-6 shadow-l1">
          <div className="flex justify-between items-center">
            <h3 className="text-title-lg font-medium text-on-surface">{t('recentDocs')}</h3>
            <button onClick={() => navigate('/documents')} className="text-brand-blue text-label-md hover:underline flex items-center gap-1 cursor-pointer">
              {t('viewAll')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          {isLoadingDocs ? (
            <TableSkeleton rows={3} />
          ) : documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Skan edilmiş sənəd yoxdur"
              description="Hal-hazırda hər hansı skan edilmiş sənəd tapılmadı."
              primaryActionLabel="Yeni Sənəd Skan Et"
              onPrimaryAction={() => navigate('/scan')}
            />
          ) : (
            <div className="flex flex-col border border-outline-variant/60 rounded-xl overflow-hidden bg-surface-container-lowest">
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-surface-container-low border-b border-outline-variant text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                <div className="col-span-6">Sənəd Adı</div>
                <div className="col-span-4">Yüklənmə Tarixi</div>
                <div className="col-span-2 text-right">Risk Balı</div>
              </div>
              
              <div className="divide-y divide-outline-variant/60">
                {documents.slice(0, 5).map((doc) => (
                  <div 
                    key={doc.id} 
                    onClick={() => navigate(`/analysis/${doc.id}`)} 
                    onContextMenu={(e) => handleContextMenu(e, doc.id, doc.name || (doc as any).fileName || '')}
                    className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 sm:px-6 py-4 items-start md:items-center hover:bg-surface-container-low transition-colors cursor-pointer group relative"
                  >
                    {/* Column 1: Document */}
                    <div className="w-full md:col-span-6 flex items-center justify-between md:justify-start gap-3.5 min-w-0">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-on-surface-variant group-hover:text-brand-blue transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-title-lg font-medium text-on-surface truncate group-hover:text-brand-blue transition-colors font-sans" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                            {decodeFileName(doc.name || (doc as any).fileName)}
                          </div>
                          <div className="text-label-sm text-on-surface-variant/70">
                            {doc.fileType} • {doc.size}
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile-only risk score */}
                      <div className="flex md:hidden flex-col items-end shrink-0">
                         {doc.riskScore !== undefined && doc.riskScore !== null && (
                           <span className={`font-semibold text-xs ${doc.riskScore >= 70 ? 'text-error' : doc.riskScore >= 40 ? 'text-warning' : 'text-emerald-600'}`}>
                             {doc.riskScore}/100
                           </span>
                         )}
                      </div>
                    </div>

                    {/* Column 2: Upload Time (Desktop) */}
                    <div className="hidden md:block col-span-4 text-label-md text-on-surface-variant">
                      <div className="font-semibold text-on-surface truncate">{doc.uploadTime}</div>
                    </div>

                    {/* Mobile-only additional details row */}
                    <div className="flex md:hidden items-center gap-3 text-xs text-on-surface-variant/80 pl-[54px] w-full mt-1">
                      <span>{doc.uploadTime}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>

                    {/* Column 3: Risk Score /100 (Desktop) */}
                    <div className="hidden md:flex col-span-2 items-center justify-end gap-2">
                      {doc.riskScore !== undefined && doc.riskScore !== null ? (
                        <span className={`font-semibold ${doc.riskScore >= 70 ? 'text-error border-l-4 border-error pl-2' : doc.riskScore >= 40 ? 'text-warning border-l-4 border-warning pl-2' : 'text-emerald-600 border-l-4 border-emerald-500 pl-2'}`}>
                          {doc.riskScore}/100
                        </span>
                      ) : (
                        <span className="text-on-surface-variant font-semibold">-</span>
                      )}
                      <ArrowRight className="w-4 h-4 text-on-surface-variant ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Floating Custom Right-Click Context Menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-[100] pointer-events-auto"
          onClick={() => setContextMenu(null)}
          onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}
        >
          <div
            className="fixed z-[101] bg-white/95 backdrop-blur-md border border-outline-variant/80 rounded-2xl shadow-xl p-1.5 min-w-[190px] animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${Math.max(10, Math.min(contextMenu.x, window.innerWidth - 200))}px`,
              top: `${Math.max(10, Math.min(contextMenu.y, window.innerHeight - 130))}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1.5 text-[11px] font-bold text-brand-blue uppercase tracking-wider border-b border-outline-variant/40 mb-1 select-none">
              {t('docActionsTitle') || 'Əməliyyatlar'}
            </div>

            <button
              type="button"
              onClick={() => {
                navigate(`/analysis/${contextMenu.docId}`);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-brand-blue" />
              <span>{t('viewDocument') || 'Sənədə bax'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleDeleteDocument(contextMenu.docId);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-error hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-error" />
              <span>{t('deleteDocument') || 'Sil'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
