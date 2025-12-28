'use client';

import { useEffect, useRef, useState } from 'react';
import { sections, Section, EducationItem, ProjectItem } from './data';
import BackgroundParticles from './components/BackgroundParticles';
import Typewriter from './components/TypeWriter';
import dynamic from 'next/dynamic'


const Scene = dynamic(() => import('./components/Scene'), {
  ssr: false,
})


const ACCENT_COLOR = '#ffffff';
const SECONDARY_COLOR = '#a0a0a0';

const getSectionId = (section: Section) => section.id.trim();

export default function Home() {
    const [activeSection, setActiveSection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorSpotlightRef = useRef<HTMLDivElement>(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
      updatePreference();

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', updatePreference);
      } else {
        // @ts-ignore legacy browsers
        mediaQuery.addListener(updatePreference);
      }

      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', updatePreference);
        } else {
          // @ts-ignore legacy browsers
          mediaQuery.removeListener(updatePreference);
        }
      };
    }, []);

    useEffect(() => {
      document.documentElement.style.setProperty('--theme-accent', ACCENT_COLOR);
      document.documentElement.style.setProperty('--theme-secondary', SECONDARY_COLOR);
    }, []);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const scrollPosition = container.scrollTop;
        const viewportHeight = window.innerHeight;
        const sectionIndex = Math.round(scrollPosition / viewportHeight);

        if (sectionIndex >= 0 && sectionIndex < sections.length) {
          setActiveSection((prev) => (prev === sectionIndex ? prev : sectionIndex));
        }
      };

      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }, []);

    useEffect(() => {
      if (prefersReducedMotion) return;

      const handleMouseMove = (event: MouseEvent) => {
        if (!cursorSpotlightRef.current) return;
        cursorSpotlightRef.current.style.left = `${event.clientX}px`;
        cursorSpotlightRef.current.style.top = `${event.clientY}px`;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [prefersReducedMotion]);

    const navigateToSection = (index: number) => {
      if (index < 0 || index >= sections.length) return;
      setActiveSection(index);

      const targetId = getSectionId(sections[index]);
      const sectionElement = document.getElementById(targetId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const renderSectionContent = (section: Section) => {
      const sectionId = getSectionId(section);

      switch (sectionId) {
        case 'intro':
          return (
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-7xl mb-4  break-words">
                <Typewriter texts={[section.title]} loop={false} />
              </h1>
              <div className="space-y-2">
                {section.subtitle?.map((line, index) => (
                  <p
                    key={`${sectionId}-subtitle-${index}`}
                    className="text-base sm:text-xl md:text-2xl  "
                    style={index === 1 ? { animationDelay: '2.2s' } : undefined}
                  >
                    {line}
                  </p>
                ))}
              </div>
              {section.descriptions && (
                <div
                  className=" text-xl md:text-2xl font-bold mt-8 mb-8 min-h-[32px] flex justify-center items-center"
                  style={{ textShadow: '0 0 10px rgba(0,0,0,0.5)' }}
                >
                  <Typewriter
                    texts={section.descriptions}
                    loop
                    
                  />
                </div>
              )}
            </div>
          );
        case 'about':
          return (
            <div className="h-full flex flex-col">
              <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-8">
                <Typewriter texts={[section.title]} loop={false} />
              </h2>
              <div className="split-section flex-1">
                <div className="left">
                  <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
                <div className="right">
                  <Scene />
                </div>
              </div>
            </div>
          );
        

        case 'education': {
          const educationItems = section.items as EducationItem[] | undefined;
          return (
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-8">
                <Typewriter texts={[section.title]} loop={false} />
              </h2>
              <div className="max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
                {educationItems?.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <span className="text-white/70">{item.period}</span>
                    </div>
                    <p className="mb-4">{item.description}</p>
                    {item.awards?.map((award, awardIndex) => (
                      <div key={`${item.title}-award-${awardIndex}`} className="border border-white/20 p-3 mt-4">
                        {award}
                      </div>
                    ))}
                    {item.details && (
                      <div className="mt-4 space-y-2 education-details">
                        {item.details.map((detail, detailIndex) => (
                          <p key={`${item.title}-detail-${detailIndex}`}>{detail}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }
        case 'skills':
          return (
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-8">
                <Typewriter texts={[section.title]} loop={false} />
              </h2>
              {section.categories?.map((category) => (
                <div key={category.name} className="mb-6">
                  <h3 className="text-lg font-bold mb-3">{category.name}</h3>
                  <div className="flex flex-wrap">
                    {category.items.map((item) => (
                      <span key={`${category.name}-${item}`} className="tech-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        case 'projects': {
          const projectItems = section.items as ProjectItem[] | undefined;
          return (
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-8">
                <Typewriter texts={[section.title]} loop={false} />
              </h2>
              <div className="space-y-12 max-h-[70vh] overflow-y-auto pr-4">
                {projectItems?.map((project, index) => (
                  <div key={`${project.title}-${index}`} className="border-l-2 border-white/30 pl-4">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">
                        {project.title}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-sm text-white/70 hover:text-white transition-colors"
                          >
                            [View Project]
                          </a>
                        )}
                      </h3>
                      <span className="text-white/70">{project.period}</span>
                    </div>
                    {project.tech && (
                      <div className="flex flex-wrap mb-4">
                        {project.tech.map((tech, techIndex) => (
                          <span key={`${project.title}-tech-${techIndex}`} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.points && (
                      <ul className="list-disc list-inside space-y-2">
                        {project.points.map((point, pointIndex) => (
                          <li key={`${project.title}-point-${pointIndex}`}>{point}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }
        case 'contact':
          return (
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-8">
                <Typewriter texts={[section.title]} loop={false} />
              </h2>
              <div className="space-y-6">
                {section.email && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <span className="text-white/70">Email:</span>
                    <a href={`mailto:${section.email}`} className="typewriter">
                      {section.email}
                    </a>
                  </div>
                )}

                {section.links && section.links.length > 0 && (
                  <div className="flex flex-col items-start gap-4">
                    <span className="text-white/70">Find me on:</span>
                    <div className="flex flex-wrap gap-3">
                      {section.links.map((link) => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-white/20 px-4 py-2 hover:border-white/40 transition-all hover:bg-black/30 hover:scale-105"
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-start gap-4 mt-8">
                  <div className="flex items-center gap-2">
                    <a
                      href="https://cs.uwatering.com/#iantang.me?nav=prev"
                      className="border border-white/20 px-3 py-2 hover:border-white/40 transition-all hover:bg-black/30 hover:scale-105"
                    >
                      ←
                    </a>
                    <a
                      href="https://cs.uwatering.com/#iantang.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-white/20 px-3 py-2 hover:border-white/40 transition-all hover:bg-black/30 hover:scale-105"
                    >
                      <img
                        src="https://cs.uwatering.com/icon.white.svg"
                        alt=""
                        className="w-6 h-6 opacity-80"
                        loading="lazy"
                        decoding="async"
                      />
                    </a>
                    <a
                      href="https://cs.uwatering.com/#iantang.me?nav=next"
                      className="border border-white/20 px-3 py-2 hover:border-white/40 transition-all hover:bg-black/30 hover:scale-105"
                    >
                      →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-8">
                <Typewriter texts={[section.title]} loop={false} />
              </h2>
            </div>
          );
      }
    };

    return (
      <div className="relative" style={{ color: ACCENT_COLOR }}>
        <BackgroundParticles reduceMotion={prefersReducedMotion}/>
        {!prefersReducedMotion && <div ref={cursorSpotlightRef} className="cursor-spotlight" />}

        <div className="fixed top-4 md:top-8 left-0 right-0 z-10 flex justify-center px-2">
          <div className="flex flex-wrap justify-center gap-1 md:gap-2 max-w-screen-lg mx-auto px-2 md:px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full">
            {sections.map((section, index) => {
              const sectionId = getSectionId(section);

              return (
                <button
                  key={sectionId || index}
                  onClick={() => navigateToSection(index)}
                  className={`resume-section text-xs md:text-sm whitespace-nowrap ${
                    index === activeSection ? 'active' : ''
                  }`}
                  aria-label={`Go to ${section.title} section`}
                >
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 hidden md:flex md:flex-col space-y-2 z-50">
          {sections.map((item, index) => (
            <div
              key={index}
              className={`nav-dot ${
                index === activeSection ? 'active' : ''
              } hover:scale-110 transition-transform`}
              title={item.title}
              onClick={() => navigateToSection(index)}
            />
          ))}
        </div>

        <div
          ref={containerRef}
          className="h-screen overflow-y-auto overflow-x-hidden"
          style={{
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {sections.map((section, index) => {
            const sectionId = getSectionId(section);
            const isActive = index === activeSection;
            const baseSectionClasses = 'w-full flex justify-center px-4 sm:px-6 py-8 md:py-0';
            const sectionClass = sectionId === 'about'
              ? `${baseSectionClasses} h-screen items-stretch`
              : `${baseSectionClasses} min-h-screen items-center`;
            const containerClass = sectionId === 'about'
              ? 'content-container w-full max-w-4xl mx-auto h-full flex flex-col'
              : 'content-container w-full max-w-4xl mx-auto';

            return (
              <section
                key={sectionId || index}
                className={sectionClass}
                id={sectionId}
              >
                {isActive && index < sections.length - 1 && (
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce opacity-40">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 20L4 12L5.41 10.59L11 16.17L11 4L13 4L13 16.17L18.59 10.59L20 12L12 20Z"
                        fill={ACCENT_COLOR}
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={containerClass}
                  style={{ boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px ${ACCENT_COLOR}10` }}
                >
                  {renderSectionContent(section)}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    );
  }