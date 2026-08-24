import React, { useState } from 'react';
import { ShieldAlert, Bot, Ban, CheckCircle, Activity, ChevronRight, ShieldCheck, ArrowRight, UploadCloud, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockInterventions } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const ActionSecurityPage: React.FC = () => {
  const { t } = useLanguage();
  const [actions, setActions] = useState(mockInterventions);

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
            <p className="text-body-md text-on-surface-variant mb-6">Active Enforcement Mode</p>
            
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
              <p className="text-headline-lg font-bold text-error">18</p>
            </div>
          </div>
        </Card>

        {/* Recent Interventions */}
        <Card padding="lg" className="lg:col-span-8 bg-surface-container-lowest border-outline-variant shadow-l1 flex flex-col gap-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-title-lg font-medium text-on-surface">Recent Interventions</h2>
            <button className="text-label-md font-medium text-brand-purple border border-brand-purple/50 rounded-lg px-4 py-2 hover:bg-brand-purple/5 transition-colors">
              View All Logs
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Intervention Item 1 (Blocked) */}
            <div className="border border-error/30 bg-error-container/10 rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row gap-4 md:items-center justify-between group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center shrink-0 mt-1 md:mt-0">
                  <Ban className="w-5 h-5 text-error" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-title-lg font-bold text-on-surface">Send document by email</h3>
                    <span className="px-2 py-0.5 rounded-full bg-error text-white text-label-xs font-bold uppercase tracking-wide">Blocked</span>
                  </div>
                  <div className="text-body-md text-on-surface-variant flex flex-col sm:flex-row sm:gap-6 gap-2 mt-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-on-surface-variant/70" />
                      <span className="font-mono text-sm text-on-surface">internal_salary_report.pdf</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant/50 hidden sm:flex">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm text-error">external@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end shrink-0 mt-2 md:mt-0 ml-14 md:ml-0">
                <span className="text-label-sm font-medium text-on-surface-variant mb-2">Agent: HR-Assistant-v2</span>
                <button className="text-label-md font-medium text-on-surface-variant hover:text-brand-blue transition-colors flex items-center gap-1">
                  Inspect Context <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Intervention Item 2 (Blocked) */}
            <div className="border border-error/30 bg-error-container/10 rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row gap-4 md:items-center justify-between group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center shrink-0 mt-1 md:mt-0">
                  <Ban className="w-5 h-5 text-error" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-title-lg font-bold text-on-surface">Upload confidential file</h3>
                    <span className="px-2 py-0.5 rounded-full bg-error text-white text-label-xs font-bold uppercase tracking-wide">Blocked</span>
                  </div>
                  <div className="text-body-md text-on-surface-variant flex flex-col sm:flex-row sm:gap-6 gap-2 mt-2">
                    <div className="flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-on-surface-variant/70" />
                      <span className="font-mono text-sm text-on-surface">project_gemini_source.zip</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant/50 hidden sm:flex">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm text-error">External server (IP: 192.168.x.x)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end shrink-0 mt-2 md:mt-0 ml-14 md:ml-0">
                <span className="text-label-sm font-medium text-on-surface-variant mb-2">Agent: Dev-Copilot</span>
                <button className="text-label-md font-medium text-on-surface-variant hover:text-brand-blue transition-colors flex items-center gap-1">
                  Inspect Context <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Intervention Item 3 (Allowed - AI Insight) */}
            <div className="border-2 border-transparent bg-surface-container-lowest rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row gap-4 md:items-center justify-between group" style={{
              backgroundImage: 'linear-gradient(#ffffff, #ffffff), linear-gradient(to right, #3174ef, #c282ed)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}>
              <div className="flex items-start gap-4 z-10">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0 mt-1 md:mt-0 border border-brand-blue/20">
                  <CheckCircle className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-title-lg font-bold text-on-surface">Summarize Q3 Earnings</h3>
                    <span className="px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue text-label-xs font-bold uppercase flex items-center gap-1 tracking-wide">
                      Allowed
                    </span>
                  </div>
                  <div className="text-body-md text-on-surface-variant flex flex-col sm:flex-row sm:gap-6 gap-2 mt-2">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-on-surface-variant/70" />
                      <span className="font-mono text-sm text-on-surface">q3_draft_v2.docx</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-on-surface-variant/50 hidden sm:flex">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm text-emerald-600">Internal SharePoint</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end shrink-0 z-10 mt-2 md:mt-0 ml-14 md:ml-0">
                <span className="text-label-sm font-medium text-on-surface-variant mb-2">Agent: Finance-Bot</span>
                <button className="text-label-md font-medium text-on-surface-variant hover:text-brand-blue transition-colors flex items-center gap-1">
                  View Output <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </Card>
      </div>
    </div>
  );
};

export default ActionSecurityPage;
