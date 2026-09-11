import React from 'react';

export const renderWithFerqliTags = (text?: string): React.ReactNode => {
  if (!text) return null;
  if (!text.includes('<ferqli>')) return text;

  const parts = text.split(/(<ferqli>[\s\S]*?<\/ferqli>)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('<ferqli>') && part.endsWith('</ferqli>')) {
          const content = part.slice(8, -9);
          return (
            <mark
              key={index}
              className="bg-yellow-300 text-gray-900 font-bold px-1.5 py-0.5 rounded shadow-2xs inline leading-relaxed"
            >
              {content}
            </mark>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};
