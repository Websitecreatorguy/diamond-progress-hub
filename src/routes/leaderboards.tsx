import { createFileRoute, Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/leaderboards")({
  head: () => ({
    meta: [
      { title: "Leaderboards — Diamond Development" },
      { name: "description", content: "Baseball leaderboards for exit velocity, pitching velocity, bat speed, 60 yard, pop time, vertical, and more." },
      { property: "og:title", content: "Baseball Leaderboards — Diamond Development" },
      { property: "og:description", content: "Compare across teams and verified players by every metric." },
      { property: "og:url", content: SITE_URL + "/leaderboards" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/leaderboards" }],
  }),
  component: LeaderboardsPage,
});

const METRICS = [
  ["Exit Velocity", "mph"],
  ["Pitching Velocity", "mph"],
  ["Bat Speed", "mph"],
  ["Sprint Speed", "mph"],
  ["60 Yard Dash", "sec"],
  ["Pop Time", "sec"],
  ["Vertical Jump", "in"],
];

function LeaderboardsPage() {
  return (
    <MarketingLayout>
      <section className="border-b border-border bg-gradient-field py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Trophy className="mx-auto h-10 w-10 opacity-90" />
          <h1 className="mt-4 text-4xl font-black md:text-5xl">Leaderboards</h1>
          <p className="mt-3 text-lg opacity-85">
            Rank every metric — all players or verified only. Compare within teams, age groups, and positions.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {METRICS.map(([name, unit]) => (
            <Card key={name} className="flex items-center justify-between rounded-2xl border-border p-5 shadow-card">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Leaderboard
                </div>
                <div className="mt-1 font-bold">{name}</div>
              </div>
              <div className="text-xs text-muted-foreground">Measured in {unit}</div>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-secondary/40 p-8 text-center">
          <h2 className="text-xl font-bold">Public leaderboards are launching</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your team's private leaderboards today. Public rankings by age and position are on the way.
          </p>
          <Button asChild size="lg" className="mt-5 bg-gradient-primary shadow-glow">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </div>
    </MarketingLayout>
  );
}
