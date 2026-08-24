import React, { useState } from 'react';
import { Copy, Check, FileCode, Moon, Sun, Settings } from 'lucide-react';
import { CodeLanguage } from '../../../types';

export interface AiCodeBlockProps {
  title?: string;
  code: string;
  language?: CodeLanguage | string;
}

const LANGUAGE_BADGES: Record<string, { label: string; color: string }> = {
  [CodeLanguage.JSON]: { label: 'JSON', color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300/50' },
  [CodeLanguage.TYPESCRIPT]: { label: 'TypeScript', color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300/50' },
  [CodeLanguage.JAVASCRIPT]: { label: 'JavaScript', color: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border-yellow-300/50' },
  [CodeLanguage.PYTHON]: { label: 'Python', color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300/50' },
  [CodeLanguage.HTML]: { label: 'HTML', color: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-300/50' },
  [CodeLanguage.CSS]: { label: 'CSS', color: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-300/50' },
  [CodeLanguage.BASH]: { label: 'Bash', color: 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-400/50' },
  [CodeLanguage.SQL]: { label: 'SQL', color: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300/50' },
  [CodeLanguage.YAML]: { label: 'YAML', color: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300/50' },
};

// Custom Token Highlighting Parser for JSON & Code
function renderHighlightedCode(code: string, language: string = 'json', isDarkTheme: boolean) {
  if (language.toLowerCase() === 'json') {
    return highlightJSON(code, isDarkTheme);
  }
  return highlightGenericCode(code, isDarkTheme);
}

function highlightJSON(code: string, isDarkTheme: boolean) {
  // Regex to tokenize JSON keys, strings, numbers, booleans, null
  const jsonRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

  const lines = code.split('\n');

  return lines.map((line, lineIdx) => {
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let match: RegExpExecArray | null;

    // Reset regex for each line
    jsonRegex.lastIndex = 0;

    while ((match = jsonRegex.exec(line)) !== null) {
      const matchText = match[0];
      const matchIndex = match.index;

      // Add un-highlighted text before match
      if (matchIndex > lastIndex) {
        elements.push(
          <span key={`text-${lineIdx}-${lastIndex}`} className={isDarkTheme ? 'text-zinc-400' : 'text-slate-600'}>
            {line.slice(lastIndex, matchIndex)}
          </span>
        );
      }

      let colorClass = isDarkTheme ? 'text-zinc-200' : 'text-slate-800';

      if (/^"/.test(matchText)) {
        if (/:$/.test(matchText)) {
          // JSON Key
          colorClass = isDarkTheme ? 'text-sky-300 font-semibold' : 'text-purple-700 font-semibold';
        } else {
          // JSON String Value
          colorClass = isDarkTheme ? 'text-emerald-400' : 'text-emerald-700';
        }
      } else if (/true|false/.test(matchText)) {
        // Boolean
        colorClass = isDarkTheme ? 'text-amber-400 font-bold' : 'text-amber-600 font-bold';
      } else if (/null/.test(matchText)) {
        // Null
        colorClass = isDarkTheme ? 'text-rose-400 italic' : 'text-rose-600 italic';
      } else if (/-?\d+/.test(matchText)) {
        // Number
        colorClass = isDarkTheme ? 'text-cyan-300 font-mono' : 'text-blue-600 font-mono';
      }

      elements.push(
        <span key={`match-${lineIdx}-${matchIndex}`} className={colorClass}>
          {matchText}
        </span>
      );

      lastIndex = jsonRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      elements.push(
        <span key={`text-end-${lineIdx}`} className={isDarkTheme ? 'text-zinc-400' : 'text-slate-600'}>
          {line.slice(lastIndex)}
        </span>
      );
    }

    return (
      <div key={`line-${lineIdx}`} className="table-row">
        <span className="table-cell select-none pr-4 text-right opacity-40 text-xs font-mono w-8">{lineIdx + 1}</span>
        <span className="table-cell whitespace-pre">{elements.length > 0 ? elements : ' '}</span>
      </div>
    );
  });
}

function highlightGenericCode(code: string, isDarkTheme: boolean) {
  const lines = code.split('\n');
  return lines.map((line, lineIdx) => (
    <div key={`line-${lineIdx}`} className="table-row">
      <span className="table-cell select-none pr-4 text-right opacity-40 text-xs font-mono w-8">{lineIdx + 1}</span>
      <span className={`table-cell whitespace-pre ${isDarkTheme ? 'text-emerald-400' : 'text-slate-800'}`}>{line || ' '}</span>
    </div>
  ));
}

export const AiCodeBlock: React.FC<AiCodeBlockProps> = ({
  title = 'Nümunə Kod Cavabı',
  code = '',
  language = CodeLanguage.JSON
}) => {
  const [copied, setCopied] = useState(false);
  const [codeTheme, setCodeTheme] = useState<'dark' | 'light'>('dark');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeInfo = LANGUAGE_BADGES[language.toLowerCase()] || {
    label: language.toUpperCase(),
    color: 'bg-surface-container text-on-surface-variant border-outline-variant'
  };

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-5 shadow-xs my-3 overflow-hidden">
      {/* Header with Title, Language Badge, Theme Toggle & Copy Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-on-surface-variant shrink-0" />
          <h3 className="text-title-md font-bold text-on-surface">{title}</h3>
        </div>

        {/* Controls: Settings / Theme Switcher + Copy Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Code Block Theme Toggle */}
          <button
            type="button"
            onClick={() => setCodeTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-outline-variant/50 hover:bg-surface-container-high/60 transition-colors text-on-surface-variant cursor-pointer"
            title="Kod mövzusunu dəyiş"
          >
            {codeTheme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Dark Theme</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-outline-variant/50 hover:bg-surface-container-high/60 transition-colors text-on-surface-variant cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Container with Syntax Highlighting and Line Numbers */}
      <div className={`p-4 rounded-2xl border transition-colors overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed shadow-inner ${
        codeTheme === 'dark' 
          ? 'bg-zinc-950 text-zinc-100 border-zinc-800' 
          : 'bg-slate-50 text-slate-900 border-slate-200'
      }`}>
        <div className="table w-full border-collapse">
          {renderHighlightedCode(code, language, codeTheme === 'dark')}
        </div>
      </div>
    </div>
  );
};
