import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Flame,
  LineChart,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diamond Development — The Baseball Development Platform" },
      {
        name: "description",
        content:
          "Track exit velocity, pitch velocity, bat speed, and every metric that matters. Diamond Development is the training and analytics platform built for baseball players, coaches, and parents.",
      },
      { property: "og:title", content: "Diamond Development — The Baseball Development Platform" },
      {
        property: "og:description",
        content: "Track exit velocity, pitch velocity, bat speed, and every metric that matters. Diamond Development is the training and analytics platform built for baseball players, coaches, and parents.",
      },
      { property: "og:url", content: SITE_URL + "/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Diamond Development",
          applicationCategory: "SportsApplication",
          operatingSystem: "Web",
          description:
            "Baseball player development platform with metric tracking, personalized training, and team leaderboards.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <MarketingLayout>
      <Hero />
      <TrustBar />
      <Features />
      <DashboardPreview />
      <TeamSection />
      <CoachSection />
      <ParentSection />
      <ProgressSection />
      <FAQ />
      <CTA />
    </MarketingLayout>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-field text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(circle_at_15%_15%,white_0,transparent_35%),radial-gradient(circle_at_85%_85%,white_0,transparent_35%)]" />
      <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-white/10 md:block" />
      <div className="pointer-events-none absolute -right-40 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-white/10 md:block" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Built for the next generation
          </div>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            The baseball development platform players actually use.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Track every metric that matters — exit velocity, pitch velo, bat speed, pop time.
            Personalized training. Team leaderboards. Coach-verified stats.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/auth">Start free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link to="/features">See features</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-white/70">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Free to start</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> No credit card</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Ages 8 to college</span>
          </div>
        </div>
        <HeroCard />
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-2xl" />
      <Card className="relative rounded-3xl border-white/15 bg-white/10 p-6 text-white shadow-glow backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs uppercase tracking-widest opacity-80">
          <span>Player · This month</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/20 px-2 py-0.5 text-success">
            <Flame className="h-3 w-3" /> 12 day streak
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <MetricTile label="Exit Velo" value="82" unit="mph" delta="+6" />
          <MetricTile label="Pitch Velo" value="74" unit="mph" delta="+3" />
          <MetricTile label="Bat Speed" value="66" unit="mph" delta="+4" />
          <MetricTile label="60 Yard" value="7.42" unit="sec" delta="-0.18" positive />
        </div>
        <div className="mt-5 rounded-2xl bg-black/25 p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="opacity-70">Exit velocity trend</span>
            <span className="opacity-70">last 8 weeks</span>
          </div>
          <SparkChart values={[72, 74, 73, 76, 78, 79, 80, 82]} />
        </div>
      </Card>
    </div>
  );
}

function MetricTile({
  label,
  value,
  unit,
  delta,
  positive,
}: {
  label: string;
  value: string;
  unit: string;
  delta: string;
  positive?: boolean;
}) {
  const good = positive ?? !delta.startsWith("-");
  return (
    <div className="rounded-2xl bg-black/25 p-3">
      <div className="text-[10px] uppercase tracking-widest opacity-70">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-black">{value}</span>
        <span className="text-xs opacity-70">{unit}</span>
      </div>
      <div className={`mt-1 text-[11px] font-semibold ${good ? "text-success" : "text-warning"}`}>
        {delta} {unit}
      </div>
    </div>
  );
}

function SparkChart({ values }: { values: number[] }) {
  const w = 240;
  const h = 60;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const step = w / (values.length - 1);
  const points = values.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 8) - 4}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polyline
        fill="rgba(255,255,255,0.12)"
        stroke="none"
        points={`0,${h} ${points} ${w},${h}`}
      />
    </svg>
  );
}

function TrustBar() {
  const items = [
    "Exit Velocity",
    "Pitch Velocity",
    "Bat Speed",
    "60 Yard",
    "Pop Time",
    "Vertical",
    "Sprint Speed",
    "Home to First",
  ];
  return (
    <section className="border-b border-border bg-secondary/40 py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Every metric that matters, in one place
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-foreground/80">
          {items.map((i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              {i}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Activity, title: "Metric tracking", body: "Log 10+ performance metrics — exit velo, pitch velo, bat speed, pop time, 60 yard, vertical, home-to-first, height, weight — and see trends over months and years." },
    { icon: Zap, title: "Personalized training", body: "Auto-generated weekly programs adjust for age, position, and current performance. Every drill has technique cues, coaching tips, and safety notes." },
    { icon: ShieldCheck, title: "Coach-verified stats", body: "Coaches confirm player metrics with a verification badge — the gold standard for recruiting profiles." },
    { icon: Trophy, title: "Team leaderboards", body: "Compare within your team, your age group, or verified players only. Ranked by every tracked metric." },
    { icon: Target, title: "Goals & PRs", body: "Set targets like 'hit 80 mph exit velo' and watch a live progress bar. Personal records auto-celebrate." },
    { icon: LineChart, title: "Progress analytics", body: "Line charts, monthly deltas, and improvement percentages that show real work, not vanity numbers." },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Features"
        title="Everything a serious player needs, nothing they don't."
        subtitle="A single platform for metrics, training, and team management. Built by people who love the game."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="group rounded-2xl border-border p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section className="border-y border-border bg-secondary/40 py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Player dashboard"
            title="Your metrics. Your training. Your progress."
            subtitle="Open the app and see the number that matters today, the streak you're building, and the next workout in your program."
            align="left"
          />
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Today's workout with technique videos",
              "Weekly completion % and streak tracking",
              "Automatic personal record detection",
              "Metric charts for every tracked stat",
              "XP, levels, and achievement badges",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-gradient-primary shadow-glow">
              <Link to="/auth">Try the dashboard</Link>
            </Button>
          </div>
        </div>
        <MockDashboard />
      </div>
    </section>
  );
}

function MockDashboard() {
  return (
    <div className="relative">
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="border-b border-border bg-gradient-field px-5 py-4 text-primary-foreground">
          <div className="text-[11px] uppercase tracking-widest opacity-75">Hey Alex</div>
          <div className="text-lg font-bold">"Trust the process."</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <MiniStat label="Streak" value="12" unit="days" />
            <MiniStat label="Week" value="80%" unit="done" />
            <MiniStat label="Total" value="43" unit="workouts" />
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Today's Plan
              </div>
              <span className="text-xs text-primary">4 of 5 done</span>
            </div>
            <ul className="space-y-2 text-sm">
              {[
                ["Dynamic warm-up", true],
                ["Goblet squats 3x10", true],
                ["Tee work 5x10", true],
                ["Long toss 60 ft", true],
                ["Front toss 3x10", false],
              ].map(([label, done]) => (
                <li
                  key={label as string}
                  className={`flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2 ${done ? "opacity-70 line-through" : ""}`}
                >
                  <div className={`grid h-4 w-4 place-items-center rounded border ${done ? "border-primary bg-primary" : "border-border"}`}>
                    {done ? <CheckCircle2 className="h-3 w-3 text-primary-foreground" /> : null}
                  </div>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/40 p-4">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-widest text-muted-foreground">
                Exit Velo · last 8 weeks
              </span>
              <span className="font-semibold text-success">+8 mph</span>
            </div>
            <SparkChartLight values={[72, 74, 73, 76, 78, 79, 80, 82]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-2 backdrop-blur">
      <div className="text-lg font-black">{value}</div>
      <div className="text-[9px] uppercase tracking-widest opacity-75">
        {label} · {unit}
      </div>
    </div>
  );
}

function SparkChartLight({ values }: { values: number[] }) {
  const w = 300;
  const h = 70;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const step = w / (values.length - 1);
  const points = values.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 8) - 4}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-16 w-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="oklch(0.36 0.14 255)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polyline
        fill="oklch(0.36 0.14 255 / 0.08)"
        stroke="none"
        points={`0,${h} ${points} ${w},${h}`}
      />
    </svg>
  );
}

function TeamSection() {
  return (
    <RoleSection
      eyebrow="For Teams"
      title="A locker room in the cloud."
      body="Create a team, invite players with a code, and build a shared roster. Coaches approve players, verify stats, and post announcements. Leaderboards keep the competitive edge every day."
      bullets={["Invite codes with coach approval", "Roster + announcements + leaderboards", "Compare teammates by any metric", "Verified stats with coach signature"]}
      icon={Users}
    />
  );
}

function CoachSection() {
  return (
    <RoleSection
      eyebrow="For Coaches"
      title="Manage the whole roster from one screen."
      body="Approve players, verify their metrics, assign workouts, post announcements, and export data as CSV. Coaches see who's on pace and who needs a push."
      bullets={["Verify player metrics with a badge", "Assign personalized workouts", "Track attendance and completion", "CSV export for parents and recruiters"]}
      icon={ClipboardList}
      flip
    />
  );
}

function ParentSection() {
  return (
    <RoleSection
      eyebrow="For Parents"
      title="See every child's progress at a glance."
      body="Manage multiple players in one account. Switch between children instantly. Never miss a milestone."
      bullets={["Link multiple player accounts", "One-tap switching between kids", "Weekly progress digest", "Direct message team coaches"]}
      icon={ShieldCheck}
    />
  );
}

function RoleSection({
  eyebrow,
  title,
  body,
  bullets,
  icon: Icon,
  flip,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  icon: typeof Users;
  flip?: boolean;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className={`grid gap-10 md:grid-cols-2 md:items-center ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={body} align="left" />
          <ul className="mt-6 space-y-2.5 text-sm">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card">
            <Icon className="absolute -right-6 -top-6 h-40 w-40 text-primary/10" strokeWidth={1.25} />
            <div className="relative grid gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-3">
                  <div>
                    <div className="text-sm font-semibold">Player #{i}</div>
                    <div className="text-xs text-muted-foreground">Exit velo · Pitch velo · 60 yd</div>
                  </div>
                  <div className="flex gap-2">
                    <Chip>82</Chip>
                    <Chip>74</Chip>
                    <Chip>7.4</Chip>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
      {children}
    </span>
  );
}

function ProgressSection() {
  return (
    <section className="border-y border-border bg-gradient-field py-20 text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        {[
          { icon: BarChart3, title: "Every metric charted", body: "Line charts, monthly deltas, and PR flags for every stat you log." },
          { icon: Trophy, title: "Achievements & levels", body: "XP for workouts, streaks, PRs, and goals. Level up as you progress." },
          { icon: LineChart, title: "Compare with peers", body: "See how you stack up against your team, your age, and verified national averages." },
        ].map((c) => (
          <div key={c.title} className="rounded-3xl bg-white/10 p-6 backdrop-blur">
            <c.icon className="h-8 w-8" />
            <h3 className="mt-4 text-lg font-bold">{c.title}</h3>
            <p className="mt-1 text-sm opacity-85">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const FAQS = [
  { q: "Is Diamond Development free?", a: "Yes — the core dashboard, training program, metric tracking, and team features are free forever." },
  { q: "What ages is it for?", a: "Players ages 8 through college. The training programs auto-adjust for age, size, and current skill level." },
  { q: "Do parents need their own accounts?", a: "Parents can create their own account and link to their child's profile to monitor progress without needing the player's password." },
  { q: "Can coaches verify stats?", a: "Yes. Coaches on your team can verify any metric you log. Verified stats get a blue badge and appear in a separate leaderboard." },
  { q: "Does it replace tools like HitTrax or Rapsodo?", a: "No — those measure the ball. Diamond Development is where you log and track those measurements over time, plus everything else that matters." },
];

function FAQ() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="FAQ"
        title="Common questions"
        subtitle="Everything you need to know before you sign up."
      />
      <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
        {FAQS.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
              {f.q}
              <span className="ml-4 text-primary transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 text-center text-primary-foreground shadow-glow md:p-16">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(circle_at_15%_20%,white_0,transparent_40%),radial-gradient(circle_at_85%_80%,white_0,transparent_40%)]" />
        <h2 className="relative text-3xl font-black md:text-4xl">Ready to track every rep?</h2>
        <p className="relative mx-auto mt-3 max-w-xl text-white/85">
          Join players building the habits that matter. Free forever. No credit card.
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link to="/auth">Create your account</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
            <Link to="/resources">Read the guides</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">{title}</h2>
      {subtitle && (
        <p className={`mt-3 text-base text-muted-foreground ${align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
