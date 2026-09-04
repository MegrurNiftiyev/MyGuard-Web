import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Send, Sparkles, Plus, X, CheckCircle2, FileCode } from 'lucide-react';
import { AiMessageWrapper } from '../components/assistant/AiMessageWrapper';
import { AiMessageRenderer } from '../components/assistant/AiMessageRenderer';
import { AiMessage, MessageBlock } from '../types';
import { chatApi } from '../api/chatApi';

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  typeLabel: string;
  status: 'uploading' | 'completed';
  progress: number;
  fileObj?: File;
  extractedText?: string;
}

const THINKING_STEPS = [
  'MyGuard AI sənəd və mətn strukturlarını analiz edir...',
  'Prompt injection və şübhəli fraqmentlər yoxlanılır...',
  'Layer 1 OCR və PDF daxili qat fərqlilikləri müqayisə olunur...',
  'Layer 2 ML classifier təhlükəsizlik qaydalarını qiymətləndirir...',
  'Layer 3 LLM tərəfindən yekun təhlükəsizlik hesabatı hazırlanır...'
];

export const ThinkingIndicator: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setStepIndex((prev) => (prev + 1) % THINKING_STEPS.length);
        setFade(true);
      }, 250);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3.5 w-full my-3.5">
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <span className="absolute w-7 h-7 rounded-full bg-brand-blue/20 animate-ping"></span>
        <span className="absolute w-8 h-8 rounded-full bg-brand-purple/15 animate-breathe"></span>
        <div className="w-8 h-8 rounded-full bg-blue-50 border border-brand-blue/30 text-brand-blue flex items-center justify-center shadow-xs z-10">
          <Sparkles className="w-4 h-4 text-brand-blue animate-icon-breathe" />
        </div>
      </div>
      <span className={`text-sm font-medium text-on-surface transition-opacity duration-300 mt-1.5 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {THINKING_STEPS[stepIndex]}
      </span>
    </div>
  );
};

// Global state to persist chat history and session across route changes without a Context provider
let globalMessages: AiMessage[] = [];
let globalSessionId: string | undefined = undefined;

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>(globalMessages);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(globalSessionId);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state to global variables so they persist when unmounting (navigating away)
  useEffect(() => {
    globalMessages = messages;
  }, [messages]);

  useEffect(() => {
    globalSessionId = sessionId;
  }, [sessionId]);

  const suggestedQuestions = [
    'Sənədin risk dərəcəsi nədir?',
    'Məlumat sızıntısı varmı?',
    'Zərərli kod aşkar edilib?',
    'Prompt injection riski',
    'Şəxsi məlumatlar varmı?',
    'Sənədi kim yaradıb?',
    'Təhlükəsizlik qaydalarına uyğundurmu?',
    'Sənədin xülasəsini ver'
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef<boolean>(false);

  const scrollToBottom = () => {
    if (!userScrolledUp.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleMessageComplete = (messageId: string) => {
    setMessages((prev) => {
      const updated = prev.map((msg) =>
        msg.id === messageId ? { ...msg, isAnimationFinished: true } : msg
      );
      globalMessages = updated;
      return updated;
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

const extractCleanTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (['txt', 'json', 'csv', 'md', 'html', 'xml', 'log', 'js', 'ts', 'py', 'css'].includes(ext)) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result || file.name);
      };
      reader.onerror = () => resolve(file.name);
      reader.readAsText(file);
    });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) {
        resolve(file.name);
        return;
      }

      const decoder = new TextDecoder('utf-8', { fatal: false });
      const rawText = decoder.decode(buffer);

      const cleanTokens = rawText
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
        .replace(/<xml[\s\S]*?>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 1 && !/^[\x00-\x1F\x7F-\xFF]+$/.test(word) && /[\p{L}\p{N}]/u.test(word));

      const extracted = cleanTokens.join(' ').trim();
      
      if (extracted.length > 20) {
        resolve(extracted);
      } else {
        resolve(`${file.name} sənədinin daxili mətni (Ölçü: ${(file.size / 1024).toFixed(1)} KB)`);
      }
    };
    reader.onerror = () => resolve(file.name);
    reader.readAsArrayBuffer(file);
  });
};

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const addFiles = (files: FileList | File[]) => {
    const newItems: AttachedFile[] = Array.from(files).map((file) => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: file.name,
        size: formatFileSize(file.size),
        typeLabel: ext === 'HTML' || ext === 'PDF' || ext === 'DOCX' ? `${ext} File` : 'File',
        status: 'uploading',
        progress: 15,
        fileObj: file
      };
    });

    setAttachedFiles((prev) => [...prev, ...newItems]);

    newItems.forEach((item) => {
      if (item.fileObj) {
        extractCleanTextFromFile(item.fileObj).then((cleanText) => {
          setAttachedFiles(prev => prev.map(f => f.id === item.id ? { ...f, extractedText: cleanText } : f));
        });
      }

      let currentProgress = 15;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 25) + 15;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setAttachedFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, progress: 100, status: 'completed' } : f))
          );
        } else {
          setAttachedFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, progress: currentProgress } : f))
          );
        }
      }, 250);
    });
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
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

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
        e.dataTransfer.clearData();
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() && attachedFiles.length === 0) return;

    userScrolledUp.current = false;
    const userBlocks: MessageBlock[] = [];
    
    let firstAttachedDoc: { fileName: string; text: string } | undefined = undefined;

    if (attachedFiles.length > 0) {
      attachedFiles.forEach((file) => {
        userBlocks.push({
          type: 'file',
          name: file.name,
          sizeLabel: file.size,
          url: '#'
        });
        
        if (file.extractedText && !firstAttachedDoc) {
          firstAttachedDoc = {
            fileName: file.name,
            text: file.extractedText
          };
        }
      });
    }

    if (query.trim()) {
      userBlocks.push({ type: 'text', content: query });
    }

    const userMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      blocks: userBlocks
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setAttachedFiles([]);
    setIsThinking(true);

    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const newSession = await chatApi.createSession('Sənəd Təhlükəsizliyi və Risk Analizi');
        currentSessionId = newSession.id;
        setSessionId(newSession.id);
      }

      const filesArray = attachedFiles.map((f) => ({
        name: f.name,
        content: (f.extractedText && f.extractedText.trim().length > 0)
          ? f.extractedText
          : `${f.name} sənədinin mətni analiz üçün ötürülmüşdür.`
      }));

      const firstAttachedDoc = attachedFiles.length > 0 ? {
        fileName: attachedFiles[0].name,
        text: attachedFiles[0].extractedText || attachedFiles[0].name
      } : undefined;

      const response = await chatApi.sendMessage({
        chatMode: 'LARGE_CHAT',
        screenDestination: 'AI_SCREEN',
        message: query || 'Qoşulmuş sənədləri analiz et',
        userMessage: query || 'Qoşulmuş sənədləri analiz et',
        sessionId: currentSessionId,
        files: filesArray.length > 0 ? filesArray : undefined,
        attachedDocument: firstAttachedDoc
      });

      if (response && response.blocks && response.blocks.length > 0) {
        setMessages((prev) => [...prev, response as unknown as AiMessage]);
      }
    } catch (err: any) {
      console.warn('Live chat request failed:', err);
      const errorMsg: AiMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        blocks: [
          {
            type: 'callout',
            title: 'Təhlükəsizlik Servisi Əlaqə Xətası',
            content: err.message || 'AI xidməti ilə əlaqə qurularkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.',
            tone: 'danger'
          }
        ]
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto flex flex-col min-h-[calc(100dvh-10rem)] pb-48 relative"
    >
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
            {attachedFiles.length > 0 && (
              <span className="text-label-sm font-semibold text-brand-blue bg-blue-50 px-3 py-1 rounded-full border border-brand-blue/30">
                {attachedFiles.length} fayl əlavə edilib
              </span>
            )}
            <div className="space-y-1">
              <h3 className="text-title-lg font-bold text-on-surface tracking-tight">Add anything</h3>
              <p className="text-body-md text-on-surface-variant">
                Drop any file here to add it to the conversation
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />

      {/* Main Messages Body */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center my-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 py-12">
          <div className="w-20 h-20 rounded-3xl bg-blue-100 text-brand-blue flex items-center justify-center shadow-sm">
            <Sparkles className="w-10 h-10" />
          </div>
          <div className="text-title-lg font-medium text-on-surface-variant text-center max-w-md">
            Sənəd təhlükəsizliyi barədə sualınızı verin və ya aşağıdakılardan birini seçin:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-3xl mt-4">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="px-5 py-2.5 rounded-full bg-surface border border-outline-variant text-on-surface-variant hover:text-brand-blue text-sm font-semibold hover:bg-blue-50/50 hover:border-brand-blue/30 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full space-y-6 pb-4 pt-4">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              {msg.sender === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-brand-blue text-white px-5 py-3 rounded-2xl max-w-lg text-body-md shadow-xs space-y-2">
                    {msg.blocks && msg.blocks.map((block, idx) => (
                      <div key={idx}>
                        {block.type === 'file' && (
                          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/20 mb-1">
                            <FileText className="w-5 h-5 text-white/90" />
                            <div className="text-left">
                              <p className="text-xs font-bold text-white truncate max-w-[180px]">{block.name}</p>
                              <p className="text-[10px] text-white/70">{block.sizeLabel}</p>
                            </div>
                          </div>
                        )}
                        {block.type === 'text' && <p>{block.content}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <AiMessageWrapper timestamp={msg.timestamp} isAnimating={!msg.isAnimationFinished}>
                  <div className="text-body-md w-full">
                    <AiMessageRenderer
                      message={msg}
                      onTyping={scrollToBottom}
                      onComplete={() => handleMessageComplete(msg.id)}
                    />
                  </div>
                </AiMessageWrapper>
              )}
            </div>
          ))}

          {isThinking && <ThinkingIndicator />}

          {/* Spacer to push the scroll target above the floating input bar */}
          <div className="h-40 pointer-events-none" />
          <div ref={messagesEndRef} className="h-1" />
        </div>
      )}

      {/* Floating Pinned AI Input Box - Portaled to avoid stacking context issues */}
      {createPortal(
        <div className="fixed bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-3 md:px-0 md:ml-10 z-[60] flex justify-center pointer-events-none">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="w-full pointer-events-auto bg-white/95 backdrop-blur-2xl border border-outline-variant/80 rounded-3xl p-3 shadow-[0_16px_48px_rgba(0,102,255,0.2)] space-y-2 transition-all"
          >
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-2 pt-1 border-b border-outline-variant/50 pb-2">
                {attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant text-xs shadow-2xs group relative"
                  >
                    {file.status === 'uploading' ? (
                      <div className="w-5 h-5 flex items-center justify-center text-brand-blue shrink-0">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="flex flex-col text-left overflow-hidden pr-1">
                      <span className="text-xs font-semibold text-on-surface truncate max-w-[120px] leading-snug">
                        {file.name}
                      </span>
                      <span className="text-[9px] text-on-surface-variant/80 font-medium leading-none mt-0.5">
                        {file.status === 'uploading' ? `(${file.progress}%)` : file.typeLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="ml-auto p-1 text-on-surface-variant/60 hover:text-error hover:bg-error-container/30 rounded-full transition-colors shrink-0"
                      title="Sil"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-surface-container-high/70 text-on-surface-variant flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isThinking}
                placeholder={
                  isThinking
                    ? 'AI analiz edir...'
                    : attachedFiles.length > 0
                    ? 'Fayllar barədə soruş...'
                    : 'Təhlükəsizlik barədə soruş...'
                }
                className="flex-1 min-w-0 py-2 sm:py-3 px-1 sm:px-2 bg-transparent text-sm sm:text-body-md text-on-surface focus:outline-none placeholder:text-on-surface-variant/60"
              />

              <button
                type="submit"
                disabled={isThinking || (!input.trim() && attachedFiles.length === 0)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-blue text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:hover:scale-100 shrink-0"
              >
                {isThinking ? (
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                ) : (
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                )}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AssistantPage;
