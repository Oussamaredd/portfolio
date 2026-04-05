const getIntlLocale = (locale = "en") => (locale === "fr" ? "fr-FR" : "en-US");

export async function fetchGitHubContributions({ locale = "en", signal, username, year }) {
  const query = new URLSearchParams({ username, lang: locale });

  if (year) {
    query.set("year", String(year));
  }

  const response = await fetch(`/api/github-contributions?${query.toString()}`, {
    method: "GET",
    signal,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? "GitHub contribution data could not be loaded.");
  }

  return payload;
}

export function formatContributionTooltip(day, locale = "en") {
  const intlLocale = getIntlLocale(locale);
  const numberFormatter = new Intl.NumberFormat(intlLocale);
  const dateFormatter = new Intl.DateTimeFormat(intlLocale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const contributionCount = numberFormatter.format(day?.contributionCount ?? 0);
  const contributionLabel =
    locale === "fr"
      ? `${contributionCount} contribution${day?.contributionCount === 1 ? "" : "s"}`
      : `${contributionCount} contribution${day?.contributionCount === 1 ? "" : "s"}`;
  const parsedDate = day?.date ? new Date(day.date) : null;
  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? dateFormatter.format(parsedDate)
      : locale === "fr"
        ? "date inconnue"
        : "Unknown date";

  return locale === "fr"
    ? `${contributionLabel} le ${formattedDate}`
    : `${contributionLabel} on ${formattedDate}`;
}
