'use client';

import { useEffect, useState } from 'react';

interface TypewriterProps {
  texts: string[];
  speed?: number;      // typing speed per character
  delay?: number;      // pause at the end of each string (ms)
}

const Typewriter: React.FC<TypewriterProps> = ({
  texts,
  speed = 100,
  delay = 1500,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    const currentText = texts[textIndex];

    if (pause) {
      const timeout = setTimeout(() => setPause(false), delay);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
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
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, pause, textIndex, texts, speed, delay]);

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
