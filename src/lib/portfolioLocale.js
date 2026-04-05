export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = ["en", "fr"];

export function getLocaleFromPathname(pathname = "/") {
  const normalizedPath = (pathname || "/").trim().replace(/\/+$/, "") || "/";
  return /^\/fr(?:\/|$)/i.test(normalizedPath) ? "fr" : DEFAULT_LOCALE;
}

export function getPathForLocale(locale) {
  return locale === "fr" ? "/fr" : "/";
}

export function buildAbsoluteLocaleUrl(
  locale,
  locationLike = typeof window !== "undefined" ? window.location : null,
) {
  const path = getPathForLocale(locale);

  if (!locationLike) {
    return path;
  }

  return new URL(path, `${locationLike.protocol}//${locationLike.host}`).toString();
}
