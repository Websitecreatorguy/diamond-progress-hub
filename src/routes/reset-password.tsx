import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOGO_URL } from "@/components/logo";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset password — Diamond Development" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase auto-parses the recovery token from the URL hash and fires
    // PASSWORD_RECOVERY. We just wait until a session exists.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. Signing you in…");
      navigate({ to: "/dashboard", replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Couldn't update password";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-field px-4 py-10">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_10%,white_0,transparent_40%),radial-gradient(circle_at_80%_90%,white_0,transparent_40%)]" />
      <div className="relative w-full max-w-md rounded-3xl bg-card p-8 shadow-glow">
        <div className="mb-6 flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Diamond Development"
            width={44}
            height={44}
            className="rounded-2xl shadow-glow"
          />
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Diamond Development
            </div>
            <h1 className="text-xl font-semibold">Reset your password</h1>
          </div>
        </div>

        {!ready ? (
          <p className="text-sm text-muted-foreground">
            Verifying your reset link… If nothing happens, please request a new link from the sign-in
            page.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary shadow-glow" disabled={busy}>
              Update password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
