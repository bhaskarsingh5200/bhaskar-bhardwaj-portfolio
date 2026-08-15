import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "../lib/public-api.js";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [state, setState] = useState({
    loading: true,
    settings: null,
    projects: null,
    services: null,
    skills: null,
    highlights: null,
    about: null,
    seo: null
  });

  const load = useCallback(async () => {
    const [settings, projects, services, skills, highlights, about, seo] =
      await Promise.all([
        api.getSiteSettings(),
        api.getPublishedProjects(),
        api.getPublishedServices(),
        api.getSkills(),
        api.getHighlights(),
        api.getAbout(),
        api.getSeoSettings()
      ]);
    setState({ loading: false, settings, projects, services, skills, highlights, about, seo });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        api.clearContentCache();
        load();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [load]);

  const refresh = useCallback(() => {
    api.clearContentCache();
    return load();
  }, [load]);

  return (
    <ContentContext.Provider value={{ ...state, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
