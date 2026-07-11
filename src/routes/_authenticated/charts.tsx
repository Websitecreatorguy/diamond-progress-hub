import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/charts")({
  head: () => ({ meta: [{ title: "Progress Charts — Diamond Development" }] }),
  component: Charts,
});

type Row = Record<string, number | string | null>;

const METRICS: { key: string; label: string; unit: string }[] = [
  { key: "height_in", label: "Height", unit: "in" },
  { key: "weight_lb", label: "Weight", unit: "lb" },
  { key: "exit_velo_mph", label: "Exit Velocity", unit: "mph" },
  { key: "pitch_velo_mph", label: "Pitch Velocity", unit: "mph" },
  { key: "sixty_yd_sec", label: "60-yd Dash", unit: "sec" },
];

function Charts() {
  const { data: entries = [] } = useQuery<Row[]>({
    queryKey: ["measurements"],
    queryFn: async () => {
      const { data } = await supabase
        .from("measurements")
        .select("*")
        .order("measured_at", { ascending: true });
      return (data ?? []) as Row[];
    },
  });

  return (
    <AppShell title="Progress Charts">
      {entries.length < 2 ? (
        <Card className="rounded-2xl border-border p-8 text-center shadow-card">
          <p className="text-sm text-muted-foreground">
            Log at least two progress checks to see your improvement over time.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {METRICS.map((m) => {
            const data = entries
              .filter((e) => e[m.key] != null)
              .map((e) => ({
                date: format(new Date(e.measured_at as string), "MMM d"),
                value: Number(e[m.key]),
              }));
            if (data.length < 2) return null;
            return (
              <Card key={m.key} className="rounded-2xl border-border p-5 shadow-card">
                <div className="mb-3 flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold">{m.label}</h3>
                  <span className="text-xs text-muted-foreground">{m.unit}</span>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="date" fontSize={11} stroke="var(--color-muted-foreground)" />
                      <YAxis fontSize={11} stroke="var(--color-muted-foreground)" domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          background: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: 12,
                          fontSize: 12,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-primary-glow)"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "var(--color-primary)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
