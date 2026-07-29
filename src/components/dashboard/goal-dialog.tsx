import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { METRIC_MAP, METRICS } from "@/lib/metrics";
import { friendlyError, logActivity } from "@/lib/activity";
import type { Tables } from "@/integrations/supabase/types";

export type Goal = Tables<"goals">;

export function GoalDialog({
  open,
  onOpenChange,
  goal,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  goal?: Goal | null;
}) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [metric, setMetric] = useState<string>("exit_velo");
  const [target, setTarget] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (goal) {
      setTitle(goal.title);
      setMetric(goal.metric ?? "exit_velo");
      setTarget(String(goal.target_value));
      setTargetDate(goal.target_date ?? "");
    } else {
      setTitle("");
      setMetric("exit_velo");
      setTarget("");
      setTargetDate("");
    }
  }, [open, goal]);

  const def = METRIC_MAP[metric];

  const save = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Give your goal a title.");
      const num = Number(target);
      if (!Number.isFinite(num) || num <= 0) throw new Error("Enter a target value.");

      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Your session expired. Please sign in again.");
      const uid = u.user.id;

      // Seed current value from the latest saved result for this metric.
      const { data: latest } = await supabase
        .from("metric_entries")
        .select("value")
        .eq("user_id", uid)
        .eq("metric", metric)
        .order("recorded_on", { ascending: false })
        .limit(1)
        .maybeSingle();

      const current = latest ? Number(latest.value) : null;
      const direction = def.lowerIsBetter ? "down" : "up";

      if (goal) {
        const { error } = await supabase
          .from("goals")
          .update({
            title: title.trim(),
            metric,
            unit: def.unit,
            target_value: num,
            target_date: targetDate || null,
            current_value: current,
            direction,
          })
          .eq("id", goal.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("goals").insert({
          user_id: uid,
          title: title.trim(),
          metric,
          unit: def.unit,
          start_value: current,
          current_value: current,
          target_value: num,
          target_date: targetDate || null,
          direction,
        });
        if (error) throw error;
        await logActivity("goal_created", `Goal created: ${title.trim()}`);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries();
      toast.success(goal ? "Goal updated" : "Goal created");
      onOpenChange(false);
    },
    onError: (e) => setError(friendlyError(e, "We couldn't save that goal.")),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{goal ? "Edit goal" : "Create a goal"}</DialogTitle>
          <DialogDescription>Track progress toward a target through the season.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            save.mutate();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="goal-title">Goal title</Label>
            <Input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Throw 70 mph"
              maxLength={120}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="goal-metric">Metric</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger id="goal-metric">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METRICS.map((m) => (
                  <SelectItem key={m.key} value={m.key}>
                    {m.label} ({m.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="goal-target">Target ({def.unit})</Label>
              <Input
                id="goal-target"
                type="number"
                step={def.step}
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="goal-date">Target date</Label>
              <Input
                id="goal-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary shadow-glow" disabled={save.isPending}>
              {save.isPending ? "Saving…" : goal ? "Save changes" : "Create goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function goalProgress(goal: Goal) {
  const start = goal.start_value === null ? null : Number(goal.start_value);
  const current = goal.current_value === null ? null : Number(goal.current_value);
  const target = Number(goal.target_value);
  if (goal.completed) return 100;
  if (current === null) return 0;
  const from = start ?? (goal.direction === "down" ? target * 1.3 : 0);
  const span = Math.abs(target - from);
  if (span === 0) return 100;
  const done = Math.abs(current - from);
  const pct = (done / span) * 100;
  const heading = goal.direction === "down" ? current <= from : current >= from;
  return Math.max(0, Math.min(100, Math.round(heading ? pct : 0)));
}
