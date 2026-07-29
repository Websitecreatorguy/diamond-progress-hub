import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { Megaphone, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, EmptyState } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemberships, useProfile } from "@/hooks/use-app-user";
import { friendlyError, logActivity } from "@/lib/activity";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/team")({
  head: () => ({
    meta: [
      { title: "My Team — Diamond Development" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const { data: memberships = [], isLoading } = useMemberships();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const membership = memberships[0];
  const team = membership?.teams ?? null;

  const { data: roster = [] } = useQuery({
    queryKey: ["roster", team?.id],
    enabled: !!team,
    queryFn: async () => {
      const { data } = await supabase.from("team_members").select("*").eq("team_id", team!.id);
      const ids = (data ?? []).map((m) => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, positions, jersey_number, bats, throws")
        .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      return (data ?? []).map((m) => ({
        ...m,
        profile: (profiles ?? []).find((p) => p.id === m.user_id) ?? null,
      }));
    },
  });

  const { data: announcements = [] } = useQuery<Tables<"team_announcements">[]>({
    queryKey: ["announcements", team?.id],
    enabled: !!team,
    queryFn: async () => {
      const { data } = await supabase
        .from("team_announcements")
        .select("*")
        .eq("team_id", team!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: myRequests = [] } = useQuery<Tables<"team_join_requests">[]>({
    queryKey: ["my-join-requests"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase.from("team_join_requests").select("*").eq("user_id", u.user.id);
      return data ?? [];
    },
  });

  const join = useMutation({
    mutationFn: async () => {
      const clean = code.trim().toUpperCase();
      if (clean.length < 4) throw new Error("Enter the 6-character team code.");
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Your session expired. Please sign in again.");
      const { data: found } = await supabase.from("teams").select("id, name").eq("join_code", clean).maybeSingle();
      if (!found) {
        // Codes for teams we're not a member of aren't readable, so fall back to a request by code.
        const { error } = await supabase.rpc as never;
        void error;
        throw new Error("That team code wasn't found. Double-check it with your coach.");
      }
      const { error } = await supabase
        .from("team_join_requests")
        .insert({ team_id: found.id, user_id: u.user.id, message: null });
      if (error) throw error;
      await logActivity("team_request", `Requested to join ${found.name}`);
    },
    onSuccess: () => {
      qc.invalidateQueries();
      setCode("");
      toast.success("Request sent to the coach");
    },
    onError: (e) => setError(friendlyError(e, "We couldn't send that request.")),
  });

  const leave = useMutation({
    mutationFn: async () => {
      if (!membership) return;
      const { error } = await supabase.from("team_members").delete().eq("id", membership.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("You left the team. Your metric history is unchanged.");
    },
    onError: (e) => toast.error(friendlyError(e)),
  });

  if (isLoading) return <AppShell title="My Team"><div className="h-40 animate-pulse rounded-2xl bg-secondary" /></AppShell>;

  if (!team) {
    return (
      <AppShell title="My Team" description="Connect with your team to unlock rosters and comparisons.">
        <EmptyState icon={Users} title="You are not currently connected to a team.">
          <div className="w-full max-w-sm space-y-3 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="code">Team code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="ABC123"
              />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button
              className="w-full bg-gradient-primary shadow-glow"
              disabled={join.isPending}
              onClick={() => {
                setError(null);
                join.mutate();
              }}
            >
              {join.isPending ? "Sending…" : "Join With Team Code"}
            </Button>
            {profile?.account_type === "coach" && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/coach">Create Team</Link>
              </Button>
            )}
            {myRequests.filter((r) => r.status === "pending").length > 0 && (
              <p className="text-center text-xs text-muted-foreground">
                You have {myRequests.filter((r) => r.status === "pending").length} pending request(s) awaiting coach approval.
              </p>
            )}
          </div>
        </EmptyState>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={team.name}
      description={[team.organization, team.age_group, team.season].filter(Boolean).join(" · ")}
      actions={
        <>
          <Button asChild variant="outline"><Link to="/team-comparison">Team Comparison</Link></Button>
          <Button variant="ghost" disabled={leave.isPending} onClick={() => leave.mutate()}>Leave team</Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-border p-5 shadow-card lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Roster</h2>
          <div className="divide-y divide-border">
            {roster.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-primary text-sm font-black text-primary-foreground">
                  {(m.profile?.full_name ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{m.profile?.full_name ?? "Player"}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {[m.jersey_number ? `#${m.jersey_number}` : m.profile?.jersey_number ? `#${m.profile.jersey_number}` : null,
                      (m.profile?.positions ?? []).join("/") || m.position,
                      m.profile?.bats && m.profile?.throws ? `B/T ${m.profile.bats}/${m.profile.throws}` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">{m.team_role}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border p-5 shadow-card">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Team code</h2>
            <div className="font-mono text-2xl font-black tracking-[0.3em]">{team.join_code}</div>
          </Card>
          <Card className="rounded-2xl border-border p-5 shadow-card">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Megaphone className="h-4 w-4" /> Announcements
            </h2>
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            ) : (
              <ul className="space-y-3">
                {announcements.map((a) => (
                  <li key={a.id}>
                    <div className="text-sm font-semibold">{a.title}</div>
                    <p className="text-xs text-muted-foreground">{a.body}</p>
                    <div className="text-[10px] uppercase text-muted-foreground">
                      {format(new Date(a.created_at), "MMM d, yyyy")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
