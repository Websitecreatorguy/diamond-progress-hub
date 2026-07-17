import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, Clock } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Card } from "@/components/ui/card";
import { articleBySlug, ARTICLES, type Article } from "@/lib/resources";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => {
    const article = articleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Not found — Diamond Development" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const a = loaderData.article;
    const url = `${SITE_URL}/resources/${params.slug}`;
    return {
      meta: [
        { title: a.title },
        { name: "description", content: a.description },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.h1,
            description: a.description,
            datePublished: a.updated,
            dateModified: a.updated,
            author: { "@type": "Organization", name: "Diamond Development" },
            publisher: { "@type": "Organization", name: "Diamond Development" },
            mainEntityOfPage: url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: a.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: ArticlePage,
});

function NotFound() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-black">Article not found</h1>
        <p className="mt-3 text-muted-foreground">Browse all baseball guides in our resources hub.</p>
        <Link to="/resources" className="mt-6 inline-block text-primary underline">
          Back to resources
        </Link>
      </div>
    </MarketingLayout>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const a: Article = article;
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
          <span>Updated {new Date(a.updated).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
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
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">{r.category}</div>
                    <div className="mt-1 font-semibold">{r.h1}</div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.description}</div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 rounded-3xl bg-gradient-primary p-8 text-center text-primary-foreground shadow-glow">
          <h2 className="text-2xl font-black">Track your own progress</h2>
          <p className="mt-2 opacity-90">Log your metrics, follow a personalized program, and see your gains over time.</p>
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
