import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressStep } from '../components/ui/ProgressStep';
import { StepStatus } from '../types';
import { mockScanSteps } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

  const [steps, setSteps] = useState(mockScanSteps.map((s, i) => ({
    ...s,
    status: i === 0 ? 'completed' : 'processing' as StepStatus
  })));

  useEffect(() => {
    if (!isScanning) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsScanning(false);
          clearInterval(timer);
          return prev;
        }
        const next = prev + 1;
        setSteps((oldSteps) =>
          oldSteps.map((step, idx) => {
            if (idx < next) {
              if (idx === 4 || idx === 5) {
                return { ...step, status: 'warning' };
              }
              return { ...step, status: 'completed' };
            }
            if (idx === next) {
              return { ...step, status: 'processing' };
            }
            return step;
          })
        );
        return next;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [isScanning, steps.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Header spanning full width */}
      <header className="lg:col-span-12 mb-2 flex justify-between items-end">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2">{t('scanTitle')}</h1>
          <p className="text-body-md text-on-surface-variant">{t('scanSubtitle')}</p>
        </div>
        {!isScanning && (
          <Button variant="primary" size="md" onClick={() => navigate('/analysis/doc-001')} icon={<ArrowRight className="w-4 h-4" />}>
            {t('viewAnalysis')}
          </Button>
        )}
      </header>

      {/* Upload/Preview Card */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card padding="lg" className="ai-gradient-card shadow-l1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-lg font-medium text-on-surface">Target File</h2>
            <span className="bg-primary-container text-on-primary-container text-label-sm px-3 py-1 rounded-full border border-primary-fixed-dim">
              {isScanning ? 'Scanning' : 'Analysis Complete'}
            </span>
          </div>
          
          <div className="aspect-[3/4] bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-center mb-6 relative overflow-hidden group">
            {/* Abstract Document Representation */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(49,116,239,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
            <FileText className="w-20 h-20 text-outline-variant group-hover:scale-105 transition-transform" />
            
            {/* Scanning line animation overlay */}
            {isScanning && (
              <div className="absolute left-0 right-0 h-1 bg-brand-blue/50 blur-[2px] top-0 shadow-[0_0_10px_rgba(49,116,239,0.8)] animate-[scan_2s_linear_infinite]"></div>
            )}
            <style>{`
              @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
              }
            `}</style>
          </div>
          
          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-label-md font-medium text-on-surface">contract_v2_final.pdf</span>
              <span className="text-label-sm text-on-surface-variant">2.4 MB</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
              <div className="bg-brand-blue h-2 rounded-full transition-all duration-500" style={{ width: `${Math.round(((currentStepIndex + 1) / steps.length) * 100)}%` }}></div>
            </div>
            <div className="text-label-sm text-brand-blue text-right mt-1">
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
            </div>
          </div>
        </Card>
      </div>

      {/* Pipeline Status */}
      <div className="lg:col-span-7">
        <Card padding="lg" className="h-full shadow-l1">
          <h2 className="text-title-lg font-medium text-on-surface mb-8">{t('pipelineTitle')}</h2>
          
          <div className="pl-2">
            {steps.map((step, idx) => (
              <ProgressStep
                key={step.stepNumber}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                status={step.status}
                isLast={idx === steps.length - 1}
              />
            ))}
          </div>

          <div className="mt-10 flex justify-end gap-4 border-t border-outline-variant pt-6">
            <Button variant="outline" size="md" onClick={() => navigate('/dashboard')}>
              Cancel Scan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScanPage;
