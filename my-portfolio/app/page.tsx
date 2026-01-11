'use client';

import { useEffect, useRef, useState } from 'react';
import { sections } from './data';
import type { EducationItem, ProjectItem, SectionItem } from './data';
import Typewriter from './components/TypeWriter';
import SimpleTesseract from './components/SimpleTesseract';

const isProjectItem = (item: SectionItem | undefined): item is ProjectItem =>
  !!item && Array.isArray((item as ProjectItem).tech);

export default function Home() {
  const [activeSection, setActiveSection] = useState(0);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(true);
  const directoryContentRef = useRef<HTMLDivElement | null>(null);
  const [directoryHeight, setDirectoryHeight] = useState<number | null>(null);
  const [isWindowVisible, setIsWindowVisible] = useState(true);
  const activeSectionData = sections[activeSection];
  const educationItems =
    activeSectionData.id === 'education'
      ? ((activeSectionData.items ?? []) as EducationItem[])
      : [];
  const projectItems =
    activeSectionData.id === 'projects'
      ? (activeSectionData.items ?? []).filter(isProjectItem)
      : [];
  
  const navigateToSection = (index: number) => {
    setActiveSection(index);
  };

  const toggleDirectory = () => {
    if (directoryContentRef.current) {
      const contentHeight = directoryContentRef.current.scrollHeight;
      setDirectoryHeight(contentHeight);
    }
    setIsDirectoryOpen((prev) => !prev);
  };

  useEffect(() => {
    const contentEl = directoryContentRef.current;
    if (!contentEl) return;

    const updateHeight = () => {
      setDirectoryHeight(contentEl.scrollHeight);
    };

    updateHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(contentEl);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);
  
  return (
    <div className="portfolio-root min-h-screen md:h-screen flex flex-col md:flex-row items-start md:items-center justify-center p-4 md:p-8">
      {isWindowVisible ? (
        <div className="w-full max-w-6xl md:h-[90vh] bg-white rounded-xl overflow-hidden window-shadow border-4 border-black flex flex-col">
        <div className="bg-white border-b-4 border-black px-4 py-3 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWindowVisible(false)}
              aria-label="Close window"
              className="w-4 h-4 rounded-full bg-portfolio-red hover:opacity-80 transition-opacity"
            ></button>
            <div className="w-4 h-4 rounded-full bg-portfolio-yellow"></div>
            <div className="w-4 h-4 rounded-full bg-portfolio-green"></div>
          </div>
          <div className="text-2xl font-bold text-black">📁 Quinn Wang - Portfolio</div>
          <div className="w-24"></div>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
          <div className="w-full md:w-64 bg-gray-100 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col">
            <div className="px-4 py-4 border-b-4 border-black bg-white">
              <div className="text-xl font-bold text-black mt-1">📂 Contents!</div>
            </div>
            <div className="sidebar-scroll flex-1 overflow-y-auto">
              <div className="p-2">
                <button
                  type="button"
                  onClick={toggleDirectory}
                  aria-expanded={isDirectoryOpen}
                  className="w-full text-xs font-bold text-black px-3 py-3 uppercase tracking-wider flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition-colors mb-2 cursor-pointer"
                >
                  <span>📁</span>
                  <span className="flex-1 text-left">File Directory</span>
                  <span className="text-lg leading-none">{isDirectoryOpen ? '-' : '+'}</span>
                </button>
                <div
                  className={`pl-4 relative directory-list ${
                    isDirectoryOpen ? 'directory-open' : 'directory-closed directory-list-closed'
                  }`}
                  style={{
                    maxHeight: isDirectoryOpen
                      ? directoryHeight === null
                        ? 'none'
                        : `${directoryHeight}px`
                      : '0px',
                  }}
                >
                  <div className="directory-line absolute left-4 top-0 bottom-0 w-0.5 bg-gray-400"></div>
                  <div ref={directoryContentRef}>
                    {sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => navigateToSection(index)}
                        className={`w-full text-left py-2 text-sm font-medium transition-colors flex items-center gap-2 tree-line directory-item ${
                          index === sections.length - 1 ? 'tree-last' : ''
                        } ${
                          index === activeSection
                            ? 'bg-gray-300 text-black font-bold'
                            : 'text-black hover:bg-gray-200'
                        }`}
                      >
                        <span className="text-base relative z-10">📄</span>
                        <span className="flex-1 relative z-10">{section.title.toLowerCase()}.txt</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 bg-white overflow-hidden flex flex-col">
            <div className="bg-gray-100 border-b-4 border-black px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span>📄</span>
                <span className="text-2xl font-bold text-black">
                  {activeSectionData.title.toLowerCase()}.txt
                </span>
              </div>
            </div>
            
            <div
              className={`flex-1 overflow-y-auto p-6 md:p-8 bg-white content-scroll ${
                activeSectionData.id === 'intro' ? 'flex justify-start items-center pt-24 mb-20' : ''
              }`}
            >
              {activeSectionData.id === 'intro' && (
                <div className="flex flex-col items-center text-center max-w-4xl w-full">
                  <h1 className="earwig-font text-5xl md:text-7xl mb-6 text-black">
                    <Typewriter texts={[activeSectionData.title]} loop={false} speed={80} />
                  </h1>
                  <div className="space-y-2  max-w-3xl mx-auto">
                    {activeSectionData.subtitle?.map((line, i) => (
                      <p key={i} className="text-lg md:text-xl text-[#4a4a4a] text-center">
                        {line}
                      </p>
                    ))}
                  </div>
                  {activeSectionData.descriptions && activeSectionData.descriptions.length > 0 && (
                    <div className="mt-8 space-y-2">
                      <div className="text-lg font-semibold text-black flex items-center gap-2 justify-center">
                        <span>→</span>
                        <Typewriter texts={activeSectionData.descriptions} loop speed={40} />
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeSectionData.id === 'about' && (
                <div>
                  <h2 className="earwig-font text-4xl md:text-5xl mb-8 text-black">
                    <Typewriter texts={[activeSectionData.title]} loop={false} speed={80} />
                  </h2>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <p className="text-lg leading-relaxed text-[#2d2d2d]">
                        {activeSectionData.content}
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-4">
                      <div className="w-full flex items-center justify-center bg-gray-200 rounded-lg p-8 border-4 border-black">
                        <SimpleTesseract />
                      </div>
                      <p className="text-sm text-[#2d2d2d] text-center">
                        This is a{' '}
                        <a
                          href="https://en.wikipedia.org/wiki/Tesseract"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-portfolio-blue"
                        >
                          tesseract
                        </a>{' '}
                        rotating in the x-w plane and the y-z plane.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSectionData.id === 'education' && (
                <div>
                  <h2 className="earwig-font text-4xl md:text-5xl mb-8 text-black">
                    <Typewriter texts={[activeSectionData.title]} loop={false} speed={80} />
                  </h2>
                  <div className="space-y-6">
                    {educationItems.map((item, i) => (
                      <div key={i} className="bg-gray-100 border-4 border-black rounded-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-black">{item.title}</h3>
                          <span className="text-black font-medium">{item.period}</span>
                        </div>
                        <p className="mb-4 text-black text-base">{item.description}</p>
                        {item.awards?.map((award, j) => (
                          <div key={j} className="bg-white border-2 border-black p-4 mt-3 rounded">
                            <p className="text-[#2d2d2d] text-sm">{award}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeSectionData.id === 'skills' && (
                <div>
                  <h2 className="earwig-font text-4xl md:text-5xl mb-8 text-black">
                    <Typewriter texts={[activeSectionData.title]} loop={false} speed={80} />
                  </h2>
                  {activeSectionData.categories?.map((category, i) => (
                    <div key={i} className="mb-8">
                      <h3 className="text-xl font-bold mb-4 text-black border-b-2 border-black pb-2">
                        {category.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((item, j) => (
                          <span
                            key={j}
                            className="px-4 py-2 text-sm bg-gray-200 text-black font-semibold border-2 border-black rounded hover:bg-gray-300 transition-colors"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeSectionData.id === 'projects' && (
                <div>
                  <h2 className="earwig-font text-4xl md:text-5xl mb-8 text-black">
                    <Typewriter texts={[activeSectionData.title]} loop={false} speed={80} />
                  </h2>
                  <div className="space-y-8">
                    {projectItems.map((project, i) => (
                      <div key={i} className="bg-gray-100 border-4 border-black rounded-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                          <h3 className="text-2xl font-bold text-black">
                            {project.title}
                            {project.url && (
                              <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-3 text-base text-black hover:text-gray-600 transition-colors underline"
                              >
                                [view →]
                              </a>
                            )}
                          </h3>
                          <span className="text-black font-medium">{project.period}</span>
                        </div>
                        {project.tech && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.map((tech, j) => (
                              <span
                                key={j}
                                className="px-3 py-1 text-xs bg-white border-2 border-black rounded font-medium "
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {project.points && (
                          <ul className="space-y-2 text-black">
                            {project.points.map((point, j) => (
                              <li key={j} className="flex gap-2">
                                <span className="text-black font-bold">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeSectionData.id === 'contact' && (
                <div>
                  <h2 className="earwig-font text-4xl md:text-5xl mb-8 text-black">
                    <Typewriter texts={[activeSectionData.title]} loop={false} speed={80} />
                  </h2>
                  <div className="space-y-6">
                    {activeSectionData.email && (
                      <div className="bg-gray-100 border-4 border-black rounded-lg p-6">
                        <span className="text-black font-semibold block mb-2">Email:</span>
                        <a
                          href={`mailto:${activeSectionData.email}`}
                          className="text-lg text-black hover:text-gray-600 transition-colors font-medium underline"
                        >
                          {activeSectionData.email}
                        </a>
                      </div>
                    )}
                    
                    {activeSectionData.links && (
                      <div className="bg-gray-100 border-4 border-black rounded-lg p-6">
                        <span className="text-black font-semibold block mb-4">Find me on:</span>
                        <div className="flex flex-wrap gap-3">
                          {activeSectionData.links.map((link) => (
                            <a
                              key={link.name}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-200 text-black border-2 border-black px-5 py-2 rounded font-semibold hover:bg-gray-300 transition-colors"
                            >
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-4">
          
          <button
            type="button"
            onClick={() => setIsWindowVisible(true)}
            className="border-4 border-black rounded-lg overflow-hidden "
            aria-label="Reopen window"
          >
            <img
              src="/kirby.gif"
              alt="Kirby waving to reopen the window"
              className="w-40 h-auto"
            />
          </button>
          <div className="text-lg text-white font-semibold">hooray! click on the kirby to reopen the window</div>
        </div>
      )}
    </div>
  );
}