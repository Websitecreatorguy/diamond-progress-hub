import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  Images,
  LayoutTemplate,
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

import { Eyebrow, SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { CONTACT, PROJECTS, REASONS, SERVICES, STARTER_FEATURES, STEPS } from "@/lib/site";

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
  LayoutTemplate,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diamond Development | Websites for Local Businesses" },
      {
        name: "description",
        content:
          "Modern, professional websites for local businesses starting at $45. Custom design, mobile-friendly, and built specifically for your business.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Diamond Development | Websites for Local Businesses" },
      {
        property: "og:description",
        content:
          "Modern, professional websites for local businesses starting at $45. Mobile-friendly and built for your business.",
      },
      { name: "twitter:title", content: "Diamond Development | Websites for Local Businesses" },
      {
        name: "twitter:description",
        content:
          "Modern, professional websites for local businesses starting at $45.",
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
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_1fr]">
          <div className="rise-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-brand)]" />
              Now accepting new projects
            </span>
            <h1 className="mt-7 text-[2.75rem] leading-[1.02] sm:text-[3.75rem]">
              Websites That Make Your Business Look{" "}
              <span className="text-gradient-brand">Legit.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              I design modern, professional websites for local businesses — without the
              traditional agency price tag.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-xl px-7 text-base">
                <Link to="/contact">
                  Get Your Website <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-xl border-border bg-card px-7 text-base"
              >
                <Link to="/portfolio">See My Work</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[var(--accent-brand)]" /> Starting at $45
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[var(--accent-brand)]" /> Mobile friendly
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[var(--accent-brand)]" /> Built for your business
              </span>
            </div>
          </div>

          <BrowserMockup />
        </div>
      </section>

      {/* Services */}
      <Section
        eyebrow="Services"
        title={
          <>
            Everything Your
            <br className="hidden sm:block" /> Business Needs Online
          </>
        }
        description="From simple business sites to full custom projects — I've got you covered."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            return (
              <div
                key={s.slug}
                className="group rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-lift"
              >
                <div className="bg-gradient-brand grid h-12 w-12 place-items-center rounded-xl text-white shadow-soft">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
                <Link
                  to="/services"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-brand)]"
                >
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Work */}
      <section className="border-y border-border/60 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="text-center">
            <Eyebrow>Portfolio</Eyebrow>
            <h2 className="mt-5 text-4xl sm:text-5xl">My Work</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Projects and websites will appear here as Diamond Development grows.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.length > 0
              ? PROJECTS.map((p) => (
                  <div
                    key={p.name}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
                  >
                    <img
                      src={p.image}
                      alt={`${p.name} website`}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {p.category}
                      </p>
                      <h3 className="mt-2 text-lg font-bold">{p.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-brand)]"
                        >
                          View website <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              : [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
                  >
                    <div className="bg-gradient-wash grid aspect-[16/10] w-full place-items-center border-b border-border/60">
                      <div className="text-center">
                        <LayoutTemplate className="mx-auto h-7 w-7 text-muted-foreground/60" />
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          Project slot
                        </p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-base font-bold">Coming soon</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        This space is reserved for a real client website.
                      </p>
                    </div>
                  </div>
                ))}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            This section is updated as soon as the first real project is completed.
          </p>
        </div>
      </section>

      {/* Process */}
      <Section
        eyebrow="How It Works"
        title="From Idea to Website in 4 Steps"
        description="A simple, transparent process from start to launch."
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-border bg-card p-7 shadow-soft"
            >
              <span className="text-gradient-brand font-display text-3xl font-extrabold">
                0{step.number}
              </span>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why work with me */}
      <section className="border-y border-border/60 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="text-center">
            <Eyebrow>Why Me</Eyebrow>
            <h2 className="mt-5 text-4xl sm:text-5xl">Why Work With Me</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((r) => {
              const Icon = ICONS[r.icon] ?? Check;
              return (
                <div
                  key={r.title}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-[var(--accent-brand)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold">{r.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {r.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="mt-5 text-4xl sm:text-5xl">
            Professional Doesn't
            <br className="hidden sm:block" /> Have to Mean Expensive.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Transparent pricing with no hidden fees. Get a professional website without breaking
            the bank.
          </p>
        </div>

        <div className="bg-gradient-wash mx-auto mt-12 max-w-3xl rounded-3xl border border-[var(--accent-brand)]/25 p-8 shadow-lift sm:p-10">
          <span className="bg-gradient-brand inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white">
            <Sparkles className="h-3.5 w-3.5" /> Most Popular
          </span>
          <h3 className="mt-6 text-2xl font-bold">Starter Website</h3>
          <p className="mt-3 flex items-baseline gap-3">
            <span className="text-sm font-semibold text-muted-foreground">Starting at</span>
            <span className="font-display text-5xl font-extrabold">$45</span>
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {STARTER_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {f}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="mt-9 h-13 w-full rounded-xl text-base">
            <Link to="/contact">
              Start a Project <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Need something more advanced?{" "}
          <Link to="/contact" className="font-semibold text-[var(--accent-brand)]">
            Contact me for a custom quote.
          </Link>
        </p>
      </section>

      {/* About */}
      <section className="border-y border-border/60 bg-secondary/50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div>
            <Eyebrow>About</Eyebrow>
            <h2 className="mt-5 text-4xl sm:text-5xl">
              Small Business Websites Without the Agency Hassle
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
              Diamond Development creates clean, modern websites for small and local businesses.
              The goal is simple: make getting a professional online presence easier and more
              affordable.
            </p>
            <div className="mt-8 space-y-6">
              {[
                {
                  icon: Target,
                  title: "Built Around You",
                  body: "Every website is designed specifically for your business — not from a template.",
                },
                {
                  icon: Building2,
                  title: "Local Business Focused",
                  body: "I understand what small and local businesses need to show online.",
                },
                {
                  icon: Zap,
                  title: "Fast & Affordable",
                  body: "A professional website without long timelines or agency costs.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="bg-gradient-brand grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-ink rounded-3xl p-8 text-white shadow-lift sm:p-10">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10">
              <Sparkles className="h-5 w-5 text-[var(--accent-brand)]" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">Diamond Development</h3>
            <p className="mt-1.5 text-sm text-white/60">Modern websites for local businesses.</p>
            <dl className="mt-8 divide-y divide-white/10 text-sm">
              {[
                ["Starting price", "$45"],
                ["Design style", "Modern & clean"],
                ["Mobile friendly", "Always"],
                ["Built for", "Your business"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-4">
                  <dt className="text-white/55">{k}</dt>
                  <dd className="font-bold text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="bg-gradient-ink overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-14">
          <h2 className="mx-auto max-w-2xl text-4xl text-white sm:text-5xl">
            Let's Build Your Website.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/60">
            Tell me about your business and what you're looking for — I'll come back with a plan
            and a price.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="h-13 rounded-xl px-7 text-base">
              <Link to="/contact">Get a Website</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 rounded-xl border-white/25 bg-transparent px-7 text-base text-white hover:bg-white/10 hover:text-white"
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

function BrowserMockup() {
  return (
    <div className="relative hidden lg:block" aria-hidden="true">
      <div className="rounded-2xl border border-border bg-card shadow-lift">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-3/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          <span className="ml-4 h-5 flex-1 rounded-full bg-secondary" />
        </div>
        <div className="p-6">
          <div className="bg-gradient-brand h-36 rounded-xl opacity-90" />
          <div className="mt-5 grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="h-8 w-8 rounded-lg bg-accent" />
                <div className="mt-3 h-2 w-full rounded-full bg-secondary" />
                <div className="mt-2 h-2 w-2/3 rounded-full bg-secondary" />
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2.5">
            <div className="h-2.5 w-full rounded-full bg-secondary" />
            <div className="h-2.5 w-4/5 rounded-full bg-secondary" />
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-8 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-lift">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-success/12 text-success">
          <Check className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold">Mobile Ready</p>
          <p className="text-xs text-muted-foreground">Responsive design</p>
        </div>
      </div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
      <div className="text-center">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="mt-5 text-4xl sm:text-5xl">{title}</h2>
        {description && (
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="mt-12">{children}</div>
    </section>
  );
}
