import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, EmptyState } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemberships } from "@/hooks/use-app-user";
import { METRICS, METRIC_MAP, formatMetric, RANGES, type RangeKey } from "@/lib/metrics";

export const Route = createFileRoute("/_authenticated/team-comparison")({
  head: () => ({
    meta: [
      { title: "Team Comparison — Diamond Development" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ComparisonPage,
});

function ComparisonPage() {
  const { data: memberships = [] } = useMemberships();
  const team = memberships[0]?.teams ?? null;
  const [metric, setMetric] = useState("exit_velo");
  const [range, setRange] = useState<RangeKey>("1y");

  const days = RANGES.find((r) => r.key === range)?.days ?? null;
  const since = days ? new Date(Date.now() - days * 864e5).toISOString().slice(0, 10) : null;

  const { data: rows = [] } = useQuery({
    queryKey: ["comparison", team?.id, metric, range],
    enabled: !!team,
    queryFn: async () => {
      const { data: members } = await supabase.from("team_members").select("user_id").eq("team_id", team!.id);
      const ids = (members ?? []).map((m) => m.user_id);
      if (!ids.length) return [];
      let q = supabase.from("metric_entries").select("user_id, value, recorded_on").eq("metric", metric).in("user_id", ids);
      if (since) q = q.gte("recorded_on", since);
      const { data: entries } = await q;
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, positions, hidden_metrics, share_metrics")
        .in("id", ids);
      const def = METRIC_MAP[metric];
      const best = new Map<string, number>();
      for (const e of entries ?? []) {
        const p = (profiles ?? []).find((x) => x.id === e.user_id);
        if (!p || p.share_metrics === false || (p.hidden_metrics ?? []).includes(metric)) continue;
        const v = Number(e.value);
        const cur = best.get(e.user_id);
        if (cur === undefined || (def.lowerIsBetter ? v < cur : v > cur)) best.set(e.user_id, v);
      }
      return Array.from(best.entries())
        .map(([id, value]) => ({
          id,
          value,
          name: (profiles ?? []).find((p) => p.id === id)?.full_name ?? "Player",
        }))
        .sort((a, b) => (def.lowerIsBetter ? a.value - b.value : b.value - a.value));
    },
  });

  if (!team) {
    return (
      <AppShell title="Team Comparison">
        <EmptyState icon={BarChart3} title="You are not currently connected to a team." description="Join a team to compare development with teammates.">
          <Button asChild className="bg-gradient-primary shadow-glow"><Link to="/team">Join With Team Code</Link></Button>
        </EmptyState>
      </AppShell>
    );
  }

  const def = METRIC_MAP[metric];
  const avg = rows.length ? rows.reduce((s, r) => s + r.value, 0) / rows.length : null;

  return (
    <AppShell
      title="Team Comparison"
      description="A development tool — not a player ranking. Players can hide metrics in Settings."
    >
      <Card className="rounded-2xl border-border p-5 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cmp-metric">Metric</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger id="cmp-metric"><SelectValue /></SelectTrigger>
              <SelectContent>
                {METRICS.map((m) => (<SelectItem key={m.key} value={m.key}>{m.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cmp-range">Date range</Label>
            <Select value={range} onValueChange={(v) => setRange(v as RangeKey)}>
              <SelectTrigger id="cmp-range"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RANGES.map((r) => (<SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {avg !== null && (
          <p className="mt-4 text-sm text-muted-foreground">
            Team average: <span className="font-semibold text-foreground">{formatMetric(metric, avg)} {def.unit}</span> across {rows.length} shared result{rows.length === 1 ? "" : "s"}.
          </p>
        )}

        {rows.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No shared results for this metric and date range yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {rows.map((r) => {
              const maxV = Math.max(...rows.map((x) => x.value));
              const width = def.lowerIsBetter ? (Math.min(...rows.map((x) => x.value)) / r.value) * 100 : (r.value / maxV) * 100;
              return (
                <li key={r.id} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 truncate text-sm font-medium">{r.name}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${width}%` }} />
                  </div>
                  <span className="w-16 shrink-0 text-right text-sm font-semibold">{formatMetric(metric, r.value)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </AppShell>
  );
}
