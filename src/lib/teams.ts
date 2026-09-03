import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Team = Tables<"teams">;
export type TeamMemberRow = Tables<"team_members">;
export type Membership = TeamMemberRow & { teams: Team | null };

export const AGE_GROUPS = [
  "8U",
  "9U",
  "10U",
  "11U",
  "12U",
  "13U",
  "14U",
  "High School",
  "Other",
] as const;

export const TEAM_LEVELS = [
  "Recreational",
  "Travel",
  "AA",
  "AAA",
  "Major",
  "School",
  "Other",
] as const;

export const TEAM_ROLES = [
  { value: "player", label: "Player" },
  { value: "coach", label: "Head coach" },
  { value: "admin", label: "Assistant coach" },
  { value: "parent", label: "Parent" },
] as const;

export const POSITIONS = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH", "UTIL"] as const;

export const ASSIGNMENT_CATEGORIES = [
  "Hitting",
  "Pitching",
  "Fielding",
  "Strength",
  "Speed",
  "Recovery",
  "Other",
] as const;

export const LOCKER_POST_POLICIES = [
  { value: "everyone", label: "Everyone on the team" },
  { value: "coaches", label: "Coaches only" },
] as const;

export function isCoachRole(role: string | null | undefined) {
  return role === "coach" || role === "admin";
}

/** All teams the signed-in user belongs to (multi-team is the architecture, never memberships[0]). */
export function useMyTeams() {
  return useQuery({
    queryKey: ["my-teams"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [] as Membership[];
      const { data, error } = await supabase
        .from("team_members")
        .select("*, teams(*)")
        .eq("user_id", u.user.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as Membership[]).filter((m) => m.teams);
    },
  });
}

export type RosterEntry = TeamMemberRow & {
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    positions: string[] | null;
    secondary_positions: string[] | null;
    jersey_number: string | null;
    bats: string | null;
    throws: string | null;
    age: number | null;
  } | null;
};

export function useRoster(teamId: string | undefined) {
  return useQuery({
    queryKey: ["roster", teamId],
    enabled: !!teamId,
    queryFn: async (): Promise<RosterEntry[]> => {
      const { data: members, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("team_id", teamId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      const ids = (members ?? []).map((m) => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, positions, secondary_positions, jersey_number, bats, throws, age")
        .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      return (members ?? []).map((m) => ({
        ...m,
        profile: (profiles ?? []).find((p) => p.id === m.user_id) ?? null,
      }));
    },
  });
}

export function displayName(entry: { full_name?: string | null } | null | undefined, fallback = "Player") {
  const n = entry?.full_name?.trim();
  return n && n.length > 0 ? n : fallback;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}
