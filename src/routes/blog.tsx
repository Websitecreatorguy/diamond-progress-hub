import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Clock } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { Card } from "@/components/ui/card";
import { ARTICLES } from "@/lib/resources";
import { TOP_LEVEL_ARTICLE_PATHS } from "@/components/article-view";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Baseball Blog — Guides, Training & Benchmarks | Diamond Development" },
      {
        name: "description",
        content:
          "Deep dives on baseball training, velocity development, nutrition, and player development. Written by coaches for players, parents, and coaches.",
      },
      { property: "og:title", content: "Baseball Blog — Diamond Development" },
      {
        property: "og:description",
        content: "In-depth baseball training and development articles, updated regularly.",
      },
      { property: "og:url", content: SITE_URL + "/blog" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  // Feature Training and Guides content on the blog.
  const posts = ARTICLES.filter(
    (a) => a.category === "Training" || a.category === "Guides" || a.category === "Nutrition" || a.category === "Recovery",
  );

  return (
    <MarketingLayout>
      <section className="border-b border-border bg-gradient-field py-16 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <BookOpen className="mx-auto h-10 w-10 opacity-90" />
          <h1 className="mt-4 text-4xl font-black md:text-5xl">Baseball Blog</h1>
          <p className="mt-4 text-lg opacity-85">
            Guides, training breakdowns, and player development written by coaches.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((a) => {
            const path = TOP_LEVEL_ARTICLE_PATHS[a.slug] ?? `/resources/${a.slug}`;
            return (
              <a key={a.slug} href={path} className="block">
                <Card className="h-full rounded-2xl border-border p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary">
                    <span>{a.category}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" /> {a.readMinutes} min
                    </span>
                  </div>
                  <h2 className="mt-2 text-base font-semibold leading-snug">{a.h1}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.description}</p>
                </Card>
              </a>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link to="/resources" className="text-sm font-medium text-primary hover:underline">
            Browse all resources →
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
