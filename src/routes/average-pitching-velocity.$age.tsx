import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Card } from "@/components/ui/card";
import { MetricCalculator } from "@/components/calculators/metric-calculator";
import { METRICS, clampAge, formatValue } from "@/lib/benchmarks";
import { ageFromSlug, PITCH_AGE_SLUGS } from "@/lib/stat-pages";
import { breadcrumbLd, buildHead } from "@/lib/seo-head";

const metric = METRICS["pitching-velocity"];

function faqsFor(age: number) {
  const a = clampAge(age);
  return [
    {
      q: `What is the average pitching velocity for a ${a}-year-old?`,
      a: `The average fastball for a ${a}-year-old pitcher is about ${metric.avg[a]} mph. Elite ${a}-year-olds sit near ${metric.elite[a]} mph.`,
    },
    {
      q: `What is a good pitching velocity for a ${a}-year-old?`,
      a: `Anything at or above ${metric.avg[a]} mph is at or above average for age ${a}. Reaching roughly ${metric.elite[a]} mph puts a pitcher in the top 10 percent of their age group.`,
    },
    {
      q: `How can a ${a}-year-old throw harder safely?`,
      a: `Focus on clean mechanics, a structured long-toss program, full-body strength work, and strict pitch-count and rest rules. Chasing velocity without recovery is the fastest route to an arm injury at this age.`,
    },
    {
      q: `How much velocity should a ${a}-year-old gain per year?`,
      a: `Two to five mph per year is typical through growth and training. Larger jumps usually come during a growth spurt.`,
    },
  ];
}

export const Route = createFileRoute("/average-pitching-velocity/$age")({
  loader: ({ params }) => {
    const age = ageFromSlug(params.age);
    if (age === null) throw notFound();
    return { age };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.age;
    const title = `Average Pitching Velocity for ${a}-Year-Olds (${metric.avg[a]} mph) | Diamond Development`;
    const description = `The average pitching velocity for a ${a}-year-old is about ${metric.avg[a]} mph, with elite ${a}-year-olds near ${metric.elite[a]} mph. See percentiles, charts, and how to throw harder safely.`;
    const path = `/average-pitching-velocity/${params.age}`;
    return buildHead({
      title,
      description,
      path,
      type: "article",
      faqs: faqsFor(a),
      jsonLd: [
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Baseball stats", path: "/baseball-stats" },
          { name: `Pitching velocity for ${a}-year-olds`, path },
        ]),
      ],
    });
  },
  component: AgePage,
});

function AgePage() {
  const { age } = Route.useLoaderData();
  const a = clampAge(age);
  const faqs = faqsFor(a);

  return (
    <MarketingLayout>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/baseball-stats" className="hover:text-foreground">Baseball stats</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Age {a}</span>
        </nav>

        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          Benchmarks
        </div>
        <h1 className="mt-2 text-3xl font-black leading-tight md:text-4xl">
          Average Pitching Velocity for {a}-Year-Olds
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground/85">
          The average fastball velocity for a {a}-year-old pitcher is about{" "}
          <strong>{metric.avg[a]} mph</strong>. Elite {a}-year-olds throw close to{" "}
          <strong>{metric.elite[a]} mph</strong>. Below is what those numbers mean, how they are
          measured, and how to add velocity without putting the arm at risk.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label={`Average (age ${a})`} value={formatValue(metric, metric.avg[a])} />
          <Stat label="Elite (90th pct)" value={formatValue(metric, metric.elite[a])} />
          <Stat
            label="Typical yearly gain"
            value={a < 18 ? `+${Math.max(1, metric.avg[a + 1] - metric.avg[a])} mph` : "+2 mph"}
          />
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">
            Check a {a}-year-old&apos;s percentile
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter a velocity to see exactly where it ranks for age {a}.
          </p>
          <div className="mt-5">
            <MetricCalculator metricKey="pitching-velocity" defaultAge={a} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">
            Is {metric.avg[a]} mph good for a {a}-year-old?
          </h2>
          <p className="mt-3 leading-relaxed text-foreground/85">
            {metric.avg[a]} mph is right at the middle of the {a}-year-old population. Because
            physical maturity varies by more than a year at this age, two players with the same
            birthday can be 8-10 mph apart and both be developing normally. The number that matters
            most is your own trend line over the season.
          </p>
          <h3 className="mt-6 text-lg font-semibold">How velocity is measured</h3>
          <p className="mt-2 text-sm text-muted-foreground">{metric.howMeasured}</p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">
            How a {a}-year-old adds velocity safely
          </h2>
          <div className="mt-4 space-y-3">
            <Tip
              heading="Mechanics before effort"
              body="Efficient sequencing from the lower half is where most youth velocity is hiding. Film a bullpen from the side and the front every few weeks."
            />
            <Tip
              heading="Get stronger year round"
              body="Age-appropriate strength training, med-ball throws, and sprinting build the force production that shows up on the radar gun."
            />
            <Tip
              heading="Respect pitch counts and rest"
              body="Follow your league's pitch-count and rest rules, and take at least three consecutive months off from competitive pitching each year."
            />
            <Tip
              heading="Long toss with a plan"
              body="A structured build-up and pull-down program two to three times a week develops arm speed better than random throwing."
            />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
            {faqs.map((f, i) => (
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
          <h2 className="text-xl font-bold">Pitching velocity by age</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {PITCH_AGE_SLUGS.map((slug) => {
              const n = Number(slug.split("-")[0]);
              const active = n === a;
              return (
                <Link
                  key={slug}
                  to="/average-pitching-velocity/$age"
                  params={{ age: slug }}
                  className={
                    active
                      ? "rounded-full bg-gradient-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground"
                      : "rounded-full border border-border px-4 py-1.5 text-sm font-medium hover:bg-secondary"
                  }
                >
                  Age {n}
                </Link>
              );
            })}
          </div>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            <li>
              <Link to="/pitching-velocity-by-age" className="text-sm text-primary hover:underline">
                Full pitching velocity by age chart
              </Link>
            </li>
            <li>
              <Link
                to="/calculators/$slug"
                params={{ slug: "pitching-velocity-calculator" }}
                className="text-sm text-primary hover:underline"
              >
                Pitching Velocity Calculator
              </Link>
            </li>
            <li>
              <Link to="/how-to-throw-harder" className="text-sm text-primary hover:underline">
                How to throw harder (safely)
              </Link>
            </li>
            <li>
              <Link to="/average-throwing-velocity-by-age" className="text-sm text-primary hover:underline">
                Average throwing velocity by age
              </Link>
            </li>
          </ul>
        </section>

        <div className="mt-14 rounded-3xl bg-gradient-primary p-8 text-center text-primary-foreground shadow-glow">
          <h2 className="text-2xl font-black">Track velocity all season</h2>
          <p className="mt-2 opacity-90">
            Log every bullpen reading and watch the trend line, not one lucky radar gun day.
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-xl border-border p-4 shadow-card">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </Card>
  );
}

function Tip({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <h3 className="text-base font-semibold">{heading}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
