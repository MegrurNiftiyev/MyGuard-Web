import React from 'react';
import { FileText, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export interface AiTableBlockProps {
  title?: string;
  headers?: string[];
  rows?: (string | number | React.ReactNode)[][];
  content?: any;
  tableData?: { headers: string[]; rows: (string | number)[][] };
}

export function normalizeTableBlock(props: AiTableBlockProps): {
  title?: string;
  headers: string[];
  rows: (string | number)[][];
} {
  let title = props.title;
  let headers: string[] = [];
  let rows: (string | number)[][] = [];

  if (Array.isArray(props.headers) && props.headers.length > 0) {
    headers = props.headers;
  } else if (props.tableData && Array.isArray(props.tableData.headers)) {
    headers = props.tableData.headers;
  }

  if (Array.isArray(props.rows) && props.rows.length > 0) {
    rows = props.rows as (string | number)[][];
  } else if (props.tableData && Array.isArray(props.tableData.rows)) {
    rows = props.tableData.rows as (string | number)[][];
  }

  // Handle payload format with array content:
  // content: [ { "Başlıq1": "Fayl Adı", ... }, { "Məzmun1": "...", ... } ]
  if (headers.length === 0 && Array.isArray(props.content) && props.content.length > 0) {
    const arr = props.content as Record<string, any>[];
    const firstObj = arr[0];
    const keys = Object.keys(firstObj);

    if (keys.some(k => k.toLowerCase().startsWith('başlıq') || k.toLowerCase().startsWith('header'))) {
      headers = Object.values(firstObj).map(String);
      rows = arr.slice(1).map(rowObj => Object.values(rowObj));
    } else {
      headers = keys;
      rows = arr.map(rowObj => keys.map(k => rowObj[k] ?? ''));
    }
  }

  // Handle Markdown string
  if (headers.length === 0 && typeof props.content === 'string' && props.content.includes('|')) {
    const lines = props.content.split('\n').map(l => l.trim()).filter(l => l.startsWith('|') && l.endsWith('|'));
    if (lines.length >= 2) {
      headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
      const dataLines = lines.slice(1).filter(l => !l.includes('---'));
      rows = dataLines.map(l => l.split('|').map(c => c.trim()).filter(Boolean));
    }
  }

  return { title, headers, rows };
}

export const AiTableBlock: React.FC<AiTableBlockProps> = (props) => {
  const { title, headers, rows } = normalizeTableBlock(props);

  if (headers.length === 0 && rows.length === 0) {
    return null;
  }

  const renderCellContent = (cell: string | number) => {
    const cellStr = String(cell).trim();
    const lower = cellStr.toLowerCase();

    // Risk Status Badges
    if (lower.includes('yüksək risk') || lower.includes('high_risk') || lower.includes('high risk') || lower.includes('blocked')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>{cellStr}</span>
        </span>
      );
    }
    if (lower.includes('şübhəli') || lower.includes('suspicious') || lower.includes('warning')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>{cellStr}</span>
        </span>
      );
    }
    if (lower.includes('təhlükəsiz') || lower.includes('safe') || lower.includes('clean')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{cellStr}</span>
        </span>
      );
    }

    // File name format with truncation
    if (lower.endsWith('.docx') || lower.endsWith('.pdf') || lower.endsWith('.txt')) {
      return (
        <span className="inline-flex items-center gap-2 max-w-[280px] font-medium text-on-surface truncate" title={cellStr}>
          <FileText className="w-4 h-4 text-brand-blue shrink-0" />
          <span className="truncate">{cellStr}</span>
        </span>
      );
    }

    // Risk Score Numbers
    if (typeof cell === 'number' || (!isNaN(Number(cellStr)) && cellStr !== '')) {
      const num = Number(cellStr);
      if (num >= 70) {
        return <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{num}</span>;
      }
      if (num >= 30) {
        return <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{num}</span>;
      }
      return <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{num}</span>;
    }

    return cellStr;
  };

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-5 shadow-xs my-3 overflow-hidden animate-in fade-in duration-300">
      {title && (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/30">
          <FileText className="w-5 h-5 text-brand-blue" />
          <h3 className="text-title-md font-bold text-on-surface">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[550px]">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-low/50">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-label-sm font-bold text-on-surface uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-surface-container-low/40 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-body-sm text-on-surface whitespace-nowrap">
                    {renderCellContent(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
