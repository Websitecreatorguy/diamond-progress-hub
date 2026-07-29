import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, EmptyState } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemberships } from "@/hooks/use-app-user";
import { friendlyError } from "@/lib/activity";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/coach")({
  head: () => ({
    meta: [
      { title: "Coach Dashboard — Diamond Development" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CoachPage,
});

function CoachPage() {
  const qc = useQueryClient();
  const { data: memberships = [] } = useMemberships();
  const coached = memberships.filter((m) => m.team_role === "coach" || m.team_role === "assistant_coach");
  const team = coached[0]?.teams ?? null;
  const [name, setName] = useState("");
  const [ann, setAnn] = useState({ title: "", body: "" });

  const { data: requests = [] } = useQuery<Tables<"team_join_requests">[]>({
    queryKey: ["join-requests", team?.id],
    enabled: !!team,
    queryFn: async () => {
      const { data } = await supabase
        .from("team_join_requests")
        .select("*")
        .eq("team_id", team!.id)
        .eq("status", "pending");
      return data ?? [];
    },
  });

  const createTeam = useMutation({
    mutationFn: async () => {
      if (name.trim().length < 3) throw new Error("Team name must be at least 3 characters.");
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Your session expired. Please sign in again.");
      const code = Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
      const { data: t, error } = await supabase
        .from("teams")
        .insert({ name: name.trim(), join_code: code })
        .select("id")
        .single();
      if (error) throw error;
      const { error: mErr } = await supabase
        .from("team_members")
        .insert({ team_id: t.id, user_id: u.user.id, team_role: "coach" });
      if (mErr) throw mErr;
    },
    onSuccess: () => {
      qc.invalidateQueries();
      setName("");
      toast.success("Team created");
    },
    onError: (e) => toast.error(friendlyError(e)),
  });

  const decide = useMutation({
    mutationFn: async ({ req, approve }: { req: Tables<"team_join_requests">; approve: boolean }) => {
      if (approve) {
        const { error } = await supabase
          .from("team_members")
          .insert({ team_id: req.team_id, user_id: req.user_id, team_role: "player" });
        if (error) throw error;
      }
      const { error } = await supabase
        .from("team_join_requests")
        .update({ status: approve ? "approved" : "denied" })
        .eq("id", req.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("Request updated");
    },
    onError: (e) => toast.error(friendlyError(e)),
  });

  const post = useMutation({
    mutationFn: async () => {
      if (!team) return;
      if (!ann.title.trim() || !ann.body.trim()) throw new Error("Add a title and message.");
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("team_announcements")
        .insert({ team_id: team.id, title: ann.title.trim(), body: ann.body.trim(), author_id: u.user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries();
      setAnn({ title: "", body: "" });
      toast.success("Announcement posted");
    },
    onError: (e) => toast.error(friendlyError(e)),
  });

  if (!team) {
    return (
      <AppShell title="Coach Dashboard" description="Create a team to manage a roster and approve players.">
        <EmptyState icon={Users} title="No team yet" description="Create your team and share the join code with players.">
          <div className="w-full max-w-sm space-y-3 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="team-name">Team name</Label>
              <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Northside 12U Blue" />
            </div>
            <Button className="w-full bg-gradient-primary shadow-glow" disabled={createTeam.isPending} onClick={() => createTeam.mutate()}>
              {createTeam.isPending ? "Creating…" : "Create Team"}
            </Button>
          </div>
        </EmptyState>
      </AppShell>
    );
  }

  return (
    <AppShell title={team.name} description={`Team code ${team.join_code}`}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border p-5 shadow-card">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Pending requests</h2>
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending requests.</p>
          ) : (
            <ul className="space-y-3">
              {requests.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3 py-2">
                  <span className="truncate text-sm">Player request</span>
                  <span className="flex gap-2">
                    <Button size="sm" onClick={() => decide.mutate({ req: r, approve: true })}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => decide.mutate({ req: r, approve: false })}>Deny</Button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="rounded-2xl border-border p-5 shadow-card">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Post announcement</h2>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="ann-title">Title</Label>
              <Input id="ann-title" value={ann.title} onChange={(e) => setAnn({ ...ann, title: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ann-body">Message</Label>
              <Input id="ann-body" value={ann.body} onChange={(e) => setAnn({ ...ann, body: e.target.value })} />
            </div>
            <Button className="bg-gradient-primary shadow-glow" disabled={post.isPending} onClick={() => post.mutate()}>
              Post
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
