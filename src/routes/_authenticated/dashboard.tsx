import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Plus,
  Target,
  Trophy,
  Users,
  UserCog,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, EmptyState } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AddResultDialog } from "@/components/dashboard/add-result-dialog";
import { GoalDialog, goalProgress } from "@/components/dashboard/goal-dialog";
import { useMemberships, useProfile } from "@/hooks/use-app-user";
import {
  METRIC_MAP,
  formatMetric,
  improvementDelta,
  relevantMetrics,
} from "@/lib/metrics";
import { todayQuote } from "@/lib/motivation";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Player Dashboard — Diamond Development" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Dashboard,
});

type Entry = Tables<"metric_entries">;

function Dashboard() {
  const [addOpen, setAddOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: memberships = [] } = useMemberships();

  const { data: entries = [], isLoading: entriesLoading } = useQuery<Entry[]>({
    queryKey: ["metric-entries"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("metric_entries")
        .select("*")
        .eq("user_id", u.user.id)
        .order("recorded_on", { ascending: false });
      return (data ?? []) as Entry[];
    },
  });

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

  const { data: goals = [] } = useQuery({
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

  const { data: activity = [] } = useQuery({
    queryKey: ["activity"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data } = await supabase
        .from("activity_log")
        .select("*")
        .eq("user_id", u.user.id)
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
  });

  const byMetric = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of entries) {
      const list = map.get(e.metric) ?? [];
      list.push(e);
      map.set(e.metric, list);
    }
    return map;
  }, [entries]);

  const cards = useMemo(() => {
    const defs = relevantMetrics(profile?.positions);
    return defs
      .map((d) => {
        const list = byMetric.get(d.key) ?? [];
        const pr = records.find((r) => r.metric === d.key);
        return { def: d, current: list[0], previous: list[1], pr };
      })
      .filter((c) => c.current || ["exit_velo", "throw_velo", "sixty_yd", "height", "weight"].includes(c.def.key));
  }, [profile?.positions, byMetric, records]);

  const completion = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile.full_name,
      profile.age,
      profile.team,
      profile.positions?.length,
      profile.height_in,
      profile.weight_lb,
      profile.bats,
      profile.throws,
      profile.grad_year,
      profile.jersey_number,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile]);

  const team = memberships[0]?.teams ?? null;
  const activeGoals = goals.filter((g) => !g.completed).slice(0, 3);

  return (
    <AppShell
      title={`Hey ${profile?.full_name?.split(" ")[0] ?? "Player"}`}
      description={todayQuote()}
      actions={
        <>
          <Button className="bg-gradient-primary shadow-glow" onClick={() => setAddOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Result
          </Button>
          <Button variant="outline" onClick={() => setGoalOpen(true)}>
            <Target className="mr-1.5 h-4 w-4" /> Create Goal
          </Button>
          <Button asChild variant="outline">
            <Link to="/team">
              <Users className="mr-1.5 h-4 w-4" /> {team ? "View Team" : "Join Team"}
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/profile">
              <UserCog className="mr-1.5 h-4 w-4" /> Edit Player Profile
            </Link>
          </Button>
        </>
      }
    >
      <AddResultDialog open={addOpen} onOpenChange={setAddOpen} />
      <GoalDialog open={goalOpen} onOpenChange={setGoalOpen} />

      {/* Player overview */}
      <Card className="rounded-2xl border-border p-5 shadow-card sm:p-6">
        {profileLoading ? (
          <div className="flex gap-4">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name ?? "Player avatar"}
                  className="h-20 w-20 rounded-2xl object-cover shadow-glow"
                />
              ) : (
                <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-3xl font-black text-primary-foreground shadow-glow">
                  {(profile?.full_name ?? "P").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="sm:hidden">
                <div className="text-lg font-bold">{profile?.full_name || "Your name"}</div>
                <div className="text-xs text-muted-foreground">{team?.name ?? profile?.team ?? "No team yet"}</div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-xl font-bold">{profile?.full_name || "Your name"}</span>
                {profile?.jersey_number && <Badge variant="secondary">#{profile.jersey_number}</Badge>}
                {profile?.account_type && (
                  <Badge variant="outline" className="capitalize">
                    {profile.account_type}
                  </Badge>
                )}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                <Field label="Age" value={profile?.age ? `${profile.age}` : "—"} />
                <Field label="Grad year" value={profile?.grad_year ? `${profile.grad_year}` : "—"} />
                <Field label="Team" value={team?.name ?? profile?.team ?? "—"} />
                <Field label="Jersey" value={profile?.jersey_number ? `#${profile.jersey_number}` : "—"} />
                <Field label="Primary" value={profile?.positions?.[0] ?? "—"} />
                <Field
                  label="Secondary"
                  value={
                    profile?.secondary_positions?.length
                      ? profile.secondary_positions.join(", ")
                      : profile?.positions?.slice(1).join(", ") || "—"
                  }
                />
                <Field label="Bats / Throws" value={`${profile?.bats ?? "—"} / ${profile?.throws ?? "—"}`} />
                <Field
                  label="Height / Weight"
                  value={`${profile?.height_in ? `${Math.floor(Number(profile.height_in) / 12)}'${Math.round(Number(profile.height_in) % 12)}"` : "—"} · ${profile?.weight_lb ? `${profile.weight_lb} lb` : "—"}`}
                />
              </dl>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">Profile completion</span>
                  <span className="font-semibold text-primary">{completion}%</span>
                </div>
                <Progress value={completion} className="h-2" />
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link to="/profile">Edit Profile</Link>
            </Button>
          </div>
        )}
      </Card>

      {/* Metrics */}
      <section className="mt-6">
        <SectionHeader title="Development metrics" to="/metrics" label="All metrics" />
        {entriesLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No results yet"
            description="Start tracking your baseball development by adding your first result."
          >
            <Button className="bg-gradient-primary shadow-glow" onClick={() => setAddOpen(true)}>
              Add Pitch Velocity
            </Button>
            <Button variant="outline" onClick={() => setAddOpen(true)}>
              Add Exit Velocity
            </Button>
            <Button variant="outline" onClick={() => setAddOpen(true)}>
              Add Sprint Time
            </Button>
          </EmptyState>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ def, current, previous, pr }) => {
              const cur = current ? Number(current.value) : null;
              const prev = previous ? Number(previous.value) : null;
              const delta = cur !== null && prev !== null ? improvementDelta(def.key, cur, prev) : null;
              return (
                <Card key={def.key} className="rounded-2xl border-border p-4 shadow-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {def.label}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="-mr-1 -mt-1 h-7 w-7"
                      aria-label={`Add ${def.label} result`}
                      onClick={() => setAddOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-3xl font-black tracking-tight">
                      {cur !== null ? formatMetric(def.key, cur) : "—"}
                    </span>
                    <span className="text-sm text-muted-foreground">{def.unit}</span>
                    {delta !== null && delta !== 0 && (
                      <span
                        className={`ml-auto text-xs font-semibold ${delta > 0 ? "text-success" : "text-muted-foreground"}`}
                      >
                        {delta > 0 ? "+" : ""}
                        {delta.toFixed(def.decimals)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                    <div>
                      Previous:{" "}
                      <span className="font-medium text-foreground">
                        {prev !== null ? formatMetric(def.key, prev) : "—"}
                      </span>
                    </div>
                    <div>
                      PR:{" "}
                      <span className="font-medium text-foreground">
                        {pr ? formatMetric(def.key, Number(pr.value)) : "—"}
                      </span>
                    </div>
                    <div className="col-span-2">
                      {current ? `Recorded ${format(parseISO(current.recorded_on), "MMM d, yyyy")}` : "No result yet"}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Personal records */}
        <section>
          <SectionHeader title="Personal records" to="/records" label="All records" />
          {records.length === 0 ? (
            <EmptyState icon={Trophy} title="No records yet" description="Your best result for each metric shows up here." >
              <Button className="bg-gradient-primary shadow-glow" onClick={() => setAddOpen(true)}>
                Add first result
              </Button>
            </EmptyState>
          ) : (
            <Card className="divide-y divide-border rounded-2xl border-border shadow-card">
              {records.slice(0, 5).map((r) => {
                const def = METRIC_MAP[r.metric];
                const prev = r.previous_value === null ? null : Number(r.previous_value);
                const gain = prev !== null ? improvementDelta(r.metric, Number(r.value), prev) : null;
                return (
                  <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                    <Trophy className="h-4 w-4 shrink-0 text-warning" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{def?.label ?? r.metric}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {format(parseISO(r.achieved_on), "MMM d, yyyy")}
                        {gain !== null && gain > 0 && ` · +${gain.toFixed(def?.decimals ?? 1)} ${r.unit} improvement`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black">{formatMetric(r.metric, Number(r.value))}</div>
                      <div className="text-[10px] uppercase text-muted-foreground">{r.unit}</div>
                    </div>
                  </div>
                );
              })}
            </Card>
          )}
        </section>

        {/* Goals */}
        <section>
          <SectionHeader title="Goals" to="/goals" label="All goals" />
          {activeGoals.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No goals yet"
              description="Create a goal and track your progress throughout the season."
            >
              <Button className="bg-gradient-primary shadow-glow" onClick={() => setGoalOpen(true)}>
                Create First Goal
              </Button>
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {activeGoals.map((g) => {
                const pct = goalProgress(g);
                return (
                  <Card key={g.id} className="rounded-2xl border-border p-4 shadow-card">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{g.title}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {g.current_value !== null ? formatMetric(g.metric ?? "", Number(g.current_value)) : "—"} /{" "}
                          {formatMetric(g.metric ?? "", Number(g.target_value))} {g.unit}
                          {g.target_date && ` · by ${format(parseISO(g.target_date), "MMM d, yyyy")}`}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary">{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-3 h-2" />
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Recent activity */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Recent activity
        </h2>
        {activity.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Nothing here yet"
            description="Results, records, goals and team updates will appear here."
          />
        ) : (
          <Card className="divide-y divide-border rounded-2xl border-border shadow-card">
            {activity.map((a) => (
              <div key={a.id} className="flex items-start gap-3 px-4 py-3">
                <ActivityIcon kind={a.kind} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{a.title}</div>
                  {a.detail && <div className="text-[11px] text-muted-foreground">{a.detail}</div>}
                </div>
                <div className="shrink-0 text-[11px] text-muted-foreground">
                  {format(new Date(a.created_at), "MMM d")}
                </div>
              </div>
            ))}
          </Card>
        )}
      </section>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  );
}

function SectionHeader({ title, to, label }: { title: string; to: string; label: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <Link to={to} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        {label} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function ActivityIcon({ kind }: { kind: string }) {
  const cls = "h-4 w-4 shrink-0 mt-0.5";
  if (kind === "record") return <Trophy className={`${cls} text-warning`} />;
  if (kind === "goal_completed") return <CheckCircle2 className={`${cls} text-success`} />;
  if (kind === "goal_created") return <Target className={`${cls} text-primary`} />;
  if (kind.startsWith("team")) return <Users className={`${cls} text-primary`} />;
  return <Activity className={`${cls} text-muted-foreground`} />;
}
