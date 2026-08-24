import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, ArrowRight, ShieldAlert, Download, SlidersHorizontal } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { mockDocuments } from '../data/mockData';
import { RiskStatus } from '../types';

import { useLanguage } from '../context/LanguageContext';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: t('filterAll') || 'Bütün' },
    { id: 'safe', label: t('filterSafe') || 'Təhlükəsiz' },
    { id: 'suspicious', label: t('filterSuspicious') || 'Şübhəli' },
    { id: 'high_risk', label: t('filterHighRisk') || 'Yüksək riskli' },
    { id: 'blocked', label: t('filterBlocked') || 'Bloklanan' }
  ];

  const filteredDocs = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.department.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && doc.status === activeFilter;
  });

  const getAccentColor = (status: RiskStatus) => {
    switch (status) {
      case 'blocked':
        return '#ba1a1a';
      case 'high_risk':
        return '#ba1a1a';
      case 'suspicious':
        return '#8c5000';
      case 'safe':
        return '#006e36';
      default:
        return '#c4c6cf';
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">
            {t('documentsPageTitle') || 'Sənəd İdarəetmə Mərkəzi'}
          </h1>
          <p className="text-body-md text-on-surface-variant">
            {t('documentsPageSubtitle') || 'Skan edilmiş korporativ sənədlərin siyahısı, risk dərəcələri və təhlükəsizlik statusları'}
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/scan')}>
          {t('newDocumentScan') || 'Yeni Sənəd Skan Et'}
        </Button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <Card padding="md" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-label-md transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-brand-blue text-white font-semibold shadow-xs'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Sənəd adı və ya departament..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-outline-variant bg-white text-label-md focus:border-brand-blue focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Data List (Clean Enterprise Table with 1px dividers & 4px left accent bars) */}
      <Card padding="none" className="overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-surface-container-low border-b border-outline-variant text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
          <div className="col-span-5">Sənəd</div>
          <div className="col-span-2">Tarix & Departament</div>
          <div className="col-span-2">Tip / Həcm</div>
          <div className="col-span-1 text-center">Risk</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-outline-variant">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/analysis/${doc.id}`)}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-surface-container-low transition-colors cursor-pointer group relative"
            >
              {/* 4px Left Accent Bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ backgroundColor: getAccentColor(doc.status) }}
              />

              {/* Column 1: Document */}
              <div className="col-span-5 flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-on-surface-variant group-hover:text-brand-blue transition-colors" />
                </div>
                <div className="min-w-0">
                  <div className="text-title-lg font-medium text-on-surface truncate group-hover:text-brand-blue transition-colors">
                    {doc.name}
                  </div>
                  <div className="text-label-sm text-on-surface-variant/70">
                    Category: {doc.category}
                  </div>
                </div>
              </div>

              {/* Column 2: Date & Dept */}
              <div className="col-span-2 text-label-md text-on-surface-variant">
                <div className="font-medium text-on-surface">{doc.department}</div>
                <div className="text-label-sm text-on-surface-variant/70">{doc.uploadTime}</div>
              </div>

              {/* Column 3: Type / Size */}
              <div className="col-span-2 text-label-md text-on-surface-variant">
                <div className="font-medium text-on-surface">{doc.fileType}</div>
                <div className="text-label-sm text-on-surface-variant/70">{doc.size}</div>
              </div>

              {/* Column 4: Risk */}
              <div className="col-span-1 flex items-center">
                {doc.riskScore > 0 ? (
                  <span className={`font-semibold ${doc.riskScore >= 70 ? 'text-error border-l-4 border-error pl-2' : doc.riskScore >= 40 ? 'text-warning border-l-4 border-warning pl-2' : 'text-success border-l-4 border-success pl-2'}`}>
                    {doc.riskScore}/100
                  </span>
                ) : (
                  <span className="text-on-surface-variant font-semibold">-</span>
                )}
              </div>

              {/* Column 5: Status */}
              <div className="col-span-2 flex items-center justify-end gap-3">
                <Chip status={doc.status} />
                <ArrowRight className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="p-12 text-center text-on-surface-variant space-y-2">
              <FileText className="w-10 h-10 mx-auto text-outline" />
              <div className="text-title-lg font-semibold">Heç bir sənəd tapılmadı</div>
              <p className="text-body-md">Axtarış meyarlarını dəyişin və ya yeni sənəd skan edin.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DocumentsPage;
