import { useEffect, useRef, useState } from "react";
import AboutSection from "../components/AboutSection";
import CyberBackground from "../components/CyberBackground";
import DesktopSidebar from "../components/DesktopSidebar";
import EducationSection from "../components/EducationSection";
import ExperienceSection from "../components/ExperienceSection";
import Footer from "../components/Footer";
import GitHubSection from "../components/GitHubSection";
import { Icon } from "../components/Icons";
import MobileNav from "../components/MobileNav";
import ProfileAvatar from "../components/ProfileAvatar";
import ProjectsSection from "../components/ProjectsSection";
import SkillsSection from "../components/SkillsSection";
import StatusBadge from "../components/StatusBadge";
import {
  aboutText,
  educationItems,
  experiences,
  githubActivity,
  navItems,
  profile,
  projects,
  resumeSource,
  skills,
} from "../data/siteContent";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const applyScrollDelta = (element, deltaY) => {
  if (!element) {
    return deltaY;
  }

  const maxScrollTop = Math.max(0, element.scrollHeight - element.clientHeight);
  if (maxScrollTop <= 0) {
    return deltaY;
  }

  const start = element.scrollTop;
  const next = clamp(start + deltaY, 0, maxScrollTop);
  const consumed = next - start;

  if (consumed !== 0) {
    element.scrollTop = next;
  }

  return deltaY - consumed;
};

export default function HomePage() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false,
  );
  const [activeSection, setActiveSection] = useState("#about");
  const mainRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || !mainRef.current) {
      return undefined;
    }

    const mainElement = mainRef.current;

    const updateActiveSection = () => {
      const sections = Array.from(mainElement.querySelectorAll("[data-section]"));
      const scrollTop = mainElement.scrollTop;

      if (scrollTop < 72) {
        setActiveSection("#about");
        return;
      }

      let currentSection = "#about";

      sections.forEach((section) => {
        const id = section.getAttribute("data-section");
        if (!id) {
          return;
        }

        if (section.offsetTop - 128 <= scrollTop) {
          currentSection = `#${id}`;
        }
      });

      setActiveSection(currentSection);
    };

    updateActiveSection();
    mainElement.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      mainElement.removeEventListener("scroll", updateActiveSection);
    };
  }, [isDesktop]);

  const handleDesktopMainWheel = (event) => {
    if (!isDesktop || !mainRef.current) {
      return;
    }

    event.preventDefault();
    const leftover = applyScrollDelta(mainRef.current, event.deltaY);

    if (leftover !== 0) {
      applyScrollDelta(sidebarRef.current, leftover);
    }
  };

  const handleDesktopSidebarWheel = (event) => {
    if (!isDesktop || !sidebarRef.current) {
      return;
    }

    event.preventDefault();
    const leftover = applyScrollDelta(sidebarRef.current, event.deltaY);

    if (leftover !== 0) {
      applyScrollDelta(mainRef.current, leftover);
    }
  };

  const handleNavigate = (href) => {
    if (href === "#home") {
      if (isDesktop) {
        mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        sidebarRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      setActiveSection("#about");
      window.history.replaceState(null, "", "#");
      return;
    }

    if (isDesktop && mainRef.current) {
      const container = mainRef.current;
      const heading = container.querySelector(href);
      const target = heading?.closest("[data-section]") ?? heading;

      if (!target) {
        return;
      }

      const top =
        target.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        28;

      container.scrollTo({ top, behavior: "smooth" });
      setActiveSection(href);
      window.history.replaceState(null, "", href);
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    const offset = 88;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", href);
  };

  const introText = aboutText.split("\n\n")[0];

  const desktopSections = (
    <>
      <AboutSection text={aboutText} />
      <ExperienceSection items={experiences} />
      <ProjectsSection items={projects} />
      <EducationSection items={educationItems} />
      <SkillsSection items={skills} />
      <GitHubSection config={githubActivity} />
    </>
  );

  const mobileSections = desktopSections;

  if (isDesktop) {
    return (
      <div className="h-screen overflow-hidden bg-[var(--color-background)]" id="home">
        <CyberBackground />
        <div className="relative z-10 mx-auto h-full max-w-[1640px] px-5 lg:px-8 xl:px-10">
          <div className="grid h-full gap-16 lg:grid-cols-[minmax(460px,560px)_minmax(0,1fr)] xl:gap-24">
            <DesktopSidebar
              ref={sidebarRef}
              activeSection={activeSection}
              navItems={navItems}
              onNavigate={handleNavigate}
              onWheel={handleDesktopSidebarWheel}
              profile={profile}
            />

            <main
              ref={mainRef}
              className="no-scrollbar h-full overflow-y-auto py-20 pr-1 lg:pl-12 xl:pl-20 xl:pr-2"
              onWheel={handleDesktopMainWheel}
            >
              <div className="w-full max-w-[840px] space-y-14 pb-12 lg:ml-auto">
                {desktopSections}
                <Footer resumeSource={resumeSource} />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]" id="home">
      <CyberBackground />
      <div className="relative z-10 flex w-full flex-col lg:hidden">
        <MobileNav navItems={navItems} onNavigate={handleNavigate} />

        <div className="mx-auto flex w-full max-w-5xl flex-col pl-5 pr-3 pb-10 pt-24 sm:pl-8 sm:pr-5">
          <section className="pt-4">
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <ProfileAvatar className="h-20 w-20 shrink-0" profile={profile} />
              </div>

              <div>
                <p className="eyebrow mb-3">Portfolio</p>
                <h1 className="max-w-xl break-words text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-[2.75rem]">
                  {profile.name}
                </h1>
                <p className="mt-3 text-base leading-7 text-[var(--color-primary)] sm:text-[1.05rem]">
                  {profile.role}
                </p>
                <StatusBadge className="mt-3">{profile.status}</StatusBadge>
                <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Icon className="h-4 w-4 text-[var(--color-accent)]" name="location" />
                  <span>{profile.location}</span>
                </div>
                <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--color-text-secondary)] sm:text-base">
                  {introText}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {profile.contactLinks.map((link) => (
                  <a
                    key={link.label}
                    className="mobile-contact-link"
                    href={link.href}
                    rel={link.href.startsWith("#") ? undefined : "noopener noreferrer"}
                    target={link.href.startsWith("#") ? undefined : "_blank"}
                  >
                    <Icon className="h-5 w-5 text-[var(--color-accent)]" name={link.icon} />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-9 space-y-14">
            {mobileSections}
            <Footer resumeSource={resumeSource} />
          </div>
        </div>
      </div>
    </div>
  );
}



