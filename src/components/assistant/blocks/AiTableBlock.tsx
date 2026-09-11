import React from 'react';
import { FileText, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { formatUploadDate } from '../../../utils/dateFormatter';

const decodeFileName = (text: string) => {
  if (!text) return text;
  try {
    return decodeURIComponent(escape(text));
  } catch {
    return text;
  }
};

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

  const renderCellContent = (cell: string | number, headerName?: string) => {
    if (cell === null || cell === undefined) return '';

    const cellStr = String(cell).trim();
    const lower = cellStr.toLowerCase();
    const headerLower = (headerName || '').toLowerCase();

    // 1. Prompt / Code / Index Snippets (e.g., "'Ignore previous instructions...'")
    if (
      cellStr.startsWith("'") || 
      cellStr.startsWith('"') || 
      headerLower.includes('indeks') || 
      headerLower.includes('snippet') || 
      headerLower.includes('prompt') || 
      headerLower.includes('kod')
    ) {
      return (
        <code className="inline-block font-mono text-xs bg-red-50/80 text-red-700 border border-red-200/60 px-3 py-1.5 rounded-lg whitespace-nowrap align-middle" title={cellStr}>
          {cellStr}
        </code>
      );
    }

    // 2. Risk Status Indicators (Clean text with subtle dot indicator)
    if (lower.includes('yüksək risk') || lower.includes('high_risk') || lower.includes('high risk') || lower.includes('blocked')) {
      return (
        <span className="inline-flex items-center gap-2 font-bold text-red-600 text-sm whitespace-nowrap font-sans">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 animate-pulse" />
          <span>{cellStr}</span>
        </span>
      );
    }
    if (lower.includes('şübhəli') || lower.includes('suspicious') || lower.includes('warning')) {
      return (
        <span className="inline-flex items-center gap-2 font-bold text-amber-600 text-sm whitespace-nowrap font-sans">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <span>{cellStr}</span>
        </span>
      );
    }
    if (lower.includes('təhlükəsiz') || lower.includes('safe') || lower.includes('clean')) {
      return (
        <span className="inline-flex items-center gap-2 font-bold text-emerald-600 text-sm whitespace-nowrap font-sans">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span>{cellStr}</span>
        </span>
      );
    }

    // 3. File Names (Clean icon + full decoded text with solid font)
    if (lower.endsWith('.docx') || lower.endsWith('.pdf') || lower.endsWith('.txt') || lower.endsWith('.doc')) {
      const displayName = decodeFileName(cellStr.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i, ''));
      return (
        <span className="inline-flex items-center gap-2 font-bold text-on-surface text-sm whitespace-nowrap font-sans" title={cellStr}>
          <FileText className="w-4 h-4 text-brand-blue shrink-0" />
          <span>{displayName}</span>
        </span>
      );
    }

    // 4. Date / Time (Format: 2026-09-08 14:12 -> 2026 sentyabr 08 14:12)
    if (cellStr.match(/^\d{4}-\d{2}-\d{2}/) || headerLower.includes('tarix') || headerLower.includes('date') || headerLower.includes('time')) {
      const formattedDate = formatUploadDate(cellStr);
      return (
        <span className="font-sans text-xs font-semibold text-on-surface-variant whitespace-nowrap bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/60">
          {formattedDate}
        </span>
      );
    }

    // 5. Numeric Risk Scores / Percentages (Solid bold font)
    if (typeof cell === 'number' || (!isNaN(Number(cellStr)) && cellStr !== '' && !cellStr.includes('-') && !cellStr.includes(':'))) {
      const num = Number(cellStr);
      if (headerLower.includes('skor') || headerLower.includes('ehtimal') || headerLower.includes('faiz') || headerLower.includes('risk') || headerLower.includes('score') || headerLower.includes('bal')) {
        const colorClass = num >= 70 ? 'text-red-600' : num >= 30 ? 'text-amber-600' : 'text-emerald-600';
        const hasPercent = headerLower.includes('%') || headerLower.includes('faiz') || headerLower.includes('ehtimal');
        return (
          <span className={`font-extrabold font-sans text-sm ${colorClass}`}>
            {num}{hasPercent ? '%' : ''}
          </span>
        );
      }
      return <span className="font-sans text-sm font-bold text-on-surface">{cellStr}</span>;
    }

    // Default text
    return <span className="text-sm font-medium text-on-surface whitespace-nowrap font-sans">{decodeFileName(cellStr)}</span>;
  };

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-4 sm:p-5 shadow-xs my-3 overflow-hidden animate-in fade-in duration-300">
      {title && (
        <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-outline-variant/30">
          <FileText className="w-4.5 h-4.5 text-brand-blue" />
          <h3 className="text-title-md font-bold text-on-surface">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto custom-scrollbar w-full pb-1">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-low/60">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap font-sans">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-surface-container-low/40 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-sm text-on-surface whitespace-nowrap align-middle font-sans">
                    {renderCellContent(cell, headers[j])}
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
