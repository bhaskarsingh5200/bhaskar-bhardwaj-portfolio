import { useCallback, useEffect, useState } from "react";
import { Plus, Sparkles, Trash2, Upload, X } from "lucide-react";
import * as api from "../../lib/admin-api.js";
import CrudSimple from "../CrudSimple.jsx";
import { Field, PageHeader, Spinner, TextArea, TextInput, Btn, useToast } from "../ui.jsx";

const HIGHLIGHT_FIELDS = [
  { key: "title", label: "Title", type: "text", placeholder: "Responsive by Design" },
  { key: "description", label: "Description", type: "textarea", rows: 2 },
  {
    key: "icon",
    label: "Icon",
    type: "select",
    options: [
      { value: "responsive", label: "Responsive" },
      { value: "bolt", label: "Bolt" },
      { value: "search", label: "Search" },
      { value: "handshake", label: "Handshake" },
      { value: "browser", label: "Browser" },
      { value: "layers", label: "Layers" },
      { value: "bag", label: "Bag" },
      { value: "code", label: "Code" }
    ]
  },
  { key: "sort_order", label: "Sort Order", type: "number", hint: "Lower numbers appear first" }
];

function stripPath(url, bucket) {
  const marker = `/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length).split("?")[0];
}

export default function AboutAdmin() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heading, setHeading] = useState("");
  const [copy, setCopy] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [gallery, setGallery] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api
      .listSiteSettings()
      .then((settings) => {
        setHeading(settings.about_heading || "");
        setCopy(Array.isArray(settings.about_copy) ? settings.about_copy.join("\n\n") : "");
        setProfileImage(settings.profile_image || "");
        setGallery(Array.isArray(settings.gallery_images) ? settings.gallery_images : []);
      })
      .catch((err) => setError(err.message || "Failed to load About settings."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const uploadTo = async (file, bucket) => {
    if (!file.type.startsWith("image/")) {
      toast({ type: "error", title: "Invalid file", message: "Please choose an image file." });
      return null;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ type: "error", title: "File too large", message: "Images must be under 2 MB." });
      return null;
    }
    setUploading(true);
    try {
      const { url } = await api.uploadImage(bucket, file);
      return url;
    } catch (err) {
      toast({ type: "error", title: "Upload failed", message: err.message || "Please try again." });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadTo(file, "profile-images");
    if (url) {
      setProfileImage(url);
      toast({ type: "success", title: "Photo uploaded" });
    }
    event.target.value = "";
  };

  const removeProfile = async () => {
    const path = stripPath(profileImage, "profile-images");
    setProfileImage("");
    if (path) {
      try {
        await api.deleteImage("profile-images", path);
      } catch {
        // ignore cleanup failures
      }
    }
  };

  const handleGalleryUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = await uploadTo(file, "profile-images");
    if (url) {
      setGallery((prev) => [...prev, url]);
      toast({ type: "success", title: "Photo added" });
    }
    event.target.value = "";
  };

  const removeGalleryItem = async (index) => {
    const url = gallery[index];
    setGallery((prev) => prev.filter((_, i) => i !== index));
    const path = stripPath(url, "profile-images");
    if (path) {
      try {
        await api.deleteImage("profile-images", path);
      } catch {
        // ignore cleanup failures
      }
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.saveSiteSetting("about_heading", heading);
      await api.saveSiteSetting(
        "about_copy",
        copy.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
      );
      await api.saveSiteSetting("profile_image", profileImage);
      await api.saveSiteSetting("gallery_images", gallery);
      toast({ type: "success", title: "About section saved" });
    } catch (err) {
      toast({ type: "error", title: "Save failed", message: err.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="About"
        subtitle="Edit your bio, portrait, and photo gallery."
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

      {!loading && !error && (
        <>
          <form onSubmit={handleSave} className="mb-10 flex flex-col gap-5 rounded-card border border-line bg-surface p-6 sm:p-8">
            <Field label="About Heading" htmlFor="about-heading">
              <TextInput id="about-heading" value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="About Me" />
            </Field>

            <Field label="Bio Paragraphs" htmlFor="about-copy" hint="Separate paragraphs with a blank line.">
              <TextArea id="about-copy" rows={7} value={copy} onChange={(e) => setCopy(e.target.value)} placeholder="First paragraph…&#10;&#10;Second paragraph…" />
            </Field>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <Field label="Portrait Photo" hint="Shown in the About section.">
                {profileImage ? (
                  <div className="flex items-center gap-4">
                    <img src={profileImage} alt="Portrait preview" className="h-28 w-24 rounded-lg border border-line object-cover" />
                    <Btn variant="danger" size="sm" onClick={removeProfile} disabled={uploading}>
                      <X size={14} /> Remove
                    </Btn>
                  </div>
                ) : (
                  <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-line-strong px-4 py-6 text-center transition-colors hover:border-accent/50">
                    <span className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-ink-secondary">
                      {uploading ? <Spinner className="text-accent" /> : <Upload size={16} />}
                      {uploading ? "Uploading…" : "Choose a photo"}
                    </span>
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleProfileUpload} disabled={uploading} />
                  </label>
                )}
              </Field>

              <Field label="Photo Gallery" hint="Small gallery shown under your bio.">
                <div className="flex flex-col gap-3">
                  {gallery.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {gallery.map((url, index) => (
                        <div key={`${url}-${index}`} className="relative">
                          <img src={url} alt={`Gallery ${index + 1}`} className="aspect-[3/4] w-full rounded-lg border border-line object-cover" />
                          <button
                            type="button"
                            aria-label={`Remove photo ${index + 1}`}
                            onClick={() => removeGalleryItem(index)}
                            className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-ink transition-colors hover:bg-[#e08170]"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-line-strong px-4 py-4 text-center transition-colors hover:border-accent/50">
                    <span className="inline-flex items-center gap-2 text-[0.86rem] font-medium text-ink-secondary">
                      {uploading ? <Spinner className="text-accent" /> : <Plus size={15} />}
                      {uploading ? "Uploading…" : "Add photo"}
                    </span>
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleGalleryUpload} disabled={uploading} />
                  </label>
                </div>
              </Field>
            </div>

            <div className="flex justify-end border-t border-line pt-5">
              <Btn type="submit" variant="primary" disabled={saving}>
                {saving && <Spinner />}
                Save About
              </Btn>
            </div>
          </form>

          <CrudSimple
            eyebrow="Content"
            title="Highlights"
            subtitle="The feature cards shown below your bio."
            icon={Sparkles}
            listFn={api.listHighlights}
            saveFn={api.saveHighlight}
            deleteFn={api.deleteHighlight}
            fields={HIGHLIGHT_FIELDS}
            newLabel="New Highlight"
            singularLabel="Highlight"
          />
        </>
      )}
    </div>
  );
}
