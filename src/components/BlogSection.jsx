import { Icon } from "./Icons";
import SectionHeading from "./SectionHeading";

export default function BlogSection({ card }) {
  return (
    <section className="scroll-mt-24" data-section="other">
      <SectionHeading id="other" title="Writing" />
      <a className="group block max-w-[34rem]" href={card.href} rel="noopener noreferrer" target="_blank">
        <article className="section-card">
          <p className="mono-detail text-[0.68rem] uppercase tracking-[0.24em]">Writing sample</p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[1.2rem] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[1.32rem]">
                {card.title}
              </h3>
              <p className="section-copy mt-3 max-w-[31rem]">{card.description}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(121,232,255,0.16)] bg-white/[0.03] text-[var(--color-primary)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
              <Icon className="h-4 w-4" name="external" />
            </div>
          </div>
        </article>
      </a>
    </section>
  );
}
