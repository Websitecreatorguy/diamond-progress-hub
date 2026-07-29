import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Pencil, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, EmptyState } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GoalDialog, goalProgress, type Goal } from "@/components/dashboard/goal-dialog";
import { formatMetric } from "@/lib/metrics";
import { friendlyError, logActivity } from "@/lib/activity";

export const Route = createFileRoute("/_authenticated/goals")({
  head: () => ({
    meta: [
      { title: "Goals — Diamond Development" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", u.user.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const complete = useMutation({
    mutationFn: async (g: Goal) => {
      const { error } = await supabase
        .from("goals")
        .update({ completed: !g.completed, completed_at: g.completed ? null : new Date().toISOString() })
        .eq("id", g.id);
      if (error) throw error;
      if (!g.completed) await logActivity("goal_completed", `Goal completed: ${g.title}`);
    },
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("Goal updated");
    },
    onError: (e) => toast.error(friendlyError(e)),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success("Goal deleted");
    },
    onError: (e) => toast.error(friendlyError(e)),
  });

  return (
    <AppShell
      title="Goals"
      description="Set targets and track progress through the season."
      actions={
        <Button
          className="bg-gradient-primary shadow-glow"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Target className="mr-1.5 h-4 w-4" /> Create Goal
        </Button>
      }
    >
      <GoalDialog open={open} onOpenChange={setOpen} goal={editing} />
      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="Create a goal and track your progress throughout the season."
        >
          <Button
            className="bg-gradient-primary shadow-glow"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Create First Goal
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {goals.map((g) => {
            const pct = goalProgress(g);
            return (
              <Card key={g.id} className="rounded-2xl border-border p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {g.completed && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
                      <span className="truncate font-semibold">{g.title}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {g.current_value !== null ? formatMetric(g.metric ?? "", Number(g.current_value)) : "—"} /{" "}
                      {formatMetric(g.metric ?? "", Number(g.target_value))} {g.unit}
                      {g.target_date && ` · by ${format(parseISO(g.target_date), "MMM d, yyyy")}`}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary">{pct}%</span>
                </div>
                <Progress value={pct} className="mt-3 h-2" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(g);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" disabled={complete.isPending} onClick={() => complete.mutate(g)}>
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    {g.completed ? "Reopen" : "Complete"}
                  </Button>
                  <Button size="sm" variant="ghost" disabled={remove.isPending} onClick={() => remove.mutate(g.id)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
