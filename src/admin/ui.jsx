import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, Loader2, X } from "lucide-react";

export function Spinner({ className = "" }) {
  return <Loader2 size={20} className={`animate-spin ${className}`} aria-hidden="true" />;
}

const btnVariants = {
  primary:
    "bg-accent text-base hover:bg-accent-hover shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]",
  secondary:
    "border border-line-strong text-ink hover:border-ink-secondary hover:bg-ink/5",
  danger:
    "border border-[#e08170]/50 text-[#e08170] hover:bg-[#e08170]/10",
  ghost: "text-ink-secondary hover:text-ink hover:bg-ink/5"
};

const btnSizes = {
  sm: "px-3 py-1.5 text-[0.82rem] rounded-[8px]",
  md: "px-4 py-2 text-[0.88rem] rounded-[10px]",
  lg: "px-5 py-2.5 text-[0.92rem] rounded-[10px]"
};

export function Btn({ variant = "secondary", size = "md", className = "", type = "button", disabled, children, ...rest }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-heading font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export const inputCls =
  "w-full rounded-[10px] border border-line-strong bg-base px-3.5 py-2.5 text-[0.92rem] text-ink outline-none transition-colors duration-200 placeholder:text-ink-muted focus:border-accent/60";

export function Field({ label, hint, error, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="font-heading text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-ink-secondary">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[0.78rem] text-ink-muted">{hint}</p>}
      {error && <p className="text-[0.8rem] text-[#e08170]">{error}</p>}
    </div>
  );
}

export function TextInput({ error, className = "", ...rest }) {
  return <input className={`${inputCls} ${error ? "border-[#e08170]/60" : ""} ${className}`} {...rest} />;
}

export function TextArea({ error, className = "", ...rest }) {
  return <textarea className={`${inputCls} ${error ? "border-[#e08170]/60" : ""} ${className}`} {...rest} />;
}

export function Select({ className = "", children, ...rest }) {
  return (
    <select className={`${inputCls} ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-surface px-4 py-3 text-left transition-colors duration-200 hover:border-line-strong"
    >
      <span>
        <span className="block text-[0.92rem] font-medium text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-[0.8rem] text-ink-muted">{description}</span>}
      </span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${checked ? "bg-accent" : "bg-line-strong"}`}
        aria-hidden="true"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-base transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </span>
    </button>
  );
}

const badgeColors = {
  green: "border-accent/40 bg-accent-soft text-accent",
  gray: "border-line-strong bg-surface text-ink-secondary",
  amber: "border-[#c9a24b]/40 bg-[#c9a24b]/10 text-[#dcb869]",
  red: "border-[#e08170]/40 bg-[#e08170]/10 text-[#e08170]",
  blue: "border-[#7fb2d9]/40 bg-[#7fb2d9]/10 text-[#7fb2d9]"
};

export function Badge({ color = "gray", children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.08em] ${badgeColors[color]}`}>
      {children}
    </span>
  );
}

export function Modal({ open, onClose, title, children, width = "max-w-2xl" }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 my-auto w-full ${width} rounded-2xl border border-line-strong bg-surface shadow-2xl`}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-heading text-[1.05rem] font-bold tracking-[-0.01em]">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-secondary transition-colors duration-200 hover:bg-ink/5 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Delete", loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-md">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e08170]/40 bg-[#e08170]/10 text-[#e08170]">
          <AlertTriangle size={20} />
        </span>
        <div>
          <p className="text-[0.95rem] leading-relaxed text-ink-secondary">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm} disabled={loading}>
          {loading && <Spinner className="text-[#e08170]" />}
          {confirmLabel}
        </Btn>
      </div>
    </Modal>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line-strong px-6 py-14 text-center">
      {Icon && (
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface text-ink-secondary">
          <Icon size={22} />
        </span>
      )}
      <div>
        <h3 className="font-heading text-[1rem] font-bold">{title}</h3>
        {description && <p className="mt-1 text-[0.86rem] text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="mb-1 font-heading text-[0.72rem] font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h1 className="font-heading text-[1.7rem] font-extrabold tracking-[-0.02em]">{title}</h1>
        {subtitle && <p className="mt-1 text-[0.9rem] text-ink-secondary">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export const thCls =
  "px-4 py-3 text-left font-heading text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-muted";
export const tdCls = "px-4 py-3.5 text-[0.9rem] text-ink";
export const rowCls = "border-b border-line last:border-0 transition-colors duration-150 hover:bg-surface-2";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = (toast) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  };

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-line-strong bg-surface px-4 py-3.5 shadow-2xl"
            >
              <span className={toast.type === "error" ? "text-[#e08170]" : toast.type === "success" ? "text-accent" : "text-ink-secondary"}>
                {toast.type === "error" ? <AlertTriangle size={18} /> : toast.type === "success" ? <CheckCircle2 size={18} /> : <Info size={18} />}
              </span>
              <div className="min-w-0">
                <p className="text-[0.9rem] font-semibold text-ink">{toast.title}</p>
                {toast.message && <p className="mt-0.5 text-[0.82rem] leading-relaxed text-ink-secondary">{toast.message}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export function useAsync(defaultValue = null) {
  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const run = async (fn, { onSuccess } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, run, setData };
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
