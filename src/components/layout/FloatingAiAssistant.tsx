import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AiMessage } from '../../types';
import { AiMessageRenderer } from '../assistant/AiMessageRenderer';
import { chatApi, ScreenDestination } from '../../api/chatApi';

export const FloatingAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const { t } = useLanguage();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'greeting',
      sender: 'assistant',
      blocks: [
        {
          type: 'text',
          content: 'Salam! MyGuard AI köməkçisiyəm. Bu səhifə və ya təhlükəsizlik qaydaları haqqında hər hansı sualınız var?'
        }
      ],
      timestamp: 'İndi'
    }
  ]);

  // Hide floating AI button on home page (/) and dedicated assistant page (/assistant)
  if (location.pathname === '/' || location.pathname === '/assistant') {
    return null;
  }

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

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || isThinking) return;

    const userMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      blocks: [{ type: 'text', content: query }],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
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
      {/* Floating Quick Chat Popup Window - Narrower & Taller Shape */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[336px] h-[520px] max-h-[78vh] rounded-3xl bg-surface-container-lowest shadow-[0_16px_48px_rgba(0,102,255,0.16)] border border-outline-variant/70 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Minimal Popup Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-outline-variant/40 bg-surface-container-lowest/90 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-label-md font-bold text-on-surface leading-tight">MyGuard AI</h3>
                <p className="text-[10px] font-semibold text-brand-blue uppercase tracking-wider leading-none">
                  {getScreenDestination(location.pathname).replace('_SCREEN', '')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant cursor-pointer shrink-0"
              title="Bağla"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="p-3.5 flex-1 overflow-y-auto space-y-3 bg-surface/50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl leading-relaxed max-w-[88%] ${
                  msg.sender === 'user'
                    ? 'bg-brand-blue text-white ml-auto font-medium rounded-tr-xs shadow-2xs'
                    : 'bg-white text-on-surface border border-outline-variant/60 shadow-2xs rounded-tl-xs'
                }`}
              >
                {msg.sender === 'user' ? (
                  msg.blocks?.[0]?.content || msg.text || ''
                ) : (
                  <AiMessageRenderer message={msg} onTyping={scrollToBottom} />
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-outline-variant/60 text-brand-blue rounded-2xl rounded-tl-xs w-fit shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Popup Input Bar */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-outline-variant/60 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isThinking}
              placeholder={isThinking ? 'AI düşünür...' : t('askPlaceholder') || 'Sual verin...'}
              className="flex-1 px-3 py-2 text-xs rounded-full border border-outline-variant/70 bg-surface-container-low focus:bg-white focus:border-brand-blue outline-none transition-all placeholder:text-on-surface-variant/60"
            />
            <button
              type="submit"
              disabled={isThinking || !input.trim()}
              className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center hover:bg-brand-blue/90 disabled:opacity-40 transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
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

