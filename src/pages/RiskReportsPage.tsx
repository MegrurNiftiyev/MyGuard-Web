import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { ShieldCheck, Ban, AlertTriangle, FileText, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { mockRiskReports } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { reportsApi, RiskSummaryMetrics } from '../api/reportsApi';

export const RiskReportsPage: React.FC = () => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<RiskSummaryMetrics>(mockRiskReports);
  const COLORS = ['#3174ef', '#c282ed', '#f59e0b', '#ba1a1a'];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const liveMetrics = await reportsApi.getRiskSummary();
        if (liveMetrics) {
          setMetrics(liveMetrics);
        }
      } catch (err) {
        console.warn('Risk summary API load fallback:', err);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-10 pb-8">
      {/* Header */}
      <header>
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2">
          {t('riskTitle')}
        </h1>
        <p className="text-body-md text-on-surface-variant max-w-3xl">
          {t('riskSubtitle')}
        </p>
      </header>

      {/* KPI Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="lg" className="border-l-4 border-l-brand-blue shadow-[0px_4px_20px_rgba(16,0,40,0.04)] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between text-on-surface-variant mb-4">
            <span className="text-title-md font-semibold">{t('totalScanned')}</span>
            <FileText className="w-6 h-6 text-brand-blue" />
          </div>
          <div className="text-display-md font-bold text-on-surface mb-2">
            {metrics.totalScanned.toLocaleString()}
          </div>
          <p className="text-body-sm font-medium text-emerald-700 flex items-center gap-1 bg-emerald-50 w-fit px-3 py-1.5 rounded-md">
            <TrendingUp className="w-4 h-4" /> +14% {t('fromLastWeek')}
          </p>
        </Card>

        <Card padding="lg" className="border-l-4 border-l-emerald-500 shadow-[0px_4px_20px_rgba(16,0,40,0.04)] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between text-on-surface-variant mb-4">
            <span className="text-title-md font-semibold">{t('safeDocs')}</span>
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="text-display-md font-bold text-emerald-700 mb-2">
            {metrics.safeCount.toLocaleString()}
          </div>
          <p className="text-body-md font-medium text-on-surface-variant/80">83% təhlükəsizlik dərəcəsi</p>
        </Card>

        <Card padding="lg" className="border-l-4 border-l-amber-500 shadow-[0px_4px_20px_rgba(16,0,40,0.04)] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between text-on-surface-variant mb-4">
            <span className="text-title-md font-semibold">{t('suspiciousDocs')}</span>
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div className="text-display-md font-bold text-amber-600 mb-2">
            {metrics.suspiciousCount}
          </div>
          <p className="text-body-md font-medium text-on-surface-variant/80">Nəzarətdə saxlanılır</p>
        </Card>

        <Card padding="lg" className="border-l-4 border-l-error shadow-[0px_4px_20px_rgba(16,0,40,0.04)] hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between text-on-surface-variant mb-4">
            <span className="text-title-md font-semibold">{t('blockedDocs')}</span>
            <Ban className="w-6 h-6 text-error" />
          </div>
          <div className="text-display-md font-bold text-error mb-2">
            {metrics.blockedCount}
          </div>
          <p className="text-body-md font-medium text-error/90">AI-yə ötürülmədi</p>
        </Card>
      </div>

      {/* Restrained Visualization Section 1: Weekly Risk Trend (AreaChart) */}
      <Card padding="lg" className="space-y-6 shadow-[0px_4px_20px_rgba(16,0,40,0.04)] border border-outline-variant">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-title-lg font-semibold text-on-surface mb-1">Həftəlik Risk və Sənəd Axını Dinamikası</h3>
            <p className="text-body-md text-on-surface-variant">Son 7 gün ərzində skan edilmiş və bloka alınmış sənəd dinamikası</p>
          </div>
          <div className="flex items-center gap-4 text-label-sm font-medium">
            <span className="flex items-center gap-2 text-brand-blue bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" /> Təhlükəsiz
            </span>
            <span className="flex items-center gap-2 text-error bg-error-container/40 px-3 py-1.5 rounded-full border border-error/20">
              <span className="w-2.5 h-2.5 rounded-full bg-error" /> Bloklanan
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-4 -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.riskTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3174ef" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3174ef" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0px 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
                itemStyle={{ fontSize: '14px', fontWeight: 500 }}
              />
              <Area type="monotone" dataKey="safe" name="Təhlükəsiz" stroke="#3174ef" fillOpacity={1} fill="url(#colorSafe)" strokeWidth={3} />
              <Area type="monotone" dataKey="blocked" name="Bloklanan" stroke="#ba1a1a" fillOpacity={1} fill="url(#colorBlocked)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Restrained Visualization Section 2: Injection Types & Department Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Injection Type Distribution */}
        <Card padding="lg" className="space-y-6 shadow-[0px_4px_20px_rgba(16,0,40,0.04)] border border-outline-variant">
          <div>
            <h3 className="text-title-lg font-semibold text-on-surface mb-1">Aşkar Edilmiş Injection Tiplərinin Paylanması</h3>
            <p className="text-body-md text-on-surface-variant">Sənəd koda tətbiq edilən əsas hücum vektoru texnikaları</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.injectionTypes} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="type" type="category" stroke="#374151" fontSize={12} width={140} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.02)'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0px 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" name="Sayı" radius={[0, 4, 4, 0]} barSize={32}>
                  {metrics.injectionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Risk Distribution */}
        <Card padding="lg" className="space-y-6 shadow-[0px_4px_20px_rgba(16,0,40,0.04)] border border-outline-variant flex flex-col">
          <div>
            <h3 className="text-title-lg font-semibold text-on-surface mb-1">Departamentlər üzrə Risk Faizi</h3>
            <p className="text-body-md text-on-surface-variant">Ən çox şübhəli sənəd qeydə alınan korporativ sahələr</p>
          </div>

          <div className="flex-1 space-y-6 pt-4 flex flex-col justify-center">
            {metrics.departmentRisks.map((dept) => (
              <div key={dept.department} className="space-y-2">
                <div className="flex items-center justify-between text-body-md">
                  <span className="font-medium text-on-surface flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${dept.riskRate > 20 ? 'bg-error' : dept.riskRate > 10 ? 'bg-warning' : 'bg-brand-blue'}`} />
                    {dept.department}
                  </span>
                  <span className={`font-bold ${dept.riskRate > 20 ? 'text-error' : 'text-on-surface'}`}>{dept.riskRate}% risk</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${dept.riskRate}%`,
                      backgroundColor: dept.riskRate > 20 ? '#ba1a1a' : dept.riskRate > 10 ? '#f59e0b' : '#3174ef'
                    }}
                  />
                </div>
                <div className="text-label-sm text-on-surface-variant/60 text-right">
                  Ümumi skan: {dept.scanned} sənəd
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RiskReportsPage;
