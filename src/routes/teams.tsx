import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Teams — Diamond Development" },
      { name: "description", content: "Create or join a baseball team. Coach-approved rosters, team leaderboards, verified stats, announcements." },
      { property: "og:title", content: "Baseball Teams — Diamond Development" },
      { property: "og:description", content: "Team management with rosters, leaderboards, and coach-verified stats." },
      { property: "og:url", content: SITE_URL + "/teams" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/teams" }],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  return (
    <MarketingLayout>
      <section className="border-b border-border bg-gradient-field py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Teams</div>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Build your team's edge.</h1>
          <p className="mt-4 text-lg opacity-85">Rosters, leaderboards, announcements, and coach-verified stats — all in one place.</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="rounded-2xl border-border p-6 shadow-card">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-lg font-semibold">Create a team</h2>
            <p className="mt-1 text-sm text-muted-foreground">Generate an invite code. Approve players who join. Assign assistant coaches.</p>
          </Card>
          <Card className="rounded-2xl border-border p-6 shadow-card">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-lg font-semibold">Join a team</h2>
            <p className="mt-1 text-sm text-muted-foreground">Enter an invite code and wait for coach approval. Your metrics stay yours.</p>
          </Card>
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-secondary/40 p-8">
          <h2 className="text-xl font-bold">Every team gets</h2>
          <ul className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            {[
              "Full roster with role management",
              "Announcements pinned to every player",
              "Leaderboards for every metric",
              "Verified vs unverified stat filters",
              "CSV export for coaches",
              "Attendance tracking",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-center">
          <Button asChild size="lg" className="bg-gradient-primary shadow-glow">
            <Link to="/auth">Get started free</Link>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Team creation opens after sign-in. Full team management arrives in the next update.
          </p>
        </div>
      </div>
    </MarketingLayout>
  );
}
