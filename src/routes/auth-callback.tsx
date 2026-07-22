import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Signing you in — Diamond Development" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let done = false;
    const finish = (path: "/dashboard" | "/auth") => {
      if (done) return;
      done = true;
      navigate({ to: path, replace: true });
    };

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) finish("/dashboard");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) finish("/dashboard");
    });

    // Failsafe: if nothing arrives in a few seconds, kick back to /auth.
    const timeout = window.setTimeout(() => finish("/auth"), 6000);

    return () => {
      sub.subscription.unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-field text-primary-foreground">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <p className="mt-4 text-sm opacity-90">Signing you in…</p>
      </div>
    </div>
  );
}
