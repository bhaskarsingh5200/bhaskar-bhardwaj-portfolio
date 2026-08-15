import * as api from "../../lib/admin-api.js";
import SettingsEditor from "../SettingsEditor.jsx";
import { PageHeader } from "../ui.jsx";

const FIELDS = [
  { key: "site_title", label: "Site Title", hint: "Shown in the browser tab and search results." },
  { key: "meta_description", label: "Meta Description", type: "textarea", rows: 3, hint: "A short summary shown in search results." },
  { key: "canonical_url", label: "Canonical URL", hint: "The primary URL for the site, e.g. https://yourdomain.com/" },
  { key: "og_title", label: "OG Title", hint: "Used when the page is shared on social media." },
  { key: "og_description", label: "OG Description", type: "textarea", rows: 3 },
  { key: "og_image", label: "OG Image URL", hint: "1200x630 image shown in social shares. Use a public URL." },
  { key: "twitter_title", label: "Twitter Title" },
  { key: "twitter_description", label: "Twitter Description", type: "textarea", rows: 3 },
  { key: "twitter_image", label: "Twitter Image URL" }
];

export default function SeoAdmin() {
  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="SEO"
        subtitle="Search and social sharing metadata for the site."
      />
      <SettingsEditor
        listFn={api.listSeoSettings}
        saveFn={api.saveSeoSetting}
        fields={FIELDS}
        saveLabel="Save SEO"
      />
    </div>
  );
}
