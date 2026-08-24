import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, ChevronDown, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { AiMessage } from '../../types';
import { mockAiMessages } from '../../data/mockData';
import { AiMessageRenderer } from '../assistant/AiMessageRenderer';

export const FloatingAiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { t } = useLanguage();

  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 'greeting',
      sender: 'assistant',
      blocks: [{ type: 'text', content: 'Salam! Mən MyGuard AI Təhlükəsizlik Köməkçisiyəm. Bu səhifə və ya yüklənmiş sənədlər haqqında hər hansı sualınız varsa, mənə müraciət edin.' }],
      timestamp: 'İndi'
    }
  ]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const userMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      blocks: [{ type: 'text', content: userText }],
      timestamp: 'İndi'
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const mockResponse = mockAiMessages.find(m => m.sender === 'assistant');
      const aiResponse: AiMessage = {
        ...mockResponse!,
        id: `msg-${Date.now() + 1}`,
        timestamp: 'İndi',
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 600);
  };

  return (
    <div className="fixed bottom-8 right-6 sm:right-8 z-50 pointer-events-auto flex flex-col items-end">
      {/* Floating Quick Chat Popup Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-96 rounded-2xl bg-surface-container-lowest shadow-[0_8px_32px_rgba(0,102,255,0.08)] border border-outline-variant/60 overflow-hidden flex flex-col max-h-[480px] animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Popup Header */}
          <div className="p-4 flex items-center justify-between border-b border-outline-variant/50 bg-surface-container-lowest">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shadow-sm shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-title-lg font-bold text-on-surface">MyGuard AI</h3>
                <p className="text-label-sm text-on-surface-variant">Real-vaxt səhifə təhlili</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-variant transition-colors text-on-surface-variant cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-surface-container-low/40 max-h-[300px]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl text-label-md leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-blue text-white ml-6 font-medium'
                    : 'bg-white text-on-surface border border-purple-100 shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? (msg.blocks?.[0]?.content || msg.text || '') : <AiMessageRenderer message={msg} />}
              </div>
            ))}
          </div>

          {/* Popup Input Bar */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-outline-variant flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('askPlaceholder')}
              className="flex-1 px-3 py-2 text-label-md rounded-lg border border-outline-variant bg-surface-container-low focus:border-brand-purple outline-none"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-lg bg-brand-purple text-white flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) Circle with Breathing Pulse Animation */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-blue via-brand-purple to-purple-400 text-white flex items-center justify-center animate-breathe cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200"
        title="AI Assistant"
      >
        <Sparkles className="w-7 h-7 text-white" />
      </button>
    </div>
  );
};
