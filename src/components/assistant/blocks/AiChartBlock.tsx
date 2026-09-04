import React, { useState } from 'react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { BarChart2, PieChart as PieIcon, TrendingUp, LayoutList } from 'lucide-react';

import { SemanticTone } from '../../../types';

export interface AiChartBlockProps {
  title?: string;
  subtitle?: string;
  chartType?: 'area' | 'line' | 'bar' | 'horizontal_bar' | 'donut' | 'pie';
  data: any[];
  chartKeys?: {
    nameKey?: string;
    valueKey?: string;
    dataKeys?: { key: string; tone?: SemanticTone | string; color?: string; label?: string }[];
  };
}

const DEFAULT_COLORS = ['#3B82F6', '#A855F7', '#F59E0B', '#EF4444', '#10B981', '#6366F1'];

export const SEMANTIC_COLOR_MAP: Record<string, string> = {
  primary: '#0066FF',
  secondary: '#64748B',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
  purple: '#A855F7',
  indigo: '#6366F1',
};

const resolveColor = (toneOrColor?: string, fallbackIndex: number = 0): string => {
  if (!toneOrColor) return DEFAULT_COLORS[fallbackIndex % DEFAULT_COLORS.length];
  if (SEMANTIC_COLOR_MAP[toneOrColor]) return SEMANTIC_COLOR_MAP[toneOrColor];
  return toneOrColor;
};

export const AiChartBlock: React.FC<AiChartBlockProps> = ({
  title,
  subtitle,
  chartType: initialType = 'area',
  data = [],
  chartKeys
}) => {
  const normalizedInitialType = initialType === 'pie' ? 'donut' : initialType;
  const [activeType, setActiveType] = useState<'area' | 'line' | 'bar' | 'horizontal_bar' | 'donut'>(normalizedInitialType);

  const nameKey = chartKeys?.nameKey || 'name';
  const valueKey = chartKeys?.valueKey || (data[0] && 'count' in data[0] ? 'count' : 'value');
  const dataKeys = (chartKeys?.dataKeys || [
    { key: valueKey, tone: 'primary', label: 'Dəyər' }
  ]).map((dk, idx) => ({
    ...dk,
    resolvedColor: resolveColor(dk.tone || (dk as any).color, idx)
  }));

  // Donut data transformation supporting both single and multi-series keys
  const donutData = React.useMemo(() => {
    if (chartKeys?.dataKeys && chartKeys.dataKeys.length > 1) {
      return dataKeys.map((dk) => {
        const sum = data.reduce((acc, curr) => acc + (Number(curr[dk.key]) || 0), 0);
        return {
          name: dk.label || dk.key,
          value: sum,
          color: dk.resolvedColor
        };
      });
    }
    return data.map((item, index) => ({
      name: String(item[nameKey] || item.type || item.name || `Element ${index + 1}`),
      value: Number(item[valueKey] || item.count || item.value || 0),
      color: resolveColor(item.tone || item.color, index),
      percentage: item.percentage
    }));
  }, [data, dataKeys, chartKeys, nameKey, valueKey]);

  const totalSum = donutData.reduce((acc, curr) => acc + (curr.value || 0), 0);

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-5 shadow-xs my-3 transition-all">
      {/* Header with Title, Subtitle and View Toggle Buttons */}
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-outline-variant/30">
          <div>
            {title && <h3 className="text-title-md font-bold text-on-surface flex items-center gap-2">{title}</h3>}
            {subtitle && <p className="text-body-sm text-on-surface-variant/80 mt-0.5">{subtitle}</p>}
          </div>

          {/* Toggle Switcher Buttons */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/40 self-start sm:self-auto shrink-0">
            {initialType === 'area' || initialType === 'line' ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveType('area')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeType === 'area' ? 'bg-surface shadow-xs text-brand-blue font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Area Chart"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Area</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveType('line')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeType === 'line' ? 'bg-surface shadow-xs text-brand-blue font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Line Chart"
                >
                  <TrendingUp className="w-3.5 h-3.5 rotate-45" />
                  <span>Line</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveType('bar')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeType === 'bar' ? 'bg-surface shadow-xs text-brand-blue font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Bar Chart"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Bar</span>
                </button>
              </>
            ) : initialType === 'horizontal_bar' ? (
              <>
                <button
                  type="button"
                  onClick={() => setActiveType('horizontal_bar')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeType === 'horizontal_bar' ? 'bg-surface shadow-xs text-brand-blue font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Düz Xətli Sütunlar"
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  <span>Düz</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveType('bar')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeType === 'bar' ? 'bg-surface shadow-xs text-brand-blue font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Veritkal Bar"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Bar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveType('donut')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeType === 'donut' ? 'bg-surface shadow-xs text-brand-blue font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Donut Görünüş"
                >
                  <PieIcon className="w-3.5 h-3.5" />
                  <span>Pie</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveType('donut')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeType === 'donut' ? 'bg-surface shadow-xs text-brand-blue font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Donut Chart"
                >
                  <PieIcon className="w-3.5 h-3.5" />
                  <span>Donut</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveType('bar')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeType === 'bar' ? 'bg-surface shadow-xs text-brand-blue font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  title="Bar Chart"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Bar</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chart View Content */}
      <div key={activeType} className="w-full min-h-[260px] animate-in fade-in duration-300">
        {activeType === 'horizontal_bar' ? (
          /* Düz Xətli Sütunlar (Straight Horizontal Bar View) */
          <div className="flex flex-col justify-center space-y-4 py-2">
            {data.map((item, index) => {
              const val = item[valueKey] || item.count || item.value || 0;
              const maxVal = Math.max(...data.map(d => d[valueKey] || d.count || d.value || 1));
              const pct = Math.round((val / maxVal) * 100);
              const itemColor = resolveColor(item.tone || item.color, index);

              return (
                <div key={index} className="space-y-1.5 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                    <span className="truncate max-w-[240px]">{item[nameKey] || item.type}</span>
                    <span className="font-bold text-on-surface font-mono">{val} ({item.percentage || pct}%)</span>
                  </div>
                  <div className="w-full h-3.5 bg-surface-container-low rounded-full overflow-hidden p-0.5 border border-outline-variant/30">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: itemColor
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeType === 'donut' ? (
          /* Donut / Pie Chart View with Bottom Responsive Grid Legend */
          <div className="w-full flex flex-col items-center justify-center pt-1">
            <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] shrink-0 my-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {donutData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Counter Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center animate-in zoom-in-75 duration-500">
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Ümumi</span>
                <span className="text-title-md font-bold text-on-surface font-mono">{totalSum.toLocaleString()}</span>
              </div>
            </div>

            {/* Bottom Responsive Legend Breakdown Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-outline-variant/30">
              {donutData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs p-2 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-on-surface truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-on-surface font-mono shrink-0 ml-2">{item.percentage ? `${item.percentage}%` : item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : activeType === 'bar' ? (
          /* Vertical Bar Chart with Capped Bar Width (maxBarSize={44}) */
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey={nameKey} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                {chartKeys?.dataKeys ? (
                  dataKeys.map((dk) => (
                    <Bar key={dk.key} dataKey={dk.key} name={dk.label || dk.key} fill={dk.resolvedColor} radius={[6, 6, 0, 0]} maxBarSize={44} isAnimationActive={true} animationDuration={800} />
                  ))
                ) : (
                  <Bar dataKey={valueKey} radius={[6, 6, 0, 0]} maxBarSize={44} isAnimationActive={true} animationDuration={800}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-bar-${index}`} fill={resolveColor(entry.tone || entry.color, index)} />
                    ))}
                  </Bar>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : activeType === 'line' ? (
          /* Line Chart */
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey={nameKey} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                {dataKeys.map((dk) => (
                  <Line key={dk.key} type="monotone" dataKey={dk.key} name={dk.label || dk.key} stroke={dk.resolvedColor} strokeWidth={3} dot={{ r: 4 }} isAnimationActive={true} animationDuration={800} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* Area Chart */
          <div className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {dataKeys.map((dk) => (
                    <linearGradient key={dk.key} id={`grad-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={dk.resolvedColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={dk.resolvedColor} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey={nameKey} axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                {dataKeys.map((dk) => (
                  <Area
                    key={dk.key}
                    type="monotone"
                    dataKey={dk.key}
                    name={dk.label || dk.key}
                    stroke={dk.resolvedColor}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill={`url(#grad-${dk.key})`}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
