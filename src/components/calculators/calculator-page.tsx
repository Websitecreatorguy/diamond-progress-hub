import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Card } from "@/components/ui/card";
import { MetricCalculator } from "@/components/calculators/metric-calculator";
import { BmiCalculator } from "@/components/calculators/bmi-calculator";
import { AgeCalculator } from "@/components/calculators/age-calculator";
import { CALCULATORS, calculatorBySlug, type Calculator } from "@/lib/calculators";
import { METRICS } from "@/lib/benchmarks";

export function CalculatorPage({ calculator }: { calculator: Calculator }) {
  const c = calculator;
  const related = c.related
    .map((s) => calculatorBySlug(s))
    .filter(Boolean) as Calculator[];

  return (
    <MarketingLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/calculators" className="hover:text-foreground">Calculators</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate">{c.name}</span>
        </nav>

        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          Free baseball calculator
        </div>
        <h1 className="mt-2 text-3xl font-black leading-tight md:text-4xl">{c.h1}</h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground/85">{c.intro}</p>

        <div className="mt-8">
          {c.kind === "metric" && c.metric ? (
            <MetricCalculator metricKey={c.metric} />
          ) : c.kind === "bmi" ? (
            <BmiCalculator />
          ) : (
            <AgeCalculator />
          )}
        </div>

        {c.kind === "metric" && c.metric && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight">
              How {METRICS[c.metric].label.toLowerCase()} is measured
            </h2>
            <p className="mt-3 leading-relaxed text-foreground/85">
              {METRICS[c.metric].howMeasured}
            </p>
            <h3 className="mt-6 text-lg font-semibold">Getting a number you can trust</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Test in the same conditions every time: same device, same surface, same warm-up, and
              the same time of day. Record every session so your trend line, not a single lucky
              reading, drives your training decisions.
            </p>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
            {c.faqs.map((f, i) => (
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

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">Related calculators</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} to="/calculators/$slug" params={{ slug: r.slug }}>
                  <Card className="rounded-2xl border-border p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
                    <div className="font-semibold">{r.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {r.description}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-xl font-bold">All baseball calculators</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {CALCULATORS.filter((x) => x.slug !== c.slug).map((x) => (
              <li key={x.slug}>
                <Link
                  to="/calculators/$slug"
                  params={{ slug: x.slug }}
                  className="text-sm text-primary hover:underline"
                >
                  {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 rounded-3xl bg-gradient-primary p-8 text-center text-primary-foreground shadow-glow">
          <h2 className="text-2xl font-black">Save your results and track progress</h2>
          <p className="mt-2 opacity-90">
            Log every test, watch your percentile climb, and follow a personalized weekly program.
          </p>
          <Link
            to="/auth"
            className="mt-4 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
          >
            Start free
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
