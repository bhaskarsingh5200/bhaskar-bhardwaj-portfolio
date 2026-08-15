import { useEffect, useState } from "react";
import { clearContentCache } from "../lib/public-api.js";
import { Btn, Field, Spinner, TextArea, TextInput, useToast } from "./ui.jsx";

export default function SettingsEditor({ listFn, saveFn, fields, onSaved, saveLabel = "Save Changes" }) {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    listFn()
      .then((settings) => setValues(settings || {}))
      .catch((err) => setError(err.message || "Failed to load settings."))
      .finally(() => setLoading(false));
  }, [listFn]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-card border border-line bg-surface px-6 py-10">
        <Spinner className="text-accent" />
        <span className="text-[0.9rem] text-ink-secondary">Loading…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-card border border-[#e08170]/40 bg-[#e08170]/10 px-6 py-8 text-[0.9rem] text-[#e08170]">
        {error}
      </div>
    );
  }

  const setValue = (key) => (value) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      for (const field of fields) {
        await saveFn(field.key, values[field.key] ?? "");
      }
      clearContentCache();
      toast({ type: "success", title: "Settings saved" });
      onSaved?.();
    } catch (err) {
      toast({ type: "error", title: "Save failed", message: err.message || "Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5 rounded-card border border-line bg-surface p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          if (field.type === "textarea") {
            return (
              <Field key={field.key} label={field.label} hint={field.hint} htmlFor={`set-${field.key}`} >
                <TextArea id={`set-${field.key}`} rows={field.rows || 3} value={values[field.key] ?? ""} onChange={(e) => setValue(field.key)(e.target.value)} placeholder={field.placeholder} />
              </Field>
            );
          }
          return (
            <Field key={field.key} label={field.label} hint={field.hint} htmlFor={`set-${field.key}`}>
              <TextInput id={`set-${field.key}`} value={values[field.key] ?? ""} onChange={(e) => setValue(field.key)(e.target.value)} placeholder={field.placeholder} />
            </Field>
          );
        })}
      </div>

      <div className="flex justify-end border-t border-line pt-5">
        <Btn type="submit" variant="primary" disabled={saving}>
          {saving && <Spinner />}
          {saveLabel}
        </Btn>
      </div>
    </form>
  );
}
