import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Diamond Development" }] }),
  component: Profile,
});

type ProfileRow = {
  id: string;
  full_name: string | null;
  age: number | null;
  team: string | null;
  positions: string[] | null;
  height_in: number | null;
  weight_lb: number | null;
  bats: string | null;
  throws: string | null;
};

const POSITIONS = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH", "UT"];

function Profile() {
  const qc = useQueryClient();
  const { data } = useQuery<ProfileRow | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").maybeSingle();
      return data as ProfileRow | null;
    },
  });

  const [form, setForm] = useState<Partial<ProfileRow>>({});
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const payload = {
        id: u.user.id,
        full_name: form.full_name ?? null,
        age: form.age ? Number(form.age) : null,
        team: form.team ?? null,
        positions: form.positions ?? null,
        height_in: form.height_in ? Number(form.height_in) : null,
        weight_lb: form.weight_lb ? Number(form.weight_lb) : null,
        bats: form.bats ?? null,
        throws: form.throws ?? null,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function togglePos(p: string) {
    const set = new Set(form.positions ?? []);
    if (set.has(p)) set.delete(p);
    else set.add(p);
    setForm((f) => ({ ...f, positions: Array.from(set) }));
  }

  return (
    <AppShell title="Player Profile">
      <Card className="rounded-2xl border-border p-5 shadow-card">
        <div className="mb-5 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-2xl font-black text-primary-foreground shadow-glow">
            {(form.full_name ?? "P").charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-bold">{form.full_name || "Your Name"}</div>
            <div className="text-xs text-muted-foreground">
              {form.team || "Team"} · {form.age ? `${form.age} yrs` : "Age"}
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input
              value={form.full_name ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Age</Label>
              <Input
                type="number"
                value={form.age ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value as unknown as number }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Team</Label>
              <Input
                value={form.team ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, team: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label>Positions</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {POSITIONS.map((p) => {
                const active = form.positions?.includes(p);
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => togglePos(p)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-secondary text-secondary-foreground hover:border-primary/40"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Height (in)</Label>
              <Input
                type="number"
                step="0.1"
                value={form.height_in ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, height_in: e.target.value as unknown as number }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Weight (lb)</Label>
              <Input
                type="number"
                step="0.1"
                value={form.weight_lb ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, weight_lb: e.target.value as unknown as number }))
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Bats</Label>
              <Select
                value={form.bats ?? ""}
                onValueChange={(v) => setForm((f) => ({ ...f, bats: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Left</SelectItem>
                  <SelectItem value="R">Right</SelectItem>
                  <SelectItem value="S">Switch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Throws</Label>
              <Select
                value={form.throws ?? ""}
                onValueChange={(v) => setForm((f) => ({ ...f, throws: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Left</SelectItem>
                  <SelectItem value="R">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-primary shadow-glow" disabled={save.isPending}>
            Save profile
          </Button>
        </form>
      </Card>
    </AppShell>
  );
}
