import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, ArrowRight, Eye, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { TableSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { RiskStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { documentsApi, DocumentItem } from '../api/documentsApi';

const decodeFileName = (text: string) => {
  if (!text) return text;
  try {
    return decodeURIComponent(escape(text));
  } catch {
    return text;
  }
};

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; docId: string; docName: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, docId: string, docName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      docId,
      docName,
    });
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    documentsApi.deleteDocument(docId).catch((err) => {
      console.warn('Background delete error:', err);
    });
  };

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      try {
        const liveDocs = await documentsApi.getDocuments();
        if (liveDocs && liveDocs.length > 0) {
          const mappedDocs = liveDocs.map((d: DocumentItem) => ({
            id: d.id,
            name: d.fileName || 'Sənəd.pdf',
            category: d.fileType?.toUpperCase() || 'DOCUMENT',
            uploadTime: d.uploadedAt ? new Date(d.uploadedAt).toLocaleString('az-AZ') : 'İndi',
            department: 'Təhlükəsizlik İdarəsi',
            size: d.fileSizeBytes ? `${(d.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB',
            status: (d.finalStatus as RiskStatus) || (d.isContainInjection ? 'high_risk' : 'safe'),
            riskScore: d.finalRiskScore ?? (d.isContainInjection ? 85 : 12),
            fileType: d.fileType?.toUpperCase() || 'PDF'
          }));
          setDocuments(mappedDocs);
        } else {
          setDocuments([]);
        }
      } catch (err) {
        console.warn('Live documents fetch failed:', err);
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const filterTabs = [
    { id: 'all', label: t('filterAll') || 'Bütün' },
    { id: 'safe', label: t('filterSafe') || 'Təhlükəsiz' },
    { id: 'suspicious', label: t('filterSuspicious') || 'Şübhəli' },
    { id: 'high_risk', label: t('filterHighRisk') || 'Yüksək riskli' },
    { id: 'blocked', label: t('filterBlocked') || 'Bloklanan' }
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.department.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'all') return matchesSearch;
    return matchesSearch && doc.status === activeFilter;
  });

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

      {/* Data List */}
      <Card padding="none" className="overflow-hidden">
        {/* Table Header (Desktop Only) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-surface-container-low border-b border-outline-variant text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">
          <div className="col-span-5">Sənəd</div>
          <div className="col-span-3">Departament</div>
          <div className="col-span-2">Tip / Həcm</div>
          <div className="col-span-2 text-right">Risk Balı</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-outline-variant">
          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : filteredDocs.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Hələ ki skan edilmiş sənəd yoxdur"
              description="Axtarış meyarlarına uyğun sənəd tapılmadı və ya sistemdə hələ heç bir sənəd skan edilməyib."
              primaryActionLabel="Yeni Sənəd Skan Et"
              onPrimaryAction={() => navigate('/scan')}
              secondaryActionLabel={searchTerm || activeFilter !== 'all' ? "Filtrləri Sıfırla" : undefined}
              onSecondaryAction={searchTerm || activeFilter !== 'all' ? () => { setSearchTerm(''); setActiveFilter('all'); } : undefined}
            />
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/analysis/${doc.id}`)}
                onContextMenu={(e) => handleContextMenu(e, doc.id, doc.name)}
                className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 sm:px-6 py-4 items-start md:items-center hover:bg-surface-container-low transition-colors cursor-pointer group relative"
              >
                {/* Column 1: Document */}
                <div className="w-full md:col-span-5 flex items-center justify-between md:justify-start gap-3.5 min-w-0">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-on-surface-variant group-hover:text-brand-blue transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-title-lg font-medium text-on-surface truncate group-hover:text-brand-blue transition-colors font-sans" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                        {decodeFileName(doc.name)}
                      </div>
                      <div className="text-label-sm text-on-surface-variant/70">
                        {doc.uploadTime}
                      </div>
                    </div>
                  </div>
                  {/* Mobile-only risk score percentage */}
                  <div className="flex md:hidden flex-col items-end shrink-0">
                     {doc.riskScore > 0 && (
                       <span className={`font-bold font-mono text-xs px-2 py-0.5 rounded-full ${doc.riskScore >= 70 ? 'bg-red-50 text-red-600 border border-red-200' : doc.riskScore >= 30 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                         {doc.riskScore}%
                       </span>
                     )}
                  </div>
                </div>

                {/* Column 2: Dept (Desktop) */}
                <div className="hidden md:block col-span-3 text-label-md text-on-surface-variant">
                  <div className="font-semibold text-on-surface truncate" title={doc.department}>{doc.department}</div>
                </div>

                {/* Column 3: Type / Size (Desktop) */}
                <div className="hidden md:block col-span-2 text-label-md text-on-surface-variant">
                  <div className="font-medium text-on-surface">{doc.fileType}</div>
                  <div className="text-label-sm text-on-surface-variant/70">{doc.size}</div>
                </div>

                {/* Mobile-only additional details row */}
                <div className="flex md:hidden items-center gap-3 text-xs text-on-surface-variant/80 pl-[54px] w-full mt-1">
                  <span>{doc.uploadTime.split(' ')[0]}</span>
                  <span>•</span>
                  <span className="truncate">{doc.department}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                </div>

                {/* Column 4: Risk Percentage (Desktop) */}
                <div className="hidden md:flex col-span-2 items-center justify-end gap-2">
                  {doc.riskScore > 0 ? (
                    <span className={`font-bold font-mono text-sm px-2.5 py-1 rounded-full ${doc.riskScore >= 70 ? 'bg-red-50 text-red-600 border border-red-200/80' : doc.riskScore >= 30 ? 'bg-amber-50 text-amber-600 border border-amber-200/80' : 'bg-emerald-50 text-emerald-600 border border-emerald-200/80'}`}>
                      {doc.riskScore}%
                    </span>
                  ) : (
                    <span className="text-on-surface-variant font-semibold">-</span>
                  )}
                  <ArrowRight className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Floating Custom Right-Click Context Menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-[100] pointer-events-auto"
          onClick={() => setContextMenu(null)}
          onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}
        >
          <div
            className="fixed z-[101] bg-white/95 backdrop-blur-md border border-outline-variant/80 rounded-2xl shadow-xl p-1.5 min-w-[190px] animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${Math.max(10, Math.min(contextMenu.x, window.innerWidth - 200))}px`,
              top: `${Math.max(10, Math.min(contextMenu.y, window.innerHeight - 130))}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1.5 text-[11px] font-bold text-brand-blue uppercase tracking-wider border-b border-outline-variant/40 mb-1 select-none">
              {t('docActionsTitle') || 'Əməliyyatlar'}
            </div>

            <button
              type="button"
              onClick={() => {
                navigate(`/analysis/${contextMenu.docId}`);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-brand-blue" />
              <span>{t('viewDocument') || 'Sənədə bax'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                handleDeleteDocument(contextMenu.docId);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-error hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-error" />
              <span>{t('deleteDocument') || 'Sil'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
