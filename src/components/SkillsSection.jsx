import SectionHeading from "./SectionHeading";

export default function SkillsSection({ eyebrow, items, title, isActive }) {
  return (
    <section className="scroll-mt-24" data-section="skills">
      <SectionHeading id="skills" isActive={isActive} title={title} />
      <div className="section-shell max-w-[34rem] px-4 py-3.5 sm:px-5">
        <p className="mono-detail mb-4 text-[0.68rem] uppercase tracking-[0.24em]">{eyebrow}</p>
        <div className="flex flex-wrap gap-2.5">
          {items.map((skill) => (
            <span key={skill} className="skill-pill cursor-default">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
