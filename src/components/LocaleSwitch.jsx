import { getPathForLocale, SUPPORTED_LOCALES } from "../lib/portfolioLocale";

const localeOptions = [
  { locale: "en", label: "English" },
  { locale: "fr", label: "Français" },
];

function buildTargetHref(nextLocale) {
  if (typeof window === "undefined") {
    return getPathForLocale(nextLocale);
  }

  const hash = window.location.hash || "";
  return `${getPathForLocale(nextLocale)}${hash}`;
}

export default function LocaleSwitch({ className = "", locale }) {
  const normalizedLocale = SUPPORTED_LOCALES.includes(locale) ? locale : "en";

  const handleLocaleClick = (event, nextLocale) => {
    if (typeof window === "undefined") {
      return;
    }

    event.preventDefault();
    window.location.assign(buildTargetHref(nextLocale));
  };

  return (
    <div className={`locale-switch ${className}`.trim()}>
      <div className="locale-switch__links" role="navigation" aria-label="Language versions">
        {localeOptions.map((option) => {
          const isActive = option.locale === normalizedLocale;

          return (
            <a
              key={option.locale}
              aria-current={isActive ? "page" : undefined}
              className={`locale-switch__link ${isActive ? "locale-switch__link--active" : ""}`.trim()}
              href={buildTargetHref(option.locale)}
              onClick={(event) => handleLocaleClick(event, option.locale)}
            >
              {option.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
