import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  METRIC_MAP,
  METRICS,
  formatMetric,
  improvementDelta,
  isImprovement,
  validateMetricValue,
  type MetricKey,
} from "@/lib/metrics";
import { friendlyError, logActivity } from "@/lib/activity";

export function AddResultDialog({
  open,
  onOpenChange,
  defaultMetric,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultMetric?: MetricKey;
}) {
  const qc = useQueryClient();
  const [metric, setMetric] = useState<string>(defaultMetric ?? "exit_velo");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [setting, setSetting] = useState("training");
  const [notes, setNotes] = useState("");
  const [video, setVideo] = useState("");
  const [error, setError] = useState<string | null>(null);

  const def = METRIC_MAP[metric];

  function reset() {
    setValue("");
    setNotes("");
    setVideo("");
    setError(null);
  }

  const save = useMutation({
    mutationFn: async () => {
      const num = Number(value);
      const invalid = validateMetricValue(metric, num);
      if (invalid) throw new Error(invalid);
      if (video && !/^https?:\/\/\S+$/i.test(video))
        throw new Error("Video link must start with http:// or https://");

      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Your session expired. Please sign in again.");
      const uid = u.user.id;

      const { error: insErr } = await supabase.from("metric_entries").insert({
        user_id: uid,
        metric,
        value: num,
        unit: def.unit,
        recorded_on: date,
        setting,
        notes: notes.trim() || null,
        video_url: video.trim() || null,
      });
      if (insErr) throw insErr;

      // Personal record
      const { data: existing } = await supabase
        .from("personal_records")
        .select("*")
        .eq("user_id", uid)
        .eq("metric", metric)
        .maybeSingle();

      let newRecord = false;
      if (!existing) {
        newRecord = true;
        await supabase.from("personal_records").insert({
          user_id: uid,
          metric,
          value: num,
          unit: def.unit,
          achieved_on: date,
        });
      } else if (isImprovement(metric, num, Number(existing.value))) {
        newRecord = true;
        await supabase
          .from("personal_records")
          .update({
            value: num,
            unit: def.unit,
            previous_value: existing.value,
            achieved_on: date,
          })
          .eq("id", existing.id);
      }

      // Goal progress
      const { data: goals } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", uid)
        .eq("metric", metric)
        .eq("completed", false);
      for (const g of goals ?? []) {
        const reached = g.direction === "down" ? num <= Number(g.target_value) : num >= Number(g.target_value);
        await supabase
          .from("goals")
          .update({
            current_value: num,
            completed: reached,
            completed_at: reached ? new Date().toISOString() : null,
          })
          .eq("id", g.id);
        if (reached) await logActivity("goal_completed", `Goal completed: ${g.title}`);
      }

      await logActivity(
        "metric",
        `Added ${def.label}: ${formatMetric(metric, num)} ${def.unit}`,
        setting === "game" ? "Game" : "Training",
      );
      if (newRecord) {
        const prev = existing ? Number(existing.value) : null;
        await logActivity(
          "record",
          `New personal record — ${def.label} ${formatMetric(metric, num)} ${def.unit}`,
          prev !== null ? `+${improvementDelta(metric, num, prev).toFixed(def.decimals)} ${def.unit}` : undefined,
        );
      }
      return { newRecord, num };
    },
    onSuccess: (res) => {
      qc.invalidateQueries();
      if (res.newRecord) toast.success(`New personal record! ${def.label} ${formatMetric(metric, res.num)} ${def.unit} 🎉`);
      else toast.success("Result saved");
      reset();
      onOpenChange(false);
    },
    onError: (e) => setError(friendlyError(e, "We couldn't save that result. Please try again.")),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a result</DialogTitle>
          <DialogDescription>Log a new measurement to update your charts, records and goals.</DialogDescription>
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
            <Label htmlFor="metric">Metric type</Label>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger id="metric">
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
              <Label htmlFor="value">Result ({def.unit})</Label>
              <Input
                id="value"
                inputMode="decimal"
                type="number"
                step={def.step}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`${def.min}–${def.max}`}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                max={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="setting">Setting</Label>
            <Select value={setting} onValueChange={setSetting}>
              <SelectTrigger id="setting">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="game">Game</SelectItem>
                <SelectItem value="showcase">Showcase / Combine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={500} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="video">Video link (optional)</Label>
            <Input
              id="video"
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              placeholder="https://…"
              inputMode="url"
            />
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
              {save.isPending ? "Saving…" : "Save result"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
