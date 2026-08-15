import { useCallback, useEffect, useMemo, useState } from "react";
import { FolderKanban, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import * as api from "../../lib/admin-api.js";
import {
  Badge,
  Btn,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  Select,
  Spinner,
  TextArea,
  TextInput,
  Toggle,
  thCls,
  tdCls,
  rowCls,
  useToast
} from "../ui.jsx";

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" }
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "",
  description: "",
  technologies: "",
  image_url: "",
  live_url: "",
  case_study_url: "",
  github_url: "",
  featured: false,
  status: "draft",
  sort_order: 0
};

function toForm(row) {
  return {
    title: row.title || "",
    slug: row.slug || "",
    category: row.category || "",
    description: row.description || "",
    technologies: (row.technologies || []).join(", "),
    image_url: row.image_url || "",
    live_url: row.live_url || "",
    case_study_url: row.case_study_url || "",
    github_url: row.github_url || "",
    featured: Boolean(row.featured),
    status: row.status || "draft",
    sort_order: row.sort_order ?? 0
  };
}

function fromForm(form) {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    category: form.category.trim(),
    description: form.description.trim(),
    technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
    image_url: form.image_url,
    live_url: form.live_url.trim(),
    case_study_url: form.case_study_url.trim(),
    github_url: form.github_url.trim(),
    featured: form.featured,
    status: form.status,
    sort_order: Number(form.sort_order) || 0
  };
}

function stripBucketPath(url) {
  const marker = "/project-images/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length).split("?")[0];
}

export default function ProjectsAdmin() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api
      .listProjects()
      .then((data) => setRows(data))
      .catch((err) => setError(err.message || "Failed to load projects."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [rows]
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setEditorOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm(toForm(row));
    setEditorOpen(true);
  };

  const setField = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ type: "error", title: "Invalid file", message: "Please choose an image file." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ type: "error", title: "File too large", message: "Images must be under 2 MB." });
      return;
    }
    setUploading(true);
    try {
      const { url } = await api.uploadImage("project-images", file);
      setField("image_url")(url);
      toast({ type: "success", title: "Image uploaded" });
    } catch (err) {
      toast({ type: "error", title: "Upload failed", message: err.message || "Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    const path = stripBucketPath(form.image_url);
    setField("image_url")("");
    if (path) {
      try {
        await api.deleteImage("project-images", path);
      } catch {
        // ignore cleanup failures
      }
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      toast({ type: "error", title: "Title is required" });
      return;
    }
    if (!form.slug.trim()) {
      toast({ type: "error", title: "Slug is required" });
      return;
    }
    setSaving(true);
    try {
      await api.saveProject(fromForm(form), editingId);
      toast({ type: "success", title: editingId ? "Project updated" : "Project created" });
      setEditorOpen(false);
      load();
    } catch (err) {
      toast({ type: "error", title: "Save failed", message: err.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.deleteProject(deleting.id);
      toast({ type: "success", title: "Project deleted" });
      setDeleting(null);
      load();
    } catch (err) {
      toast({ type: "error", title: "Delete failed", message: err.message || "Please try again." });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Projects"
        subtitle="Add, edit, and publish portfolio projects."
        action={
          <Btn variant="primary" onClick={openCreate}>
            <Plus size={16} /> New Project
          </Btn>
        }
      />

      {loading && (
        <div className="flex items-center gap-3 rounded-card border border-line bg-surface px-6 py-10">
          <Spinner className="text-accent" />
          <span className="text-[0.9rem] text-ink-secondary">Loading projects…</span>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-card border border-[#e08170]/40 bg-[#e08170]/10 px-6 py-8 text-[0.9rem] text-[#e08170]">
          {error}
        </div>
      )}

      {!loading && !error && sorted.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to get started."
          action={
            <Btn variant="primary" onClick={openCreate}>
              <Plus size={16} /> New Project
            </Btn>
          }
        />
      )}

      {!loading && !error && sorted.length > 0 && (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full">
            <thead className="border-b border-line bg-[#0d0d0d]">
              <tr>
                <th className={thCls}>Title</th>
                <th className={thCls}>Category</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Order</th>
                <th className={`${thCls} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.id} className={rowCls}>
                  <td className={tdCls}>
                    <div className="flex items-center gap-3">
                      {row.image_url ? (
                        <img src={row.image_url} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
                      ) : (
                        <span className="inline-flex h-10 w-14 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-ink-muted">
                          <FolderKanban size={16} />
                        </span>
                      )}
                      <div>
                        <p className="font-semibold">{row.title}</p>
                        <p className="text-[0.78rem] text-ink-muted">/{row.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className={tdCls}>
                    <span className="text-[0.86rem] text-ink-secondary">{row.category || "—"}</span>
                  </td>
                  <td className={tdCls}>
                    <Badge color={row.status === "published" ? "green" : "gray"}>{row.status}</Badge>
                  </td>
                  <td className={tdCls}>
                    <span className="text-[0.86rem] text-ink-secondary">{row.sort_order ?? 0}</span>
                  </td>
                  <td className={`${tdCls} text-right`}>
                    <div className="flex justify-end gap-2">
                      <Btn size="sm" onClick={() => openEdit(row)}>
                        <Pencil size={14} /> Edit
                      </Btn>
                      <Btn size="sm" variant="danger" onClick={() => setDeleting(row)}>
                        <Trash2 size={14} />
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={editorOpen} onClose={() => setEditorOpen(false)} title={editingId ? "Edit Project" : "New Project"}>
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Title" htmlFor="proj-title">
              <TextInput id="proj-title" value={form.title} onChange={(e) => setField("title")(e.target.value)} placeholder="Project name" />
            </Field>
            <Field label="Slug" htmlFor="proj-slug" hint="Used in the URL, e.g. my-project">
              <TextInput id="proj-slug" value={form.slug} onChange={(e) => setField("slug")(e.target.value)} placeholder="my-project" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Category" htmlFor="proj-category">
              <TextInput id="proj-category" value={form.category} onChange={(e) => setField("category")(e.target.value)} placeholder="Business Website" />
            </Field>
            <Field label="Sort Order" htmlFor="proj-order" hint="Lower numbers appear first">
              <TextInput id="proj-order" type="number" value={form.sort_order} onChange={(e) => setField("sort_order")(e.target.value)} />
            </Field>
          </div>

          <Field label="Description" htmlFor="proj-desc">
            <TextArea id="proj-desc" rows={4} value={form.description} onChange={(e) => setField("description")(e.target.value)} placeholder="Short project description" />
          </Field>

          <Field label="Technologies" htmlFor="proj-tech" hint="Comma-separated, e.g. React, Tailwind, WordPress">
            <TextInput id="proj-tech" value={form.technologies} onChange={(e) => setField("technologies")(e.target.value)} placeholder="React, Tailwind CSS" />
          </Field>

          <Field label="Cover Image" hint="PNG or JPG, up to 2 MB">
            {form.image_url ? (
              <div className="flex items-center gap-4">
                <img src={form.image_url} alt="Cover preview" className="h-24 w-36 rounded-lg border border-line object-cover" />
                <Btn variant="danger" size="sm" onClick={removeImage} disabled={uploading}>
                  <X size={14} /> Remove
                </Btn>
              </div>
            ) : (
              <label className="inline-flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-line-strong px-4 py-6 text-center transition-colors hover:border-accent/50">
                <span className="inline-flex items-center gap-2 text-[0.88rem] font-medium text-ink-secondary">
                  {uploading ? <Spinner className="text-accent" /> : <Upload size={16} />}
                  {uploading ? "Uploading…" : "Choose an image"}
                </span>
                <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleImage} disabled={uploading} />
              </label>
            )}
          </Field>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Field label="Live URL" htmlFor="proj-live">
              <TextInput id="proj-live" value={form.live_url} onChange={(e) => setField("live_url")(e.target.value)} placeholder="https://…" />
            </Field>
            <Field label="Case Study URL" htmlFor="proj-case">
              <TextInput id="proj-case" value={form.case_study_url} onChange={(e) => setField("case_study_url")(e.target.value)} placeholder="https://…" />
            </Field>
            <Field label="Source URL" htmlFor="proj-src">
              <TextInput id="proj-src" value={form.github_url} onChange={(e) => setField("github_url")(e.target.value)} placeholder="https://github.com/…" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Status" htmlFor="proj-status">
              <Select id="proj-status" value={form.status} onChange={(e) => setField("status")(e.target.value)}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Select>
            </Field>
            <Toggle
              checked={form.featured}
              onChange={setField("featured")}
              label="Featured project"
              description="Show this project more prominently."
            />
          </div>

          <div className="mt-2 flex justify-end gap-3 border-t border-line pt-5">
            <Btn variant="secondary" onClick={() => setEditorOpen(false)}>Cancel</Btn>
            <Btn type="submit" variant="primary" disabled={saving}>
              {saving && <Spinner />}
              {editingId ? "Save Changes" : "Create Project"}
            </Btn>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete project"
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
        confirmLabel="Delete Project"
      />
    </div>
  );
}
