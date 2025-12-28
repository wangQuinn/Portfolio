// Content data
export type ProjectItem = {
  title: string;
  period: string;
  url?: string;
  tech: string[];
  points: string[];
};

export type EducationItem = {
  title: string;
  period: string;
  description: string;
  awards?: string[];
  details?: string[];
};

export type ExperienceItem = {
  title: string;
  period: string;
  points: string[];
};

export type SectionItem = ProjectItem | EducationItem | ExperienceItem;

 export type Section = {
  id: string;
  title: string;
  subtitle?: string[];
  descriptions?: string[];
  content?: string;
  items?: SectionItem[];
  email?: string;
  links?: { name: string; url: string }[];
  categories?: { name: string; items: string[] }[];
};

export const sections: Section[] = [
{
    id: 'intro',
    title: 'QUINN WANG',
    subtitle: [ 'Software Engineering Student @ UWaterloo'],
    descriptions: [
      'PROBLEM SOLVER',
      'CREATIVE THINKER',
      'LEADER',
      'CURIOUS LEARNER',
    ],
},
{
    id: 'about ',
    title: 'ABOUT',
    content: `I'm a student at the University of Waterloo, studying Software Engineering with an interest in anything interesting :) I started programming in highschool, and loved the endless knowledge and creativity I could find in the community. In my free time I like to dabbling in various sports, play video games, and scroll Wikipedia. `
},
 {
    id: 'education',
    title: 'EDUCATION',
    items: [
      {
        title: 'University of Waterloo',
        period: 'Sept 2024 – May 2028',
        description: 'Bachelor of Software Engineering, Honours',
        awards: [
          "President's Scholarship of Distinction - Awarded to students with an admission average of 95% or higher, recognizing exceptional academic achievement and leadership potential",
        ],
      },
      {
        title: 'Victoria Park Collegiate Institute',
        period: 'Sept 2021 – Jun 2025',
        description: 'International Baccalaureate (IB) Diploma Program',
        details: [
          'Higher Level (HL) Subjects:',
          '- Mathematics: Analysis and Approaches',
          '- English Literature',
          '- Computer Science',
          '',
          'Standard Level (SL) Subjects:',
          '- Chemistry',
          '- Physics',
          '- Economics',
          '- French',
          '',
          'The IB Diploma Program is a rigorous pre-university course of study that emphasizes critical thinking, research skills, and international-mindedness. The program challenges students to excel in their studies and encourages them to make connections between traditional academic subjects and the real world.',
        ],
      },
    ],
  },
   {
    id: 'skills',
    title: 'TECHNICAL SKILLS',
    categories: [
      {
        name: 'Languages',
        items: [
          'C',
          'C++',
          'CSS3',
          'HTML5',
          'Java',
          'JavaScript',
          'Python',
          'SQL',
          'TypeScript',
        ],
      },
      {
        name: 'Tools',
        items: [
          'Git',
        ],
      },
      {
        name: 'Frameworks',
        items: [
          'Flask',
          'Next.js',
          'Node.js',
          'React.js',
          'TailwindCSS',
          'Vue.js',
        ],
      },
    ],
  },
   {
    id: 'projects',
    title: 'PROJECTS',
    items: [
      {
        title: 'Personal Portfolio Website',
        period: 'Apr 2025',
        url: 'https://github.com/wangQuinn/Portfolio',
        tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React'],
        points: [
          'Designed and developed a minimalist, modern portfolio website with unique typography and animation effects',
          'Implemented custom typewriter animations and font-switching features for a distinctive user experience',
          'Created a responsive, single-page application with smooth scrolling and section transitions',
          'Incorporated a random font generator that applies a different monospace typeface on each visit',
        ],
      },
    ] as ProjectItem[],
  },
  {
    id: 'contact',
    title: 'CONTACT',
    email: 'q242wang@uwaterloo.ca',
    links: [
      { name: 'GitHub', url: 'https://github.com/wangQuinn' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/tianlynn-wang-239753290/'},
    ],
  },
];

