const numberFormatter = new Intl.NumberFormat("en");
const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export async function fetchGitHubContributions({ username, year, signal }) {
  const query = new URLSearchParams({ username });

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

export function formatContributionTooltip(day) {
  const contributionCount = numberFormatter.format(day?.contributionCount ?? 0);
  const contributionLabel = `${contributionCount} contribution${day?.contributionCount === 1 ? "" : "s"}`;
  const parsedDate = day?.date ? new Date(day.date) : null;
  const formattedDate = parsedDate && !Number.isNaN(parsedDate.getTime())
    ? dateFormatter.format(parsedDate)
    : "Unknown date";

  return `${contributionLabel} on ${formattedDate}`;
}

