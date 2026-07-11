import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({ meta: [{ title: "Progress Check — Diamond Development" }] }),
  component: ProgressCheck,
});

type Measurement = {
  id: string;
  measured_at: string;
  height_in: number | null;
  weight_lb: number | null;
  exit_velo_mph: number | null;
  pitch_velo_mph: number | null;
  throw_velo_mph: number | null;
  bat_speed_mph: number | null;
  home_to_first_sec: number | null;
  sixty_yd_sec: number | null;
};

const METRICS: {
  key: keyof Measurement;
  label: string;
  unit: string;
  lowerIsBetter?: boolean;
}[] = [
  { key: "height_in", label: "Height", unit: "in" },
  { key: "weight_lb", label: "Weight", unit: "lb" },
  { key: "exit_velo_mph", label: "Exit Velocity", unit: "mph" },
  { key: "pitch_velo_mph", label: "Pitch Velocity", unit: "mph" },
  { key: "throw_velo_mph", label: "Throwing Velocity", unit: "mph" },
  { key: "bat_speed_mph", label: "Bat Speed", unit: "mph" },
  { key: "home_to_first_sec", label: "Home-to-First", unit: "sec", lowerIsBetter: true },
  { key: "sixty_yd_sec", label: "60-yd Dash", unit: "sec", lowerIsBetter: true },
];

function ProgressCheck() {
  const qc = useQueryClient();
  const { data: entries = [] } = useQuery<Measurement[]>({
    queryKey: ["measurements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("measurements")
        .select("*")
        .order("measured_at", { ascending: false });
      return (data ?? []) as Measurement[];
    },
  });

  const latest = entries[0];
  const previous = entries[1];
  const daysSince = latest ? differenceInDays(new Date(), new Date(latest.measured_at)) : null;
  const dueForCheck = daysSince === null || daysSince >= 60;

  const [form, setForm] = useState<Record<string, string>>({});
  const submit = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const payload: Record<string, unknown> = { user_id: u.user.id };
      METRICS.forEach((m) => {
        const v = form[m.key];
        if (v) payload[m.key] = parseFloat(v);
      });
      const { error } = await supabase.from("measurements").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["measurements"] });
      setForm({});
      toast.success("New personal records logged!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell title="Progress Check">
      {dueForCheck && (
        <div className="mb-4 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
          <div className="font-semibold text-warning">Time for a check-in</div>
          <p className="mt-1 text-muted-foreground">
            {latest
              ? `It's been ${daysSince} days since your last measurement.`
              : "Log your first measurements to start tracking progress."}
          </p>
        </div>
      )}

      {latest && previous && (
        <Card className="mb-4 rounded-2xl border-border p-5 shadow-card">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Compared to {format(new Date(previous.measured_at), "MMM d, yyyy")}
          </h2>
          <ul className="mt-3 space-y-2">
            {METRICS.map((m) => {
              const curr = latest[m.key] as number | null;
              const prev = previous[m.key] as number | null;
              if (curr == null || prev == null) return null;
              const diff = Number((curr - prev).toFixed(2));
              const improved = m.lowerIsBetter ? diff < 0 : diff > 0;
              const same = diff === 0;
              const Icon = same ? Minus : improved ? TrendingUp : TrendingDown;
              const color = same
                ? "text-muted-foreground"
                : improved
                  ? "text-success"
                  : "text-destructive";
              const message = same
                ? "Keep training. Progress takes time."
                : improved
                  ? `Great job! Your ${m.label} improved by ${Math.abs(diff)} ${m.unit}.`
                  : `Small dip in ${m.label}. Stay consistent.`;
              return (
                <li key={m.key} className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3">
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
                  <div className="min-w-0 flex-1 text-sm">
                    <div className="font-medium">{message}</div>
                    <div className="text-xs text-muted-foreground">
                      {prev} → {curr} {m.unit}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <Card className="rounded-2xl border-border p-5 shadow-card">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Log new measurements
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
          className="grid grid-cols-2 gap-3"
        >
          {METRICS.map((m) => (
            <div key={m.key} className="space-y-1.5">
              <Label className="text-xs">
                {m.label} <span className="text-muted-foreground">({m.unit})</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                inputMode="decimal"
                value={form[m.key] ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, [m.key]: e.target.value }))}
                placeholder={latest?.[m.key]?.toString() ?? "—"}
              />
            </div>
          ))}
          <Button
            type="submit"
            className="col-span-2 mt-2 bg-gradient-primary shadow-glow"
            disabled={submit.isPending}
          >
            Save measurements
          </Button>
        </form>
      </Card>

      {entries.length > 0 && (
        <Card className="mt-4 rounded-2xl border-border p-5 shadow-card">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            History
          </h2>
          <ul className="space-y-2 text-sm">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
                <span className="font-medium">{format(new Date(e.measured_at), "MMM d, yyyy")}</span>
                <span className="text-xs text-muted-foreground">
                  {[e.exit_velo_mph && `EV ${e.exit_velo_mph}`, e.sixty_yd_sec && `60yd ${e.sixty_yd_sec}s`]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </AppShell>
  );
}
