import React from 'react';

/**
 * Parses text containing one or multiple hidden text XML tags (<HiddenText>, <ferqli>, <hidden_text>)
 * and highlights the inner text content with yellow background while stripping raw XML tags.
 */
export const renderWithFerqliTags = (text?: string): React.ReactNode => {
  if (!text) return null;

  // Pattern matching any valid hidden text tag pair: <tag>content</tag>
  const tagPattern = /(<(?:ferqli|HiddenText|hidden_text|hiddenText)>[\s\S]*?<\/(?:ferqli|HiddenText|hidden_text|hiddenText)>)/gi;

  const parts = text.split(tagPattern);

  if (parts.length === 1) {
    // No full tag pairs found, just strip any stray/orphan tag strings
    const cleanText = text.replace(/<\/?(?:ferqli|HiddenText|hidden_text|hiddenText)>/gi, '');
    return cleanText;
  }

  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^<(?:ferqli|HiddenText|hidden_text|hiddenText)>([\s\S]*?)<\/(?:ferqli|HiddenText|hidden_text|hiddenText)>$/i);
        if (match) {
          const content = match[1];
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
