export default function Footer({ resumeSource }) {
  return (
    <footer className="border-t border-[rgba(121,232,255,0.12)] pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Portfolio</p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Designed and developed with React and Tailwind CSS.
          </p>
        </div>
        <p className="mono-detail text-xs uppercase tracking-[0.28em]">
          Built with motion, detail, and intent
        </p>
      </div>
      <span className="sr-only" id="resume-source">
        Resume source: {resumeSource}
      </span>
    </footer>
  );
}