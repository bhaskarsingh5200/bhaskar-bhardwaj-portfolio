import { getSupabase } from "./supabase.js";
import { projects as fallbackProjects } from "../data/projects.js";
import { services as fallbackServices, highlights as fallbackHighlights, about as fallbackAbout } from "../data/services.js";
import { technologies as fallbackTechnologies } from "../data/technologies.js";
import { hero as fallbackHero, site as fallbackSite, social as fallbackSocial, contactCta as fallbackContactCta } from "../data/site.js";

const CACHE_TTL = 15 * 1000;
const cache = new Map();

const MOCKUP_VARIANTS = ["gym", "fashion", "news", "recipe"];

const CATEGORY_ORDER = ["Frontend", "CMS & Backend", "Workflow"];

function readCache(key) {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.at > CACHE_TTL) {
    cache.delete(key);
    return undefined;
  }
  return entry.data;
}

function writeCache(key, data) {
  cache.set(key, { at: Date.now(), data });
}

export function clearContentCache() {
  cache.clear();
}

async function fetchRows(table, options) {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).select(options?.columns || "*").order(options?.orderBy || "sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

async function fetchSettings(table) {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.from(table).select("key, value");
  if (error) throw error;
  const out = {};
  (data || []).forEach((row) => {
    out[row.key] = row.value;
  });
  return out;
}

const sortByOrder = (rows) => [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

function mapProject(row, index) {
  return {
    id: row.id,
    number: index + 1,
    name: row.title,
    slug: row.slug,
    category: row.category || "",
    description: row.description || "",
    tags: row.technologies || [],
    image: row.image_url || null,
    gallery: [],
    liveUrl: row.live_url || "",
    caseStudyUrl: row.case_study_url || "",
    githubUrl: row.github_url || "",
    featured: Boolean(row.featured),
    mockup: MOCKUP_VARIANTS[index % MOCKUP_VARIANTS.length]
  };
}

export async function getPublishedProjects() {
  const cached = readCache("projects");
  if (cached) return cached;
  try {
    const rows = await fetchRows("projects", {
      columns: "id, title, slug, category, description, technologies, image_url, live_url, case_study_url, github_url, featured",
      orderBy: "sort_order"
    });
    if (rows === null) {
      const data = fallbackProjects.map((p, index) => ({
        id: p.id,
        number: index + 1,
        name: p.name,
        slug: "",
        category: p.category,
        description: p.description,
        tags: p.tags,
        image: null,
        gallery: [],
        liveUrl: p.liveUrl || "",
        caseStudyUrl: p.caseStudyUrl || "",
        githubUrl: p.githubUrl || "",
        featured: false,
        mockup: p.mockup
      }));
      writeCache("projects", data);
      return data;
    }
    const published = rows.filter((r) => r.status === "published");
    const data = published.map(mapProject);
    writeCache("projects", data);
    return data;
  } catch (err) {
    return fallbackProjects.map((p, index) => ({
      id: p.id,
      number: index + 1,
      name: p.name,
      slug: "",
      category: p.category,
      description: p.description,
      tags: p.tags,
      image: null,
      gallery: [],
      liveUrl: p.liveUrl || "",
      caseStudyUrl: p.caseStudyUrl || "",
      githubUrl: p.githubUrl || "",
      featured: false,
      mockup: p.mockup
    }));
  }
}

export async function getPublishedServices() {
  const cached = readCache("services");
  if (cached) return cached;
  try {
    const rows = await fetchRows("services");
    if (rows === null) {
      const data = fallbackServices;
      writeCache("services", data);
      return data;
    }
    const data = sortByOrder(rows.filter((r) => r.status === "published")).map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description || "",
      icon: r.icon || "code"
    }));
    writeCache("services", data);
    return data;
  } catch (err) {
    return fallbackServices;
  }
}

export async function getSkills() {
  const cached = readCache("skills");
  if (cached) return cached;
  try {
    const rows = await fetchRows("skills");
    if (rows === null) {
      const data = fallbackTechnologies;
      writeCache("skills", data);
      return data;
    }
    const published = sortByOrder(rows.filter((r) => r.status === "published"));
    const data = CATEGORY_ORDER.map((title) => ({
      id: title.toLowerCase().replace(/[^a-z]+/g, "-"),
      title,
      items: published.filter((r) => r.category === title).map((r) => ({
        name: r.name,
        icon: r.icon || "code"
      }))
    })).filter((g) => g.items.length > 0);
    writeCache("skills", data);
    return data;
  } catch (err) {
    return fallbackTechnologies;
  }
}

export async function getHighlights() {
  const cached = readCache("highlights");
  if (cached) return cached;
  try {
    const rows = await fetchRows("highlights", { orderBy: "sort_order" });
    if (rows === null) {
      const data = fallbackHighlights;
      writeCache("highlights", data);
      return data;
    }
    const data = sortByOrder(rows).map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description || "",
      icon: r.icon || "bolt"
    }));
    writeCache("highlights", data);
    return data;
  } catch (err) {
    return fallbackHighlights;
  }
}

export async function getAbout() {
  const cached = readCache("about");
  if (cached) return cached;
  const fallback = {
    heading: fallbackAbout.heading,
    copy: fallbackAbout.copy,
    profileImage: "/images/portrait-2.webp",
    gallery: ["/images/portrait-1.webp", "/images/portrait-2.webp", "/images/portrait-3.webp"]
  };
  try {
    const settings = await fetchSettings("site_settings");
    if (settings === null) {
      writeCache("about", fallback);
      return fallback;
    }
    const data = {
      heading: settings.about_heading || fallbackAbout.heading,
      copy: Array.isArray(settings.about_copy) ? settings.about_copy : fallbackAbout.copy,
      profileImage: settings.profile_image || "",
      gallery: Array.isArray(settings.gallery_images) ? settings.gallery_images : fallback.gallery
    };
    writeCache("about", data);
    return data;
  } catch (err) {
    return fallback;
  }
}

export async function getSiteSettings() {
  const cached = readCache("site_settings");
  if (cached) return cached;
  const fallback = {
    name: fallbackSite.name,
    firstName: fallbackSite.firstName,
    role: fallbackSite.role,
    hero_eyebrow: fallbackHero.eyebrow,
    hero_role_before: fallbackHero.roleBefore,
    hero_role_accent: fallbackHero.roleAccent,
    hero_description: fallbackHero.description,
    primary_cta_label: fallbackHero.primaryCta.label,
    primary_cta_href: fallbackHero.primaryCta.href,
    secondary_cta_label: fallbackHero.secondaryCta.label,
    secondary_cta_href: fallbackHero.secondaryCta.href,
    email: fallbackSocial.EMAIL_ADDRESS,
    whatsapp_number: fallbackSocial.WHATSAPP_NUMBER,
    github_url: fallbackSocial.GITHUB_URL,
    linkedin_url: fallbackSocial.LINKEDIN_URL,
    footer_text: "",
    theme_palette: "blue-black",
    contact_cta_title: fallbackContactCta.title,
    contact_cta_text: fallbackContactCta.text
  };
  try {
    const settings = await fetchSettings("site_settings");
    if (settings === null) {
      writeCache("site_settings", fallback);
      return fallback;
    }
    const data = { ...fallback, ...settings };
    writeCache("site_settings", data);
    return data;
  } catch (err) {
    return fallback;
  }
}

export async function getSeoSettings() {
  const cached = readCache("seo_settings");
  if (cached) return cached;
  try {
    const settings = await fetchSettings("seo_settings");
    if (settings === null) return {};
    writeCache("seo_settings", settings);
    return settings;
  } catch (err) {
    return {};
  }
}
