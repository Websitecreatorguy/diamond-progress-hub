import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Card } from "@/components/ui/card";
import { AGES, chartData, formatValue, METRICS } from "@/lib/benchmarks";
import { STAT_PAGES, type StatPage } from "@/lib/stat-pages";

export function StatByAgePage({ page }: { page: StatPage }) {
  const metric = METRICS[page.metric];
  const data = chartData(metric);

  return (
    <MarketingLayout>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/baseball-stats" className="hover:text-foreground">Baseball stats</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate">{metric.label}</span>
        </nav>

        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          Benchmarks
        </div>
        <h1 className="mt-2 text-3xl font-black leading-tight md:text-4xl">{page.h1}</h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground/85">{page.intro}</p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">
            {metric.label} by age chart (7-18)
          </h2>
          <Card className="mt-4 rounded-2xl border-border p-4 shadow-card">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="age" ticks={AGES as unknown as number[]} fontSize={12} stroke="var(--color-muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--color-muted-foreground)" domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(v: number, n: string) => [`${v} ${metric.unit}`, n]}
                    labelFormatter={(l) => `Age ${l}`}
                  />
                  <Line type="monotone" dataKey="average" name="Average" stroke="var(--color-primary-glow)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="elite" name="Elite" stroke="var(--color-muted-foreground)" strokeDasharray="5 4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">
            Average {metric.label.toLowerCase()} by age table
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Age</th>
                  <th className="px-4 py-3 font-semibold">Average</th>
                  <th className="px-4 py-3 font-semibold">Elite (90th)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {AGES.map((a) => (
                  <tr key={a}>
                    <td className="px-4 py-2.5 font-medium">{a}</td>
                    <td className="px-4 py-2.5">{formatValue(metric, metric.avg[a])}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">
                      {formatValue(metric, metric.elite[a])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">How to measure it correctly</h2>
          <p className="mt-3 leading-relaxed text-foreground/85">{metric.howMeasured}</p>
          <h3 className="mt-6 text-lg font-semibold">Reading the numbers the right way</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Averages describe a population, not a ceiling. Two players at the same age can be a
            full year apart in physical maturity, so treat these numbers as a starting reference
            point and focus on your own rate of improvement.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">How to improve</h2>
          <div className="mt-4 space-y-3">
            {page.improve.map((tip, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <h3 className="text-base font-semibold">{tip.heading}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-secondary/40 p-5">
          <h2 className="text-lg font-bold">Check your own percentile</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {page.calculators.map((slug) => (
              <li key={slug}>
                <Link
                  to="/calculators/$slug"
                  params={{ slug }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
            {page.faqs.map((f, i) => (
              <details key={i} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                  {f.q}
                  <span className="text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold">More baseball benchmarks</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {STAT_PAGES.filter((p) => p.path !== page.path).map((p) => (
              <li key={p.path}>
                <a href={p.path} className="text-sm text-primary hover:underline">
                  {p.h1}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 rounded-3xl bg-gradient-primary p-8 text-center text-primary-foreground shadow-glow">
          <h2 className="text-2xl font-black">Track your numbers month over month</h2>
          <p className="mt-2 opacity-90">
            Diamond Development logs every test, charts your trend, and builds your weekly plan.
          </p>
          <Link
            to="/auth"
            className="mt-4 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
          >
            Start free
          </Link>
        </div>
      </article>
    </MarketingLayout>
  );
}
