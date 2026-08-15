import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { isSupabaseConfigured } from "../lib/supabase.js";
import { Btn, Field, TextInput } from "./ui.jsx";

export default function AdminLogin() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/admin";

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-[0.88rem] text-ink-secondary transition-colors hover:text-ink">
            <ArrowLeft size={16} /> Back to site
          </Link>
          <div className="rounded-2xl border border-line-strong bg-surface p-8">
            <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft text-accent">
              <KeyRound size={22} />
            </span>
            <h1 className="font-heading text-[1.4rem] font-extrabold tracking-[-0.02em]">Supabase not configured</h1>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-secondary">
              To use the admin panel, connect your Supabase project:
            </p>
            <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 text-[0.86rem] leading-relaxed text-ink-secondary">
              <li>Create a project at <code className="rounded bg-base px-1.5 py-0.5 text-accent">supabase.com</code>.</li>
              <li>Run the SQL from <code className="rounded bg-base px-1.5 py-0.5 text-accent">supabase/migrations/0001_init.sql</code> in the SQL Editor.</li>
              <li>Set <code className="rounded bg-base px-1.5 py-0.5 text-accent">VITE_SUPABASE_URL</code> and <code className="rounded bg-base px-1.5 py-0.5 text-accent">VITE_SUPABASE_ANON_KEY</code> in <code className="rounded bg-base px-1.5 py-0.5 text-accent">.env</code>.</li>
              <li>Restart the dev server or redeploy.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Unable to sign in. Check your email and password, or create an account in Supabase Auth.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-[0.88rem] text-ink-secondary transition-colors hover:text-ink">
          <ArrowLeft size={16} /> Back to site
        </Link>
        <div className="rounded-2xl border border-line-strong bg-surface p-8">
          <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent-soft text-accent">
            <KeyRound size={22} />
          </span>
          <h1 className="font-heading text-[1.4rem] font-extrabold tracking-[-0.02em]">Admin Sign In</h1>
          <p className="mt-1 text-[0.88rem] text-ink-secondary">Sign in to manage your portfolio content.</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5" noValidate>
            <Field label="Email" htmlFor="admin-email">
              <TextInput
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password" htmlFor="admin-password">
              <TextInput
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>

            {error && (
              <div role="alert" className="flex items-start gap-2.5 rounded-[10px] border border-[#e08170]/40 bg-[#e08170]/10 px-4 py-3 text-[0.86rem] text-[#e08170]">
                <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Btn type="submit" variant="primary" size="lg" disabled={submitting} className="w-full">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
              {submitting ? "Signing in…" : "Sign In"}
            </Btn>
          </form>
        </div>
      </div>
    </div>
  );
}
