import { useEffect, useState } from "react";
import { Check, Loader2, Palette } from "lucide-react";
import * as api from "../../lib/admin-api.js";
import { DEFAULT_PALETTE, PALETTES } from "../../data/palettes.js";
import { Btn, PageHeader, Spinner, useToast } from "../ui.jsx";

export default function ThemeAdmin() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(DEFAULT_PALETTE);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await api.listSiteSettings();
        if (!mounted) return;
        const current = rows?.theme_palette;
        if (current && PALETTES.some((p) => p.id === current)) {
          setSelected(current);
        }
      } catch (err) {
        if (mounted) toast({ type: "error", title: "Could not load theme", message: err.message || "Please try again." });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveSiteSetting("theme_palette", selected);
      toast({ type: "success", title: "Theme saved", message: "The public site now uses the selected palette." });
    } catch (err) {
      toast({ type: "error", title: "Save failed", message: err.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Appearance"
        title="Theme"
        subtitle="Choose a color palette for the public site. Pick a two-color combination — dark or light background with a strong accent."
        action={
          <Btn variant="primary" size="lg" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Palette size={18} />}
            Save Theme
          </Btn>
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {PALETTES.map((palette) => {
          const active = selected === palette.id;
          return (
            <button
              key={palette.id}
              type="button"
              onClick={() => setSelected(palette.id)}
              className={`group relative rounded-2xl border p-5 text-left transition-all duration-200 ${
                active
                  ? "border-accent bg-surface ring-2 ring-accent/40"
                  : "border-line-strong bg-surface hover:border-ink-secondary hover:bg-surface-2"
              }`}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-heading text-[0.68rem] font-bold uppercase tracking-[0.14em] ${
                    active ? "bg-accent text-base" : "bg-ink/5 text-ink-muted"
                  }`}
                >
                  {palette.dark ? "Dark" : "Light"}
                </span>
                {active && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-base">
                    <Check size={13} strokeWidth={3} />
                  </span>
                )}
              </div>

              <div className="mb-4 flex h-10 w-full overflow-hidden rounded-xl border border-line-strong">
                <div className="flex-1" style={{ backgroundColor: palette.colors[0] }} />
                <div className="flex-1" style={{ backgroundColor: palette.colors[1] }} />
              </div>

              <h3 className="font-heading text-[0.95rem] font-bold tracking-[-0.01em]">{palette.name}</h3>
              <p className="mt-1 text-[0.82rem] leading-relaxed text-ink-muted">{palette.description}</p>
            </button>
          );
        })}
      </div>

      <p className="mt-6 flex items-center gap-2 text-[0.82rem] text-ink-muted">
        <Check size={14} className="text-accent" />
        The theme applies to the public site only — the admin panel always stays on the default dark look.
      </p>
    </div>
  );
}
