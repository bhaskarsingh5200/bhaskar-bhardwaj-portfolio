import * as api from "../../lib/admin-api.js";
import SettingsEditor from "../SettingsEditor.jsx";
import { PageHeader } from "../ui.jsx";

const FIELDS = [
  { key: "name", label: "Site Name", hint: "Shown in the footer." },
  { key: "firstName", label: "First Name", hint: "Shown in the navigation brand." },
  { key: "role", label: "Role", hint: "Shown under the site name in the footer." },
  { key: "hero_eyebrow", label: "Hero Eyebrow" },
  { key: "hero_headline_before", label: "Hero Headline (before accent)", type: "textarea", rows: 2 },
  { key: "hero_headline_accent", label: "Hero Headline (accent)" },
  { key: "hero_description", label: "Hero Description", type: "textarea", rows: 3 },
  { key: "primary_cta_label", label: "Primary CTA Label" },
  { key: "primary_cta_href", label: "Primary CTA Link" },
  { key: "secondary_cta_label", label: "Secondary CTA Label" },
  { key: "secondary_cta_href", label: "Secondary CTA Link" },
  { key: "email", label: "Email Address" },
  { key: "whatsapp_number", label: "WhatsApp Number", hint: "International format without +, e.g. 919876543210" },
  { key: "github_url", label: "GitHub URL" },
  { key: "linkedin_url", label: "LinkedIn URL" },
  { key: "footer_text", label: "Footer Text", hint: "Optional text next to the copyright." }
];

export default function SettingsAdmin() {
  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        subtitle="Site-wide identity and content used across the public site."
      />
      <SettingsEditor
        listFn={api.listSiteSettings}
        saveFn={api.saveSiteSetting}
        fields={FIELDS}
      />
    </div>
  );
}
