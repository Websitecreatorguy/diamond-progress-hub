import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  Images,
  MessageCircle,
  MousePointerClick,
  Palette,
  PencilRuler,
  Phone,
  RefreshCw,
  Smartphone,
  Sparkles,
  Tag,
  Target,
  Trophy,
  UtensilsCrossed,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { CONTACT, REASONS, SERVICES, STARTER_FEATURES, STEPS } from "@/lib/site";

export const ICONS: Record<string, LucideIcon> = {
  Building2,
  UtensilsCrossed,
  Wrench,
  Images,
  Trophy,
  MousePointerClick,
  RefreshCw,
  Sparkles,
  Tag,
  Palette,
  Smartphone,
  Zap,
  MessageCircle,
  PencilRuler,
  Target,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Christian Yoo Web Design — Websites for Local Businesses" },
      {
        name: "description",
        content:
          "Modern, mobile-friendly websites for restaurants, auto shops, sports teams, and local businesses. Starter websites from $45.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Christian Yoo Web Design — Websites for Local Businesses" },
      {
        property: "og:description",
        content:
          "Modern, mobile-friendly websites for restaurants, auto shops, sports teams, and local businesses. Starter websites from $45.",
      },
      { name: "twitter:title", content: "Christian Yoo Web Design — Websites for Local Businesses" },
      {
        name: "twitter:description",
        content:
          "Modern, mobile-friendly websites for restaurants, auto shops, sports teams, and local businesses.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-wash relative overflow-hidden border-b border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="rise-in max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Websites for local businesses
            </span>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.03] sm:text-6xl">
              Your Business Deserves a Better Website.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              I design modern, mobile-friendly websites for local businesses at an affordable
              price.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-full px-7 text-base">
                <Link to="/contact">
                  Get a Website <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-full px-7 text-base"
              >
                <Link to="/portfolio">View My Work</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Simple pricing. Fast turnaround. Built for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <Section
        eyebrow="Services"
        title="What I build"
        description="Pick the type of site that fits your business — or tell me about something different."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            return (
              <div
                key={s.slug}
                className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent">
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-8">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/services">
              See all services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Process */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <h2 className="text-3xl font-semibold sm:text-4xl">How It Works</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Four straightforward steps from first message to a live website.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number} className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary font-display text-sm font-semibold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why work with me */}
      <Section eyebrow="Why me" title="Why Work With Me">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r) => {
            const Icon = ICONS[r.icon] ?? Check;
            return (
              <div
                key={r.title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent-brand)]" />
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">{r.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {r.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Pricing teaser */}
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">Simple, honest pricing</h2>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              Starter websites begin at $45. Bigger or more custom projects get a quote based on
              what you actually need — nothing is charged automatically.
            </p>
            <Button asChild size="lg" className="mt-7 h-12 rounded-full px-6">
              <Link to="/pricing">See pricing</Link>
            </Button>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-lift">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Starter Website
            </p>
            <p className="mt-3 font-display text-4xl font-semibold">
              From $45
            </p>
            <ul className="mt-6 space-y-3">
              {STARTER_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="bg-gradient-ink overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-14">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold text-primary-foreground sm:text-4xl">
            Ready for a website that actually looks the part?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-primary-foreground/70">
            Tell me about your business and I'll come back with a plan and a price.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="h-13 rounded-full px-7 text-base">
              <Link to="/contact">Get a Website</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 rounded-full border-primary-foreground/30 bg-transparent px-7 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={CONTACT.phoneHref}>
                <Phone className="mr-2 h-4 w-4" /> {CONTACT.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 max-w-xl text-muted-foreground">{description}</p>}
      <div className="mt-10">{children}</div>
    </section>
  );
}
