import React, { useState, useRef, useEffect } from 'react';
import { FileText, Send, Sparkles, Plus, X, UploadCloud, Mic, CheckCircle2, FileCode } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AiMessageWrapper } from '../components/assistant/AiMessageWrapper';
import { AiMessageRenderer } from '../components/assistant/AiMessageRenderer';
import { mockAiMessages } from '../data/mockData';
import { AiMessage, MessageBlock } from '../types';

interface AttachedFile {
  id: string;
  name: string;
  size: string;
  typeLabel: string;
  status: 'uploading' | 'completed';
  progress: number;
}

export const AssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>(mockAiMessages);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
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

  // Track user manual scroll up/down
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Distance from bottom of the page
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      // If user scrolls up away from bottom (> 120px), pause auto-scroll
      if (distanceFromBottom > 120) {
        userScrolledUp.current = true;
      } else {
        // If user scrolls back to bottom, resume auto-scroll
        userScrolledUp.current = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  // Progressive auto-scroll function
  const scrollToBottom = () => {
    if (!userScrolledUp.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom when messages or isThinking changes
  useEffect(() => {
    scrollToBottom();

    // While blocks mount and animate, progressively auto-scroll for 2 seconds
    const interval = setInterval(() => {
      if (!userScrolledUp.current) {
        scrollToBottom();
      } else {
        clearInterval(interval);
      }
    }, 200);

    const timeout = setTimeout(() => clearInterval(interval), 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [messages, isThinking]);

  // Helper to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Process files dropped or selected
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

    // Simulate progress animation for each file
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

  // Drag & Drop Window Handlers
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

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() && attachedFiles.length === 0) return;

    userScrolledUp.current = false;

    const userBlocks: MessageBlock[] = [];
    
    // Add attached files as file blocks in user message if any
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

    setTimeout(() => {
      const mockResponse = mockAiMessages.find((m) => m.sender === 'assistant');
      const aiResponse: AiMessage = {
        ...mockResponse!,
        id: `msg-${Date.now() + 1}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative max-w-4xl mx-auto space-y-6 min-h-[80vh]"
    >
      {/* Full-Screen Drag & Drop Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-surface-container-lowest/85 backdrop-blur-md flex flex-col items-center justify-center p-6 transition-all duration-300 animate-in fade-in zoom-in-95 pointer-events-none">
          <div className="w-full max-w-xl p-10 border-2 border-dashed border-brand-blue/70 rounded-3xl bg-surface/95 flex flex-col items-center justify-center text-center space-y-5 shadow-2xl">
            {/* Stacked floating icons */}
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

            <div className="pt-2">
              <span className="text-xs text-on-surface-variant/70 font-mono">PDF, DOCX, HTML, TXT, PNG, JPG...</span>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />

      {/* Empty State / Chat Stream */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in-95 duration-300">
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
        <div className="space-y-6 min-h-[420px] pb-36">
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
                    {!msg.blocks && <p>{msg.text}</p>}
                  </div>
                </div>
              ) : (
                <AiMessageWrapper timestamp={msg.timestamp}>
                  <AiMessageRenderer message={msg} />
                </AiMessageWrapper>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      )}

      {/* Standalone Input Box Wrapper */}
      <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[850px] px-4 z-40 flex flex-col items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className={`w-full flex-shrink-0 bg-surface-container-lowest/85 backdrop-blur-xl border transition-all shadow-md rounded-[28px] p-2.5 ${
            isThinking ? 'animate-breathe border-brand-blue/50' : 'border-outline-variant/70'
          }`}
        >
          {/* Attached Files Carousel/Row */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto px-2 pt-1 pb-2 mb-1 border-b border-outline-variant/30 scrollbar-none">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="relative group flex items-center gap-3 px-3 py-2 rounded-2xl border border-outline-variant/60 bg-surface-container/60 hover:bg-surface-container-high/60 transition-all shrink-0 min-w-[160px]"
                >
                  {/* Progress Spinner / Status Icon */}
                  {file.status === 'uploading' ? (
                    <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 animate-spin text-brand-blue" viewBox="0 0 24 24">
                        <circle
                          className="opacity-20"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                        />
                        <path
                          className="opacity-90"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/50">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}

                  {/* File Meta Info */}
                  <div className="flex flex-col text-left overflow-hidden pr-1">
                    <span className="text-xs font-semibold text-on-surface truncate max-w-[120px] leading-snug">
                      {file.name}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/80 font-medium leading-none mt-0.5">
                      {file.status === 'uploading' ? `File (${file.progress}%)` : file.typeLabel}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="ml-auto p-1 text-on-surface-variant/60 hover:text-error hover:bg-error-container/30 rounded-full transition-colors shrink-0"
                    title="Sil"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Controls Bar */}
          <div className="flex items-center gap-2 px-2">
            {/* Plus / Attach Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full hover:bg-surface-container-high/70 text-on-surface-variant flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="Fayl əlavə et"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Main Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isThinking}
              placeholder={
                isThinking
                  ? 'MyGov AI analiz edir...'
                  : attachedFiles.length > 0
                  ? 'Ask anything about attached files...'
                  : 'Sənəd təhlükəsizliyi haqqında istənilən sualı verin...'
              }
              className="flex-1 py-3 px-2 bg-transparent text-body-md text-on-surface focus:outline-none placeholder:text-on-surface-variant/60"
            />

            {/* Mic / Voice Option */}
            <button
              type="button"
              className="w-10 h-10 rounded-full hover:bg-surface-container-high/70 text-on-surface-variant flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="Səsli daxiletmə"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send Button */}
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

