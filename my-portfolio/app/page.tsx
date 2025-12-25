'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { sections } from './data';
import Typewriter from './components/TypeWriter';

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll handler to update active section
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const windowHeight = window.innerHeight;
    const currentSection = Math.round(scrollPosition / windowHeight);
    if (currentSection >= 0 && currentSection < sections.length) {
      setActiveSection(currentSection);
    }
  };

  return (
    <div>
      {/* Section navigation dots */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        {sections.map((item, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === activeSection ? 'bg-black' : 'bg-gray-400'
            } cursor-pointer`}
            onClick={() => {
              const el = document.getElementById(item.id);
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto"
        onScroll={handleScroll}
      >
        {sections.map((section, index) => {
          const isActive = index === activeSection;
          return (
            <section
              key={section.id}
              id={section.id}
              className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl text-center"
              >
                {/* Typewriter for title */}
                <h1 className="text-5xl font-bold mb-4">
                  {section.title}
                </h1>

                {section.descriptions && (
                  <p className="text-xl mb-2">
                    <Typewriter texts={section.descriptions} />
                  </p>
                )}

                {/* Content */}
                {section.content && <p className="text-lg mt-4">{section.content}</p>}

                {/* Items */}
                {section.items?.map((item, i) => (
                  <div key={i} className="mt-6 text-left">
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    {'period' in item && <span className="text-gray-600">{item.period}</span>}
                    {'description' in item && <p>{item.description}</p>}
                    {'points' in item && (
                      <ul className="list-disc list-inside mt-2">
                        {item.points.map((point, j) => (
                          <li key={j}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {/* Links */}
                {section.links && (
                  <div className="mt-4 flex gap-4 justify-center">
                    {section.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                )}

                {/* Email */}
                {section.email && (
                  <div className="mt-2">
                    <a href={`mailto:${section.email}`} className="text-blue-600 underline">
                      {section.email}
                    </a>
                  </div>
                )}
              </motion.div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
