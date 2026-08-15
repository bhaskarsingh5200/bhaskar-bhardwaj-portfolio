import { useCallback, useEffect, useState } from "react";
import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import * as api from "../../lib/admin-api.js";
import {
  Badge,
  Btn,
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  Select,
  Spinner,
  thCls,
  tdCls,
  rowCls,
  useToast
} from "../ui.jsx";
import { MESSAGE_STATUS_OPTIONS } from "../icons.js";

const statusColors = {
  new: "red",
  read: "blue",
  replied: "green",
  archived: "gray"
};

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return value;
  }
}

export default function MessagesAdmin() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    api
      .listMessages()
      .then((data) => setRows(data))
      .catch((err) => setError(err.message || "Failed to load messages."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateMessageStatus(id, status);
      toast({ type: "success", title: "Status updated" });
      setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (err) {
      toast({ type: "error", title: "Update failed", message: err.message || "Please try again." });
    }
  };

  const handleReply = async (message) => {
    const subject = `Re: Project inquiry from ${message.name}`;
    const body = [
      `Hi ${message.name},`,
      "",
      "Thanks for reaching out. Here's my reply to your inquiry:",
      "",
      "—",
      `Original message (${formatDate(message.created_at)}):`,
      "",
      message.message
    ].join("\n");
    window.location.href = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    await handleStatusChange(message.id, "replied");
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api.deleteMessage(deleting.id);
      toast({ type: "success", title: "Message deleted" });
      setDeleting(null);
      if (selected?.id === deleting.id) setSelected(null);
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
        eyebrow="Inbox"
        title="Messages"
        subtitle="Inquiries submitted through the contact form."
      />

      {loading && (
        <div className="flex items-center gap-3 rounded-card border border-line bg-surface px-6 py-10">
          <Spinner className="text-accent" />
          <span className="text-[0.9rem] text-ink-secondary">Loading messages…</span>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-card border border-[#e08170]/40 bg-[#e08170]/10 px-6 py-8 text-[0.9rem] text-[#e08170]">
          {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <EmptyState
          icon={MailOpen}
          title="No messages yet"
          description="Inquiries from the contact form will appear here."
        />
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <table className="w-full">
            <thead className="border-b border-line bg-[#0d0d0d]">
              <tr>
                <th className={thCls}>From</th>
                <th className={thCls}>Subject</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Received</th>
                <th className={`${thCls} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={`${rowCls} cursor-pointer`} onClick={() => setSelected(row)}>
                  <td className={tdCls}>
                    <p className="font-semibold">{row.name}</p>
                    <p className="text-[0.8rem] text-ink-muted">{row.email}</p>
                  </td>
                  <td className={tdCls}>
                    <span className="text-[0.86rem] text-ink-secondary">{row.project_type || "General inquiry"}</span>
                  </td>
                  <td className={tdCls}>
                    <Badge color={statusColors[row.status] || "gray"}>{row.status}</Badge>
                  </td>
                  <td className={tdCls}>
                    <span className="text-[0.86rem] text-ink-secondary">{formatDate(row.created_at)}</span>
                  </td>
                  <td className={`${tdCls} text-right`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
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

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Message details" width="max-w-2xl">
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[10px] border border-line bg-base px-4 py-3">
                <p className="font-heading text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-muted">From</p>
                <p className="mt-1 text-[0.92rem] text-ink">{selected.name}</p>
                <a href={`mailto:${selected.email}`} className="text-[0.84rem] text-accent hover:underline">{selected.email}</a>
              </div>
              <div className="rounded-[10px] border border-line bg-base px-4 py-3">
                <p className="font-heading text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-muted">Details</p>
                <p className="mt-1 text-[0.84rem] text-ink-secondary">{selected.company || "No company"}</p>
                <p className="text-[0.84rem] text-ink-secondary">{selected.project_type || "No project type"}</p>
                <p className="text-[0.84rem] text-ink-secondary">{selected.budget || "No budget"}</p>
              </div>
            </div>

            <div className="rounded-[10px] border border-line bg-base px-4 py-4">
              <p className="font-heading text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-muted">Message</p>
              <p className="mt-2 whitespace-pre-wrap text-[0.92rem] leading-relaxed text-ink">{selected.message}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <div className="flex items-center gap-3">
                <span className="text-[0.82rem] text-ink-muted">Status</span>
                <Select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                  className="w-36"
                >
                  {MESSAGE_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </div>
              <div className="flex gap-3">
                <Btn variant="secondary" onClick={() => handleStatusChange(selected.id, "read")}>
                  <Mail size={15} /> Mark Read
                </Btn>
                <Btn variant="primary" onClick={() => handleReply(selected)}>
                  <Reply size={15} /> Reply by Email
                </Btn>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete message"
        message={`Delete the message from "${deleting?.name}"? This cannot be undone.`}
        confirmLabel="Delete Message"
      />
    </div>
  );
}
