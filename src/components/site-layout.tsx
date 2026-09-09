import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X, Mail, Phone } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CONTACT, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Work" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button asChild size="lg" className="hidden h-11 rounded-xl px-5 sm:inline-flex">
              <Link to="/contact">
                Get a Website <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl border border-border lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                    "hover:bg-secondary data-[status=active]:bg-secondary",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild size="lg" className="mt-2 h-13 rounded-xl text-base">
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Get a Website
                </Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gradient-ink mt-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <Logo invert />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Modern websites for local businesses. Professional design without the traditional
              agency price tag.
            </p>
            <a
              className="mt-5 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
              href={`mailto:${CONTACT.primaryEmail}`}
            >
              <Mail className="h-4 w-4" />
              {CONTACT.primaryEmail}
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-white/70 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  className="flex items-center gap-2 break-all text-white/70 transition-colors hover:text-white"
                  href={`mailto:${CONTACT.primaryEmail}`}
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {CONTACT.primaryEmail}
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-2 break-all text-white/70 transition-colors hover:text-white"
                  href={`mailto:${CONTACT.secondaryEmail}`}
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {CONTACT.secondaryEmail}
                </a>
              </li>
              <li>
                <a
                  className="flex items-center gap-2 text-white/70 transition-colors hover:text-white"
                  href={CONTACT.phoneHref}
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {CONTACT.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-5 py-6 text-xs text-white/50 sm:px-8">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-foreground">
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-gradient-wash relative overflow-hidden border-b border-border/60">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
