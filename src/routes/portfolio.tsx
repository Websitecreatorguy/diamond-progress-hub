import { Link, createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

import { PageHeader, SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { buildHead } from "@/lib/seo-head";
import { PROJECTS } from "@/lib/site";

export const Route = createFileRoute("/portfolio")({
  head: () =>
    buildHead({
      title: "Portfolio — Recent Website Projects | Christian Yoo Web Design",
      description:
        "Recent website projects built for local businesses, restaurants, auto shops, and sports organizations.",
      path: "/portfolio",
    }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Portfolio"
        title="Recent projects."
        description="A look at the websites I've built. New work gets added here as projects launch."
      >
        <Button asChild size="lg" className="h-12 rounded-full px-6">
          <Link to="/contact">Get a Website</Link>
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {PROJECTS.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center sm:p-16">
            <h2 className="text-2xl font-semibold">Project showcase coming together</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              I'm putting the first project write-ups together now. If you'd like to see examples
              of my work in the meantime, send me a message and I'll share them with you directly.
            </p>
            <Button asChild size="lg" className="mt-7 h-12 rounded-full px-6">
              <Link to="/contact">Ask to see examples</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <article
                key={p.name}
                className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={`${p.name} website`}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {p.category}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">{p.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                    >
                      Visit site <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
