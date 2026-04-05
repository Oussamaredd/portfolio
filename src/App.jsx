import { useEffect } from "react";
import { getPortfolioContent } from "./data/siteContent";
import { buildAbsoluteLocaleUrl, getLocaleFromPathname } from "./lib/portfolioLocale";
import HomePage from "./pages/HomePage";

function upsertMeta(selector, attribute, value, content) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
  element.setAttribute("content", content);
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

export default function App() {
  const locale =
    typeof window !== "undefined" ? getLocaleFromPathname(window.location.pathname) : "en";
  const content = getPortfolioContent(locale);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const canonicalUrl = buildAbsoluteLocaleUrl(locale);
    const englishUrl = buildAbsoluteLocaleUrl("en");
    const frenchUrl = buildAbsoluteLocaleUrl("fr");

    document.documentElement.lang = locale;
    document.title = content.meta.title;

    upsertMeta('meta[name="description"]', "name", "description", content.meta.description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", content.meta.title);
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      content.meta.description,
    );
    upsertMeta(
      'meta[property="og:locale"]',
      "property",
      "og:locale",
      locale === "fr" ? "fr_FR" : "en_US",
    );
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);

    upsertLink('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });
    upsertLink('link[rel="alternate"][hreflang="en"]', {
      rel: "alternate",
      hreflang: "en",
      href: englishUrl,
    });
    upsertLink('link[rel="alternate"][hreflang="fr"]', {
      rel: "alternate",
      hreflang: "fr",
      href: frenchUrl,
    });
    upsertLink('link[rel="alternate"][hreflang="x-default"]', {
      rel: "alternate",
      hreflang: "x-default",
      href: englishUrl,
    });
  }, [content.meta.description, content.meta.title, locale]);

  return <HomePage content={content} locale={locale} />;
}
