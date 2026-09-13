import React from 'react';
import { StructuredAiAnalysis } from '../../../types';
import { useLanguage } from '../../../context/LanguageContext';

export interface AiAnalysisBlockProps {
  data: StructuredAiAnalysis;
}

export const AiAnalysisBlock: React.FC<AiAnalysisBlockProps> = ({ data }) => {
  const { t } = useLanguage();

  return (
    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-purple-200/60">
        <div>
          <div className="text-label-sm font-bold text-purple-900/60 uppercase tracking-wider mb-1">{t('riskScore')}</div>
          <div className="text-body-md font-bold text-error">{data.riskSeverity}</div>
        </div>
        <div>
          <div className="text-label-sm font-bold text-purple-900/60 uppercase tracking-wider mb-1">{t('isThreat')}</div>
          <div className="text-body-md font-semibold text-purple-950">{data.detectedThreat}</div>
        </div>
        <div>
          <div className="text-label-sm font-bold text-purple-900/60 uppercase tracking-wider mb-1">{t('promptInjectionProb')}</div>
          <div className="text-body-md font-bold text-brand-blue">{data.confidence}</div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="text-label-sm font-bold text-purple-900/60 uppercase tracking-wider">{t('explanationTitle')}:</div>
        <p className="text-body-md text-on-surface leading-relaxed">{data.reason}</p>
      </div>

      <div className="space-y-1.5 pt-2">
        <div className="text-label-sm font-bold text-purple-900/60 uppercase tracking-wider">{t('recommendedSecurityActions')}:</div>
        <p className="text-body-md font-semibold text-error-900">{data.recommendation}</p>
      </div>
    </div>
  );
};
