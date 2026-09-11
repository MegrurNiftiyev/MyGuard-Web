import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, X, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AiMessage } from '../../types';
import { AiMessageRenderer } from '../assistant/AiMessageRenderer';
import { AiLinkBlock } from '../assistant/blocks/AiLinkBlock';
import { chatApi, ScreenDestination } from '../../api/chatApi';

export const FloatingAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AiMessage[]>([]);

  const suggestedQuestions = [
    'Son yüklənən sənədlərin statusu nədir?',
    'Yüksək riskli fayllar varmı?',
    'Bu gün neçə sənəd skan edilib?'
  ];

  const getScreenDestination = (pathname: string): ScreenDestination => {
    if (pathname === '/') return 'HOME_SCREEN';
    if (pathname.startsWith('/documents')) return 'DOCUMENTS_SCREEN';
    if (pathname.startsWith('/scan')) return 'SCAN_SCREEN';
    if (pathname.startsWith('/settings')) return 'SETTINGS_SCREEN';
    if (pathname.startsWith('/assistant')) return 'AI_SCREEN';
    return 'HOME_SCREEN';
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleCloseChat = () => setIsOpen(false);
    window.addEventListener('close-floating-chat', handleCloseChat);
    return () => window.removeEventListener('close-floating-chat', handleCloseChat);
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isThinking, isOpen]);

  // Hide floating AI button on home page (/) and dedicated assistant page (/assistant)
  if (location.pathname === '/' || location.pathname === '/assistant') {
    return null;
  }

  const handleSend = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery || input).trim();
    if (!query || isThinking) return;

    const userMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      blocks: [{ type: 'text', content: query }],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customQuery) setInput('');
    setIsThinking(true);

    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const newSession = await chatApi.createSession('Səhifə Tez Analizi');
        currentSessionId = newSession.id;
        setSessionId(newSession.id);
      }

      const screenDestination = getScreenDestination(location.pathname);

      const response = await chatApi.sendMessage({
        chatMode: 'SMALL_CHAT',
        screenDestination,
        message: query,
        sessionId: currentSessionId
      });

      if (response && response.blocks && response.blocks.length > 0) {
        setMessages((prev) => [...prev, response as unknown as AiMessage]);
      }
    } catch (err) {
      const fallbackAiMsg: AiMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        blocks: [
          {
            type: 'text',
            content: 'Soruşduğunuz mövzu üzrə sistem təhlükəsizlik qaydalarını qiymətləndirdi. Əlavə dəqiqləşdirmə üçün Əsas AI Asistent bölməsinə keçə bilərsiniz.'
          }
        ]
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="hidden md:flex fixed bottom-8 right-8 z-40 pointer-events-auto flex-col items-end">
      {/* Floating Quick Chat Popup Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[350px] h-[520px] max-h-[78vh] rounded-3xl bg-surface-container-lowest shadow-[0_16px_48px_rgba(0,102,255,0.16)] border border-outline-variant/70 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header matching main page AI panel */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-outline-variant/40 bg-surface-container-lowest/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-label-md font-bold text-on-surface leading-tight">MyGuard AI</h3>
                <p className="text-[11px] font-medium text-on-surface-variant leading-none">
                  Real-time analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/assistant');
                }}
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
                title="Tam ekran"
              >
                Tam ekran ➔
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer shrink-0 ml-1"
                title="Bağla"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="p-3.5 flex-1 overflow-y-auto space-y-3 bg-surface/50 text-xs custom-scrollbar flex flex-col justify-between">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center gap-3 text-center p-3 my-auto">
                <p className="text-xs font-semibold text-on-surface-variant mb-1">Tez-tez soruşulan suallar:</p>
                <div className="flex flex-col items-center gap-2.5 w-full max-w-[280px]">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSend(undefined, q)}
                      className="w-full px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/70 text-on-surface-variant hover:text-brand-blue text-xs font-semibold hover:bg-blue-50/50 hover:border-brand-blue/40 transition-all cursor-pointer shadow-2xs text-center"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col gap-1.5 w-full ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed max-w-[88%] ${
                        msg.sender === 'user'
                          ? 'bg-brand-blue text-white ml-auto font-medium rounded-tr-xs shadow-2xs'
                          : 'bg-white text-on-surface border border-outline-variant/60 shadow-2xs rounded-tl-xs'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        msg.blocks?.[0]?.content || (msg as any).text || ''
                      ) : (
                        <AiMessageRenderer 
                          message={{ ...msg, blocks: msg.blocks?.map(b => b.type === 'link' ? { ...b, type: 'link_content_only' as any } : b) || [] }} 
                          onTyping={scrollToBottom} 
                          onComplete={() => {
                            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isAnimationFinished: true } : m));
                          }}
                        />
                      )}
                    </div>

                    {/* Navigation Links Outside Box */}
                    {msg.sender === 'assistant' && msg.blocks?.some(b => b.type === 'link') && (msg.isAnimationFinished || msg.id === 'greeting') && (
                       <div className="w-[88%] px-1 animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
                         {msg.blocks.filter(b => b.type === 'link').map((b, i) => (
                            <div key={i} className="mb-2">
                               <AiLinkBlock url={b.url || '#'} label={b.label || ''} description={b.description} />
                            </div>
                         ))}
                       </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isThinking && (
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-outline-variant/60 text-brand-blue rounded-2xl rounded-tl-xs w-fit shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar Form */}
          <form onSubmit={handleSend} className="relative p-3 bg-white border-t border-outline-variant/60 shrink-0">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isThinking}
              placeholder={isThinking ? 'AI düşünür...' : t('askPlaceholder') || 'Sənəd təhlükəsizliyi haqqında soruşun...'}
              className="w-full bg-surface-container border border-outline-variant/80 rounded-full py-2.5 px-4 pr-10 text-xs text-on-surface focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-inner placeholder:text-on-surface-variant/60" 
            />
            <button 
              type="submit" 
              disabled={isThinking || !input.trim()}
              className="absolute right-5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-brand-blue hover:bg-surface-variant disabled:opacity-40 rounded-full transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) Circle with Breathing Pulse Animation */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-gradient-to-tr from-brand-blue via-brand-purple to-purple-400 text-white flex items-center justify-center animate-breathe cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200 shadow-xl"
        title="MyGuard AI Köməkçi"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
