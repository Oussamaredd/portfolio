const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const DEFAULT_LEGEND_COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
};
const CACHE_HEADERS = {
  "cache-control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=43200",
};
const NO_STORE_HEADERS = {
  "cache-control": "no-store",
};
const normalizeLocale = (rawLocale) =>
  String(rawLocale ?? "").toLowerCase().startsWith("fr") ? "fr" : "en";

const getIntlLocale = (locale) => (normalizeLocale(locale) === "fr" ? "fr-FR" : "en-US");
const createNumberFormatter = (locale) => new Intl.NumberFormat(getIntlLocale(locale));

const CONTRIBUTIONS_QUERY = `
  query PortfolioContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionYears
        contributionCalendar {
          colors
          totalContributions
          months {
            firstDay
            name
          }
          weeks {
            firstDay
            contributionDays {
              color
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

const createJsonResponse = (payload, init = {}) =>
  new Response(JSON.stringify(payload), {
    status: init.status ?? 200,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers ?? {}),
    },
  });

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const parseRequestedYear = (rawYear, fallbackYear) => {
  const parsedYear = Number.parseInt(rawYear ?? "", 10);

  if (!Number.isFinite(parsedYear) || parsedYear < 2007 || parsedYear > fallbackYear) {
    return fallbackYear;
  }

  return parsedYear;
};

const createUtcDate = (year, month, day, hours = 0, minutes = 0, seconds = 0, ms = 0) =>
  new Date(Date.UTC(year, month, day, hours, minutes, seconds, ms));

const deriveUtcWeekday = (dateString) => {
  const parsedDate = new Date(`${dateString}T00:00:00Z`);
  return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getUTCDay();
};

const buildContributionWindow = (selectedYear, now = new Date()) => {
  const currentYear = now.getUTCFullYear();

  if (selectedYear === currentYear) {
    const to = createUtcDate(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999,
    );
    const from = createUtcDate(to.getUTCFullYear() - 1, to.getUTCMonth(), to.getUTCDate() + 1);

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      isRollingWindow: true,
    };
  }

  return {
    from: createUtcDate(selectedYear, 0, 1).toISOString(),
    to: createUtcDate(selectedYear, 11, 31, 23, 59, 59, 999).toISOString(),
    isRollingWindow: false,
  };
};

const formatSummary = (totalContributions, selectedYear, isRollingWindow, locale) => {
  const normalizedLocale = normalizeLocale(locale);
  const contributionLabel = `${createNumberFormatter(normalizedLocale).format(totalContributions)} contribution${
    totalContributions === 1 ? "" : "s"
  }`;

  if (normalizedLocale === "fr") {
    return isRollingWindow
      ? `${contributionLabel} au cours des 12 derniers mois`
      : `${contributionLabel} en ${selectedYear}`;
  }

  return isRollingWindow
    ? `${contributionLabel} in the last year`
    : `${contributionLabel} in ${selectedYear}`;
};

const normalizeCalendar = (collection, selectedYear, isRollingWindow, locale) => {
  const calendar = collection?.contributionCalendar;
  const totalContributions = calendar?.totalContributions ?? 0;
  const contributionYears = Array.from(new Set([selectedYear, ...(collection?.contributionYears ?? [])])).sort(
    (left, right) => right - left,
  );

  return {
    selectedYear,
    isRollingWindow,
    summary: formatSummary(totalContributions, selectedYear, isRollingWindow, locale),
    totalContributions,
    colors:
      Array.isArray(calendar?.colors) && calendar.colors.length > 0 ? calendar.colors : DEFAULT_LEGEND_COLORS,
    contributionYears,
    months: (calendar?.months ?? []).map((month) => ({
      firstDay: month.firstDay,
      name: month.name,
    })),
    weeks: (calendar?.weeks ?? []).map((week) => ({
      firstDay: week.firstDay,
      contributionDays: (week.contributionDays ?? []).map((day) => ({
        color: day.color,
        contributionCount: day.contributionCount,
        date: day.date,
        weekday: deriveUtcWeekday(day.date),
      })),
    })),
  };
};

export async function requestGitHubContributionCalendar({
  username,
  selectedYear,
  token,
  locale = "en",
  now = new Date(),
}) {
  const normalizedToken = token?.trim();

  if (!normalizedToken) {
    throw createError("Missing GITHUB_TOKEN configuration.", 500);
  }

  const contributionWindow = buildContributionWindow(selectedYear, now);
  const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${normalizedToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: {
        login: username,
        from: contributionWindow.from,
        to: contributionWindow.to,
      },
    }),
  });

  const payload = await response.json().catch(() => null);
  const apiErrors = payload?.errors?.map((entry) => entry.message).filter(Boolean) ?? [];

  if (!response.ok || apiErrors.length > 0) {
    const message = apiErrors.join(" ") || payload?.message || "GitHub GraphQL request failed.";
    throw createError(message, response.status || 502);
  }

  const user = payload?.data?.user;

  if (!user) {
    throw createError(`GitHub user \"${username}\" was not found.`, 404);
  }

  return normalizeCalendar(
    user.contributionsCollection,
    selectedYear,
    contributionWindow.isRollingWindow,
    locale,
  );
}

export async function handleGitHubContributionsRequest(
  request,
  { token = process.env.GITHUB_TOKEN, now = new Date() } = {},
) {
  if (request.method !== "GET") {
    return createJsonResponse(
      { error: "Method not allowed." },
      {
        status: 405,
        headers: {
          allow: "GET",
          ...NO_STORE_HEADERS,
        },
      },
    );
  }

  const requestUrl = new URL(request.url);
  const username = requestUrl.searchParams.get("username")?.trim();

  if (!username) {
    return createJsonResponse(
      { error: "Missing username query parameter." },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  const selectedYear = parseRequestedYear(requestUrl.searchParams.get("year"), now.getUTCFullYear());
  const locale = normalizeLocale(requestUrl.searchParams.get("lang"));

  try {
    const contributionCalendar = await requestGitHubContributionCalendar({
      username,
      selectedYear,
      token,
      now,
      locale,
    });

    return createJsonResponse(
      {
        username,
        ...contributionCalendar,
      },
      {
        headers: CACHE_HEADERS,
      },
    );
  } catch (error) {
    return createJsonResponse(
      {
        error: error.message,
      },
      {
        status: error.status ?? 502,
        headers: NO_STORE_HEADERS,
      },
    );
  }
}
