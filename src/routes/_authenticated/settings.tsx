import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfile } from "@/hooks/use-app-user";
import { METRICS } from "@/lib/metrics";
import { friendlyError } from "@/lib/activity";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Diamond Development" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const [visibility, setVisibility] = useState("team");
  const [share, setShare] = useState(true);
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) return;
    setVisibility(profile.profile_visibility ?? "team");
    setShare(profile.share_metrics ?? true);
    setHidden(profile.hidden_metrics ?? []);
  }, [profile]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Your session expired. Please sign in again.");
      const { error } = await supabase
        .from("profiles")
        .update({ profile_visibility: visibility, share_metrics: share, hidden_metrics: hidden })
        .eq("id", u.user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("Privacy settings saved");
    },
    onError: (e) => toast.error(friendlyError(e)),
  });

  return (
    <AppShell title="Settings" description="Control what teammates and coaches can see.">
      <Card className="max-w-2xl rounded-2xl border-border p-6 shadow-card">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Privacy</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          We never show birth dates, addresses, phone numbers or email addresses to teammates.
        </p>

        <div className="mt-5 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="visibility">Player profile visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger id="visibility"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private — only me</SelectItem>
                <SelectItem value="team">My team only</SelectItem>
                <SelectItem value="public">Public recruiting profile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl bg-secondary/50 px-4 py-3">
            <div>
              <div className="text-sm font-medium">Share metrics with teammates</div>
              <div className="text-xs text-muted-foreground">Turn off to hide all results from team comparisons.</div>
            </div>
            <Switch checked={share} onCheckedChange={setShare} aria-label="Share metrics with teammates" />
          </div>

          <div>
            <Label>Hide specific metrics from comparisons</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {METRICS.map((m) => {
                const off = hidden.includes(m.key);
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setHidden((h) => (off ? h.filter((k) => k !== m.key) : [...h, m.key]))}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      off
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border bg-secondary text-secondary-foreground hover:border-primary/40"
                    }`}
                  >
                    {m.short}{off ? " · hidden" : ""}
                  </button>
                );
              })}
            </div>
          </div>

          <Button className="bg-gradient-primary shadow-glow" disabled={save.isPending} onClick={() => save.mutate()}>
            {save.isPending ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </Card>
    </AppShell>
  );
}
