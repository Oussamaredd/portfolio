export default function SectionHeading({ id, title }) {
  return (
    <div className="mb-5 flex items-end gap-4 sm:mb-7">
      <div className="min-w-0">
        <div className="section-heading__group flex flex-wrap items-center gap-2.5">
          <h2
            className="section-heading__title scroll-mt-24 text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[1.55rem]"
            id={id}
          >
            {title}
          </h2>
        </div>
      </div>
      <div className="mb-2 hidden h-px flex-1 bg-[linear-gradient(90deg,rgba(121,232,255,0.38),rgba(121,232,255,0))] sm:block" />
    </div>
  );
}
