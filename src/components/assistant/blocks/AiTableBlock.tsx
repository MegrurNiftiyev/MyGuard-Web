import React from 'react';

export interface AiTableBlockProps {
  title?: string;
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
}

export const AiTableBlock: React.FC<AiTableBlockProps> = ({ title, headers = [], rows = [] }) => {
  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-5 shadow-xs my-3 overflow-hidden">
      {title && (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/30">
          <span className="text-xl">🧑‍💻</span>
          <h3 className="text-title-md font-bold text-on-surface">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[550px]">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-low/40">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-label-sm font-bold text-on-surface uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
                {row.map((cell, j) => {
                  const cellStr = String(cell);
                  return (
                    <td key={j} className="px-4 py-3 text-body-sm text-on-surface whitespace-nowrap">
                      {cellStr === 'Artım' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Artım
                        </span>
                      ) : cellStr === 'Azalma' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Azalma
                        </span>
                      ) : typeof cell === 'string' && cell.startsWith('+') ? (
                        <span className="font-semibold text-emerald-600">{cell}</span>
                      ) : typeof cell === 'string' && cell.startsWith('-') ? (
                        <span className="font-semibold text-zinc-600 dark:text-zinc-400">{cell}</span>
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
