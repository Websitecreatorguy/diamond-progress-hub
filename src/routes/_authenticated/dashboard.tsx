import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Flame, Trophy, Target, Zap, CheckCircle2 } from "lucide-react";
import { format, startOfWeek, endOfWeek, subDays } from "date-fns";
import { todayQuote } from "@/lib/motivation";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Diamond Development" }] }),
  component: Dashboard,
});

type Workout = {
  id: string;
  scheduled_date: string;
  category: string;
  title: string;
  completed: boolean;
};

function Dashboard() {
  const qc = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").maybeSingle();
      return data;
    },
  });

  const { data: todays = [] } = useQuery<Workout[]>({
    queryKey: ["workouts", "today", today],
    queryFn: async () => {
      const { data } = await supabase
        .from("workouts")
        .select("*")
        .eq("scheduled_date", today)
        .order("created_at");
      return (data ?? []) as Workout[];
    },
  });

  const { data: week = [] } = useQuery<Workout[]>({
    queryKey: ["workouts", "week", weekStart],
    queryFn: async () => {
      const { data } = await supabase
        .from("workouts")
        .select("*")
        .gte("scheduled_date", weekStart)
        .lte("scheduled_date", weekEnd);
      return (data ?? []) as Workout[];
    },
  });

  const { data: streak = 0 } = useQuery({
    queryKey: ["streak"],
    queryFn: async () => {
      const since = format(subDays(new Date(), 60), "yyyy-MM-dd");
      const { data } = await supabase
        .from("workouts")
        .select("scheduled_date, completed")
        .gte("scheduled_date", since)
        .eq("completed", true)
        .order("scheduled_date", { ascending: false });
      const done = new Set((data ?? []).map((w) => w.scheduled_date as string));
      let s = 0;
      for (let i = 0; i < 60; i++) {
        const d = format(subDays(new Date(), i), "yyyy-MM-dd");
        if (done.has(d)) s++;
        else if (i > 0) break;
      }
      return s;
    },
  });

  const { data: totalDone = 0 } = useQuery({
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
      const { error } = await supabase
        .from("workouts")
        .update({
          completed: !w.completed,
          completed_at: !w.completed ? new Date().toISOString() : null,
        })
        .eq("id", w.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries(),
  });

  const doneWeek = week.filter((w) => w.completed).length;
  const weekPct = week.length ? Math.round((doneWeek / week.length) * 100) : 0;

  const achievements = [
    { unlocked: totalDone >= 1, label: "First Workout", icon: Zap },
    { unlocked: streak >= 7, label: "7-Day Streak", icon: Flame },
    { unlocked: totalDone >= 30, label: "30 Workouts", icon: Trophy },
  ];

  return (
    <AppShell title="Dashboard">
      <section className="rounded-3xl bg-gradient-field p-6 text-primary-foreground shadow-glow">
        <div className="text-xs uppercase tracking-widest opacity-75">
          Hey {profile?.full_name?.split(" ")[0] ?? "Player"}
        </div>
        <h1 className="mt-1 text-2xl font-bold leading-tight">"{todayQuote()}"</h1>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat label="Streak" value={`${streak}`} unit="days" icon={<Flame className="h-4 w-4" />} />
          <Stat label="This week" value={`${weekPct}%`} unit="done" />
          <Stat label="Total" value={`${totalDone}`} unit="workouts" />
        </div>
      </section>

      <section className="mt-5">
        <Card className="rounded-2xl border-border p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Today's Plan
            </h2>
            <Link to="/training" className="text-xs font-medium text-primary hover:underline">
              Edit plan →
            </Link>
          </div>
          {todays.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
              No workouts scheduled today.
              <div className="mt-3">
                <Button asChild size="sm" className="bg-gradient-primary">
                  <Link to="/training">Plan today</Link>
                </Button>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {todays.map((w) => (
                <li
                  key={w.id}
                  className="flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-3"
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
                  {w.completed && <CheckCircle2 className="h-4 w-4 text-success" />}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section className="mt-5">
        <Card className="rounded-2xl border-border p-5 shadow-card">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Weekly progress
            </h2>
            <span className="text-sm font-semibold text-primary">
              {doneWeek} / {week.length || 0}
            </span>
          </div>
          <Progress value={weekPct} className="h-3" />
          <p className="mt-3 text-xs text-muted-foreground">
            Keep going. {week.length - doneWeek} workouts left this week.
          </p>
        </Card>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2">
        <Card className="rounded-2xl border-border p-5 shadow-card">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Target className="h-4 w-4 text-primary" /> Current Goal
          </h3>
          <p className="text-sm font-medium">Reach 80 mph exit velocity</p>
          <Progress value={60} className="mt-3 h-2" />
          <p className="mt-2 text-xs text-muted-foreground">60% there. Trust the process.</p>
        </Card>

        <Card className="rounded-2xl border-border p-5 shadow-card">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Trophy className="h-4 w-4 text-warning" /> Achievements
          </h3>
          <ul className="space-y-2 text-sm">
            {achievements.map((a) => (
              <li
                key={a.label}
                className={`flex items-center gap-2 ${a.unlocked ? "" : "opacity-40"}`}
              >
                <a.icon className="h-4 w-4 text-primary" />
                {a.label}
                {a.unlocked && <CheckCircle2 className="ml-auto h-4 w-4 text-success" />}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value: string;
  unit: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
      <div className="flex items-center justify-center gap-1 text-2xl font-black">
        {icon}
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-widest opacity-75">
        {label} · {unit}
      </div>
    </div>
  );
}
