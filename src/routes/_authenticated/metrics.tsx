import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Activity, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, EmptyState } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AddResultDialog } from "@/components/dashboard/add-result-dialog";
import { METRIC_MAP, formatMetric } from "@/lib/metrics";
import { friendlyError } from "@/lib/activity";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/metrics")({
  head: () => ({
    meta: [
      { title: "My Metrics — Diamond Development" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: MetricsPage,
});

function MetricsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: entries = [], isLoading } = useQuery<Tables<"metric_entries">[]>({
    queryKey: ["metric-entries"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("metric_entries")
        .select("*")
        .eq("user_id", u.user.id)
        .order("recorded_on", { ascending: false });
      return data ?? [];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("metric_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("Result deleted");
    },
    onError: (e) => toast.error(friendlyError(e, "We couldn't delete that result.")),
  });

  return (
    <AppShell
      title="Metrics"
      description="Every result you've logged, newest first."
      actions={
        <Button className="bg-gradient-primary shadow-glow" onClick={() => setOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Result
        </Button>
      }
    >
      <AddResultDialog open={open} onOpenChange={setOpen} />
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No metrics yet"
          description="Start tracking your baseball development by adding your first result."
        >
          <Button className="bg-gradient-primary shadow-glow" onClick={() => setOpen(true)}>
            Add first result
          </Button>
        </EmptyState>
      ) : (
        <Card className="divide-y divide-border rounded-2xl border-border shadow-card">
          {entries.map((e) => {
            const def = METRIC_MAP[e.metric];
            return (
              <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{def?.label ?? e.metric}</span>
                    <Badge variant="secondary" className="capitalize">
                      {e.setting}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {format(parseISO(e.recorded_on), "MMM d, yyyy")}
                    {e.notes ? ` · ${e.notes}` : ""}
                  </div>
                  {e.video_url && (
                    <a
                      href={e.video_url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[11px] font-medium text-primary hover:underline"
                    >
                      Watch video
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-black">{formatMetric(e.metric, Number(e.value))}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{e.unit}</div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Delete result"
                  disabled={remove.isPending}
                  onClick={() => remove.mutate(e.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            );
          })}
        </Card>
      )}
    </AppShell>
  );
}
