import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabase.js";
import * as api from "../lib/admin-api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    let active = true;
    let subscription = { unsubscribe: () => {} };

    (async () => {
      const { data } = await api.getSession();
      if (!active) return;
      if (data.session) {
        setUser(data.session.user);
        api
          .getProfile(data.session.user.id)
          .then((p) => {
            if (active) setProfile(p);
          })
          .catch(() => {
            if (active) setProfile(null);
          });
      }
      setLoading(false);
    })();

    api.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user || null);
        if (session?.user) {
          api
            .getProfile(session.user.id)
            .then((p) => setProfile(p))
            .catch(() => setProfile(null));
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
      }
    }).then((result) => {
      subscription = result.data.subscription;
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    await api.signIn(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await api.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(() => {
    if (user) {
      api
        .getProfile(user.id)
        .then(setProfile)
        .catch(() => {});
    }
  }, [user]);

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, profile, isAdmin, loading, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
