const baseClasses =
  "relative overflow-hidden rounded-full border border-[rgba(121,232,255,0.18)] bg-[radial-gradient(circle_at_top,rgba(121,232,255,0.22),transparent_60%),linear-gradient(145deg,rgba(15,25,43,0.92),rgba(6,10,19,0.92))]";

export default function ProfileAvatar({ className = "h-20 w-20", profile }) {
  return (
    <div className={`${baseClasses} ${className}`}>
      {profile.imageSrc ? (
        <>
          <img
            alt={profile.imageAlt}
            className="h-full w-full object-cover object-[50%_18%]"
            decoding="async"
            fetchPriority="high"
            height="213"
            loading="eager"
            src={profile.imageSrc}
            width="320"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(4,8,18,0.28)_100%)]"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-secondary)]">
          {profile.imageLabel}
        </div>
      )}
    </div>
  );
}
