import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator as CalcIcon } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Card } from "@/components/ui/card";
import { CALCULATORS } from "@/lib/calculators";
import { STAT_PAGES } from "@/lib/stat-pages";
import { breadcrumbLd, buildHead } from "@/lib/seo-head";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Free Baseball Calculators — Velocity, Height, Weight & Age | Diamond Development";
const DESCRIPTION =
  "Free baseball calculators for pitching velocity, exit velocity, height, weight, BMI, 60-yard dash, vertical jump, and league age. Instant percentiles by age.";

export const Route = createFileRoute("/calculators/")({
  head: () =>
    buildHead({
      title: TITLE,
      description: DESCRIPTION,
      path: "/calculators",
      jsonLd: [
        {
          "@type": "ItemList",
          name: "Baseball calculators",
          itemListElement: CALCULATORS.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            url: `${SITE_URL}/calculators/${c.slug}`,
          })),
        },
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
        ]),
      ],
    }),
  component: CalculatorsIndex,
});

function CalculatorsIndex() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          Free tools
        </div>
        <h1 className="mt-2 text-4xl font-black leading-tight md:text-5xl">
          Baseball Calculators
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Enter your numbers and instantly see how you rank against players your age. Every
          calculator is free, mobile-friendly, and built on age-by-age benchmarks from ages 7
          through 18.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CALCULATORS.map((c) => (
            <Link key={c.slug} to="/calculators/$slug" params={{ slug: c.slug }}>
              <Card className="h-full rounded-2xl border-border p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <CalcIcon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-base font-bold">{c.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{c.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Baseball benchmarks by age</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Full age-by-age reference tables and charts behind the calculators.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {STAT_PAGES.map((p) => (
              <li key={p.path}>
                <a href={p.path} className="text-sm text-primary hover:underline">
                  {p.h1}
                </a>
              </li>
            ))}
            <li>
              <a href="/average-exit-velocity-by-age" className="text-sm text-primary hover:underline">
                Average Exit Velocity by Age
              </a>
            </li>
            <li>
              <a href="/pitching-velocity-by-age" className="text-sm text-primary hover:underline">
                Average Pitching Velocity by Age
              </a>
            </li>
          </ul>
        </section>
      </div>
    </MarketingLayout>
  );
}
