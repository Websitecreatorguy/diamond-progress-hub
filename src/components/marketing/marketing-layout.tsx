import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo, LOGO_URL } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/teams", label: "Teams" },
  { to: "/calculators", label: "Calculators" },
  { to: "/baseball-stats", label: "Stats" },
  { to: "/leaderboards", label: "Leaderboards" },
  { to: "/resources", label: "Resources" },
] as const;

export function MarketingLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSignedIn(!!s);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center">
            <Logo size={34} />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/search"
              aria-label="Search"
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </Link>
            {signedIn ? (
              <Button asChild size="sm" className="bg-gradient-primary shadow-glow">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-primary shadow-glow">
                  <Link to="/auth">Get started</Link>
                </Button>
              </>
            )}
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-border md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
              <Link
                to="/search"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                Search
              </Link>
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                {signedIn ? (
                  <Button asChild className="flex-1 bg-gradient-primary">
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="flex-1">
                      <Link to="/auth" onClick={() => setOpen(false)}>
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild className="flex-1 bg-gradient-primary">
                      <Link to="/auth" onClick={() => setOpen(false)}>
                        Get started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="mt-24 border-t border-border bg-gradient-field text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src={LOGO_URL}
                alt="Diamond Development"
                width={44}
                height={44}
                className="rounded-xl"
              />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
                  Diamond
                </div>
                <div className="text-lg font-bold">Development</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm opacity-80">
              The training and analytics platform built for the next generation of
              baseball players, coaches, and families.
            </p>
          </div>
          <FooterCol
            title="Platform"
            links={[
              { to: "/features", label: "Features" },
              { to: "/teams", label: "Teams" },
              { to: "/calculators", label: "Calculators" },
  { to: "/baseball-stats", label: "Stats" },
  { to: "/leaderboards", label: "Leaderboards" },
              { to: "/dashboard", label: "Player dashboard" },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { to: "/calculators", label: "Baseball calculators" },
              { to: "/baseball-stats", label: "Stats by age" },
              { to: "/resources", label: "All resources" },
              { to: "/resources/average-exit-velocity-by-age", label: "Exit velo by age" },
              { to: "/resources/average-pitching-velocity-by-age", label: "Pitch velo by age" },
              { to: "/resources/baseball-workout-plans", label: "Workout plans" },
            ]}
          />
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs opacity-70 sm:flex-row sm:items-center sm:px-6">
            <p>© {new Date().getFullYear()} Diamond Development. All rights reserved.</p>
            <p>Built for players who put in the work.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
        {title}
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="opacity-90 transition-opacity hover:opacity-100 hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
