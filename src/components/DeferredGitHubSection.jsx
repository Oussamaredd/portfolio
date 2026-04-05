import { Suspense, lazy, useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";

const GitHubSection = lazy(() => import("./GitHubSection"));

function GitHubSectionPlaceholder({ title }) {
  return (
    <section className="scroll-mt-24" data-section="github">
      <SectionHeading id="github" title={title} />
      <div className="section-shell max-w-[64rem] px-4 py-3.5 sm:px-5">
        <div className="github-graph-shell animate-pulse">
          <div className="h-8 w-64 rounded-full bg-white/[0.08]" />
          <div className="mt-6 h-40 rounded-[0.5rem] bg-white/[0.03]" />
        </div>
      </div>
    </section>
  );
}

export default function DeferredGitHubSection(props) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (shouldLoad) {
      return undefined;
    }

    const element = containerRef.current;
    if (!element) {
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
      { rootMargin: "600px 0px" },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  return (
    <div ref={containerRef}>
      {shouldLoad ? (
        <Suspense fallback={<GitHubSectionPlaceholder title={props.title} />}>
          <GitHubSection {...props} />
        </Suspense>
      ) : (
        <GitHubSectionPlaceholder title={props.title} />
      )}
    </div>
  );
}
