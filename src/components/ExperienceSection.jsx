import { Icon } from "./Icons";
import SectionHeading from "./SectionHeading";

export default function ExperienceSection({ items, title, isActive }) {
  return (
    <section className="scroll-mt-24" data-section="experience">
      <SectionHeading id="experience" isActive={isActive} title={title} />
      <div className="space-y-4">
        {items.map((item) => {
          const card = (
            <article className="experience-card">
              <div aria-hidden="true" className="experience-card__surface" />
              <div aria-hidden="true" className="experience-card__border" />

              <div className="experience-card__content px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="experience-card__period mono-detail text-[0.68rem] uppercase tracking-[0.24em]">
                    {item.period}
                  </p>

                  {item.href ? (
                    <div className="experience-card__icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5">
                      <Icon className="h-4 w-4" name="external" />
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="experience-card__title text-[1.2rem] font-semibold tracking-[-0.03em] sm:text-[1.34rem]">
                    {item.title}
                  </h3>
                  {item.company ? (
                    <p className="experience-card__company text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                      {item.company}
                    </p>
                  ) : null}
                </div>

                <p className="experience-card__summary section-copy mt-4 max-w-none">
                  {item.summary}
                </p>
              </div>
            </article>
          );

          if (item.href) {
            return (
              <a
                key={`${item.title}-${item.company ?? item.period}`}
                className="group block max-w-none rounded-[1.25rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(131,197,153,0.2)] focus-visible:ring-offset-0"
                href={item.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {card}
              </a>
            );
          }

          return (
            <div key={`${item.title}-${item.company ?? item.period}`} className="max-w-none">
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}
