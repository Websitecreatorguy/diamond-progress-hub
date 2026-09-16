import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, EmptyState } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddResultDialog } from "@/components/dashboard/add-result-dialog";
import { METRIC_MAP, formatMetric, improvementDelta } from "@/lib/metrics";

export const Route = createFileRoute("/_authenticated/records")({
  head: () => ({
    meta: [
      { title: "Personal Records — Diamond Development" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RecordsPage,
});

function RecordsPage() {
  const [open, setOpen] = useState(false);
  const { data: records = [] } = useQuery({
    queryKey: ["personal-records"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("personal_records")
        .select("*")
        .eq("user_id", u.user.id)
        .order("achieved_on", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <AppShell
      title="Personal records"
      description="Your best result for every metric you track."
      actions={
        <Button className="bg-gradient-primary shadow-glow" onClick={() => setOpen(true)}>
          Add Result
        </Button>
      }
    >
      <AddResultDialog open={open} onOpenChange={setOpen} />
      {records.length === 0 ? (
        <EmptyState icon={Trophy} title="No records yet" description="Log a result and your first record appears here.">
          <Button className="bg-gradient-primary shadow-glow" onClick={() => setOpen(true)}>
            Add first result
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((r) => {
            const def = METRIC_MAP[r.metric];
            const prev = r.previous_value === null ? null : Number(r.previous_value);
            const gain = prev !== null ? improvementDelta(r.metric, Number(r.value), prev) : null;
            return (
              <Card key={r.id} className="rounded-2xl border-border p-5 shadow-card">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Trophy className="h-4 w-4 text-warning" /> {def?.label ?? r.metric}
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black tracking-tight">{formatMetric(r.metric, Number(r.value))}</span>
                  <span className="text-sm text-muted-foreground">{r.unit}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Achieved {format(parseISO(r.achieved_on), "MMM d, yyyy")}
                </div>
                {gain !== null && gain > 0 && (
                  <div className="mt-1 text-xs font-semibold text-success">
                    +{gain.toFixed(def?.decimals ?? 1)} {r.unit} over previous best
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
