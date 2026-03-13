export default function SectionHeading({ id, title, count }) {
  return (
    <div className="mb-5 flex items-end gap-4 sm:mb-7">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2
            className="scroll-mt-24 text-[1.15rem] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-[1.55rem]"
            id={id}
          >
            {title}
          </h2>
          {count ? (
            <span className="rounded-full border border-[rgba(121,232,255,0.14)] bg-white/[0.03] px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              {String(count).padStart(2, "0")}
            </span>
          ) : null}
        </div>
      </div>
      <div className="mb-2 hidden h-px flex-1 bg-[linear-gradient(90deg,rgba(121,232,255,0.38),rgba(121,232,255,0))] sm:block" />
    </div>
  );
}

