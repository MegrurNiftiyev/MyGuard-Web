import React from 'react';
import ReactMarkdown from 'react-markdown';

export const AiTextBlock: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="font-body-md text-body-md text-on-surface leading-relaxed [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-2 [&_strong]:font-bold [&_strong]:text-on-surface [&_a]:text-brand-blue [&_a]:underline">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
