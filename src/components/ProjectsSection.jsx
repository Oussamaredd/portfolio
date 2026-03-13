import { Icon } from "./Icons";
import SectionHeading from "./SectionHeading";

function ProjectPreview({ imageAlt, imageSrc }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-[rgba(121,232,255,0.12)] bg-[rgba(4,10,19,0.86)]">
      <img
        alt={imageAlt}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        src={imageSrc}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(7,14,26,0.08),rgba(7,14,26,0.02)_36%,rgba(7,14,26,0.16)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,rgba(4,10,19,0),rgba(4,10,19,0.16)_58%,rgba(4,10,19,0.42))]" />
    </div>
  );
}

export default function ProjectsSection({ items }) {
  return (
    <section className="scroll-mt-24" data-section="projects">
      <SectionHeading count={items.length} id="projects" title="Projects" />
      <div className="grid w-full max-w-[840px] grid-cols-1 gap-4 xl:grid-cols-2">
        {items.map((project) => (
          <article
            key={project.title}
            className="group relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-[rgba(101,168,124,0.14)] bg-[linear-gradient(180deg,rgba(8,20,13,0.88),rgba(5,11,8,0.76))] shadow-[0_20px_60px_rgba(6,18,10,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(131,197,153,0.22)] hover:shadow-[0_28px_76px_rgba(9,24,14,0.32)]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(131,255,195,0),rgba(131,255,195,0.28),rgba(131,255,195,0))]" />

            <div className="relative border-b border-[rgba(121,232,255,0.08)] px-5 pb-4 pt-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-[1.22rem] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-[1.36rem]">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 rounded-full border border-[rgba(121,232,255,0.14)] bg-white/[0.06] px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                  <span className={`h-2 w-2 rounded-full ${project.statusColor}`} />
                  {project.status}
                </div>
              </div>

              <div className="mt-4">
                <ProjectPreview imageAlt={project.imageAlt} imageSrc={project.imageSrc} />
              </div>
            </div>

            <div className="relative flex flex-grow flex-col px-5 pb-5 pt-4">
              <p className="section-copy mb-4 max-w-none">{project.summary}</p>

              <div className="mb-4 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span key={technology} className="project-chip">
                    {technology}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap gap-2.5 border-t border-[rgba(121,232,255,0.08)] pt-4">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(121,232,255,0.14)] bg-[rgba(255,255,255,0.03)] px-3.5 py-2 text-[0.88rem] font-medium text-[var(--color-text-primary)] transition-all duration-200 hover:border-[rgba(131,255,195,0.26)] hover:bg-[rgba(255,255,255,0.06)]"
                    href={link.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon className="h-4 w-4 text-[var(--color-accent)]" name={link.icon} />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}




