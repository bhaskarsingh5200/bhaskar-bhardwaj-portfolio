import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
} from "./ui.jsx";

function defaultValue(fields) {
  const out = {};
  fields.forEach((f) => {
    if (f.type === "toggle") out[f.key] = false;
    else if (f.type === "number") out[f.key] = 0;
    else if (f.type === "textarea") out[f.key] = "";
    else out[f.key] = "";
  });
  return out;
}

function fromRow(row, fields) {
  const out = {};
  fields.forEach((f) => {
    out[f.key] = row[f.key] ?? (f.type === "toggle" ? false : f.type === "number" ? 0 : "");
  });
  return out;
}

function toPayload(form, fields) {
  const out = {};
  fields.forEach((f) => {
    out[f.key] = f.type === "number" ? Number(form[f.key]) || 0 : form[f.key];
  });
  return out;
}

export default function CrudSimple({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  listFn,
  saveFn,
  deleteFn,
  fields,
  newLabel,
  singularLabel
}) {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => defaultValue(fields));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    listFn()
      .then((data) => setRows(data))
      .catch((err) => setError(err.message || `Failed to load ${title.toLowerCase()}.`))
      .finally(() => setLoading(false));
  }, [listFn, title]);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(
    () => [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [rows]
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultValue(fields));
    setEditorOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm(fromRow(row, fields));
    setEditorOpen(true);
  };

  const setField = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (event) => {
    event.preventDefault();
    const primary = fields[0];
    if (primary && !String(form[primary.key] || "").trim()) {
      toast({ type: "error", title: `${primary.label} is required` });
      return;
    }
    setSaving(true);
    try {
      await saveFn(toPayload(form, fields), editingId);
      toast({ type: "success", title: editingId ? `${singularLabel} updated` : `${singularLabel} created` });
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
      await deleteFn(deleting.id);
      toast({ type: "success", title: `${singularLabel} deleted` });
      setDeleting(null);
      load();
    } catch (err) {
      toast({ type: "error", title: "Delete failed", message: err.message || "Please try again." });
    } finally {
      setDeleteLoading(false);
    }
  };

  const primaryKey = fields[0].key;

  return (
    <div>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        action={
          <Btn variant="primary" onClick={openCreate}>
            <Plus size={16} /> {newLabel}
          </Btn>
        }
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

      {!loading && !error && sorted.length === 0 && (
        <EmptyState
          icon={Icon}
          title={`No ${title.toLowerCase()} yet`}
          description={`Add your first ${singularLabel.toLowerCase()} to get started.`}
          action={
            <Btn variant="primary" onClick={openCreate}>
              <Plus size={16} /> {newLabel}
            </Btn>
          }
        />
      )}

      {!loading && !error && sorted.length > 0 && (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full">
            <thead className="border-b border-line bg-[#0d0d0d]">
              <tr>
                <th className={thCls}>{fields[0].label}</th>
                {fields.find((f) => f.type === "select") && (
                  <th className={thCls}>{fields.find((f) => f.type === "select").label}</th>
                )}
                {fields.find((f) => f.key === "status") && <th className={thCls}>Status</th>}
                <th className={thCls}>Order</th>
                <th className={`${thCls} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.id} className={rowCls}>
                  <td className={tdCls}>
                    <p className="font-semibold">{row[primaryKey]}</p>
                    {row.description && (
                      <p className="mt-0.5 max-w-[46ch] truncate text-[0.8rem] text-ink-muted">{row.description}</p>
                    )}
                  </td>
                  {fields.find((f) => f.type === "select") && (
                    <td className={tdCls}>
                      <span className="text-[0.86rem] text-ink-secondary">{row[fields.find((f) => f.type === "select").key]}</span>
                    </td>
                  )}
                  {fields.find((f) => f.key === "status") && (
                    <td className={tdCls}>
                      <Badge color={row.status === "published" ? "green" : "gray"}>{row.status || "draft"}</Badge>
                    </td>
                  )}
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

      <Modal open={editorOpen} onClose={() => setEditorOpen(false)} title={editingId ? `Edit ${singularLabel}` : `New ${singularLabel}`}>
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {fields.map((field) => {
            if (field.type === "textarea") {
              return (
                <Field key={field.key} label={field.label} hint={field.hint} htmlFor={`f-${field.key}`}>
                  <TextArea id={`f-${field.key}`} rows={field.rows || 3} value={form[field.key]} onChange={(e) => setField(field.key)(e.target.value)} placeholder={field.placeholder} />
                </Field>
              );
            }
            if (field.type === "select") {
              return (
                <Field key={field.key} label={field.label} htmlFor={`f-${field.key}`}>
                  <Select id={`f-${field.key}`} value={form[field.key]} onChange={(e) => setField(field.key)(e.target.value)}>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                </Field>
              );
            }
            if (field.type === "toggle") {
              return (
                <Toggle
                  key={field.key}
                  checked={Boolean(form[field.key])}
                  onChange={setField(field.key)}
                  label={field.label}
                  description={field.hint}
                />
              );
            }
            if (field.type === "number") {
              return (
                <Field key={field.key} label={field.label} hint={field.hint} htmlFor={`f-${field.key}`}>
                  <TextInput id={`f-${field.key}`} type="number" value={form[field.key]} onChange={(e) => setField(field.key)(e.target.value)} />
                </Field>
              );
            }
            return (
              <Field key={field.key} label={field.label} hint={field.hint} htmlFor={`f-${field.key}`}>
                <TextInput id={`f-${field.key}`} value={form[field.key]} onChange={(e) => setField(field.key)(e.target.value)} placeholder={field.placeholder} />
              </Field>
            );
          })}

          <div className="mt-2 flex justify-end gap-3 border-t border-line pt-5">
            <Btn variant="secondary" onClick={() => setEditorOpen(false)}>Cancel</Btn>
            <Btn type="submit" variant="primary" disabled={saving}>
              {saving && <Spinner />}
              {editingId ? "Save Changes" : "Create"}
            </Btn>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title={`Delete ${singularLabel.toLowerCase()}`}
        message={`Delete "${deleting?.[primaryKey]}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
