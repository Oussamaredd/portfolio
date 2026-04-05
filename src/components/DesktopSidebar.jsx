import { forwardRef } from "react";
import { Icon } from "./Icons";
import LocaleSwitch from "./LocaleSwitch";
import ProfileAvatar from "./ProfileAvatar";
import StatusBadge from "./StatusBadge";

const orderedLinks = (links) =>
  [...links].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));

const DesktopSidebar = forwardRef(function DesktopSidebar(
  { activeSection, locale, navItems, onNavigate, onWheel, profile },
  ref,
) {
  return (
    <header
      ref={ref}
      className="no-scrollbar flex h-full flex-col justify-between overflow-y-auto py-20 lg:pl-10 xl:pl-14"
      onWheel={onWheel}
    >
      <div>
        <div className="space-y-4">
          <ProfileAvatar className="h-20 w-20" profile={profile} />

          <div>
            <h1 className="mt-4 max-w-none whitespace-nowrap text-[2.85rem] font-semibold leading-[0.94] tracking-[-0.055em] text-[var(--color-text-primary)] xl:text-[3.15rem]">
              {profile.name}
            </h1>
            <p className="mt-3 max-w-[24rem] text-[1.02rem] leading-6 text-[var(--color-primary)]">
              {profile.role}
            </p>
            <StatusBadge className="mt-3">{profile.status}</StatusBadge>
            <div className="mt-4 flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)]">
              <Icon className="h-4 w-4 text-[var(--color-accent)]" name="location" />
              <span>{profile.location}</span>
            </div>
          </div>
        </div>

        <nav aria-label="In-page jump links" className="mt-12">
          <ul className="space-y-4">
            {navItems
              .filter((item) => item.href !== "#home")
              .map((item) => {
                const isActive = activeSection === item.href;

                return (
                  <li key={item.label}>
                    <a
                      className={`group flex items-center gap-3.5 outline-none transition-colors duration-200 ${
                        isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"
                      }`}
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault();
                        onNavigate(item.href);
                      }}
                    >
                      <span
                        className={`block h-px transition-all duration-200 ${
                          isActive
                            ? "w-9 bg-[var(--color-accent)]"
                            : "w-8 bg-white/70 group-hover:w-9 group-hover:bg-[var(--color-accent)]"
                        }`}
                      />
                      <span
                        className={`text-[0.82rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
                          isActive
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)]"
                        }`}
                      >
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
          </ul>
        </nav>
      </div>

      <div className="mt-12 pb-4">
        <ul aria-label="Social media" className="flex items-center gap-5">
          {orderedLinks(profile.contactLinks).map((link) => (
            <li key={link.label}>
              <a
                aria-label={link.label}
                className="social-icon-link text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                href={link.href}
                rel={link.href.startsWith("#") ? undefined : "noreferrer"}
                target={link.href.startsWith("#") ? undefined : "_blank"}
              >
                <Icon className="h-7 w-7" name={link.icon} />
              </a>
            </li>
          ))}
        </ul>
        <LocaleSwitch className="mt-5" locale={locale} />
      </div>
    </header>
  );
});

export default DesktopSidebar;
