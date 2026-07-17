import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, User, Dumbbell, LineChart, Ruler, LogOut } from "lucide-react";
import { type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LOGO_URL } from "@/components/logo";

const nav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/training", label: "Training", icon: Dumbbell },
  { to: "/progress", label: "Progress", icon: Ruler },
  { to: "/charts", label: "Charts", icon: LineChart },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img
              src={LOGO_URL}
              alt="Diamond Development"
              width={32}
              height={32}
              className="rounded-lg shadow-glow"
            />
            <div className="leading-tight">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Diamond Dev
              </div>
              <div className="text-sm font-semibold">{title}</div>
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-5">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
