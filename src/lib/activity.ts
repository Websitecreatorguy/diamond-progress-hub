import { supabase } from "@/integrations/supabase/client";

export type ActivityKind =
  | "metric"
  | "record"
  | "goal_created"
  | "goal_completed"
  | "team_joined"
  | "team_request"
  | "team_invite"
  | "feedback"
  | "profile";

export async function logActivity(kind: ActivityKind, title: string, detail?: string) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("activity_log").insert({ user_id: data.user.id, kind, title, detail: detail ?? null });
}

/** Human-friendly message for a Supabase/network failure — never leaks raw DB errors. */
export function friendlyError(err: unknown, fallback = "Something went wrong. Please try again."): string {
  const raw = err instanceof Error ? err.message : typeof err === "string" ? err : "";
  const msg = raw.toLowerCase();
  if (!raw) return fallback;
  if (msg.includes("failed to fetch") || msg.includes("networkerror"))
    return "Network problem. Check your connection and try again.";
  if (msg.includes("duplicate key") && msg.includes("pending"))
    return "You already have a pending request for this team.";
  if (msg.includes("duplicate key") && msg.includes("team_members"))
    return "You're already on this team.";
  if (msg.includes("duplicate key")) return "That already exists.";
  if (msg.includes("row-level security") || msg.includes("permission denied") || msg.includes("violates"))
    return "You don't have permission to do that.";
  if (msg.includes("jwt") || msg.includes("session")) return "Your session expired. Please sign in again.";
  if (msg.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (msg.includes("already registered")) return "An account with this email already exists.";
  if (msg.includes("email not confirmed")) return "Please confirm your email address first.";
  // Anything else: keep it generic rather than exposing internals.
  return fallback;
}

export function generateTeamCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}
