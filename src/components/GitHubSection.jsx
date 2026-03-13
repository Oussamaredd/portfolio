import { useEffect, useRef, useState } from "react";
import { fetchGitHubContributions, formatContributionTooltip } from "../lib/githubContributions";
import { Icon } from "./Icons";
import SectionHeading from "./SectionHeading";

const LEARN_MORE_URL =
  "https://docs.github.com/en/account-and-profile/concepts/contributions-visible-on-your-profile";
const HEATMAP_PALETTE = ["rgba(5, 16, 13, 0.88)", "rgba(0, 95, 62, 0.56)", "#008c5c", "#00c97f", "#00f5a0"];
const VISIBLE_WEEKS = 43;

const normalizeColor = (color) => (typeof color === "string" ? color.trim().toLowerCase() : "");

const buildMonthColumns = (months, weeks) =>
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
        label: month.name.slice(0, 3),
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

const getContributionColor = (day, sourceColors, maxContributionCount) => {
  if (!day?.contributionCount) {
    return HEATMAP_PALETTE[0];
  }

  const normalizedSourceColors = (sourceColors ?? []).map((color) => normalizeColor(color));
  const colorIndex = normalizedSourceColors.indexOf(normalizeColor(day?.color));

  if (colorIndex > 0) {
    return HEATMAP_PALETTE[Math.min(colorIndex, HEATMAP_PALETTE.length - 1)];
  }

  return HEATMAP_PALETTE[getContributionLevel(day.contributionCount, maxContributionCount)];
};

function HeatmapLegend() {
  return (
    <div className="flex items-center gap-2 text-[0.92rem] text-[var(--color-text-secondary)]">
      <span>Less</span>
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
      <span>More</span>
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

function ErrorBoard({ message }) {
  return (
    <div className="github-graph-shell border border-white/[0.08] px-4 py-5 sm:px-5">
      <p className="text-[1rem] font-semibold tracking-[-0.03em] text-[var(--color-text-primary)]">
        GitHub contribution calendar unavailable
      </p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">{message}</p>
      <p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
        Add a `GITHUB_TOKEN` environment variable for the API endpoint and reload the section.
      </p>
    </div>
  );
}

function YearSelector({ years, selectedYear, onSelectYear }) {
  if (!Array.isArray(years) || years.length < 2) {
    return null;
  }

  return (
    <div className="github-year-strip" aria-label="Contribution years">
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

function ContributionBoard({ data, profileUrl, selectedYear, onSelectYear, username }) {
  const displayedWeeks = data.weeks.slice(Math.max(data.weeks.length - VISIBLE_WEEKS, 0));
  const monthColumns = buildMonthColumns(data.months, displayedWeeks);
  const maxContributionCount = getMaxContributionCount(displayedWeeks);
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[34rem] text-[1.35rem] font-semibold tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-[1.7rem]">
          {data.summary}
        </p>

        {profileUrl ? (
          <a
            className="github-profile-link"
            href={profileUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon name="github" className="h-[1.05rem] w-[1.05rem]" />
            <span>@{username}</span>
          </a>
        ) : null}
      </div>

      <div ref={scrollViewportRef} className="github-scrollport mt-6 overflow-x-auto pb-3">
        <div className="inline-grid min-w-max gap-y-3">
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
                    const tooltip = formatContributionTooltip(day);

                    return (
                      <div
                        key={day.date ?? `${week.firstDay}-${day.weekday}`}
                        role="img"
                        aria-label={tooltip}
                        className="github-graph-cell"
                        style={{
                          backgroundColor: getContributionColor(day, data.colors, maxContributionCount),
                        }}
                        title={tooltip}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <YearSelector
          years={data.contributionYears}
          selectedYear={selectedYear}
          onSelectYear={onSelectYear}
        />
        <HeatmapLegend />
      </div>

      <a
        className="mt-4 inline-flex text-[0.9rem] text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-accent)]"
        href={LEARN_MORE_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        Learn how GitHub counts contributions
      </a>
    </div>
  );
}

export default function GitHubSection({ config }) {
  const [selectedYear, setSelectedYear] = useState(() => config?.defaultYear ?? new Date().getFullYear());
  const [calendarState, setCalendarState] = useState({
    status: "loading",
    data: null,
    error: null,
  });

  const username = config?.username ?? "";
  const profileUrl = config?.profileUrl ?? "";

  useEffect(() => {
    setSelectedYear(config?.defaultYear ?? new Date().getFullYear());
  }, [config?.defaultYear, username]);

  useEffect(() => {
    if (!username) {
      setCalendarState({
        status: "error",
        data: null,
        error: "Missing GitHub username.",
      });
      return undefined;
    }

    const controller = new AbortController();

    setCalendarState({
      status: "loading",
      data: null,
      error: null,
    });

    fetchGitHubContributions({
      username,
      year: selectedYear,
      signal: controller.signal,
    })
      .then((data) => {
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
  }, [selectedYear, username]);

  return (
    <section className="scroll-mt-24" data-section="github">
      <SectionHeading id="github" title="GitHub Activity" />
      <div className="section-shell max-w-[64rem] px-4 py-3.5 sm:px-5">
        {calendarState.status === "loading" ? <LoadingBoard /> : null}
        {calendarState.status === "error" ? <ErrorBoard message={calendarState.error} /> : null}
        {calendarState.status === "ready" ? (
          <ContributionBoard
            data={calendarState.data}
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

