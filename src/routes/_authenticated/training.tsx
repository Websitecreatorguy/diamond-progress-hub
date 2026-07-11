import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Sparkles, Info } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { CATEGORIES, type Category } from "@/lib/motivation";
import {
  DRILLS,
  DAY_INDEX,
  generateWeek,
  toWorkoutCategory,
  type DayId,
} from "@/lib/program";
import { encouragement, milestoneFor } from "@/lib/encouragement";
import { DrillSheet } from "@/components/drill-sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/training")({
  head: () => ({ meta: [{ title: "Training Plan — Diamond Development" }] }),
  component: Training,
});

type Workout = {
  id: string;
  scheduled_date: string;
  category: Category;
  title: string;
  completed: boolean;
  notes: string | null;
};

function Training() {
  const qc = useQueryClient();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekStartStr = format(weekStart, "yyyy-MM-dd");
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const [activeDrill, setActiveDrill] = useState<string | null>(null);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").maybeSingle();
      return data;
    },
  });

  const { data: latestMeasurements = [] } = useQuery({
    queryKey: ["measurements", "recent"],
    queryFn: async () => {
      const { data } = await supabase
        .from("measurements")
        .select("*")
        .order("measured_at", { ascending: false })
        .limit(2);
      return data ?? [];
    },
  });

  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["workouts", "week", weekStartStr],
    queryFn: async () => {
      const { data } = await supabase
        .from("workouts")
        .select("*")
        .gte("scheduled_date", weekStartStr)
        .lte("scheduled_date", format(addDays(weekStart, 6), "yyyy-MM-dd"))
        .order("scheduled_date");
      return (data ?? []) as Workout[];
    },
  });

  const { data: completedCount = 0 } = useQuery({
    queryKey: ["totalWorkouts"],
    queryFn: async () => {
      const { count } = await supabase
        .from("workouts")
        .select("*", { count: "exact", head: true })
        .eq("completed", true);
      return count ?? 0;
    },
  });

  const toggle = useMutation({
    mutationFn: async (w: Workout) => {
      const nowCompleting = !w.completed;
      const { error } = await supabase
        .from("workouts")
        .update({
          completed: nowCompleting,
          completed_at: nowCompleting ? new Date().toISOString() : null,
        })
        .eq("id", w.id);
      if (error) throw error;
      return nowCompleting;
    },
    onSuccess: (nowCompleting) => {
      qc.invalidateQueries({ queryKey: ["workouts"] });
      qc.invalidateQueries({ queryKey: ["totalWorkouts"] });
      if (nowCompleting) {
        toast.success(encouragement());
        const next = completedCount + 1;
        const milestone = milestoneFor(next);
        if (milestone) toast(`🏆 ${milestone}`, { duration: 5000 });
      }
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("workouts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  });

  const generate = useMutation({
    mutationFn: async ({ replace }: { replace: boolean }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      if (replace) {
        await supabase
          .from("workouts")
          .delete()
          .eq("user_id", u.user.id)
          .gte("scheduled_date", weekStartStr)
          .lte("scheduled_date", format(addDays(weekStart, 6), "yyyy-MM-dd"));
      }
      const latest = latestMeasurements[0] ?? null;
      const prior = latestMeasurements[1] ?? null;
      const plan = generateWeek({
        age: (profile?.age as number | null) ?? null,
        positions: (profile?.positions as string[] | null) ?? null,
        latest,
        prior,
      });
      const rows: Array<{
        user_id: string;
        scheduled_date: string;
        title: string;
        category: string;
        notes: string;
      }> = [];
      for (const day of plan) {
        const date = format(addDays(weekStart, DAY_INDEX[day.day]), "yyyy-MM-dd");
        for (const item of day.drills) {
          rows.push({
            user_id: u.user.id,
            scheduled_date: date,
            title: item.displayTitle,
            category: toWorkoutCategory(item.drill.category),
            notes: item.drill.id,
          });
        }
      }
      if (rows.length) {
        const { error } = await supabase.from("workouts").insert(rows);
        if (error) throw error;
      }
      return rows.length;
    },
    onSuccess: (count) => {
      qc.invalidateQueries({ queryKey: ["workouts"] });
      toast.success(`Generated ${count} drills for the week!`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const done = workouts.filter((w) => w.completed).length;
  const pct = workouts.length ? Math.round((done / workouts.length) * 100) : 0;
  const hasWeek = workouts.length > 0;

  return (
    <AppShell title="Training Plan">
      <Card className="rounded-2xl border-border p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Week of {format(weekStart, "MMM d")}
            </div>
            <div className="text-2xl font-bold">{pct}% complete</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {done} of {workouts.length || 0} drills done
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <GenerateProgramButton
              hasWeek={hasWeek}
              pending={generate.isPending}
              onGenerate={(replace) => generate.mutate({ replace })}
            />
            <AddWorkoutDialog defaultDate={format(new Date(), "yyyy-MM-dd")} compact />
          </div>
        </div>
        <Progress value={pct} className="mt-4 h-3" />
      </Card>

      {!hasWeek && (
        <Card className="mt-4 rounded-2xl border-dashed border-primary/40 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold">Build your personalized week</div>
              <p className="mt-1 text-sm text-muted-foreground">
                We'll create a 7-day program based on your age, position, and latest measurements —
                with technique notes, sets, and reps for every drill.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-5 space-y-4">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const list = workouts.filter((w) => w.scheduled_date === key);
          const isToday = key === format(new Date(), "yyyy-MM-dd");
          const dayId = (["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as DayId[])[
            (day.getDay() + 6) % 7
          ];
          return (
            <div key={key}>
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-baseline gap-2">
                  <div className={`text-sm font-bold ${isToday ? "text-primary" : ""}`}>
                    {format(day, "EEE")}
                  </div>
                  <div className="text-xs text-muted-foreground">{format(day, "MMM d")}</div>
                  {isToday && (
                    <Badge className="bg-primary/10 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Today
                    </Badge>
                  )}
                </div>
                <AddWorkoutDialog defaultDate={key} compact />
              </div>
              {list.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border py-4 text-center text-xs text-muted-foreground">
                  {dayId === "Sun" ? "Recovery day" : "Rest day"}
                </div>
              ) : (
                <ul className="space-y-2">
                  {list.map((w) => {
                    const hasDrill = w.notes && DRILLS[w.notes];
                    return (
                      <li
                        key={w.id}
                        className="flex items-center gap-3 rounded-xl bg-card px-3 py-3 shadow-card"
                      >
                        <Checkbox
                          checked={w.completed}
                          onCheckedChange={() => toggle.mutate(w)}
                          className="h-5 w-5"
                        />
                        <button
                          type="button"
                          onClick={() => hasDrill && setActiveDrill(w.notes)}
                          className="min-w-0 flex-1 text-left"
                          disabled={!hasDrill}
                        >
                          <div
                            className={`truncate text-sm font-medium ${w.completed ? "text-muted-foreground line-through" : ""}`}
                          >
                            {w.title}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                            {w.category}
                            {hasDrill && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1 text-primary">
                                  <Info className="h-3 w-3" /> Tap for how-to
                                </span>
                              </>
                            )}
                          </div>
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => del.mutate(w.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <DrillSheet
        drillId={activeDrill}
        prescription={
          activeDrill
            ? workouts.find((w) => w.notes === activeDrill && DRILLS[w.notes])
              ? DRILLS[activeDrill].base
              : undefined
            : undefined
        }
        onOpenChange={(open) => !open && setActiveDrill(null)}
      />
    </AppShell>
  );
}

function GenerateProgramButton({
  hasWeek,
  pending,
  onGenerate,
}: {
  hasWeek: boolean;
  pending: boolean;
  onGenerate: (replace: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  if (!hasWeek) {
    return (
      <Button
        size="sm"
        className="bg-gradient-primary shadow-glow"
        disabled={pending}
        onClick={() => onGenerate(false)}
      >
        <Sparkles className="mr-1 h-4 w-4" /> Generate program
      </Button>
    );
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Sparkles className="mr-1 h-4 w-4" /> Regenerate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rebuild this week?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This will delete this week's current workouts and generate a fresh personalized program
          based on your latest measurements.
        </p>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-gradient-primary"
            disabled={pending}
            onClick={() => {
              onGenerate(true);
              setOpen(false);
            }}
          >
            Yes, regenerate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddWorkoutDialog({ defaultDate, compact }: { defaultDate: string; compact?: boolean }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Hitting");
  const [date, setDate] = useState(defaultDate);

  const add = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("workouts").insert({
        user_id: u.user.id,
        scheduled_date: date,
        category,
        title,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workouts"] });
      setOpen(false);
      setTitle("");
      toast.success("Workout added");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary">
          <Plus className="mr-1 h-4 w-4" /> {compact ? "Add" : "New workout"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add workout</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim()) add.mutate();
          }}
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tee work — 3 rounds"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-primary" disabled={add.isPending}>
            Add workout
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
