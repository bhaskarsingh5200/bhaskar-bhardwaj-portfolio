import { useEffect } from "react";
import { useContent } from "../context/ContentContext.jsx";
import { isSupabaseConfigured } from "../lib/supabase.js";

function upsertMeta(selector, content) {
  if (!content) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const match = selector.match(/^meta\[(property|name)="([^"]+)"\]$/);
    if (match) el.setAttribute(match[1], match[2]);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SeoManager() {
  const { seo } = useContent();

  useEffect(() => {
    if (!isSupabaseConfigured || !seo) return;
    if (seo.site_title) document.title = seo.site_title;
    upsertMeta('meta[name="description"]', seo.meta_description);
    upsertLink("canonical", seo.canonical_url);
    upsertMeta('meta[property="og:title"]', seo.og_title || seo.site_title);
    upsertMeta('meta[property="og:description"]', seo.og_description);
    upsertMeta('meta[property="og:url"]', seo.canonical_url);
    if (seo.og_image) upsertMeta('meta[property="og:image"]', seo.og_image);
    upsertMeta('meta[name="twitter:title"]', seo.twitter_title || seo.site_title);
    upsertMeta('meta[name="twitter:description"]', seo.twitter_description);
    if (seo.twitter_image) upsertMeta('meta[name="twitter:image"]', seo.twitter_image);
  }, [seo]);

  return null;
}
