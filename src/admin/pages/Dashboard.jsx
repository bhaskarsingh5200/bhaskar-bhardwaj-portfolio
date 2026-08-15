import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Mail,
  MessageSquare,
  Search,
  Settings,
  User,
  Wrench
} from "lucide-react";
import * as api from "../../lib/admin-api.js";
import { PageHeader, Spinner } from "../ui.jsx";

const QUICK_LINKS = [
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, hint: "Manage portfolio projects" },
  { to: "/admin/services", label: "Services", icon: Wrench, hint: "Edit service offerings" },
  { to: "/admin/skills", label: "Skills", icon: MessageSquare, hint: "Manage tech stack" },
  { to: "/admin/about", label: "About", icon: User, hint: "Edit bio and photos" },
  { to: "/admin/messages", label: "Messages", icon: Mail, hint: "Review inquiries" },
  { to: "/admin/settings", label: "Settings", icon: Settings, hint: "Site-wide content" },
  { to: "/admin/seo", label: "SEO", icon: Search, hint: "Search visibility" }
];

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-card border border-line bg-surface p-6">
      <p className="font-heading text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</p>
      <p className="mt-2 font-heading text-[2.2rem] font-extrabold tracking-[-0.02em]">{value}</p>
      {hint && <p className="mt-1 text-[0.82rem] text-ink-secondary">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.listProjects(),
      api.listServices(),
      api.listSkills(),
      api.listHighlights(),
      api.listMessages()
    ])
      .then(([projects, services, skills, highlights, messages]) => {
        if (!active) return;
        setStats({
          projects: projects.length,
          published: projects.filter((p) => p.status === "published").length,
          services: services.length,
          skills: skills.length,
          highlights: highlights.length,
          messages: messages.length,
          unread: messages.filter((m) => m.status === "new").length
        });
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load dashboard data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        subtitle="A quick look at your portfolio content."
      />

      {loading && (
        <div className="flex items-center gap-3 rounded-card border border-line bg-surface px-6 py-10">
          <Spinner className="text-accent" />
          <span className="text-[0.9rem] text-ink-secondary">Loading…</span>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-card border border-[#e08170]/40 bg-[#e08170]/10 px-6 py-8 text-[0.9rem] text-[#e08170]">
          {error}
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Projects" value={stats.projects} hint={`${stats.published} published`} />
            <StatCard label="Services" value={stats.services} />
            <StatCard label="Skills" value={stats.skills} />
            <StatCard label="Messages" value={stats.messages} hint={`${stats.unread} new`} />
          </div>

          <h2 className="mb-4 mt-10 font-heading text-[1.05rem] font-bold tracking-[-0.01em]">Quick links</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_LINKS.map(({ to, label, icon: Icon, hint }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-start gap-4 rounded-card border border-line bg-surface p-5 transition-colors duration-200 hover:border-line-strong hover:bg-surface-2"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block font-heading text-[0.98rem] font-bold">{label}</span>
                  <span className="mt-0.5 block text-[0.82rem] text-ink-muted">{hint}</span>
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
