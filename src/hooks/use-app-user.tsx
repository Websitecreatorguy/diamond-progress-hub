import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type Team = Tables<"teams">;
export type TeamMember = Tables<"team_members">;

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth-user"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user ?? null;
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.user.id)
        .maybeSingle();
      if (error) throw error;
      return (data as Profile) ?? null;
    },
  });
}

export type Membership = TeamMember & { teams: Team | null };

export function useMemberships() {
  return useQuery({
    queryKey: ["memberships"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data, error } = await supabase
        .from("team_members")
        .select("*, teams(*)")
        .eq("user_id", u.user.id);
      if (error) throw error;
      return (data ?? []) as Membership[];
    },
  });
}

/** True when the account is a coach/admin anywhere (drives coach-only navigation). */
export function useIsCoach() {
  const { data: profile } = useProfile();
  const { data: memberships = [], isLoading } = useMemberships();
  const owns = memberships.some((m) => m.team_role === "coach" || m.team_role === "admin");
  return {
    isCoach: profile?.account_type === "coach" || owns,
    isLoading,
  };
}
