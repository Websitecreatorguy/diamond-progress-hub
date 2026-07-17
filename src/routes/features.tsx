import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  ClipboardList,
  LineChart,
  ShieldCheck,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Diamond Development" },
      { name: "description", content: "Metric tracking, personalized training, team leaderboards, coach verification, and more — a full baseball development platform." },
      { property: "og:title", content: "Diamond Development — Features" },
      { property: "og:description", content: "Everything a baseball player, coach, or parent needs to develop the next level." },
      { property: "og:url", content: SITE_URL + "/features" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/features" }],
  }),
  component: FeaturesPage,
});

const GROUPS = [
  {
    title: "For Players",
    icon: Activity,
    items: [
      { icon: LineChart, title: "Metric tracking", body: "Exit velo, pitch velo, bat speed, pop time, 60 yard, home to first, vertical, height, weight — logged and charted over time." },
      { icon: Zap, title: "Personalized training", body: "Auto-generated weekly programs adjust for age, position, and current performance." },
      { icon: Trophy, title: "Achievements & XP", body: "Earn XP for workouts, streaks, PRs, and goals. Level up over the season." },
      { icon: Target, title: "Goals & PRs", body: "Set targets like 'hit 80 mph exit velo' and watch a live progress bar." },
    ],
  },
  {
    title: "For Coaches",
    icon: ClipboardList,
    items: [
      { icon: ShieldCheck, title: "Verify stats", body: "Confirm player metrics with a badge — the gold standard for recruiting profiles." },
      { icon: Users, title: "Roster management", body: "Approve or remove players, assign assistant coaches, post team announcements." },
      { icon: BarChart3, title: "Team analytics", body: "Team leaderboards, attendance, workout completion — export to CSV any time." },
    ],
  },
  {
    title: "For Parents",
    icon: ShieldCheck,
    items: [
      { icon: Users, title: "Multiple players", body: "Manage several children under one parent account. One-tap switching." },
      { icon: BarChart3, title: "Progress at a glance", body: "Weekly summaries for each child, PR alerts, workout completion." },
    ],
  },
];

function FeaturesPage() {
  return (
    <MarketingLayout>
      <section className="border-b border-border bg-gradient-field py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Features</div>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Every tool a baseball player needs to develop.</h1>
          <p className="mt-4 text-lg opacity-85">One platform for players, coaches, and parents.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                <g.icon className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">{g.title}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {g.items.map((item) => (
                <Card key={item.title} className="rounded-2xl border-border p-5 shadow-card">
                  <item.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                </Card>
              ))}
            </div>
          </section>
        ))}

        <div className="rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground shadow-glow">
          <h2 className="text-2xl font-black md:text-3xl">Start tracking today.</h2>
          <p className="mt-2 opacity-85">Free forever. No credit card.</p>
          <Button asChild size="lg" className="mt-5 bg-white text-primary hover:bg-white/90">
            <Link to="/auth">Create your account</Link>
          </Button>
        </div>
      </div>
    </MarketingLayout>
  );
}
