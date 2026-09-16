import { Link } from "@tanstack/react-router";
import { ChevronRight, Clock } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Card } from "@/components/ui/card";
import { ARTICLES, type Article } from "@/lib/resources";

export function ArticleView({ article }: { article: Article }) {
  const a = article;
  const related = (a.related ?? [])
    .map((slug) => ARTICLES.find((x) => x.slug === slug))
    .filter(Boolean) as Article[];

  return (
    <MarketingLayout>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <nav className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/resources" className="hover:text-foreground">Resources</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate">{a.category}</span>
        </nav>

        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          {a.category}
        </div>
        <h1 className="mt-2 text-3xl font-black leading-tight md:text-4xl">{a.h1}</h1>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {a.readMinutes} min read
          </span>
          <span>
            Updated{" "}
            {new Date(a.updated).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <p className="mt-6 text-lg leading-relaxed text-foreground/85">{a.intro}</p>

        <div className="mt-10 space-y-10">
          {a.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-2xl font-bold tracking-tight">{s.heading}</h2>
              {s.body && <p className="mt-3 leading-relaxed text-foreground/85">{s.body}</p>}
              {s.sub && (
                <div className="mt-5 space-y-4">
                  {s.sub.map((sub, j) => (
                    <div key={j} className="rounded-xl border border-border bg-card p-4 shadow-card">
                      <h3 className="text-base font-semibold">{sub.heading}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{sub.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card">
            {a.faqs.map((f, i) => (
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
          <section className="mt-14">
            <h2 className="text-xl font-bold">Related resources</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} to="/resources/$slug" params={{ slug: r.slug }}>
                  <Card className="rounded-2xl border-border p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                      {r.category}
                    </div>
                    <div className="mt-1 font-semibold">{r.h1}</div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {r.description}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 rounded-3xl bg-gradient-primary p-8 text-center text-primary-foreground shadow-glow">
          <h2 className="text-2xl font-black">Track your own progress</h2>
          <p className="mt-2 opacity-90">
            Log your metrics, follow a personalized program, and see your gains over time.
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

/**
 * Slugs that also have a top-level canonical URL. When set, the /resources/[slug]
 * page defers its canonical/og:url to the top-level route so search engines
 * consolidate signals on the primary URL.
 */
export const TOP_LEVEL_ARTICLE_PATHS: Record<string, string> = {
  "average-exit-velocity-by-age": "/average-exit-velocity-by-age",
  "average-pitching-velocity-by-age": "/pitching-velocity-by-age",
  "average-bat-speed-by-age": "/average-bat-speed-by-age",
  "average-pop-time-by-age": "/average-pop-time-by-age",
  "baseball-workout-plans": "/baseball-workout-plans",
  "baseball-strength-training": "/baseball-strength-training",
  "baseball-nutrition": "/baseball-nutrition",
  "how-to-increase-exit-velocity": "/how-to-increase-exit-velocity",
  "how-to-throw-harder": "/how-to-throw-harder",
};

export function articleHead(slug: string, article: Article, canonicalPath: string) {
  const url = `https://diamond-progress-hub.lovable.app${canonicalPath}`;
  return {
    meta: [
      { title: article.title },
      { name: "description", content: article.description },
      { property: "og:title", content: article.title },
      { property: "og:description", content: article.description },
      { property: "og:url", content: url },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json" as const,
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.h1,
          description: article.description,
          datePublished: article.updated,
          dateModified: article.updated,
          author: { "@type": "Organization", name: "Diamond Development" },
          publisher: { "@type": "Organization", name: "Diamond Development" },
          mainEntityOfPage: url,
        }),
      },
      {
        type: "application/ld+json" as const,
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  };
}
