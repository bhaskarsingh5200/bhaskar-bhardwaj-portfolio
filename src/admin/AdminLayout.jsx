import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  Layers,
  LogOut,
  Mail,
  Menu,
  Palette,
  Search,
  Settings,
  User,
  Wrench,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/skills", label: "Skills", icon: Layers },
  { to: "/admin/about", label: "About", icon: User },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/theme", label: "Theme", icon: Palette },
  { to: "/admin/seo", label: "SEO", icon: Search }
];

function SidebarContent({ onNavigate }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 py-5">
        <NavLink to="/admin" onClick={onNavigate} className="font-heading text-[1.3rem] font-extrabold tracking-[-0.03em]">
          Admin<span className="text-accent">.</span>
        </NavLink>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3" aria-label="Admin">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[0.9rem] font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-ink-secondary hover:bg-surface hover:text-ink"
              }`
            }
          >
            <Icon size={17} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-soft text-[0.8rem] font-bold text-accent">
            {(user?.email || "A").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.84rem] font-semibold text-ink">{user?.email}</p>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            onClick={handleSignOut}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary transition-colors hover:bg-[#e08170]/10 hover:text-[#e08170]"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen bg-base text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-[#0d0d0d] lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={closeMobile} />
          <aside className="fixed inset-y-0 left-0 w-72 border-r border-line bg-[#0d0d0d] shadow-2xl">
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Close menu"
              className="absolute right-3 top-5 inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary hover:bg-surface hover:text-ink"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={closeMobile} />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen w-full flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-base/80 px-5 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-line-strong text-ink lg:hidden"
            >
              <Menu size={18} />
            </button>
            <p className="text-[0.9rem] text-ink-secondary">
              Signed in as <span className="font-semibold text-ink">Administrator</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-[10px] border border-line-strong px-3.5 py-2 text-[0.84rem] font-medium text-ink-secondary transition-colors hover:border-ink-secondary hover:text-ink"
            >
              <ExternalLink size={15} />
              <span className="hidden sm:inline">View site</span>
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-[10px] border border-[#e08170]/40 px-3.5 py-2 text-[0.84rem] font-medium text-[#e08170] transition-colors hover:bg-[#e08170]/10"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-5 py-8 sm:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
