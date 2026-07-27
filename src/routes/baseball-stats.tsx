import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Card } from "@/components/ui/card";
import { METRICS } from "@/lib/benchmarks";
import { STAT_PAGES, PITCH_AGE_SLUGS } from "@/lib/stat-pages";
import { CALCULATORS } from "@/lib/calculators";
import { breadcrumbLd, buildHead } from "@/lib/seo-head";

const TITLE = "Baseball Statistics by Age — Averages, Percentiles & Charts | Diamond Development";
const DESCRIPTION =
  "Age-by-age baseball benchmarks for pitching velocity, exit velocity, throwing velocity, height, weight, 60-yard dash, and vertical jump, ages 7 to 18.";

export const Route = createFileRoute("/baseball-stats")({
  head: () =>
    buildHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/baseball-stats",
      jsonLd: [
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Baseball stats", path: "/baseball-stats" },
        ]),
      ],
    }),
  component: StatsHub,
});

function StatsHub() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          Benchmarks
        </div>
        <h1 className="mt-2 text-4xl font-black leading-tight md:text-5xl">
          Baseball Statistics by Age
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Average and elite marks for every key baseball metric from age 7 through 18, with charts,
          tables, and free percentile calculators.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">Benchmark pages</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              { path: "/pitching-velocity-by-age", h1: "Average Pitching Velocity by Age", d: "Fastball velocity benchmarks from 7U through high school." },
              { path: "/average-exit-velocity-by-age", h1: "Average Exit Velocity by Age", d: "Exit velocity averages and elite marks by age." },
              ...STAT_PAGES.map((p) => ({ path: p.path, h1: p.h1, d: p.description })),
            ].map((p) => (
              <a key={p.path} href={p.path}>
                <Card className="h-full rounded-2xl border-border p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
                  <h3 className="font-semibold">{p.h1}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.d}</p>
                </Card>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight">
            Average pitching velocity by single age
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PITCH_AGE_SLUGS.map((slug) => {
              const age = Number(slug.split("-")[0]);
              return (
                <Link
                  key={slug}
                  to="/average-pitching-velocity/$age"
                  params={{ age: slug }}
                  className="rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Average pitching velocity for {age}-year-olds
                  <span className="ml-2 text-muted-foreground">
                    {METRICS["pitching-velocity"].avg[age]} mph
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight">Free calculators</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {CALCULATORS.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/calculators/$slug"
                  params={{ slug: c.slug }}
                  className="text-sm text-primary hover:underline"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MarketingLayout>
  );
}
