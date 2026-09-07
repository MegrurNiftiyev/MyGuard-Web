import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Typewriter } from '../../ui/Typewriter';
import { resolveScreenRoute } from './AiLinkBlock';

const CustomLink: React.FC<{ href?: string; children?: React.ReactNode }> = ({ href, children }) => {
  const navigate = useNavigate();
  const screenRoute = resolveScreenRoute(href);

  if (screenRoute) {
    const Icon = screenRoute.icon;
    const labelText = String(children || screenRoute.defaultLabel);

    return (
      <span className="block my-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigate(screenRoute.path);
            window.dispatchEvent(new CustomEvent('close-floating-chat'));
          }}
          className="w-full py-2 px-3 rounded-xl bg-brand-blue hover:bg-brand-blue/90 active:scale-[0.98] text-white text-xs font-bold inline-flex items-center justify-between shadow-xs transition-all cursor-pointer group hover:shadow-md"
        >
          <span className="flex items-center gap-2 truncate">
            <Icon className="w-3.5 h-3.5 text-white/90 shrink-0" />
            <span className="truncate">{labelText}</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
        </button>
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-brand-blue font-bold hover:underline">
      {children}
    </a>
  );
};

export const AiTextBlock: React.FC<{ 
  content: string; 
  animate?: boolean; 
  onTyping?: () => void;
  onComplete?: () => void;
}> = ({
  content,
  animate = true,
  onTyping,
  onComplete
}) => {
  const [isDone, setIsDone] = useState(!animate);

  const handleComplete = () => {
    setIsDone(true);
    if (onComplete) onComplete();
  };

  return (
    <div className="text-inherit text-on-surface leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-2 [&_strong]:font-bold [&_strong]:text-on-surface">
      {animate && !isDone ? (
        <Typewriter
          text={content}
          speed={10}
          onCharacter={onTyping}
          onComplete={handleComplete}
        />
      ) : (
        <ReactMarkdown
          components={{
            a: CustomLink
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
};
