import React, { useState } from 'react';
import { Settings, ShieldCheck, Sliders, Lock, Bell, CheckCircle, Save, Quote, Globe, User, Shield, Building, Mail, ArrowRight, Check, X, RotateCcw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CustomSwitch } from '../components/ui/CustomSwitch';
import { useLanguage } from '../context/LanguageContext';
import { useUserRole } from '../context/UserRoleContext';

export const SettingsPage: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const { role, setRole, isAdmin } = useUserRole();

  const [ocrThreshold, setOcrThreshold] = useState(95);
  const [sensitivity, setSensitivity] = useState<'Low' | 'Medium' | 'High'>('High');
  const [maxFileSize, setMaxFileSize] = useState(50);
  const [autoScan, setAutoScan] = useState(true);

  const [allowExternalAi, setAllowExternalAi] = useState(false);
  const [confidentialMode, setConfidentialMode] = useState(true);

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-body-md flex items-center gap-3 animate-in fade-in zoom-in-95">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{t('settingsSaved') || 'Parametrlər uğurla yadda saxlanıldı və platformaya tətbiq edildi.'}</span>
        </div>
      )}

      {/* SECTION 1: Profil */}
      <section className="space-y-6">
        <h2 className="text-title-lg font-bold text-on-surface border-b border-outline-variant/60 pb-3">
          {t('profileSection') || 'Profil'}
        </h2>

        <div className="space-y-6">
          {/* User Header */}
          <Card padding="lg" className="border-outline-variant/60 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface font-bold text-title-lg shrink-0">
                  EM
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-headline-sm font-bold text-on-surface">Elvin Məmmədov</h1>
                  </div>
                  <p className="text-body-md text-on-surface-variant">
                    Təhlükəsizlik Əməliyyatları Mərkəzi (SOC) • AI Təhlükəsizlik Arxitektorı
                  </p>
                  <div className="flex items-center gap-4 text-label-sm text-on-surface-variant/80 pt-1 flex-wrap">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> e.mammadov@soc.gov.az</span>
                    <span className="flex items-center gap-1.5"><Building className="w-4 h-4" /> Dövlət AI Təhlükəsizlik Agentliyi</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Language Preferences Tile with Sliding Background Box */}
          <Card padding="lg" className="border-outline-variant/60 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <Globe className="w-6 h-6 text-brand-blue mt-1" />
                <div>
                  <h4 className="text-title-lg font-medium text-on-surface truncate">
                    {t('interfaceLanguage') || 'İnterfeys Dili'}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant/80 mt-1 max-w-sm">
                    {t('selectInterfaceLanguage') || 'Sistemin istifadəçi interfeysi dilini seçin'}
                  </p>
                </div>
              </div>

              {/* Sliding Background Language Pill Switcher */}
              <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/80 p-1 rounded-full shadow-xs self-start sm:self-auto">
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-blue rounded-full shadow-sm transition-transform duration-300 ease-out ${
                    lang === 'az' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setLang('az')}
                  className={`relative z-10 px-4 py-2 text-label-md font-bold rounded-full transition-colors cursor-pointer flex items-center gap-2 min-w-[76px] justify-center ${
                    lang === 'az' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>🇦🇿 AZ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`relative z-10 px-4 py-2 text-label-md font-bold rounded-full transition-colors cursor-pointer flex items-center gap-2 min-w-[76px] justify-center ${
                    lang === 'en' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>🇬🇧 EN</span>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 2: Təhlükəsizlik */}
      <section className="space-y-6 mt-8">
        <h2 className="text-title-lg font-bold text-on-surface border-b border-outline-variant/60 pb-3">
          {t('securitySection') || 'Təhlükəsizlik'}
        </h2>

        {/* Section 1: Scan Parameters */}
        <Card padding="lg" className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-outline-variant">
            <Sliders className="w-5 h-5 text-brand-blue" />
            <h3 className="text-title-lg font-bold text-on-surface">
              {t('scanParameters') || '1. Skan Parametrləri (Scan Parameters)'}
            </h3>
          </div>

          <div className="flex flex-col">
            {/* OCR Match Threshold Slider Tile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-outline-variant/40 gap-4">
              <div className="flex items-start gap-4">
                <Sliders className="w-6 h-6 text-brand-blue mt-1" />
                <div>
                  <h4 className="text-title-lg font-medium text-on-surface truncate">
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
                  onChange={(e) => setOcrThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
                <span className="font-bold text-brand-blue whitespace-nowrap">{ocrThreshold}%</span>
              </div>
            </div>

            {/* Injection Sensitivity Tile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-outline-variant/40 gap-4">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-brand-purple mt-1" />
                <div>
                  <h4 className="text-title-lg font-medium text-on-surface truncate">
                    {t('sensitivity') || 'Injection Həssaslığı'}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant/80 mt-1 max-w-sm">
                    Sənədlərin tərkibindəki anomaliyaları aşkarlamaq üçün analiz səviyyəsi.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl">
                {(['Low', 'Medium', 'High'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSensitivity(level)}
                    className={`px-4 py-2 rounded-lg text-label-sm font-semibold transition-all cursor-pointer ${
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
                  <h4 className="text-title-lg font-medium text-on-surface truncate">
                    {t('autoScanMode') || 'Avtomatik Skan Rejimi'}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant/80 mt-1 max-w-sm">
                    {t('autoScanDesc') || 'Bütün yüklənən sənədlər dərhal borudan (pipeline) keçirilsin.'}
                  </p>
                </div>
              </div>
              <CustomSwitch checked={autoScan} onChange={setAutoScan} />
            </div>
          </div>
        </Card>

        {/* Section 2: Privacy & Model Isolation */}
        <Card padding="lg" className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-outline-variant">
            <Lock className="w-5 h-5 text-brand-blue" />
            <h3 className="text-title-lg font-bold text-on-surface">
              {t('privacyIsolation') || '2. Məxfilik və İzolyasiya (Privacy & Isolation)'}
            </h3>
          </div>

          <div className="flex flex-col">
            {/* Confidential Mode Tile */}
            <div className="flex items-center justify-between py-5 border-b border-outline-variant/40 gap-4">
              <div className="flex items-start gap-4">
                <Lock className="w-6 h-6 text-brand-purple mt-1" />
                <div>
                  <h4 className="text-title-lg font-medium text-on-surface truncate">
                    {t('confidentialModeTitle') || 'Konfidensial Rejim'}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant/80 mt-1 max-w-sm">
                    {t('confidentialModeDesc') || 'Sənəd məlumatları heç bir halda lokal şəbəkədən kənara çıxarılmasın.'}
                  </p>
                </div>
              </div>
              <CustomSwitch checked={confidentialMode} onChange={setConfidentialMode} />
            </div>

            {/* External AI Tile */}
            <div className="flex items-center justify-between py-5 gap-4">
              <div className="flex items-start gap-4">
                <Globe className="w-6 h-6 text-brand-blue mt-1" />
                <div>
                  <h4 className="text-title-lg font-medium text-on-surface truncate">
                    {t('externalAiTitle') || 'Xarici AI Modellərindən İstifadə'}
                  </h4>
                  <p className="text-label-sm text-on-surface-variant/80 mt-1 max-w-sm">
                    {t('externalAiDesc') || 'Aşağı həssaslıqlı sənədlər üçün bulud əsaslı modellərdən istifadəyə icazə verilir.'}
                  </p>
                </div>
              </div>
              <CustomSwitch checked={allowExternalAi} onChange={setAllowExternalAi} />
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

      {/* Floating Bottom Right Action Bar */}
      <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up transition-all">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-full p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center gap-2 max-w-fit">
          <Button variant="outline" size="sm" className="!text-on-surface-variant hover:!bg-surface-container-high hover:!text-on-surface !border-outline-variant/40 rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all" title="Ləğv elə">
            <X className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="!text-on-surface-variant hover:!bg-surface-container-high hover:!text-on-surface !border-outline-variant/40 rounded-full w-10 h-10 p-0 flex items-center justify-center transition-all" title="Geri al">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-outline-variant/30 mx-1"></div>
          <Button variant="primary" size="md" onClick={handleSave} className="px-6 !bg-brand-blue hover:!bg-brand-blue-hover text-white shadow-md rounded-full font-bold transition-all" icon={<Save className="w-4 h-4" />}>
            {t('saveBtn') || 'Yadda Saxla'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
