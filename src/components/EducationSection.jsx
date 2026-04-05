import SectionHeading from "./SectionHeading";

function getSchoolDetails(item) {
  if (item.location) {
    return {
      school: item.school,
      location: item.location,
    };
  }

  const [school, ...locationParts] = item.school.split(",");

  return {
    school: school.trim(),
    location: locationParts.join(",").trim(),
  };
}

export default function EducationSection({ items, title, isActive }) {
  return (
    <section className="scroll-mt-24" data-section="education">
      <SectionHeading id="education" isActive={isActive} title={title} />
      <div className="max-w-none space-y-4">
        {items.map((item) => {
          const { school, location } = getSchoolDetails(item);

          return (
            <article key={`${school}-${item.period}`} className="experience-card">
              <div aria-hidden="true" className="experience-card__surface" />
              <div aria-hidden="true" className="experience-card__border" />

              <div className="experience-card__content px-5 py-5 sm:px-6 sm:py-6">
                <p className="experience-card__period mono-detail text-[0.68rem] uppercase tracking-[0.24em]">
                  {item.period}
                </p>
                <h3 className="experience-card__title mt-4 text-[1.18rem] font-semibold tracking-[-0.03em] text-[var(--color-accent)] sm:text-[1.3rem]">
                  {school}
                </h3>
                {location ? (
                  <p className="mt-2 text-sm font-medium text-[var(--color-text-secondary)] sm:text-[0.98rem]">
                    {location}
                  </p>
                ) : null}
                <p className="experience-card__summary section-copy mt-4 max-w-none">
                  {item.detail}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
