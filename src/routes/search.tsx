import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Search as SearchIcon } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { searchSite } from "@/lib/search-index";
import { buildHead } from "@/lib/seo-head";

const schema = z.object({ q: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(schema),
  head: () => ({
    ...buildHead({
      title: "Search — Players, Teams, Calculators & Baseball Stats | Diamond Development",
      description:
        "Search Diamond Development for calculators, baseball statistics by age, training articles, teams, and player tools.",
      path: "/search",
    }),
    meta: [
      ...buildHead({
        title: "Search — Players, Teams, Calculators & Baseball Stats | Diamond Development",
        description:
          "Search Diamond Development for calculators, baseball statistics by age, training articles, teams, and player tools.",
        path: "/search",
      }).meta,
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const results = searchSite(q);

  return (
    <MarketingLayout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-black md:text-4xl">Search Diamond Development</h1>
        <p className="mt-2 text-muted-foreground">
          Players, teams, calculators, statistics, and articles.
        </p>

        <div className="relative mt-6">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus
            value={q}
            onChange={(e) =>
              navigate({ search: { q: e.target.value }, replace: true })
            }
            placeholder="Try 'exit velocity', '12 year old pitching', 'teams'"
            className="h-12 pl-9"
            aria-label="Search"
          />
        </div>

        <div className="mt-8 space-y-3">
          {q.trim() === "" ? (
            <p className="text-sm text-muted-foreground">Start typing to search the site.</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No matches for &ldquo;{q}&rdquo;. Try a metric name or an age.
            </p>
          ) : (
            results.map((r) => (
              <Link key={r.href} to={r.href}>
                <Card className="rounded-2xl border-border p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                    {r.type}
                  </div>
                  <div className="mt-0.5 font-semibold">{r.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {r.description}
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </MarketingLayout>
  );
}
