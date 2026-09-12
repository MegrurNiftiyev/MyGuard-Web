import React from 'react';

export const renderWithFerqliTags = (text?: string): React.ReactNode => {
  if (!text) return null;

  const tagPattern = /(<(?:ferqli|HiddenText|hidden_text|hiddenText)>[\s\S]*?<\/(?:ferqli|HiddenText|hidden_text|hiddenText)>)/gi;

  if (!tagPattern.test(text)) {
    const cleanText = text.replace(/<\/?(?:ferqli|HiddenText|hidden_text|hiddenText)>/gi, '');
    return cleanText;
  }

  const parts = text.split(tagPattern);

  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^<(ferqli|HiddenText|hidden_text|hiddenText)>([\s\S]*?)<\/\1>$/i);
        if (match) {
          const content = match[2];
          return (
            <mark
              key={index}
              className="bg-yellow-300 text-gray-900 font-bold px-1.5 py-0.5 rounded shadow-2xs inline leading-relaxed"
            >
              {content}
            </mark>
          );
        }
        const cleanPart = part.replace(/<\/?(?:ferqli|HiddenText|hidden_text|hiddenText)>/gi, '');
        return <React.Fragment key={index}>{cleanPart}</React.Fragment>;
      })}
    </>
  );
};
