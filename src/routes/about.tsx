import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeader, SiteLayout } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/routes/index";
import { buildHead } from "@/lib/seo-head";
import { CONTACT, REASONS } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () =>
    buildHead({
      title: "About — Christian Yoo Web Design",
      description:
        "I build modern, affordable websites for local businesses. You work directly with me from the first message to launch.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About"
        title="One person, building websites for local businesses."
        description="No agency layers, no account managers. You message me, I build your site, and I make the changes you ask for."
      />

      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            A lot of small businesses are running on a website that's ten years old, hard to read
            on a phone, or missing entirely. Meanwhile, most people looking for a restaurant, a
            mechanic, or a local service check online first.
          </p>
          <p>
            That's the gap I work in. I build clean, modern websites at prices that make sense for
            a small business — starting at $45 — and I keep the process simple: you tell me about
            your business, I build it, you review it, and we launch when you're happy.
          </p>
          <p>
            Because it's just me, you always know who you're talking to. Send a message, and it
            comes straight to me.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {REASONS.map((r) => {
            const Icon = ICONS[r.icon];
            return (
              <div key={r.title} className="rounded-2xl border border-border bg-card p-6">
                {Icon && (
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <h2 className="mt-4 font-semibold">{r.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {r.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 rounded-3xl border border-border bg-secondary/40 p-8 text-center sm:p-10">
          <h2 className="text-2xl font-semibold">Let's talk about your website</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Email or text me, or send the project form and I'll get back to you.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-6">
              <Link to="/contact">Get a Website</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6">
              <a href={CONTACT.smsHref}>Text {CONTACT.phone}</a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
