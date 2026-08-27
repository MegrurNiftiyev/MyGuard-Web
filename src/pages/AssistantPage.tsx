import React, { useState, useRef, useEffect } from 'react';
import { FileText, Send, Sparkles, Plus, X, Mic, CheckCircle2, FileCode } from 'lucide-react';
import { AiMessageWrapper } from '../components/assistant/AiMessageWrapper';
import { AiMessageRenderer } from '../components/assistant/AiMessageRenderer';
import { mockAiMessages } from '../data/mockData';
import { AiMessage, MessageBlock } from '../types';
import { chatApi } from '../api/chatApi';

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  typeLabel: string;
  status: 'uploading' | 'completed';
  progress: number;
}

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const initChatSession = async () => {
      try {
        const session = await chatApi.createSession('Sənəd Təhlükəsizliyi və Risk Analizi');
        if (session && session.id) {
          setSessionId(session.id);
          const history = await chatApi.getHistory(session.id);
          if (history && history.length > 0) {
            setMessages(history as unknown as AiMessage[]);
          }
        }
      } catch (err) {
        console.warn('Chat session init fallback:', err);
      }
    };
    initChatSession();
  }, []);

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    if (!userScrolledUp.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

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
        progress: 15
      };
    });

    setAttachedFiles((prev) => [...prev, ...newItems]);

    newItems.forEach((item) => {
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

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

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
    
    if (attachedFiles.length > 0) {
      attachedFiles.forEach((file) => {
        userBlocks.push({
          type: 'file',
          name: file.name,
          sizeLabel: file.size,
          url: '#'
        });
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
      const response = await chatApi.sendMessage({
        chatMode: 'LARGE_CHAT',
        screenDestination: 'AI_SCREEN',
        message: query,
        sessionId
      });

      if (response && response.blocks) {
        setIsThinking(false);
        setMessages((prev) => [...prev, response as unknown as AiMessage]);
        return;
      }
    } catch (err) {
      console.warn('Live chat response failed, using dynamic local AI fallback:', err);
    }

    // Fallback streaming AI response
    setTimeout(() => {
      const mockResponse = mockAiMessages.find((m) => m.sender === 'assistant');
      const allBlocks = mockResponse?.blocks || [];

      if (allBlocks.length === 0) {
        setIsThinking(false);
        return;
      }

      const aiMessageId = `msg-${Date.now() + 1}`;
      const initialAiMsg: AiMessage = {
        id: aiMessageId,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        blocks: [allBlocks[0]]
      };

      setMessages((prev) => [...prev, initialAiMsg]);
      setIsThinking(false);
    }, 1000);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh-10rem)] pb-48 relative"
    >
      {isDragging && (
        <div className="fixed inset-0 z-[60] bg-surface-container-lowest/85 backdrop-blur-md flex flex-col items-center justify-center p-6 transition-all duration-300 animate-in fade-in zoom-in-95 pointer-events-none">
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
        </div>
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
        <div className="flex-1 space-y-6 pb-48 pt-4">
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
                <AiMessageWrapper timestamp={msg.timestamp}>
                  <AiMessageRenderer message={msg} />
                </AiMessageWrapper>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/60 max-w-md animate-pulse shadow-xs">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-brand-blue shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">
                MyGuard AI analiz edir və hesabat hazırlayır...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Floating Pinned AI Input Box - Fixed floating at bottom of screen above all contents */}
      <div className="fixed bottom-6 left-4 right-4 md:left-24 md:right-8 z-50 flex justify-center pointer-events-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="w-full max-w-4xl pointer-events-auto bg-white/95 backdrop-blur-2xl border border-outline-variant/80 rounded-3xl p-3 shadow-[0_16px_48px_rgba(0,102,255,0.2)] space-y-2 transition-all"
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

          <div className="flex items-center gap-2 px-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full hover:bg-surface-container-high/70 text-on-surface-variant flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isThinking}
              placeholder={
                isThinking
                  ? 'MyGuard AI analiz edir...'
                  : attachedFiles.length > 0
                  ? 'Əlavə edilmiş fayllar haqqında soruşun...'
                  : 'Sənəd təhlükəsizliyi haqqında istənilən sualı verin...'
              }
              className="flex-1 py-3 px-2 bg-transparent text-body-md text-on-surface focus:outline-none placeholder:text-on-surface-variant/60"
            />

            <button
              type="button"
              className="w-10 h-10 rounded-full hover:bg-surface-container-high/70 text-on-surface-variant flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={isThinking || (!input.trim() && attachedFiles.length === 0)}
              className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:hover:scale-100 shrink-0"
            >
              {isThinking ? (
                <Sparkles className="w-5 h-5 animate-pulse" />
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssistantPage;
