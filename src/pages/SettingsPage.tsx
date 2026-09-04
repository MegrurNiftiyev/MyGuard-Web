import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders, Lock, Bell, CheckCircle2, Save, Quote, Globe, Mail, LogOut, LogIn, Fingerprint } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CustomSwitch } from '../components/ui/CustomSwitch';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const INITIAL_SETTINGS = {
  ocrThreshold: 95,
  sensitivity: 'High' as const,
  autoScan: true,
  allowExternalAi: false,
  confidentialMode: true,
};

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  const [ocrThreshold, setOcrThreshold] = useState(INITIAL_SETTINGS.ocrThreshold);
  const [sensitivity, setSensitivity] = useState<'Low' | 'Medium' | 'High'>(INITIAL_SETTINGS.sensitivity);
  const [autoScan, setAutoScan] = useState(INITIAL_SETTINGS.autoScan);
  const [allowExternalAi, setAllowExternalAi] = useState(INITIAL_SETTINGS.allowExternalAi);
  const [confidentialMode, setConfidentialMode] = useState(INITIAL_SETTINGS.confidentialMode);

  // State to track if any setting has been modified
  const [isDirty, setIsDirty] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const updateDirty = (dirty: boolean) => {
    setIsDirty(dirty);
    window.dispatchEvent(new CustomEvent('settings-dirty-changed', { detail: { isDirty: dirty } }));
  };

  const markDirty = () => {
    if (!isDirty) updateDirty(true);
  };

  const handleSave = () => {
    updateDirty(false);
    window.dispatchEvent(new CustomEvent('settings-saved-success'));
  };

  const handleReset = () => {
    setOcrThreshold(INITIAL_SETTINGS.ocrThreshold);
    setSensitivity(INITIAL_SETTINGS.sensitivity);
    setAutoScan(INITIAL_SETTINGS.autoScan);
    setAllowExternalAi(INITIAL_SETTINGS.allowExternalAi);
    setConfidentialMode(INITIAL_SETTINGS.confidentialMode);
    updateDirty(false);
  };

  useEffect(() => {
    const handleSaveTrigger = () => handleSave();
    const handleResetTrigger = () => handleReset();

    window.addEventListener('trigger-settings-save', handleSaveTrigger);
    window.addEventListener('trigger-settings-reset', handleResetTrigger);
    return () => {
      window.removeEventListener('trigger-settings-save', handleSaveTrigger);
      window.removeEventListener('trigger-settings-reset', handleResetTrigger);
    };
  }, [ocrThreshold, sensitivity, autoScan, allowExternalAi, confidentialMode]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 relative">

      {/* Təhlükəsizlik və Skan Parametrləri */}
      <section className="space-y-6">

        {/* Section 1: Scan Parameters */}
        <Card padding="lg" className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-outline-variant">
            <Sliders className="w-5 h-5 text-brand-blue" />
            <h3 className="text-title-lg font-bold text-on-surface leading-tight">
              {t('scanParameters') || '1. Skan Parametrləri'}
            </h3>
          </div>

          <div className="flex flex-col">
            {/* OCR Match Threshold Slider Tile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-outline-variant/40 gap-4">
              <div className="flex items-start gap-4">
                <Sliders className="w-6 h-6 text-brand-blue mt-1" />
                <div>
                  <h4 className="text-title-lg font-medium text-on-surface leading-tight">
                    {t('ocrThreshold') || 'OCR ↔ PDF Uyğunluq Eşik Dərəcəsi'}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant/80 mt-1 max-w-sm">
                    Uyğunsuzluq bu faizdən aşağı olduqda sənəd avtomatik şübhəli bəyan edilir.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 min-w-[200px]">
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={ocrThreshold}
                  onChange={(e) => { setOcrThreshold(Number(e.target.value)); markDirty(); }}
                  className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
                <span className="font-bold text-brand-blue whitespace-nowrap">{ocrThreshold}%</span>
              </div>
            </div>

            {/* Injection Sensitivity Tile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-outline-variant/40 gap-4">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-brand-purple mt-1" />
                <div>
                  <h4 className="text-title-lg font-medium text-on-surface leading-tight">
                    {t('sensitivity') || 'Injection Həssaslığı'}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant/80 mt-1 max-w-sm">
                    Sənədlərin tərkibindəki anomaliyaları aşkarlamaq üçün analiz səviyyəsi.
                  </p>
                </div>
              </div>
              <div className="flex items-center w-full sm:w-auto sm:min-w-[320px] bg-surface-container-low p-1 rounded-xl">
                {(['Low', 'Medium', 'High'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => { setSensitivity(level); markDirty(); }}
                    className={`flex-1 px-2 sm:px-4 py-2 rounded-lg text-label-sm font-semibold transition-all cursor-pointer text-center ${
                      sensitivity === level
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {level === 'Low' && (lang === 'en' ? 'Low' : 'Aşağı')}
                    {level === 'Medium' && (lang === 'en' ? 'Medium' : 'Orta')}
                    {level === 'High' && (lang === 'en' ? 'High' : 'Yüksək')}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Scan Toggle Tile */}
            <div className="flex items-center justify-between py-5 gap-4">
              <div className="flex items-start gap-4">
                <Bell className="w-6 h-6 text-emerald-500 mt-1" />
                <div>
                  <h4 className="text-title-lg font-medium text-on-surface leading-tight">
                    {t('autoScanMode') || 'Avtomatik Skan Rejimi'}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant/80 mt-1 max-w-sm">
                    {t('autoScanDesc') || 'Bütün yüklənən sənədlər dərhal borudan (pipeline) keçirilsin.'}
                  </p>
                </div>
              </div>
              <CustomSwitch checked={autoScan} onChange={(val) => { setAutoScan(val); markDirty(); }} />
            </div>
          </div>
        </Card>

        {/* Section 2: Privacy & Model Isolation */}
        <Card padding="lg" className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-outline-variant">
            <Lock className="w-5 h-5 text-brand-blue" />
            <h3 className="text-title-lg font-bold text-on-surface leading-tight">
              {t('privacyIsolation') || '2. Məxfilik və İzolyasiya'}
            </h3>
          </div>

          <div className="flex flex-col">
            {/* Confidential Mode Tile */}
            <div className="flex items-center justify-between py-5 border-b border-outline-variant/40 gap-4">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-brand-purple mt-1" />
                <div>
                  <h4 className="text-title-lg font-medium text-on-surface leading-tight">
                    {t('confidentialModeTitle') || 'Konfidensial Rejim'}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant/80 mt-1 max-w-sm">
                    {t('confidentialModeDesc') || 'Sənəd məlumatları heç bir halda lokal şəbəkədən kənara çıxarılmasın.'}
                  </p>
                </div>
              </div>
              <CustomSwitch checked={confidentialMode} onChange={(val) => { setConfidentialMode(val); markDirty(); }} />
            </div>

            {/* External AI Tile */}
            <div className="flex items-center justify-between py-5 gap-4">
              <div className="flex items-start gap-4">
                <Globe className="w-6 h-6 text-brand-blue mt-1" />
                <div>
                  <h4 className="text-title-lg font-medium text-on-surface leading-tight">
                    {t('externalAiTitle') || 'Xarici AI Modellərindən İstifadə'}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant/80 mt-1 max-w-sm">
                    {t('externalAiDesc') || 'Aşağı həssaslıqlı sənədlər üçün bulud əsaslı modellərdən istifadəyə icazə verilir.'}
                  </p>
                </div>
              </div>
              <CustomSwitch checked={allowExternalAi} onChange={(val) => { setAllowExternalAi(val); markDirty(); }} />
            </div>
          </div>
        </Card>

        {/* Free-standing Routing Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Yüksək Risk */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200 flex flex-col h-full hover:shadow-md transition-shadow relative">
            <div className="flex items-start gap-4 mb-4">
              <Quote className="w-8 h-8 text-red-500 opacity-80 shrink-0" />
              <div>
                <h4 className="text-label-lg font-bold text-red-700">
                  {t('highRiskDocs') || 'Yüksək Riskli Sənədlər'}
                </h4>
              </div>
            </div>
            <p className="text-body-md text-on-surface-variant leading-relaxed flex-1">
              {t('highRiskPolicyDesc') || 'Korporativ AI modellərinə ötürülməsi qadağan edilir. Sənəd dərhal dayandırılır və audit jurnallarına qeyd edilir.'}
            </p>
          </div>

          {/* Şübhəli */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-200 flex flex-col h-full hover:shadow-md transition-shadow relative">
            <div className="flex items-start gap-4 mb-4">
              <Quote className="w-8 h-8 text-amber-500 opacity-80 shrink-0" />
              <div>
                <h4 className="text-label-lg font-bold text-amber-800">
                  {t('suspiciousDocsPolicy') || 'Şübhəli Sənədlər'}
                </h4>
              </div>
            </div>
            <p className="text-body-md text-on-surface-variant leading-relaxed flex-1">
              {t('suspiciousPolicyDesc') || 'İzolyasiya edilmiş gücləndirilmiş modelə yönləndirilir. Bütün ehtimal olunan zərərli kodlar süzgəcdən keçirilir.'}
            </p>
          </div>

          {/* Təhlükəsiz */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-200 flex flex-col h-full hover:shadow-md transition-shadow relative">
            <div className="flex items-start gap-4 mb-4">
              <Quote className="w-8 h-8 text-emerald-500 opacity-80 shrink-0" />
              <div>
                <h4 className="text-label-lg font-bold text-emerald-800">
                  {t('safeDocsPolicy') || 'Təhlükəsiz Sənədlər'}
                </h4>
              </div>
            </div>
            <p className="text-body-md text-on-surface-variant leading-relaxed flex-1">
              {t('safePolicyDesc') || 'Əsas korporativ AI modelinə birbaşa yönəldilir. Gecikməsiz və ən yüksək performansla emal prosesi başa çatır.'}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SettingsPage;
