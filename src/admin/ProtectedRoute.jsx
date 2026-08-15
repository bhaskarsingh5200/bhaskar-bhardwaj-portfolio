import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Btn, Spinner } from "./ui.jsx";

export default function ProtectedRoute({ children }) {
  const { user, profile, loading, isAdmin, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <Spinner className="text-accent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base p-6">
        <div className="w-full max-w-md rounded-2xl border border-line-strong bg-surface p-8 text-center">
          <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#e08170]/40 bg-[#e08170]/10 text-[#e08170]">
            <ShieldAlert size={22} />
          </span>
          <h1 className="font-heading text-[1.3rem] font-extrabold tracking-[-0.02em]">Admin access required</h1>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-secondary">
            You&apos;re signed in as <span className="text-ink">{profile?.full_name || user.email}</span>, but this account
            doesn&apos;t have the admin role. Contact the site owner to grant access.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Btn variant="secondary" onClick={signOut}>Sign out</Btn>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
