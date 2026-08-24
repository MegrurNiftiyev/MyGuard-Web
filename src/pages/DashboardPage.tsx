import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, ArrowRight, ShieldCheck, Send, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

import { mockDocuments, mockModelConfigs, mockAiMessages } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { AiMessageRenderer } from '../components/assistant/AiMessageRenderer';
import { AiMessage } from '../types';
import { Chip } from '../components/ui/Chip';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const activeModel = mockModelConfigs.find(m => m.status === 'Active');
  
  const [aiInput, setAiInput] = React.useState('');
  const [messages, setMessages] = React.useState<AiMessage[]>([]);

  const handleAiChatSubmit = (queryOverride?: string) => {
    const text = queryOverride || aiInput;
    if (!text.trim()) return;

    const userMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      blocks: [{ type: 'text', content: text }],
      timestamp: 'İndi'
    };
    
    setMessages(prev => [...prev, userMsg]);
    if (!queryOverride) setAiInput('');

    setTimeout(() => {
      const mockResponse = mockAiMessages.find(m => m.sender === 'assistant');
      const aiResponse: AiMessage = {
        ...mockResponse!,
        id: `msg-${Date.now() + 1}`,
        timestamp: 'İndi',
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 600);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Safe': return <span className="text-success font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4"/> Təhlükəsiz</span>;
      case 'High Risk': return <span className="text-error font-bold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4"/> Yüksək Risk</span>;
      case 'Scanning': return <span className="text-brand-blue font-bold flex items-center gap-1.5"><Sparkles className="w-4 h-4"/> Skan edilir</span>;
      case 'Quarantined': return <span className="text-warning font-bold flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> Karantində</span>;
      default: return <span className="text-on-surface-variant font-bold">{status}</span>;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      navigate('/scan');
    }
  };

  const suggestedQuestions = [
    'Son yüklənən sənədlərin statusu nədir?',
    'Yüksək riskli fayllar varmı?',
    'Bu gün neçə sənəd skan edilib?'
  ];

  return (
    <div className="flex flex-col gap-10 w-full pb-8">
      {/* Top Row: Upload & AI Panel */}
      <div className="flex flex-col lg:flex-row gap-10 w-full items-stretch">
        
        {/* Left: Upload Card */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Card padding="lg" className="flex flex-col gap-6 shadow-l1 h-full">
            <div>
              <h2 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2">{t('uploadTitle')}</h2>
              <p className="text-body-md text-on-surface-variant">{t('uploadSubtitle')}</p>
            </div>
          
          <label
            htmlFor="file-upload"
            className="border-2 border-dashed border-outline-variant rounded-2xl bg-surface-bright flex flex-col items-center justify-center py-16 px-6 text-center hover:border-brand-blue hover:bg-surface-variant/20 transition-all cursor-pointer group"
          >
            <input id="file-upload" type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} />
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-4 group-hover:text-brand-blue group-hover:bg-primary-container transition-colors">
              <UploadCloud className="w-8 h-8" />
            </div>
            <p className="text-title-lg font-medium text-on-surface mb-1">{t('dragDropText')}</p>
            <p className="text-body-md text-on-surface-variant mb-6">{t('maxSize')}</p>
            <Button variant="primary" size="md" className="shadow-sm pointer-events-none">
              {t('selectFile')}
            </Button>
          </label>
        </Card>
        </div>

        {/* Right: Interactive AI Panel */}
        <div className="hidden lg:flex w-[420px] flex-shrink-0">
          <aside className="w-full h-full bg-surface-container-lowest rounded-3xl border border-outline-variant/60 shadow-[0_8px_32px_rgba(0,102,255,0.08)] flex flex-col overflow-hidden">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/50 shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shadow-sm shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-title-lg font-bold text-on-surface">MyGuard AI</h3>
                  <p className="text-label-sm text-on-surface-variant">Real-time analysis</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto mb-4 pr-2 custom-scrollbar flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-wrap items-center justify-center gap-2 content-center">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleAiChatSubmit(q)}
                        className="px-4 py-2 rounded-full bg-surface border border-outline-variant text-on-surface-variant hover:text-brand-blue text-sm font-semibold hover:bg-blue-50/50 hover:border-brand-blue/30 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95 text-center"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-xl text-label-md leading-relaxed ${
                      msg.sender === 'user' ? 'bg-brand-blue text-white ml-6 font-medium' : 'bg-white text-on-surface border border-purple-100 shadow-xs'
                    }`}>
                      {msg.sender === 'user' ? (msg.blocks?.[0]?.content || msg.text || '') : <AiMessageRenderer message={msg} />}
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleAiChatSubmit(); }} className="relative mt-auto shrink-0">
                <input 
                  type="text" 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-full py-3 px-4 pr-12 text-body-md text-on-surface focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-inner" 
                  placeholder={t('askPlaceholder')}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-brand-blue hover:bg-surface-variant rounded-full transition-colors cursor-pointer">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom Row: Recent Documents */}
      <div className="w-full">
        <Card padding="lg" className="flex flex-col gap-6 shadow-l1">
          <div className="flex justify-between items-center">
            <h3 className="text-title-lg font-medium text-on-surface">{t('recentDocs')}</h3>
            <button onClick={() => navigate('/documents')} className="text-brand-blue text-label-md hover:underline flex items-center gap-1">
              {t('viewAll')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-3 px-4 text-label-sm text-on-surface-variant">Name</th>
                  <th className="py-3 px-4 text-label-sm text-on-surface-variant">Time</th>
                  <th className="py-3 px-4 text-label-sm text-on-surface-variant w-[150px]">Status</th>
                  <th className="py-3 px-4 text-label-sm text-on-surface-variant w-[150px]">Risk Score</th>
                </tr>
              </thead>
              <tbody className="text-body-md">
                {mockDocuments.slice(0, 3).map((doc) => (
                  <tr key={doc.id} onClick={() => navigate(`/analysis/${doc.id}`)} className="border-b border-outline-variant/50 hover:bg-surface-bright transition-colors cursor-pointer group">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-tertiary" />
                      <span className="font-medium text-on-surface group-hover:text-brand-blue transition-colors">{doc.name}</span>
                    </td>
                    <td className="py-4 px-4 text-on-surface-variant text-sm">{doc.uploadTime}</td>
                    <td className="py-4 px-4">
                      <Chip status={doc.status} />
                    </td>
                    <td className="py-4 px-4">
                      {doc.riskScore > 0 ? (
                        <span className={`font-semibold ${doc.riskScore >= 70 ? 'text-error border-l-4 border-error pl-2' : doc.riskScore >= 40 ? 'text-warning border-l-4 border-warning pl-2' : 'text-success border-l-4 border-success pl-2'}`}>
                          {doc.riskScore}/100
                        </span>
                      ) : (
                        <span className="text-on-surface-variant font-semibold">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
