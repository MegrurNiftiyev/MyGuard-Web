import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onCharacter?: () => void;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 12,
  className,
  onCharacter,
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const textRef = useRef(text);
  textRef.current = text;

  useEffect(() => {
    setDisplayedText('');
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(textRef.current.substring(0, i));
      if (onCharacter) onCharacter();

      if (i >= textRef.current.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className={className}>
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </div>
  );
};
