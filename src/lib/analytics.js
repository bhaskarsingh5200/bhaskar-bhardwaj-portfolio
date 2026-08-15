const ANALYTICS_ID = import.meta.env.VITE_PUBLIC_ANALYTICS_ID || "";

export const analyticsEnabled = Boolean(ANALYTICS_ID);

export function trackEvent(name, params = {}) {
  if (!analyticsEnabled) return;
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

export function initAnalytics() {
  if (!analyticsEnabled || typeof document === "undefined") return;
  if (window.gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", ANALYTICS_ID);
}
