import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { PageHeader, SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/routes/index";
import { buildHead } from "@/lib/seo-head";
import { SERVICES, STEPS } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () =>
    buildHead({
      title: "Services — Websites for Restaurants, Auto Shops & Local Business",
      description:
        "Business websites, restaurant sites, auto shop pages, portfolios, team sites, landing pages, redesigns, and custom projects — built modern and mobile-friendly.",
      path: "/services",
    }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Services"
        title="Websites built around what your business actually needs."
        description="Every project starts the same way — a conversation about your business. Here are the kinds of sites I build most often."
      >
        <Button asChild size="lg" className="h-12 rounded-full px-6">
          <Link to="/contact">
            Get a Website <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6">
          <Link to="/pricing">See Pricing</Link>
        </Button>
      </PageHeader>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <div
                key={s.slug}
                className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                {Icon && (
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="text-3xl font-semibold sm:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number} className="rounded-2xl border border-border bg-card p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {step.number}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Every website includes</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Modern website design", "Mobile-friendly layout", "Clear contact details", "Changes based on your feedback"].map(
              (item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ),
            )}
          </ul>
          <Button asChild size="lg" className="mt-8 h-12 rounded-full px-6">
            <Link to="/contact">Start your project</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
