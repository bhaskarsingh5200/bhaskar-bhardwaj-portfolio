import { getSupabase, isSupabaseConfigured } from "./supabase.js";

export async function requireSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment."
    );
  }
  const supabase = await getSupabase();
  if (!supabase) {
    throw new Error("Supabase client is unavailable.");
  }
  return supabase;
}

export const getSession = async () => {
  const supabase = await getSupabase();
  return supabase ? supabase.auth.getSession() : { data: { session: null } };
};

export const onAuthStateChange = async (callback) => {
  const supabase = await getSupabase();
  return supabase
    ? supabase.auth.onAuthStateChange(callback)
    : { data: { subscription: { unsubscribe: () => {} } } };
};

export async function signIn(email, password) {
  const client = await requireSupabase();
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const supabase = await getSupabase();
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId) {
  const client = await requireSupabase();
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

async function list(table, columns, orderBy = "sort_order") {
  const client = await requireSupabase();
  const query = client.from(table).select(columns || "*");
  const { data, error } = await query.order(orderBy, { ascending: true });
  if (error) throw error;
  return data || [];
}

async function saveRow(table, payload, id) {
  const client = await requireSupabase();
  const body = { ...payload };
  if (id) body.id = id;
  const { error } = await client.from(table).upsert(body);
  if (error) throw error;
}

async function deleteRow(table, id) {
  const client = await requireSupabase();
  const { error } = await client.from(table).delete().eq("id", id);
  if (error) throw error;
}

export const listProjects = () => list("projects", "*", "sort_order");
export const saveProject = (payload, id) => saveRow("projects", payload, id);
export const deleteProject = (id) => deleteRow("projects", id);

export const listServices = () => list("services", "*", "sort_order");
export const saveService = (payload, id) => saveRow("services", payload, id);
export const deleteService = (id) => deleteRow("services", id);

export const listSkills = () => list("skills", "*", "sort_order");
export const saveSkill = (payload, id) => saveRow("skills", payload, id);
export const deleteSkill = (id) => deleteRow("skills", id);

export const listHighlights = () => list("highlights", "*", "sort_order");
export const saveHighlight = (payload, id) => saveRow("highlights", payload, id);
export const deleteHighlight = (id) => deleteRow("highlights", id);

export async function listMessages() {
  const client = await requireSupabase();
  const { data, error } = await client
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateMessageStatus(id, status) {
  const client = await requireSupabase();
  const patch = { status };
  if (status === "read" || status === "replied") {
    patch.is_read = true;
    patch.read_at = new Date().toISOString();
  }
  const { error } = await client.from("contact_messages").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteMessage(id) {
  const client = await requireSupabase();
  const { error } = await client.from("contact_messages").delete().eq("id", id);
  if (error) throw error;
}

async function listSettingsFlat(table) {
  const client = await requireSupabase();
  const { data, error } = await client.from(table).select("key, value");
  if (error) throw error;
  const out = {};
  (data || []).forEach((row) => {
    out[row.key] = row.value;
  });
  return out;
}

async function saveSettingFlat(table, key, value) {
  const client = await requireSupabase();
  const { error } = await client
    .from(table)
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}

export const listSiteSettings = () => listSettingsFlat("site_settings");
export const saveSiteSetting = (key, value) => saveSettingFlat("site_settings", key, value);
export const listSeoSettings = () => listSettingsFlat("seo_settings");
export const saveSeoSetting = (key, value) => saveSettingFlat("seo_settings", key, value);

export async function uploadImage(bucket, file) {
  const client = await requireSupabase();
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await client.storage.from(bucket).upload(name, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (error) throw error;
  const { data } = client.storage.from(bucket).getPublicUrl(name);
  return { path: name, url: data.publicUrl };
}

export async function deleteImage(bucket, path) {
  if (!path) return;
  const client = await requireSupabase();
  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) throw error;
}
