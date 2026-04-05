import SectionHeading from "./SectionHeading";

export default function SkillsSection({ items, title, isActive }) {
  return (
    <section className="scroll-mt-24" data-section="skills">
      <SectionHeading id="skills" isActive={isActive} title={title} />
      <div className="section-shell max-w-[52rem] px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
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
