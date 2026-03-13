export default function StatusBadge({ children, className = "" }) {
  return (
    <div
      className={`group inline-flex cursor-default items-center gap-2 rounded-full border border-[rgba(131,255,195,0.28)] bg-[linear-gradient(180deg,rgba(4,18,20,0.82),rgba(3,11,17,0.76))] px-4 py-2 text-[0.88rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_0_1px_rgba(5,20,26,0.35)] transition-[transform,border-color,box-shadow,background] duration-200 ease-out hover:-translate-y-px hover:border-[rgba(131,255,195,0.42)] hover:bg-[linear-gradient(180deg,rgba(5,22,24,0.9),rgba(4,14,20,0.84))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_24px_rgba(2,12,16,0.22),0_0_0_1px_rgba(7,24,28,0.42)] motion-reduce:transition-none ${className}`.trim()}
    >
      <span className="relative flex h-3 w-3 shrink-0 rounded-full bg-[var(--color-accent)] shadow-[0_0_0_6px_rgba(131,255,195,0.08)] transition-transform duration-200 ease-out group-hover:scale-110 motion-reduce:transition-none" />
      <span className="transition-[color] duration-200 ease-out group-hover:text-[#b8ffd9] motion-reduce:transition-none">
        {children}
      </span>
    </div>
  );
}
