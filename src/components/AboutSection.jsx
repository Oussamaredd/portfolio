import SectionHeading from "./SectionHeading";

export default function AboutSection({ text, title, isActive }) {
  const paragraphs = text.split("\n\n");

  return (
    <section className="scroll-mt-24" data-section="about">
      <SectionHeading id="about" isActive={isActive} title={title} />
      <div className="section-shell max-w-[58rem] px-4 py-3.5 sm:px-5">
        <div className="space-y-2.5">
          {paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={
                index === 0
                  ? "max-w-[58rem] text-[0.98rem] leading-[1.65] text-[var(--color-text-primary)] sm:text-base"
                  : "section-copy max-w-[58rem]"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
