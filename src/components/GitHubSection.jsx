import { useEffect, useRef, useState } from "react";
import { fetchGitHubContributions, formatContributionTooltip } from "../lib/githubContributions";
import { Icon } from "./Icons";
import SectionHeading from "./SectionHeading";

const HEATMAP_PALETTE = ["rgba(5, 16, 13, 0.88)", "rgba(0, 95, 62, 0.56)", "#008c5c", "#00c97f", "#00f5a0"];
const VISIBLE_WEEKS = 43;
const contributionCache = new Map();

const normalizeColor = (color) => (typeof color === "string" ? color.trim().toLowerCase() : "");
const getCacheKey = (username, year, locale) => `${username}:${year ?? "latest"}:${locale}`;
const getIntlLocale = (locale) => (locale === "fr" ? "fr-FR" : "en-US");

const getMonthLabel = (firstDay, locale) => {
  if (!firstDay) {
    return "";
  }

  const parsedDate = new Date(`${firstDay}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(getIntlLocale(locale), { month: "short" }).format(parsedDate);
};

const buildMonthColumns = (months, weeks, locale) =>
  months
    .map((month) => {
      const column = weeks.findIndex((week) =>
        week.contributionDays?.some((day) => day.date === month.firstDay),
      );

      if (column < 0) {
        return null;
      }

      return {
        key: `${month.firstDay}-${month.name}`,
        label: getMonthLabel(month.firstDay, locale),
        column,
      };
    })
    .filter(Boolean);

const buildFallbackDayDate = (firstDay, weekday) => {
  const baseDate = firstDay ? new Date(firstDay) : null;

  if (!baseDate || Number.isNaN(baseDate.getTime())) {
    return null;
  }

  const date = new Date(baseDate);
  date.setDate(baseDate.getDate() + weekday);

  return date.toISOString().slice(0, 10);
};

const normalizeContributionDays = (week) => {
  const daysByWeekday = new Map((week?.contributionDays ?? []).map((day) => [day.weekday, day]));

  return Array.from({ length: 7 }, (_, weekday) => {
    const existingDay = daysByWeekday.get(weekday);

    if (existingDay) {
      return existingDay;
    }

    return {
      date: buildFallbackDayDate(week?.firstDay, weekday),
      color: "rgba(22, 27, 34, 0.72)",
      contributionCount: 0,
      weekday,
    };
  });
};

const getMaxContributionCount = (weeks) =>
  weeks.reduce(
    (maxCount, week) =>
      Math.max(
        maxCount,
        ...(week.contributionDays ?? []).map((day) => day?.contributionCount ?? 0),
      ),
    0,
  );

const getContributionLevel = (contributionCount, maxContributionCount) => {
  if (!contributionCount) {
    return 0;
  }

  if (!maxContributionCount) {
    return 1;
  }

  const ratio = contributionCount / maxContributionCount;

  if (ratio >= 0.8) {
    return 4;
  }

  if (ratio >= 0.55) {
    return 3;
  }

  if (ratio >= 0.28) {
    return 2;
  }

  return 1;
};

const getContributionColor = (day, normalizedSourceColors, maxContributionCount) => {
  if (!day?.contributionCount) {
    return HEATMAP_PALETTE[0];
  }

  const colorIndex = normalizedSourceColors.indexOf(normalizeColor(day?.color));

  if (colorIndex > 0) {
    return HEATMAP_PALETTE[Math.min(colorIndex, HEATMAP_PALETTE.length - 1)];
  }

  return HEATMAP_PALETTE[getContributionLevel(day.contributionCount, maxContributionCount)];
};

function HeatmapLegend({ labels }) {
  return (
    <div className="flex items-center gap-2 text-[0.92rem] text-[var(--color-text-secondary)]">
      <span>{labels.legendLess}</span>
      <div className="flex items-center gap-[var(--github-cell-gap)]">
        {HEATMAP_PALETTE.map((color, index) => (
          <span
            key={`${color}-${index}`}
            aria-hidden="true"
            className="github-graph-cell"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <span>{labels.legendMore}</span>
    </div>
  );
}

function IdleBoard({ labels }) {
  return (
    <div className="github-graph-shell border border-white/[0.08] px-4 py-5 sm:px-5">
      <p className="text-[1rem] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
        {labels.idleTitle}
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
        {labels.idleDescription}
      </p>
    </div>
  );
}

function LoadingBoard() {
  return (
    <div className="github-graph-shell animate-pulse">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="h-8 w-72 rounded-full bg-white/[0.08]" />
        <div className="h-5 w-40 rounded-full bg-white/[0.06]" />
      </div>

      <div className="mt-6 overflow-x-auto pb-3 github-scrollport">
        <div className="inline-grid min-w-max gap-y-3">
          <div
            className="github-graph-months"
            style={{ gridTemplateColumns: "repeat(28, var(--github-cell-size))" }}
          >
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="h-4 w-8 rounded-full bg-white/[0.06]" />
            ))}
          </div>

          <div className="github-graph-weeks">
            {Array.from({ length: 28 }, (_, weekIndex) => (
              <div key={weekIndex} className="github-graph-week">
                {Array.from({ length: 7 }, (_, dayIndex) => (
                  <span key={dayIndex} className="github-graph-cell bg-white/[0.05]" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="h-5 w-32 rounded-full bg-white/[0.05]" />
        <div className="h-5 w-36 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  );
}

function ErrorBoard({ labels, message }) {
  return (
    <div className="github-graph-shell border border-white/[0.08] px-4 py-5 sm:px-5">
      <p className="text-[1rem] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
        {labels.errorTitle}
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">{message}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">{labels.errorHelp}</p>
    </div>
  );
}

function YearSelector({ ariaLabel, onSelectYear, selectedYear, years }) {
  if (!Array.isArray(years) || years.length < 2) {
    return null;
  }

  return (
    <div className="github-year-strip" aria-label={ariaLabel}>
      {years.map((year) => {
        const isActive = year === selectedYear;

        return (
          <button
            key={year}
            type="button"
            aria-pressed={isActive}
            className={`github-year-chip ${isActive ? "github-year-chip--active" : ""}`}
            onClick={() => onSelectYear(year)}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}

function ContributionBoard({ data, labels, locale, onSelectYear, profileUrl, selectedYear, username }) {
  const displayedWeeks = data.weeks.slice(Math.max(data.weeks.length - VISIBLE_WEEKS, 0));
  const monthColumns = buildMonthColumns(data.months, displayedWeeks, locale);
  const maxContributionCount = getMaxContributionCount(displayedWeeks);
  const normalizedSourceColors = (data.colors ?? []).map((color) => normalizeColor(color));
  const scrollViewportRef = useRef(null);

  useEffect(() => {
    const viewport = scrollViewportRef.current;

    if (!viewport) {
      return undefined;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      viewport.scrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [data.selectedYear, displayedWeeks.length]);

  return (
    <div className="github-graph-shell">
      <p className="max-w-[34rem] text-[1.35rem] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-[1.7rem]">
        {data.summary}
      </p>

      <div ref={scrollViewportRef} className="github-scrollport mt-6 overflow-x-auto pb-3">
        <div className="inline-grid min-w-max gap-y-4">
          {profileUrl ? (
            <div className="flex justify-end">
              <a
                className="github-profile-link"
                href={profileUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon name="github" className="h-[1.05rem] w-[1.05rem]" />
                <span>@{username}</span>
              </a>
            </div>
          ) : null}

          <div
            className="github-graph-months text-[0.94rem] text-[var(--color-text-secondary)]"
            style={{ gridTemplateColumns: `repeat(${Math.max(displayedWeeks.length, 1)}, var(--github-cell-size))` }}
          >
            {monthColumns.map((month) => (
              <span key={month.key} style={{ gridColumn: `${month.column + 1} / span 1` }}>
                {month.label}
              </span>
            ))}
          </div>

          <div className="github-graph-weeks">
            {displayedWeeks.map((week) => {
              const days = normalizeContributionDays(week);

              return (
                <div key={week.firstDay} className="github-graph-week">
                  {days.map((day) => {
                    const tooltip = formatContributionTooltip(day, locale);

                    return (
                      <div
                        key={day.date ?? `${week.firstDay}-${day.weekday}`}
                        role="img"
                        aria-label={tooltip}
                        className="github-graph-cell"
                        style={{
                          backgroundColor: getContributionColor(
                            day,
                            normalizedSourceColors,
                            maxContributionCount,
                          ),
                        }}
                        title={tooltip}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="mt-1 flex items-center justify-between gap-8">
            <YearSelector
              ariaLabel={labels.yearSelectorAriaLabel}
              years={data.contributionYears}
              selectedYear={selectedYear}
              onSelectYear={onSelectYear}
            />
            <HeatmapLegend labels={labels} />
          </div>
        </div>
      </div>

      <a
        className="mt-4 inline-flex text-[0.9rem] text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-accent)]"
        href={labels.learnMoreUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        {labels.learnMoreLabel}
      </a>
    </div>
  );
}

export default function GitHubSection({ config, labels, locale, title, isActive }) {
  const sectionRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => config?.defaultYear ?? new Date().getFullYear());
  const [calendarState, setCalendarState] = useState({
    status: "idle",
    data: null,
    error: null,
  });

  const username = config?.username ?? "";
  const profileUrl = config?.profileUrl ?? "";

  useEffect(() => {
    setSelectedYear(config?.defaultYear ?? new Date().getFullYear());
  }, [config?.defaultYear, username]);

  useEffect(() => {
    if (shouldLoad) {
      return undefined;
    }

    const sectionElement = sectionRef.current;
    if (!sectionElement) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "420px 0px" },
    );

    observer.observe(sectionElement);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) {
      return undefined;
    }

    if (!username) {
      setCalendarState({
        status: "error",
        data: null,
        error: labels.missingUsernameError,
      });
      return undefined;
    }

    const cacheKey = getCacheKey(username, selectedYear, locale);
    const cachedData = contributionCache.get(cacheKey);

    if (cachedData) {
      setCalendarState({
        status: "ready",
        data: cachedData,
        error: null,
      });

      if (cachedData.selectedYear && cachedData.selectedYear !== selectedYear) {
        setSelectedYear(cachedData.selectedYear);
      }

      return undefined;
    }

    const controller = new AbortController();

    setCalendarState((currentState) => ({
      status: currentState.data ? "ready" : "loading",
      data: currentState.data,
      error: null,
    }));

    fetchGitHubContributions({
      username,
      year: selectedYear,
      signal: controller.signal,
      locale,
    })
      .then((data) => {
        contributionCache.set(cacheKey, data);

        if (data.selectedYear && data.selectedYear !== selectedYear) {
          contributionCache.set(getCacheKey(username, data.selectedYear, locale), data);
        }

        setCalendarState({
          status: "ready",
          data,
          error: null,
        });

        if (data.selectedYear && data.selectedYear !== selectedYear) {
          setSelectedYear(data.selectedYear);
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }

        setCalendarState({
          status: "error",
          data: null,
          error: error.message,
        });
      });

    return () => {
      controller.abort();
    };
  }, [labels.missingUsernameError, locale, selectedYear, shouldLoad, username]);

  return (
    <section ref={sectionRef} className="scroll-mt-24" data-section="github">
      <SectionHeading id="github" isActive={isActive} title={title} />
      <div className="section-shell max-w-[64rem] px-4 py-3.5 sm:px-5">
        {calendarState.status === "idle" ? <IdleBoard labels={labels} /> : null}
        {calendarState.status === "loading" ? <LoadingBoard /> : null}
        {calendarState.status === "error" ? (
          <ErrorBoard labels={labels} message={calendarState.error} />
        ) : null}
        {calendarState.status === "ready" ? (
          <ContributionBoard
            data={calendarState.data}
            labels={labels}
            locale={locale}
            profileUrl={profileUrl}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            username={username}
          />
        ) : null}
      </div>
    </section>
  );
}
