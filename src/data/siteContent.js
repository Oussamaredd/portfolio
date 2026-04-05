import { DEFAULT_LOCALE } from "../lib/portfolioLocale";

const sharedSkills = [
  "TypeScript",
  "JavaScript",
  "Python",
  "C#",
  "Java",
  "PHP",
  "SQL",
  "React",
  "NestJS",
  "Node.js",
  "Express",
  "Laravel",
  "ASP.NET",
  "REST APIs",
  "OpenAPI / Swagger",
  "JWT / OAuth",
  "PostgreSQL",
  "MySQL",
  "SQL Server",
  "Redis",
  "Drizzle ORM",
  "Schema Design",
  "Migrations",
  "Query Tuning",
  "Caching",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Ansible",
  "Linux",
  "Bash",
  "PowerShell",
  "GitHub Actions",
  "GitLab",
  "Jenkins",
  "Playwright",
  "Cypress",
  "PHPUnit",
  "Vitest",
  "Jest",
  "Prometheus",
  "Grafana",
  "ELK",
  "SonarQube",
  "Kafka",
  "RabbitMQ",
  "Microservices",
  "Monorepos",
  "MVC",
  "Clean Architecture",
  "Hexagonal Architecture",
  "OWASP",
  "DDD",
  "TDD",
  "OIDC",
  "IAM",
];

const sharedGitHubActivity = {
  username: "Oussamaredd",
  profileUrl: "https://github.com/Oussamaredd",
};

const portfolioContentByLocale = {
  en: {
    locale: "en",
    meta: {
      title: "Oussama Radouane | Software Engineer",
      description:
        "Portfolio of Oussama Radouane, a software engineer focused on backend systems, DevOps, Laravel, Node.js, cloud infrastructure, and automation.",
    },
    resumeSource: "/CV_EN_Oussama_Radouane_Full_Time.pdf",
    navItems: [
      { label: "Home", href: "#home", icon: "home" },
      { label: "About", href: "#about", icon: "about" },
      { label: "Experience", href: "#experience", icon: "experience" },
      { label: "Projects", href: "#projects", icon: "projects" },
      { label: "Education", href: "#education", icon: "education" },
      { label: "Skills", href: "#skills", icon: "skills" },
      { label: "GitHub", href: "#github", icon: "github" },
    ],
    sectionTitles: {
      about: "About",
      experience: "Professional Experience",
      projects: "Projects",
      education: "Education",
      skills: "Technical Skills",
      github: "GitHub Activity",
    },
    profile: {
      status: "Available from July 2026",
      name: "Oussama Radouane",
      role: "Software Engineer",
      location: "Asnières-sur-Seine, France",
      imageSrc: "/profile-images/oussama-portrait.jpg",
      imageAlt: "Portrait of Oussama Radouane at a desk with a laptop, code editor, and frontend development references.",
      imageLabel: "OR",
      contactLinks: [
        {
          label: "Email",
          icon: "email",
          href: "mailto:radouaneoussama998@gmail.com",
          order: 40,
        },
        {
          label: "LinkedIn",
          icon: "linkedin",
          href: "https://www.linkedin.com/in/oussama-radouane",
          order: 20,
        },
        {
          label: "GitHub",
          icon: "github",
          href: "https://github.com/Oussamaredd",
          order: 10,
        },
        {
          label: "Portfolio",
          icon: "globe",
          href: "https://ecotrack-jmj.pages.dev/",
          order: 30,
        },
        {
          label: "Resume",
          icon: "resume",
          href: "/CV_EN_Oussama_Radouane_Full_Time.pdf",
          order: 50,
        },
      ],
    },
    aboutText:
      "Passionate software engineer with extensive experience in JavaScript and web development, backed by a strong foundation in system operations. Currently pursuing a Master's degree in Software Architecture and Application Development at INGETIS Paris and looking for a full-time role from July 2026.",
    experiences: [
      {
        title: "Software Engineer",
        company: "JoyatWork",
        period: "Oct 2025 - Jan 2026",
        summary:
          "Built Laravel backend features with APIs, middleware, and service logic for booking and onboarding workflows, including validation rules and MySQL migrations. Implemented secure token-based authentication and role-based access control with Laravel Sanctum, optimized key endpoints through caching and query improvements for a 30 percent response-time reduction, and automated delivery with GitHub Actions CI and release workflows.",
      },
      {
        title: "Software Engineer",
        company: "Articode",
        period: "Oct 2023 - Aug 2025",
        summary:
          "Contributed to microservices architecture development to improve backend modularity and scalability. Strengthened PostgreSQL and Redis integrations, advanced rate limiting, validation, structured JSON logging, and error handling; automated Kubernetes, RabbitMQ, PostgreSQL, GitLab, and ELK infrastructure with Terraform and Ansible; expanded observability with Prometheus and Grafana; and improved code quality with automated tests and SonarQube quality gates.",
      },
      {
        title: "AR Engineer",
        company: "Articode",
        period: "Jun 2023 - Oct 2023",
        summary:
          "Helped deliver a WebGL-based AR web application, documented implementation choices, and coordinated execution across a four-intern team. Worked in a shared review and iteration workflow that improved teamwork, handoff clarity, and delivery pace.",
      },
      {
        title: "Software Engineer",
        company: "Fondation Zakoura Education",
        period: "Jul 2022 - Oct 2022",
        summary:
          "Provided day-to-day technical support across internal systems and contributed SQL queries plus .NET API endpoints to streamline education workflows and simplify internal data access.",
      },
    ],
    projects: [
      {
        title: "EcoTrack",
        status: "Live",
        statusColor: "bg-green-500",
        imageSrc: "/project-images/ecotrack-cover.jpg",
        imageAlt: "Photo of urban waste collection workers operating a sanitation truck in the city.",
        summary:
          "Smart IoT waste management platform for citizens, field agents, and managers, featuring telemetry ingestion, route planning, and live updates.",
        technologies: ["React", "NestJS", "Drizzle ORM", "PostgreSQL", "Kubernetes", "MQTT", "Kafka"],
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
        title: "PhotoSharingApplication",
        status: "Completed",
        statusColor: "bg-sky-500",
        imageSrc: "/project-images/photosharing-cover.jpg",
        imageAlt: "Abstract preview of a nature photo gallery web application with image cards and a camera panel.",
        summary:
          "Nature gallery web application built to let users share and browse photos through a simple and intuitive experience.",
        technologies: [
          "C#",
          "ASP.NET Core",
          "ASP.NET Identity",
          "ASP.NET Web API",
          "React",
          "Entity Framework",
          "SQL Server",
          "Bootstrap",
        ],
        links: [
          {
            label: "GitHub",
            href: "https://github.com/Oussamaredd/PhotoSharingApplication",
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
          "Equipment reservation system designed to manage requests, availability, and reservation workflows.",
        technologies: ["Vue.js", "PHP", "Symfony", "Doctrine", "Docker", "GitHub Actions"],
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
          "End-to-end bank transaction flow automation with Playwright, covering consent and bank selection with CI execution and failure artifacts for faster debugging.",
        technologies: ["TypeScript", "Playwright", "OpenAPI / Swagger", "GitHub Actions"],
        links: [
          {
            label: "GitHub",
            href: "https://github.com/Oussamaredd/algoan-playwright",
            icon: "github",
          },
        ],
      },
    ],
    educationItems: [
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
    ],
    skills: sharedSkills,
    githubActivity: sharedGitHubActivity,
    ui: {
      mobileEyebrow: "Portfolio",
      skillsEyebrow: "Core toolkit",
      footer: {
        eyebrow: "Portfolio",
        description: "Designed and developed with React and Tailwind CSS.",
        signature: "Built with motion, detail, and intent",
        resumeSourceLabel: "Resume source",
      },
      github: {
        idleTitle: "GitHub contribution calendar",
        idleDescription:
          "This section loads as you get close to it so the first screen stays lighter and more responsive.",
        errorTitle: "GitHub contribution calendar unavailable",
        errorHelp: "Add a GITHUB_TOKEN environment variable for the API endpoint and reload the section.",
        legendLess: "Less",
        legendMore: "More",
        learnMoreLabel: "Learn how GitHub counts contributions",
        learnMoreUrl:
          "https://docs.github.com/en/account-and-profile/concepts/contributions-visible-on-your-profile",
        yearSelectorAriaLabel: "Contribution years",
        missingUsernameError: "Missing GitHub username.",
      },
    },
  },
  fr: {
    locale: "fr",
    meta: {
      title: "Oussama Radouane | Ingénieur logiciel",
      description:
        "Portfolio d'Oussama Radouane, ingénieur logiciel orienté backend, DevOps, Laravel, Node.js, infrastructure cloud et automatisation.",
    },
    resumeSource: "/CV_FR_Oussama_Radouane_CDI.pdf",
    navItems: [
      { label: "Accueil", href: "#home", icon: "home" },
      { label: "À propos", href: "#about", icon: "about" },
      { label: "Expérience", href: "#experience", icon: "experience" },
      { label: "Projets", href: "#projects", icon: "projects" },
      { label: "Formation", href: "#education", icon: "education" },
      { label: "Compétences", href: "#skills", icon: "skills" },
      { label: "GitHub", href: "#github", icon: "github" },
    ],
    sectionTitles: {
      about: "À propos",
      experience: "Expérience professionnelle",
      projects: "Projets",
      education: "Formation",
      skills: "Compétences techniques",
      github: "Activité GitHub",
    },
    profile: {
      status: "Disponible à partir de juillet 2026",
      name: "Oussama Radouane",
      role: "Ingénieur logiciel",
      location: "Asnières-sur-Seine, France",
      imageSrc: "/profile-images/oussama-portrait.jpg",
      imageAlt: "Portrait d'Oussama Radouane devant un ordinateur portable avec un environnement de travail de développement.",
      imageLabel: "OR",
      contactLinks: [
        {
          label: "E-mail",
          icon: "email",
          href: "mailto:radouaneoussama998@gmail.com",
          order: 40,
        },
        {
          label: "LinkedIn",
          icon: "linkedin",
          href: "https://www.linkedin.com/in/oussama-radouane",
          order: 20,
        },
        {
          label: "GitHub",
          icon: "github",
          href: "https://github.com/Oussamaredd",
          order: 10,
        },
        {
          label: "Portfolio",
          icon: "globe",
          href: "https://ecotrack-jmj.pages.dev/",
          order: 30,
        },
        {
          label: "CV",
          icon: "resume",
          href: "/CV_FR_Oussama_Radouane_CDI.pdf",
          order: 50,
        },
      ],
    },
    aboutText:
      "Élève en dernière année à Ingetis, avec 3 ans d'expérience en développement back-end et DevOps, je recherche un CDI ou CDD à partir de juillet 2026. Passionné par le développement logiciel, je souhaite mettre mes compétences au service de projets techniques exigeants.",
    experiences: [
      {
        title: "Ingénieur logiciel",
        company: "JoyatWork",
        period: "Oct 2025 - Jan 2026",
        summary:
          "Développement de fonctionnalités back-end en Laravel pour une plateforme B2B : API REST, middlewares, logique métier de réservation et d'onboarding, règles de validation et migrations MySQL. Mise en place d'une authentification sécurisée et d'un contrôle d'accès par rôles avec Laravel Sanctum, optimisation d'endpoints critiques via le cache et les requêtes pour réduire les temps de réponse de 30 %, et automatisation de la livraison avec GitHub Actions.",
      },
      {
        title: "Ingénieur logiciel",
        company: "Articode",
        period: "Oct 2023 - Août 2025",
        summary:
          "Contribution au développement d'une architecture microservices pour renforcer la modularité et la scalabilité du back-end. Renforcement des intégrations PostgreSQL et Redis, du rate limiting, des validations, des logs JSON structurés et de la gestion des erreurs ; automatisation de l'infrastructure Kubernetes, RabbitMQ, PostgreSQL, GitLab et ELK avec Terraform et Ansible ; mise à l'échelle de l'observabilité avec Prometheus et Grafana ; et amélioration de la qualité de code avec des tests automatisés et SonarQube.",
      },
      {
        title: "Ingénieur AR",
        company: "Articode",
        period: "Juin 2023 - Oct 2023",
        summary:
          "Contribution à la livraison d'une application web AR basée sur WebGL, documentation des choix d'implémentation et coordination de l'exécution au sein d'une équipe de quatre stagiaires. Travail dans un cycle partagé de revue et d'itération qui a amélioré la collaboration, la transmission et le rythme de livraison.",
      },
      {
        title: "Ingénieur logiciel",
        company: "Fondation Zakoura Education",
        period: "Juil 2022 - Oct 2022",
        summary:
          "Support technique quotidien sur les systèmes internes et contribution à des requêtes SQL ainsi qu'à des endpoints API .NET pour fluidifier les workflows éducation et simplifier l'accès aux données internes.",
      },
    ],
    projects: [
      {
        title: "EcoTrack",
        status: "En ligne",
        statusColor: "bg-green-500",
        imageSrc: "/project-images/ecotrack-cover.jpg",
        imageAlt: "Photo d'agents de propreté urbaine opérant un camion de collecte en ville.",
        summary:
          "Plateforme IoT de gestion intelligente des déchets pour citoyens, agents terrain et gestionnaires, avec ingestion de télémétrie, planification de tournées et mises à jour en temps réel.",
        technologies: ["React", "NestJS", "Drizzle ORM", "PostgreSQL", "Kubernetes", "MQTT", "Kafka"],
        links: [
          {
            label: "Demo",
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
        title: "PhotoSharingApplication",
        status: "Termine",
        statusColor: "bg-sky-500",
        imageSrc: "/project-images/photosharing-cover.jpg",
        imageAlt: "Apercu abstrait d'une application web de galerie photo nature avec cartes d'images et panneau appareil photo.",
        summary:
          "Application web de galerie photo nature concue pour permettre aux utilisateurs de partager et consulter des photos dans une experience simple et intuitive.",
        technologies: [
          "C#",
          "ASP.NET Core",
          "ASP.NET Identity",
          "ASP.NET Web API",
          "React",
          "Entity Framework",
          "SQL Server",
          "Bootstrap",
        ],
        links: [
          {
            label: "GitHub",
            href: "https://github.com/Oussamaredd/PhotoSharingApplication",
            icon: "github",
          },
        ],
      },
      {
        title: "Partage et Vie Equipment Reservation",
        status: "Termine",
        statusColor: "bg-sky-500",
        imageSrc: "/project-images/reservation-cover.jpg",
        imageAlt: "Photo de materiel medical range dans des bacs de stockage etiquetes.",
        summary:
          "Système de réservation d'équipements pour gérer les demandes, les disponibilités et les workflows de réservation.",
        technologies: ["Vue.js", "PHP", "Symfony", "Doctrine", "Docker", "GitHub Actions"],
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
        status: "Termine",
        statusColor: "bg-sky-500",
        imageSrc: "/project-images/algoan-cover.jpg",
        imageAlt: "Photo d'un environnement bancaire numérique avec smartphone, carte et poste de travail.",
        summary:
          "Automatisation de bout en bout d'un parcours de transaction bancaire avec Playwright, couvrant le consentement et la sélection, avec exécution CI et artefacts d'échec pour accélérer le debug.",
        technologies: ["TypeScript", "Playwright", "OpenAPI / Swagger", "GitHub Actions"],
        links: [
          {
            label: "GitHub",
            href: "https://github.com/Oussamaredd/algoan-playwright",
            icon: "github",
          },
        ],
      },
    ],
    educationItems: [
      {
        school: "INGETIS, Paris, France",
        period: "Sep 2025 - Juil 2026",
        detail: "Master, Expert en Architecture et Développement Logiciels et Applications",
      },
      {
        school: "EMSI, Casablanca, Maroc",
        period: "Diplômé en 2023",
        detail: "Master MIAGE, Ingénieur en Informatique et Réseaux",
      },
    ],
    skills: sharedSkills,
    githubActivity: sharedGitHubActivity,
    ui: {
      mobileEyebrow: "Portfolio",
      skillsEyebrow: "Compétences clés",
      footer: {
        eyebrow: "Portfolio",
        description: "Conçu et développé avec React et Tailwind CSS.",
        signature: "Construit avec intention, détail et mouvement",
        resumeSourceLabel: "Source du CV",
      },
      github: {
        idleTitle: "Calendrier de contributions GitHub",
        idleDescription:
          "Cette section se charge à l'approche du viewport pour garder le premier écran plus léger et réactif.",
        errorTitle: "Calendrier de contributions GitHub indisponible",
        errorHelp: "Ajoutez une variable d'environnement GITHUB_TOKEN pour l'endpoint API puis rechargez la section.",
        legendLess: "Moins",
        legendMore: "Plus",
        learnMoreLabel: "Comprendre le calcul des contributions GitHub",
        learnMoreUrl:
          "https://docs.github.com/en/account-and-profile/concepts/contributions-visible-on-your-profile",
        yearSelectorAriaLabel: "Années de contribution",
        missingUsernameError: "Nom d'utilisateur GitHub manquant.",
      },
    },
  },
};

export function getPortfolioContent(locale = DEFAULT_LOCALE) {
  return portfolioContentByLocale[locale] ?? portfolioContentByLocale[DEFAULT_LOCALE];
}
