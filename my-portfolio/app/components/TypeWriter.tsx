'use client';

import { useEffect, useState } from 'react';

interface TypewriterProps {
  texts: string[];
  speed?: number;      // typing speed per character
  delay?: number;      // pause between strings (ms)
  loop?: boolean;      // allow cycling and deletion
}

const Typewriter: React.FC<TypewriterProps> = ({
  texts,
  speed = 100,
  delay = 1500,
  loop = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0 || (!loop && completed)) return;

    const currentText = texts[textIndex];

    if (pause) {
      const timeout = setTimeout(() => {
        if (!loop) {
          if (textIndex < texts.length - 1) {
            setTextIndex(textIndex + 1);
            setDisplayedText('');
            setCharIndex(0);
            setPause(false);
          } else {
            setCompleted(true);
          }
        } else {
          setPause(false);
        }
      }, delay);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      if (!loop) {
        const nextIndex = charIndex + 1;
        setDisplayedText(currentText.slice(0, nextIndex));
        setCharIndex(nextIndex);

        if (nextIndex === currentText.length) {
          setPause(true);
        }
        return;
      }

      if (!isDeleting) {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        if (charIndex + 1 === currentText.length) {
          setPause(true);           // pause before deleting
          setIsDeleting(true);
        } else {
          setCharIndex(charIndex + 1);
        }
      } else {
        setDisplayedText(currentText.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
        setCharIndex(charIndex - 1);
      }
    }, !loop ? speed : isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, pause, textIndex, texts, speed, delay, loop, completed]);

  useEffect(() => {
    setDisplayedText('');
    setTextIndex(0);
    setCharIndex(0);
    setPause(false);
    setIsDeleting(false);
    setCompleted(false);
  }, [texts, loop]);

  return (
    <span>
      {displayedText}
      <span className="ml-1 animate-blink">|</span>
      <style jsx>{`
        .animate-blink {
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

export default Typewriter;
