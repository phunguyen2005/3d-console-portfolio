export const profile = {
  name: 'Nguyen Do Thanh Phu',
  shortName: 'Phu Nguyen',
  role: 'Full-stack Developer',
  location: 'Ho Chi Minh City, Vietnam',
  shortLocation: 'HO CHI MINH, VN',
  email: 'phu.ngyuen018@gmail.com',
  phone: '0852852018',
  github: 'github.com/phunguyen2005',
  githubUrl: 'https://github.com/phunguyen2005',
  education: 'Ho Chi Minh City University of Education · Bachelor of IT (GPA: 3.0/4.0)',
  availability: 'Open to Full-stack roles',
  bio: 'Third-year IT student at Ho Chi Minh City University of Education with hands-on experience building full-stack web applications using React.js, Node.js, and MongoDB. Seeking a Full-stack role to contribute to real-world products while growing skills in API design, deployment, and scalable frontend architecture.',
  shortBio: [
    '3RD-YEAR IT STUDENT AT HCMUE.',
    'BUILDING FULL-STACK APPS WITH',
    'REACT, NODE, LARAVEL & AI.',
  ],
};

export const menuItems = [
  { id: 'about', label: 'ABOUT ME' },
  { id: 'projects', label: 'SELECTED WORK' },
  { id: 'toolkit', label: 'MY TOOLKIT' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'contact', label: 'SAY HELLO' },
] as const;

export type Section = typeof menuItems[number]['id'];

export const projects = [
  {
    name: 'HCMUE Library System',
    shortName: 'HCMUE LIBRARY',
    year: '2026',
    category: 'FULL-STACK / AI',
    role: 'FULL-STACK DEVELOPER',
    description: 'Full-stack library platform with 3-tier RBAC (student/librarian/admin), physical & digital book borrowing, study room booking, and fine management.',
    short: [
      '3-TIER RBAC LIBRARY SYSTEM.',
      'GEMINI AI CHATBOT & METADATA.',
      'MOMO & VNPAY WEBHOOKS.',
    ],
    stack: ['Laravel 12', 'React 19', 'TiDB', 'Tailwind 4', 'Gemini AI'],
    detail: 'Integrated Google Gemini AI for auto-generated book metadata and floating chatbot with personalized recommendations. Built MoMo & VNPay payment gateways (IPN webhooks) for fine settlement.',
    result: 'Shipped gamification (streaks, XP, badges), EN/VI localization, and 135 backend tests with 787 assertions; deployed on Render & Cloudflare Pages.',
  },
  {
    name: 'CueMasters Billiards',
    shortName: 'CUEMASTERS',
    year: '2026',
    category: 'FULL-STACK / REALTIME',
    role: 'FULL-STACK DEVELOPER',
    description: 'A full-stack billiards booking and management web application with live match updates and synchronized reservations.',
    short: [
      'REAL-TIME BILLIARDS BOOKING.',
      'SOCKET.IO LIVE MATCH UPDATES.',
      'JWT AUTH & PROTECTED ROUTES.',
    ],
    stack: ['React.js', 'Node.js', 'MongoDB', 'Express', 'Socket.io'],
    detail: 'Implemented real-time table reservations and live match scores using Socket.io. Built secure JWT authentication and role-based access control with protected routes.',
    result: 'Designed scalable RESTful APIs and optimized MongoDB schemas for reservation scheduling and member management.',
  },
  {
    name: 'Social Media Widget App',
    shortName: 'SOCIAL WIDGETS',
    year: '2025',
    category: 'MOBILE / REALTIME',
    role: 'FRONTEND LEAD',
    description: 'Interactive home-screen mobile widgets with real-time friend status synchronization and optimized rendering latency.',
    short: [
      'INTERACTIVE HOME WIDGETS.',
      'REAL-TIME STATUS SYNC VIA',
      'FIREBASE & MONGODB.',
    ],
    stack: ['JavaScript', 'React Native', 'MongoDB', 'Firebase'],
    detail: 'Led a frontend team of 3; designed and implemented responsive interactive home-screen widgets using React Native with live status synchronization.',
    result: 'Optimized component rendering performance, cutting mobile app latency for smooth, instant transitions.',
  },
  {
    name: 'Advising Chatbot Research',
    shortName: 'ADVISING BOT',
    year: '2024',
    category: 'ACADEMIC / NLP',
    role: 'AI RESEARCHER',
    description: 'Scientific university research on automating academic student query retrieval and information routing using Natural Language Processing.',
    short: [
      'SCIENTIFIC RESEARCH AT HCMUE.',
      'AUTOMATING QUERY RETRIEVAL',
      'USING PYTHON NLP PIPELINES.',
    ],
    stack: ['Python', 'NLP', 'Information Retrieval'],
    detail: 'Developed NLP-driven semantic query parsing and matching algorithms to automate student academic advising FAQs and department routing.',
    result: 'Achieved "Good" official rating for university scientific research in automated student query retrieval.',
  },
];

export const toolkit = [
  {
    category: 'FRONTEND',
    items: ['React 19', 'TypeScript', 'React Native', 'Tailwind 4', 'Next.js'],
  },
  {
    category: 'BACKEND',
    items: ['Node.js', 'Express.js', 'Laravel 12', 'RESTful APIs', 'Socket.io'],
  },
  {
    category: 'DATABASE & AI',
    items: ['MongoDB', 'MySQL', 'TiDB', 'Firebase', 'Gemini AI'],
  },
  {
    category: 'TOOLS & TEST',
    items: ['Git / GitHub', 'Postman', 'Linux CLI', 'PHPUnit / Pest', 'Jira'],
  },
];

export const experience = [
  {
    year: '2026',
    role: 'Fullstack Developer Intern',
    company: 'Etech (Ho Chi Minh City)',
    note: 'Built React.js modules for EOS operations; integrated REST APIs, error states, and dashboards.',
  },
  {
    year: '2025',
    role: 'Media Department Member',
    company: 'IT Club - HCMUE',
    note: 'Media content, community events, and digital media production.',
  },
  {
    year: '2024',
    role: 'Academic NLP Researcher',
    company: 'HCMUE Research',
    note: 'Student query retrieval using NLP; rated "Good" for university scientific research.',
  },
  {
    year: '2023',
    role: 'IT Undergraduate (GPA 3.0)',
    company: 'HCM City Univ of Education',
    note: 'Specializing in software engineering, distributed systems, and web architecture.',
  },
];

