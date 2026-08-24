import React, { useState } from 'react';
import { Cpu, Server, ShieldCheck, CheckCircle2, Lock, Globe, RefreshCw, SlidersHorizontal, Activity } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockModelConfigs, mockPipelines } from '../data/mockData';
import { AIModelMode } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const ModelManagementPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState<AIModelMode>('CONFIDENTIAL AI');
  const [models, setModels] = useState(mockModelConfigs);
  const pipeline = mockPipelines[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-label-sm font-semibold text-brand-blue uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> AI Infrastruktur və Model İdarəetməsi
          </div>
          <h1 className="text-headline-lg font-bold text-on-surface mt-1">
            Model Operating Modes
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Sənədin məxfilik dərəcəsindən asılı olaraq təhlükəsizlik marşrutlaşdırma modelləri
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-label-sm font-semibold text-on-surface-variant">Cari Aktiv Rejim:</span>
          <span className="px-3.5 py-1.5 rounded-full text-label-md font-bold bg-purple-100 text-brand-purple border border-purple-200">
            {activeMode}
          </span>
        </div>
      </div>

      {/* Operating Mode Selector (Two Large Interactive Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: STANDARD AI */}
        <Card
          padding="lg"
          className={`cursor-pointer transition-all ${
            activeMode === 'STANDARD AI'
              ? 'border-2 border-brand-blue ring-2 ring-blue-100 bg-blue-50/20'
              : 'hover:border-outline'
          }`}
          onClick={() => setActiveMode('STANDARD AI')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center font-bold">
                <Globe className="w-6 h-6" />
              </div>
              {activeMode === 'STANDARD AI' && (
                <span className="px-3 py-1 rounded-full text-label-sm font-bold bg-brand-blue text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Seçilib
                </span>
              )}
            </div>

            <div>
              <h3 className="text-headline-lg-mobile font-bold text-on-surface">
                STANDARD AI
              </h3>
              <p className="text-label-md text-brand-blue font-semibold mt-0.5">
                External High-Performance Cloud LLM
              </p>
            </div>

            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Aşağı və orta həssaslıqlı sənədlər üçün nəzərdə tutulmuşdur. Yüksək sürətli emal gücünə və böyük kontekst pəncərəsinə malikdir.
            </p>

            <div className="pt-4 border-t border-outline-variant grid grid-cols-2 gap-4 text-label-sm">
              <div>
                <span className="text-on-surface-variant/70">Yerləşmə:</span>
                <p className="font-semibold text-on-surface">External Cloud Endpoint</p>
              </div>
              <div>
                <span className="text-on-surface-variant/70">Gecikmə (Latency):</span>
                <p className="font-semibold text-on-surface">~140ms</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: CONFIDENTIAL AI */}
        <Card
          padding="lg"
          className={`cursor-pointer transition-all ${
            activeMode === 'CONFIDENTIAL AI'
              ? 'border-2 border-brand-purple ring-2 ring-purple-100 bg-purple-50/20'
              : 'hover:border-outline'
          }`}
          onClick={() => setActiveMode('CONFIDENTIAL AI')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-brand-purple flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
              </div>
              {activeMode === 'CONFIDENTIAL AI' && (
                <span className="px-3 py-1 rounded-full text-label-sm font-bold bg-brand-purple text-white flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Seçilib (Tövsiyə olunan)
                </span>
              )}
            </div>

            <div>
              <h3 className="text-headline-lg-mobile font-bold text-on-surface">
                CONFIDENTIAL AI
              </h3>
              <p className="text-label-md text-brand-purple font-semibold mt-0.5">
                Local / On-Premise Air-Gapped Model
              </p>
            </div>

            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Yüksək məfiliyə malik müdafiə, dövlət və HR sənədləri üçün lokal serverlərdə çalışan, xarici şəbəkədən tam izolyasiya edilmiş AI modeli.
            </p>

            <div className="pt-4 border-t border-outline-variant grid grid-cols-2 gap-4 text-label-sm">
              <div>
                <span className="text-on-surface-variant/70">Yerləşmə:</span>
                <p className="font-semibold text-on-surface">On-Premise Isolated Server</p>
              </div>
              <div>
                <span className="text-on-surface-variant/70">Təhlükəsizlik Zəmanəti:</span>
                <p className="font-semibold text-emerald-700">Zero Data Leakage</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3-Layer Architecture Status Panels */}
      <Card padding="lg" className="space-y-6">
        <div>
          <h3 className="text-title-lg font-bold text-on-surface">3-Qatlı Analiz Arxitekturası Statusu</h3>
          <p className="text-label-md text-on-surface-variant">Pipeline qatlarının cari işləmə statusları və yüklənmələri</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Layer 1 */}
          <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-bold text-blue-600 uppercase tracking-wider">Layer 1</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h4 className="text-title-md font-bold text-on-surface">Mətn & Vizual Ekstraksiya</h4>
            <p className="text-label-sm text-on-surface-variant">
              PDF Text Layer, OCR və Hidden Text modulları aktivdir.
            </p>
            <div className="pt-2 border-t border-outline-variant text-label-md">
              <span className="font-semibold">Uyğunluq:</span> {pipeline.layer1_ocrTextMatch.matchPercent}%
            </div>
          </div>

          {/* Layer 2 */}
          <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-bold text-purple-600 uppercase tracking-wider">Layer 2</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h4 className="text-title-md font-bold text-on-surface">Klassifikasiya (LLM)</h4>
            <p className="text-label-sm text-on-surface-variant">
              Prompt injection cəhdlərini və risk dərəcəsini qiymətləndirən lokal model.
            </p>
            <div className="pt-2 border-t border-outline-variant text-label-md">
              <span className="font-semibold">Status:</span> {pipeline.layer2_classification.label} ({(pipeline.layer2_classification.confidence * 100).toFixed(0)}%)
            </div>
          </div>

          {/* Layer 3 */}
          <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-bold text-amber-600 uppercase tracking-wider">Layer 3</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </div>
            <h4 className="text-title-md font-bold text-on-surface">İnsan Yoxlaması (Review Loop)</h4>
            <p className="text-label-sm text-on-surface-variant">
              Sistem modelin qərarına əmin olmadıqda (Confidence &lt; 0.7) insan müdaxiləsi tələb olunur.
            </p>
            <div className="pt-2 border-t border-outline-variant text-label-md">
              <span className="font-semibold">Status:</span> Gözləmədə (Standby)
            </div>
          </div>
        </div>
      </Card>

      {/* Model Technical Details Table */}
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-title-lg font-bold text-on-surface">Mövcud AI Modellər və Server Statusları</h3>
            <p className="text-label-md text-on-surface-variant">Sənəd emal mühərriklərinin texniki göstəriciləri</p>
          </div>
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
            Statusları Yoxla
          </Button>
        </div>

        <div className="divide-y divide-outline-variant">
          {models.map((model) => (
            <div key={model.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5 text-on-surface-variant" />
                </div>
                <div>
                  <div className="text-title-lg font-semibold text-on-surface flex items-center gap-2">
                    {model.name}
                    <span className="text-label-sm px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {model.status}
                    </span>
                  </div>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">{model.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-label-md">
                <div>
                  <span className="text-label-sm text-on-surface-variant/70">Kontekst:</span>
                  <div className="font-semibold text-on-surface">{model.maxContext}</div>
                </div>
                <div>
                  <span className="text-label-sm text-on-surface-variant/70">Lokal Server:</span>
                  <div className="font-semibold text-on-surface">{model.isLocal ? 'Bəli (On-Prem)' : 'Xeyr (Cloud)'}</div>
                </div>
                <div>
                  <span className="text-label-sm text-on-surface-variant/70">Yenilənmə:</span>
                  <div className="font-semibold text-on-surface">{model.lastUpdate}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ModelManagementPage;
