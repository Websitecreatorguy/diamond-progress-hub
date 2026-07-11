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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { CATEGORIES, type Category } from "@/lib/motivation";
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
};

function Training() {
  const qc = useQueryClient();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { data: workouts = [] } = useQuery<Workout[]>({
    queryKey: ["workouts", "week", format(weekStart, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data } = await supabase
        .from("workouts")
        .select("*")
        .gte("scheduled_date", format(weekStart, "yyyy-MM-dd"))
        .lte("scheduled_date", format(addDays(weekStart, 6), "yyyy-MM-dd"))
        .order("scheduled_date");
      return (data ?? []) as Workout[];
    },
  });

  const toggle = useMutation({
    mutationFn: async (w: Workout) => {
      const { error } = await supabase
        .from("workouts")
        .update({
          completed: !w.completed,
          completed_at: !w.completed ? new Date().toISOString() : null,
        })
        .eq("id", w.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("workouts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  });

  const done = workouts.filter((w) => w.completed).length;
  const pct = workouts.length ? Math.round((done / workouts.length) * 100) : 0;

  return (
    <AppShell title="Training Plan">
      <Card className="rounded-2xl border-border p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Week of {format(weekStart, "MMM d")}
            </div>
            <div className="text-2xl font-bold">{pct}% complete</div>
          </div>
          <AddWorkoutDialog defaultDate={format(new Date(), "yyyy-MM-dd")} />
        </div>
        <Progress value={pct} className="mt-4 h-3" />
      </Card>

      <div className="mt-5 space-y-4">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const list = workouts.filter((w) => w.scheduled_date === key);
          const isToday = key === format(new Date(), "yyyy-MM-dd");
          return (
            <div key={key}>
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-baseline gap-2">
                  <div className={`text-sm font-bold ${isToday ? "text-primary" : ""}`}>
                    {format(day, "EEE")}
                  </div>
                  <div className="text-xs text-muted-foreground">{format(day, "MMM d")}</div>
                  {isToday && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Today
                    </span>
                  )}
                </div>
                <AddWorkoutDialog defaultDate={key} compact />
              </div>
              {list.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border py-4 text-center text-xs text-muted-foreground">
                  Rest day
                </div>
              ) : (
                <ul className="space-y-2">
                  {list.map((w) => (
                    <li
                      key={w.id}
                      className="flex items-center gap-3 rounded-xl bg-card px-3 py-3 shadow-card"
                    >
                      <Checkbox
                        checked={w.completed}
                        onCheckedChange={() => toggle.mutate(w)}
                        className="h-5 w-5"
                      />
                      <div className="min-w-0 flex-1">
                        <div
                          className={`truncate text-sm font-medium ${w.completed ? "text-muted-foreground line-through" : ""}`}
                        >
                          {w.title}
                        </div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          {w.category}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => del.mutate(w.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
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
        {compact ? (
          <Button variant="ghost" size="sm" className="text-primary">
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        ) : (
          <Button size="sm" className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> New workout
          </Button>
        )}
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
