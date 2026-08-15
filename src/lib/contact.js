import { social } from "../data/site.js";
import { getSupabase, isSupabaseConfigured } from "./supabase.js";

const FORM_ENDPOINT = import.meta.env.VITE_PUBLIC_FORM_ENDPOINT || "";

export function buildMailto(payload) {
  const subject = `Project inquiry from ${payload.name}`;
  const body = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Business / Company: ${payload.company || "-"}`,
    `Project Type: ${payload.projectType || "-"}`,
    `Budget Range: ${payload.budget || "-"}`,
    "",
    "Message:",
    payload.message
  ].join("\n");

  return `mailto:${social.EMAIL_ADDRESS}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

export async function submitInquiry(payload) {
  if (isSupabaseConfigured) {
    const supabase = await getSupabase();
    if (supabase) {
      const { error } = await supabase.from("contact_messages").insert({
        name: payload.name,
        email: payload.email,
        company: payload.company || null,
        project_type: payload.projectType || null,
        budget: payload.budget || null,
        message: payload.message
      });
      if (!error) {
        return;
      }
    }
  }

  if (FORM_ENDPOINT) {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error("Submission failed");
    }
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 700));
  window.location.href = buildMailto(payload);
}
