export default function Footer({ content, resumeSource }) {
  return (
    <footer className="border-t border-[rgba(121,232,255,0.12)] pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-2">{content.eyebrow}</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{content.description}</p>
        </div>
        <p className="mono-detail text-xs uppercase tracking-[0.28em]">{content.signature}</p>
      </div>
      <span className="sr-only" id="resume-source">
        {content.resumeSourceLabel}: {resumeSource}
      </span>
    </footer>
  );
}
