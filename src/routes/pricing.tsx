import { Link, createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { PageHeader, SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { buildHead } from "@/lib/seo-head";
import { CONTACT, STARTER_FEATURES } from "@/lib/site";

const FAQS = [
  {
    q: "How much does a website cost?",
    a: "Starter websites begin at $45. Larger projects with more pages or extra features are quoted individually after we talk about what you need.",
  },
  {
    q: "Do I get charged automatically on this site?",
    a: "No. There is no automatic payment here. You send a project request, we agree on the details and price first, and payment is handled separately.",
  },
  {
    q: "What is included in the starter website?",
    a: "A modern, mobile-friendly design with your business information, a services or menu section, contact details, and maps or social links when they're needed.",
  },
  {
    q: "How long does it take?",
    a: "It depends on the size of the site, but I work in short cycles so you see progress quickly and can give feedback along the way.",
  },
];

export const Route = createFileRoute("/pricing")({
  head: () =>
    buildHead({
      title: "Pricing — Affordable Websites From $45 | Christian Yoo Web Design",
      description:
        "Straightforward website pricing for small businesses. Starter websites from $45, with custom quotes for larger projects. No automatic charges.",
      path: "/pricing",
      faqs: FAQS,
    }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Pricing"
        title="Simple pricing, built for small businesses."
        description="No packages full of things you don't need. Start here, and we'll adjust the scope and price to match your project."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-3xl border-2 border-primary bg-card p-8 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Starter Website
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-semibold">$45</span>
              <span className="text-muted-foreground">starting price</span>
            </div>
            <ul className="mt-7 space-y-3">
              {STARTER_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 h-12 w-full rounded-full text-base">
              <Link to="/contact">Request a Website</Link>
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Sending a request doesn't charge you anything.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-secondary/40 p-8 sm:p-10">
            <h2 className="text-2xl font-semibold">Bigger project?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              More pages, online ordering links, booking, a full redesign, or something custom —
              those are quoted individually. Tell me what you have in mind and I'll give you a
              price before any work starts.
            </p>
            <div className="mt-7 space-y-2 text-sm">
              <a
                className="block font-medium text-primary hover:underline"
                href={`mailto:${CONTACT.primaryEmail}`}
              >
                {CONTACT.primaryEmail}
              </a>
              <a className="block font-medium text-primary hover:underline" href={CONTACT.phoneHref}>
                {CONTACT.phone}
              </a>
            </div>
            <Button asChild size="lg" variant="outline" className="mt-8 h-12 rounded-full px-6">
              <Link to="/contact">Get a custom quote</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-semibold sm:text-4xl">Questions</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {FAQS.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
