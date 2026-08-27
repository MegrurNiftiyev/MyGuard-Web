import React, { useState, useEffect } from 'react';
import { ShieldCheck, Ban, CheckCircle, Activity, ChevronRight, FileText, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useLanguage } from '../context/LanguageContext';
import { securityApi, AgentSecurityAction } from '../api/securityApi';

export const ActionSecurityPage: React.FC = () => {
  const { t } = useLanguage();
  const [actions, setActions] = useState<AgentSecurityAction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadActions = async () => {
    try {
      const liveActions = await securityApi.getActions();
      if (liveActions && liveActions.length > 0) {
        setActions(liveActions);
      } else {
        setActions([
          {
            id: 'act-101',
            agent: 'HR Resume Classifier Agent',
            action: 'Rank Candidate & Forward to Main LLM',
            file: 'CV_Samir_Aliyev.pdf',
            destination: 'Internal HR Portal',
            sensitivity: 'High',
            decision: 'BLOCKED',
            timestamp: '11:45',
            reason: 'Instruction Override injection detected in page 2'
          },
          {
            id: 'act-102',
            agent: 'Finance Auditor Agent',
            action: 'Summarize Q3 Financial Report',
            file: 'Q3_Report_Draft.docx',
            destination: 'Internal SharePoint',
            sensitivity: 'Medium',
            decision: 'ALLOWED',
            timestamp: '11:30'
          }
        ]);
      }
    } catch (err) {
      console.warn('Security actions load fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActions();
  }, []);

  const handleDecisionToggle = async (id: string, currentDecision: string) => {
    const newDecision = currentDecision === 'BLOCKED' ? 'ALLOWED' : 'BLOCKED';
    try {
      await securityApi.updateDecision(id, newDecision);
    } catch (err) {
      console.warn('Update decision fallback:', err);
    }
    setActions(prev => prev.map(a => a.id === id ? { ...a, decision: newDecision } : a));
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <header>
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-8 h-8 text-brand-blue" />
          <h1 className="text-display-sm md:text-display-lg font-bold text-on-surface">
            {t('agentProtectionTitle') || 'Agent Protection'}
          </h1>
        </div>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">
          {t('agentProtectionSubtitle') || 'Real-time monitoring and enforcement of security policies for autonomous AI agents. Preventing unauthorized data exfiltration and maintaining strict boundary controls.'}
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* System Status Widget */}
        <Card padding="lg" className="lg:col-span-4 bg-surface-container-lowest border-outline-variant shadow-l1 flex flex-col justify-between">
          <div>
            <h2 className="text-title-lg font-medium text-on-surface mb-2">Policy Engine</h2>
            <p className="text-body-md text-on-surface-variant mb-6 font-medium text-emerald-600">Active Enforcement Mode</p>
            
            <div className="flex items-center justify-center py-8">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-brand-blue/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                <div className="w-32 h-32 rounded-full border-4 border-brand-blue flex items-center justify-center bg-brand-blue/10">
                  <Activity className="w-12 h-12 text-brand-blue" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-surface-container rounded-lg p-4">
              <p className="text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Agents Monitored</p>
              <p className="text-headline-lg font-bold text-on-surface">142</p>
            </div>
            <div className="bg-error-container/30 border border-error/20 rounded-lg p-4">
              <p className="text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Actions Blocked</p>
              <p className="text-headline-lg font-bold text-error">
                {actions.filter(a => a.decision === 'BLOCKED').length}
              </p>
            </div>
          </div>
        </Card>

        {/* Recent Interventions */}
        <Card padding="lg" className="lg:col-span-8 bg-surface-container-lowest border-outline-variant shadow-l1 flex flex-col gap-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-title-lg font-medium text-on-surface">Recent Interventions</h2>
            <button onClick={loadActions} className="text-label-md font-medium text-brand-purple border border-brand-purple/50 rounded-lg px-4 py-2 hover:bg-brand-purple/5 transition-colors cursor-pointer">
              Yenilə
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="p-6 text-center text-on-surface-variant">Yüklənir...</div>
            ) : (
              actions.map((act) => (
                <div
                  key={act.id}
                  className={`border rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row gap-4 md:items-center justify-between group ${
                    act.decision === 'BLOCKED'
                      ? 'border-error/30 bg-error-container/10'
                      : 'border-emerald-200 bg-emerald-50/20'
                  }`}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${act.decision === 'BLOCKED' ? 'bg-error' : 'bg-emerald-500'}`}></div>
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 md:mt-0 ${act.decision === 'BLOCKED' ? 'bg-error-container text-error' : 'bg-emerald-100 text-emerald-600'}`}>
                      {act.decision === 'BLOCKED' ? <Ban className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-title-lg font-bold text-on-surface">{act.action}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-white text-label-xs font-bold uppercase tracking-wide ${act.decision === 'BLOCKED' ? 'bg-error' : 'bg-emerald-600'}`}>
                          {act.decision}
                        </span>
                      </div>
                      <div className="text-body-md text-on-surface-variant flex flex-col sm:flex-row sm:gap-6 gap-2 mt-2">
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-on-surface-variant/70" />
                          <span className="font-mono text-sm text-on-surface">{act.file}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-on-surface-variant/50 hidden sm:flex">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono text-sm ${act.decision === 'BLOCKED' ? 'text-error' : 'text-emerald-600'}`}>
                            {act.destination}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end shrink-0 mt-2 md:mt-0 ml-14 md:ml-0 gap-2">
                    <span className="text-label-sm font-medium text-on-surface-variant">Agent: {act.agent}</span>
                    <button
                      onClick={() => handleDecisionToggle(act.id, act.decision)}
                      className="text-label-sm font-bold text-brand-blue hover:underline cursor-pointer flex items-center gap-1"
                    >
                      Qərarı dəyiş ({act.decision === 'BLOCKED' ? 'ALLOW' : 'BLOCK'}) <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ActionSecurityPage;
