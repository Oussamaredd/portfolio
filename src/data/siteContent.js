export const resumeSource = "/Oussama_Radouane_CV_EN_Full_Time.pdf";

export const navItems = [
  { label: "Home", href: "#home", icon: "home" },
  { label: "About", href: "#about", icon: "about" },
  { label: "Experience", href: "#experience", icon: "experience" },
  { label: "Projects", href: "#projects", icon: "projects" },
  { label: "Education", href: "#education", icon: "education" },
  { label: "Skills", href: "#skills", icon: "skills" },
  { label: "GitHub", href: "#github", icon: "github" },
];

export const profile = {
  status: "Available from July 2026",
  name: "Oussama Radouane",
  role: "Senior Software Engineer",
  location: "Asnieres-sur-Seine, France",
  imageSrc: "/profile-images/oussama-portrait.png",
  imageAlt: "Portrait of Oussama Radouane at a desk with a laptop, code editor, and frontend development references.",
  imageLabel: "OR",
  contactLinks: [
    {
      label: "Email",
      icon: "email",
      href: "mailto:radouaneoussama998@gmail.com",
    },
    {
      label: "LinkedIn",
      icon: "linkedin",
      href: "https://www.linkedin.com/in/oussama-radouane",
    },
    {
      label: "GitHub",
      icon: "github",
      href: "https://github.com/Oussamaredd",
    },
    {
      label: "Portfolio",
      icon: "globe",
      href: "https://ecotrack-jmj.pages.dev/",
    },
    {
      label: "Resume",
      icon: "resume",
      href: resumeSource,
    },
  ],
};

export const githubActivity = {
  username: "Oussamaredd",
  profileUrl: "https://github.com/Oussamaredd",
};

export const aboutText =
  "Master's student in Software Architecture and Application Development at INGETIS Paris, seeking a full-time Software Engineering role from July 2026.";

export const experiences = [
  {
    title: "Software Engineer",
    company: "JoyAtWork",
    period: "Oct 2025 - Jan 2026",
    summary:
      "Built Laravel and PHP APIs, validation rules, middleware, MySQL migrations, and Sanctum-based authentication for booking and onboarding flows. Optimized key endpoints with caching and query tuning, reducing response time by 30 percent while improving release safety through GitHub Actions CI.",
  },
  {
    title: "Software Engineer",
    company: "Articode",
    period: "Nov 2023 - Aug 2025",
    summary:
      "Built Node.js and Express services with PostgreSQL-backed features for internal platforms and consulting projects. Standardized Docker deployments, provisioned infrastructure with Terraform, and added logging, dashboards, tests, and SonarQube quality gates to improve observability and delivery quality.",
  },
  {
    title: "AR Engineer",
    company: "R&D / Web Engineering",
    period: "Jun 2023 - Oct 2023",
    summary:
      "Helped deliver a WebGL-based AR web application, documented implementation choices, and coordinated execution across a four-intern team. Worked in a shared review and iteration workflow that improved handoff clarity and delivery pace.",
  },
  {
    title: "IT Support Engineer / Junior Developer",
    company: "Fondation Zakoura Education",
    period: "Jul 2022 - Oct 2022",
    summary:
      "Provided day-to-day technical support across internal systems and reduced resolution time for operational issues. Also wrote SQL queries and contributed to .NET API endpoints that simplified education workflows and internal data access.",
  },
];

export const projects = [
  {
    title: "EcoTrack",
    status: "Live",
    statusColor: "bg-green-500",
    imageSrc: "/project-images/ecotrack-cover.jpg",
    imageAlt: "Photo of urban waste collection workers operating a sanitation truck in the city.",
    summary:
      "Waste operations platform with route planning, telemetry, live updates, and manager dashboards for citizens, field agents, and city teams.",
    technologies: ["React", "NestJS", "Drizzle ORM", "PostgreSQL", "Docker", "JWT", "Google OAuth"],
    links: [
      {
        label: "Live Demo",
        href: "https://ecotrack-jmj.pages.dev/",
        icon: "globe",
      },
      {
        label: "GitHub",
        href: "https://github.com/Oussamaredd/EcoTrack",
        icon: "github",
      },
    ],
  },
  {
    title: "Partage et Vie Equipment Reservation",
    status: "Completed",
    statusColor: "bg-sky-500",
    imageSrc: "/project-images/reservation-cover.jpg",
    imageAlt: "Photo of a clinician pulling medical supplies from labeled storage bins.",
    summary:
      "Equipment reservation platform with clear backend and frontend boundaries plus automated PHPUnit, Vitest, and Playwright coverage.",
    technologies: ["Symfony", "Vue.js", "Docker", "PHPUnit", "Vitest", "Playwright"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Oussamaredd/partage-et-vie-equipment-reservation",
        icon: "github",
      },
    ],
  },
  {
    title: "Algoan Playwright",
    status: "Completed",
    statusColor: "bg-sky-500",
    imageSrc: "/project-images/algoan-cover.jpg",
    imageAlt: "Photo of a mobile banking and online payment setup with a phone, card, and desktop workstation.",
    summary:
      "Playwright automation for consent and bank-selection flows with CI runs and failure artifacts for faster debugging.",
    technologies: ["Playwright", "TypeScript", "CI", "E2E Testing"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Oussamaredd/algoan-playwright",
        icon: "github",
      },
    ],
  },
];

export const educationItems = [
  {
    school: "INGETIS, Paris, France",
    period: "Sep 2025 - Jul 2026",
    detail: "Master's Degree, Software Architecture and Application Development",
  },
  {
    school: "EMSI, Casablanca, Morocco",
    period: "Graduated 2023",
    detail: "Master's Degree, Computer Science and Networks (MIAGE)",
  },
];

export const skills = [
  "TypeScript",
  "JavaScript",
  "React",
  "Node.js",
  "NestJS",
  "Laravel",
  "PostgreSQL",
  "MySQL",
  "Docker",
  "Terraform",
  "GitHub Actions",
  "Playwright",
  "Vitest",
  "Prometheus",
  "Grafana",
  "OWASP",
  "DDD",
  "TDD",
];



