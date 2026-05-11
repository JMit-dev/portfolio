export const siteConfig = {
  name: 'Jordan Mitacek',
  title: 'Jordan.',
  subtitle: 'I build low-level systems.',
  description: 'Student Assistant at Brookhaven National Laboratory. B.S. Computer Science. Systems programming, scientific computing, and game development.',
  email: 'jordan.mitacek@gmail.com',
  domain: 'jordanmitacek.com',
  social: {
    github: 'https://github.com/JMit-dev',
    linkedin: 'https://linkedin.com/in/jordanmitacek',
    instagram: 'https://instagram.com/jordan.mitacek',
    resume: '/Jordan_Mitacek_CV.pdf',
  },
  github: {
    owner: 'JMit-dev',
    repo: 'portfolio',
  },
}

export const about = {
  bio: `I'm a Student Assistant at Brookhaven National Laboratory — a U.S. Department of Energy national lab — where I'm part of the team that builds and maintains software for scientists running experiments at the NSLS-II particle accelerator facility. I hold a Bachelor's in Computer Science. My day-to-day involves working on control systems, real-time data infrastructure, and the tools beamline operators rely on to run experiments.

Outside of work I like building things from scratch. I've made CPU emulators, games, renderers, and whatever else catches my interest. When I'm not at a keyboard I'm usually lifting weights or playing guitar.`,

  skills: [
    'C / C++',
    'Python',
    'Java',
    'TypeScript / JavaScript',
    'Systems Programming',
    'Web Development (Full-Stack)',
    'Game & Graphics Development',
    'Scientific & Control-System Software',
    'Databases & Storage',
    'DevOps & CI/CD',
    'Linux / Shell Scripting',
    'Assembly & Emulation',
  ],
}

export const causes = [
  {
    name: 'Stop Killing Games',
    description: 'Games are cultural artifacts. Publishers should not be allowed to remotely destroy games after selling them.',
    url: 'https://www.stopkillinggames.com/',
    color: 'neon-red' as const,
    icon: '🎮',
  },
  {
    name: 'Electronic Frontier Foundation',
    description: 'Defending civil liberties in the digital world — privacy, free speech, and innovation.',
    url: 'https://www.eff.org/',
    color: 'neon-yellow' as const,
    icon: '🛡️',
  },
  {
    name: 'Free & Open Source Software',
    description: 'Software freedom matters. FOSS ensures transparency, security, and the right to study and modify what you use.',
    url: 'https://www.gnu.org/philosophy/free-sw.html',
    color: 'neon-green' as const,
    icon: '💾',
  },
  {
    name: 'Right to Repair',
    description: 'You should be able to fix what you own. Planned obsolescence and repair monopolies hurt consumers and the environment.',
    url: 'https://www.repair.org/',
    color: 'neon-orange' as const,
    icon: '🔧',
  },
  {
    name: 'Net Neutrality',
    description: 'The internet must remain an open, level playing field — no throttling, no fast lanes, no gatekeepers.',
    url: 'https://www.battleforthenet.com/',
    color: 'neon-cyan' as const,
    icon: '🌐',
  },
]

export const experience = [
  {
    company: 'Brookhaven National Laboratory',
    companyUrl: 'https://www.bnl.gov/',
    positions: [
      {
        title: 'Student Assistant — Data Science & Systems Integration',
        period: 'Nov 2025 – Present',
        bullets: [
          'Developing and maintaining software for the Phoebus control system environment supporting accelerator operations at NSLS-II',
          'Built real-time WebSocket streaming endpoints for the Bluesky Queue Server, enabling live data communication between beamline control systems',
          'Developed the Phoebus Olog Shift Module, a Java plugin that automatically attaches active shift metadata to electronic logbook entries via REST API',
          'Contributing to software testing, documentation, and deployment automation using Ansible across distributed control system infrastructure',
          'Integrating Ophyd and Ophyd-Async for hardware abstraction in Bluesky framework projects',
        ],
      },
      {
        title: 'SULI Research Intern',
        period: 'Jun 2025 – Aug 2025',
        bullets: [
          'Built a JavaFX client integrating Bluesky Queue Server into Phoebus, enabling real-time plan management for beamline scientists',
          'Designed high-performance REST service layer with rate limiting and retry logic; achieved 100% request success rate with 18.6ms mean response time',
          'Deployed as standalone Phoebus application, reducing operator context switching and streamlining experimental workflows',
          'Presented at BNL\'s summer intern symposium (300+ attendees) and at ICALEPCS 2025, the International Conference on Accelerator and Large Experimental Physics Control Systems',
        ],
      },
      {
        title: 'CCI Research Intern',
        period: 'Aug 2024 – Dec 2024',
        bullets: [
          'Designed custom interpreter for Deposition Laboratory control system automation',
          'Developed Python and C++ bindings for EPICS IOCs',
          'Created Qt-based GUI for real-time chamber parameter monitoring',
          'Implemented remote script execution using Bluesky QueueServer',
        ],
      },
    ],
  },
  {
    company: 'Suffolk County Community College',
    companyUrl: 'https://www.sunysuffolk.edu/',
    positions: [
      {
        title: 'Computer Science Tutor',
        period: 'Oct 2023 – May 2024',
        bullets: [
          'Tutored students in Java, C, C++, JavaScript, HTML/CSS, and MIPS Assembly',
          'Assisted with data structures, algorithms, and introductory systems concepts',
        ],
      },
      {
        title: 'Undergraduate Researcher',
        period: 'Nov 2022 – May 2023',
        bullets: [
          'Built Raspberry Pi–based water quality monitoring system for environmental research',
          'Presented findings at SUNY Undergraduate Research Conference (SURC)',
        ],
      },
    ],
  },
]

export const education = [
  {
    degree: 'B.S. Computer Science',
    school: 'Stony Brook University',
    schoolUrl: 'https://www.stonybrook.edu/',
    period: 'Sep 2024 – Aug 2026',
    gpa: '3.0 / 4.0',
    focus: 'Systems programming, graphics, computer architecture',
  },
  {
    degree: 'A.S. Computer Science',
    school: 'Suffolk County Community College',
    schoolUrl: 'https://www.sunysuffolk.edu/',
    period: 'Sep 2022 – May 2024',
    gpa: '3.9 / 4.0',
    focus: 'Programming foundations, data structures, algorithms',
  },
]

// Projects and Achievements are now managed via the admin panel.
// They live in public/projects/index.json and public/achievements/index.json.
// See src/hooks/useProjects.ts and src/hooks/useAchievements.ts.

export const games: {
  title: string
  description: string
  url: string
  image?: string
  tech: string[]
}[] = []
