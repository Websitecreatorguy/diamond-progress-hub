import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Phone } from "lucide-react";

import { ProjectRequestForm } from "@/components/project-request-form";
import { PageHeader, SiteLayout } from "@/components/site-layout";
import { buildHead } from "@/lib/seo-head";
import { CONTACT } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () =>
    buildHead({
      title: "Contact — Request a Website | Christian Yoo Web Design",
      description:
        "Tell me about your business and what you need. Email, call, or text — or send the project request form and I'll get back to you.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Tell me about your business."
        description="Fill out the form below or reach out directly. Sending a request costs nothing and doesn't commit you to anything."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-4">
            <a
              href={`mailto:${CONTACT.primaryEmail}`}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                <span className="block text-sm font-semibold">Email</span>
                <span className="block break-all text-sm text-muted-foreground">
                  {CONTACT.primaryEmail}
                </span>
              </span>
            </a>
            <a
              href={`mailto:${CONTACT.secondaryEmail}`}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                <span className="block text-sm font-semibold">Second email</span>
                <span className="block break-all text-sm text-muted-foreground">
                  {CONTACT.secondaryEmail}
                </span>
              </span>
            </a>
            <a
              href={CONTACT.phoneHref}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                <span className="block text-sm font-semibold">Call</span>
                <span className="block text-sm text-muted-foreground">{CONTACT.phone}</span>
              </span>
            </a>
            <a
              href={CONTACT.smsHref}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                <span className="block text-sm font-semibold">Text</span>
                <span className="block text-sm text-muted-foreground">{CONTACT.phone}</span>
              </span>
            </a>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Project request</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The more detail you give me, the better the first version will be.
            </p>
            <div className="mt-7">
              <ProjectRequestForm />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
