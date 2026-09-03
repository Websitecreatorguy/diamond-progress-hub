import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { METRICS } from "@/lib/metrics";
import { AGE_GROUPS, TEAM_LEVELS, LOCKER_POST_POLICIES } from "@/lib/teams";
import { friendlyError, generateTeamCode, logActivity } from "@/lib/activity";

type Draft = {
  name: string;
  organization: string;
  age_group: string;
  season: string;
  team_level: string;
  city: string;
  state: string;
  logo_url: string;
  head_coach_name: string;
  assistant_coaches: string;
  description: string;
  practice_location: string;
  website_url: string;
  visible_metrics: string[];
  comparisons_visible: boolean;
  chat_enabled: boolean;
  announcements_enabled: boolean;
  member_list_visible: boolean;
  locker_post_policy: string;
};

const EMPTY: Draft = {
  name: "",
  organization: "",
  age_group: "",
  season: `${new Date().getFullYear()}`,
  team_level: "",
  city: "",
  state: "",
  logo_url: "",
  head_coach_name: "",
  assistant_coaches: "",
  description: "",
  practice_location: "",
  website_url: "",
  visible_metrics: METRICS.slice(0, 6).map((m) => m.key),
  comparisons_visible: true,
  chat_enabled: true,
  announcements_enabled: true,
  member_list_visible: true,
  locker_post_policy: "everyone",
};

const STEPS = ["Identity", "Details", "Settings", "Review"];

export function CreateTeamWizard({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ id: string; code: string; name: string } | null>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  function reset() {
    setStep(0);
    setDraft(EMPTY);
    setError(null);
    setCreated(null);
  }

  function close(v: boolean) {
    onOpenChange(v);
    if (!v) setTimeout(reset, 200);
  }

  function validateStep(): string | null {
    if (step === 0) {
      if (draft.name.trim().length < 3) return "Team name must be at least 3 characters.";
      if (!draft.age_group) return "Choose an age group.";
      if (!draft.season.trim()) return "Enter a season.";
    }
    return null;
  }

  const create = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Your session expired. Please sign in again.");

      let code = generateTeamCode();
      let team: { id: string } | null = null;
      let lastErr: unknown = null;

      for (let attempt = 0; attempt < 5 && !team; attempt++) {
        const { data, error } = await supabase
          .from("teams")
          .insert({
            name: draft.name.trim(),
            organization: draft.organization.trim() || null,
            age_group: draft.age_group,
            season: draft.season.trim(),
            team_level: draft.team_level || null,
            city: draft.city.trim() || null,
            state: draft.state.trim() || null,
            logo_url: draft.logo_url.trim() || null,
            head_coach_name: draft.head_coach_name.trim() || null,
            assistant_coaches: draft.assistant_coaches
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            description: draft.description.trim() || null,
            practice_location: draft.practice_location.trim() || null,
            website_url: draft.website_url.trim() || null,
            visible_metrics: draft.visible_metrics,
            comparisons_visible: draft.comparisons_visible,
            chat_enabled: draft.chat_enabled,
            announcements_enabled: draft.announcements_enabled,
            member_list_visible: draft.member_list_visible,
            locker_post_policy: draft.locker_post_policy,
            join_code: code,
            owner_id: u.user.id,
          })
          .select("id")
          .single();
        if (!error) {
          team = data;
          break;
        }
        lastErr = error;
        if (!`${error.message}`.toLowerCase().includes("duplicate")) throw error;
        code = generateTeamCode();
      }
      if (!team) throw lastErr ?? new Error("Could not create the team.");

      const { error: mErr } = await supabase
        .from("team_members")
        .insert({ team_id: team.id, user_id: u.user.id, team_role: "coach" });
      if (mErr) throw mErr;

      await logActivity("team_joined", `Created team ${draft.name.trim()}`);
      return { id: team.id, code, name: draft.name.trim() };
    },
    onSuccess: (t) => {
      qc.invalidateQueries();
      setCreated(t);
    },
    onError: (e) => setError(friendlyError(e, "We couldn't create that team.")),
  });

  const shareLink =
    created && typeof window !== "undefined"
      ? `${window.location.origin}/team?code=${created.code}`
      : "";

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed — select the text manually.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {created ? (
          <div className="py-2 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <Check className="h-7 w-7 text-primary-foreground" />
            </div>
            <DialogTitle className="text-2xl font-black">Your team is ready.</DialogTitle>
            <DialogDescription className="mt-1">
              Share this code with players so they can request to join {created.name}.
            </DialogDescription>

            <div className="mx-auto mt-6 w-full max-w-xs rounded-2xl border border-border bg-secondary/50 px-4 py-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Team code</div>
              <div className="mt-1 font-mono text-3xl font-black tracking-[0.3em]">{created.code}</div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="outline" onClick={() => copy(created.code, "Team code")}>
                <Copy className="mr-1.5 h-4 w-4" /> Copy code
              </Button>
              <Button variant="outline" onClick={() => copy(shareLink, "Invite link")}>
                Invite players
              </Button>
              <Button
                className="bg-gradient-primary shadow-glow"
                onClick={() => {
                  close(false);
                  navigate({ to: "/team/$teamId", params: { teamId: created.id } });
                }}
              >
                Go to team dashboard
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Create a team
              </DialogTitle>
              <DialogDescription>Step {step + 1} of 4 — {STEPS[step]}</DialogDescription>
            </DialogHeader>

            <div className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`}
                />
              ))}
            </div>

            <div className="space-y-4 py-2">
              {step === 0 && (
                <>
                  <Field label="Team name" required>
                    <Input value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Northside Bandits" />
                  </Field>
                  <Field label="Organization name">
                    <Input value={draft.organization} onChange={(e) => set("organization", e.target.value)} placeholder="Northside Baseball Club" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Age group" required>
                      <Select value={draft.age_group} onValueChange={(v) => set("age_group", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {AGE_GROUPS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Season" required>
                      <Input value={draft.season} onChange={(e) => set("season", e.target.value)} placeholder="Spring 2026" />
                    </Field>
                    <Field label="Team level">
                      <Select value={draft.team_level} onValueChange={(v) => set("team_level", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {TEAM_LEVELS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <Field label="City"><Input value={draft.city} onChange={(e) => set("city", e.target.value)} /></Field>
                      </div>
                      <Field label="State"><Input value={draft.state} maxLength={2} onChange={(e) => set("state", e.target.value.toUpperCase())} /></Field>
                    </div>
                  </div>
                  <Field label="Team logo URL">
                    <Input value={draft.logo_url} onChange={(e) => set("logo_url", e.target.value)} placeholder="https://…" />
                  </Field>
                </>
              )}

              {step === 1 && (
                <>
                  <Field label="Head coach name">
                    <Input value={draft.head_coach_name} onChange={(e) => set("head_coach_name", e.target.value)} />
                  </Field>
                  <Field label="Assistant coaches" hint="Separate names with commas — optional.">
                    <Input value={draft.assistant_coaches} onChange={(e) => set("assistant_coaches", e.target.value)} placeholder="Chris Lee, Dana Ruiz" />
                  </Field>
                  <Field label="Team description">
                    <Textarea rows={3} value={draft.description} onChange={(e) => set("description", e.target.value)} placeholder="What this team is about, goals for the season…" />
                  </Field>
                  <Field label="Primary practice location">
                    <Input value={draft.practice_location} onChange={(e) => set("practice_location", e.target.value)} placeholder="Riverside Field 3" />
                  </Field>
                  <Field label="Team website or social link">
                    <Input value={draft.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://…" />
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <Label>Player metrics visible to the team</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {METRICS.map((m) => {
                        const on = draft.visible_metrics.includes(m.key);
                        return (
                          <button
                            key={m.key}
                            type="button"
                            onClick={() =>
                              set(
                                "visible_metrics",
                                on
                                  ? draft.visible_metrics.filter((k) => k !== m.key)
                                  : [...draft.visible_metrics, m.key],
                              )
                            }
                            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                              on
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-secondary text-muted-foreground"
                            }`}
                          >
                            {m.short}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Toggle label="Team comparison" hint="Let players see how they rank on shared metrics." checked={draft.comparisons_visible} onChange={(v) => set("comparisons_visible", v)} />
                  <Toggle label="Player chat (Locker Room)" hint="Private team group chat." checked={draft.chat_enabled} onChange={(v) => set("chat_enabled", v)} />
                  <Toggle label="Announcements" hint="Coach posts pinned for every player." checked={draft.announcements_enabled} onChange={(v) => set("announcements_enabled", v)} />
                  <Toggle label="Member list visible to players" checked={draft.member_list_visible} onChange={(v) => set("member_list_visible", v)} />
                  <Field label="Who can post in the Locker Room">
                    <Select value={draft.locker_post_policy} onValueChange={(v) => set("locker_post_policy", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {LOCKER_POST_POLICIES.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </>
              )}

              {step === 3 && (
                <div className="space-y-3 rounded-2xl border border-border bg-secondary/40 p-4 text-sm">
                  <Row k="Team" v={draft.name} />
                  <Row k="Organization" v={draft.organization || "—"} />
                  <Row k="Age group" v={draft.age_group} />
                  <Row k="Season" v={draft.season} />
                  <Row k="Level" v={draft.team_level || "—"} />
                  <Row k="Location" v={[draft.city, draft.state].filter(Boolean).join(", ") || "—"} />
                  <Row k="Head coach" v={draft.head_coach_name || "—"} />
                  <Row k="Assistants" v={draft.assistant_coaches || "—"} />
                  <Row k="Practice" v={draft.practice_location || "—"} />
                  <Row k="Visible metrics" v={`${draft.visible_metrics.length} selected`} />
                  <Row k="Comparison" v={draft.comparisons_visible ? "On" : "Off"} />
                  <Row k="Locker Room" v={draft.chat_enabled ? `On · ${draft.locker_post_policy === "everyone" ? "everyone posts" : "coaches only"}` : "Off"} />
                  <Row k="Announcements" v={draft.announcements_enabled ? "On" : "Off"} />
                </div>
              )}

              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="flex justify-between gap-2">
              <Button
                variant="ghost"
                onClick={() => (step === 0 ? close(false) : setStep((s) => s - 1))}
                disabled={create.isPending}
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> {step === 0 ? "Cancel" : "Back"}
              </Button>
              {step < 3 ? (
                <Button
                  className="bg-gradient-primary shadow-glow"
                  onClick={() => {
                    const v = validateStep();
                    setError(v);
                    if (!v) setStep((s) => s + 1);
                  }}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  className="bg-gradient-primary shadow-glow"
                  disabled={create.isPending}
                  onClick={() => {
                    setError(null);
                    create.mutate();
                  }}
                >
                  {create.isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                  {create.isPending ? "Creating…" : "Create team"}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-secondary/50 px-4 py-3">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}
