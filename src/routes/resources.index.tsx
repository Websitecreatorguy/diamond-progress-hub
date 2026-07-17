import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Calculator, Dumbbell, Heart, LineChart, Ruler } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Card } from "@/components/ui/card";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/lib/resources";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      { title: "Baseball Resources & Guides — Diamond Development" },
      { name: "description", content: "Age-by-age benchmarks, training plans, calculators, and complete guides for baseball development from Little League to college." },
      { property: "og:title", content: "Baseball Resources & Guides" },
      { property: "og:description", content: "Free training plans, benchmarks, and calculators for baseball players." },
      { property: "og:url", content: SITE_URL + "/resources" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/resources" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Baseball Resources & Guides",
          url: SITE_URL + "/resources",
        }),
      },
    ],
  }),
  component: ResourcesIndex,
});

const CATEGORY_ICON = {
  Benchmarks: Ruler,
  Training: Dumbbell,
  Recovery: Heart,
  Nutrition: Heart,
  Calculators: Calculator,
  Guides: BookOpen,
} as const;

function ResourcesIndex() {
  return (
    <MarketingLayout>
      <section className="border-b border-border bg-gradient-field py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <LineChart className="mx-auto h-10 w-10 opacity-90" />
          <h1 className="mt-4 text-4xl font-black md:text-5xl">Baseball Resources</h1>
          <p className="mt-4 text-lg opacity-85">
            Benchmarks, training plans, calculators, and complete guides — free, no sign-in required.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {ARTICLE_CATEGORIES.map((cat) => {
          const items = ARTICLES.filter((a) => a.category === cat);
          if (items.length === 0) return null;
          const Icon = CATEGORY_ICON[cat];
          return (
            <section key={cat} className="mb-12">
              <div className="mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">{cat}</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((a) => (
                  <Link
                    key={a.slug}
                    to="/resources/$slug"
                    params={{ slug: a.slug }}
                    className="block"
                  >
                    <Card className="h-full rounded-2xl border-border p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
                      <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                        {a.category} · {a.readMinutes} min
                      </div>
                      <h3 className="mt-2 text-base font-semibold leading-snug">{a.h1}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                        {a.description}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </MarketingLayout>
  );
}
