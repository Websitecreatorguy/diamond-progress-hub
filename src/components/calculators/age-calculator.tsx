import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { exactAge, leagueAge, schoolGrade, suggestedDivision } from "@/lib/benchmarks";

export function AgeCalculator() {
  const [dob, setDob] = useState("");

  const result = useMemo(() => {
    if (!dob) return null;
    const d = new Date(`${dob}T00:00:00`);
    if (Number.isNaN(d.getTime()) || d > new Date()) return null;
    const la = leagueAge(d);
    return {
      exact: exactAge(d),
      league: la,
      grade: schoolGrade(la),
      division: suggestedDivision(la),
    };
  }, [dob]);

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border p-5 shadow-card sm:p-6">
        <div className="max-w-xs space-y-1.5">
          <Label htmlFor="dob">Date of birth</Label>
          <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>

        {result ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
              <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
                League age (Aug 31 cutoff)
              </div>
              <div className="mt-1 text-4xl font-black">{result.league}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Box
                label="Exact age"
                value={`${result.exact.years}y ${result.exact.months}m ${result.exact.days}d`}
              />
              <Box label="Expected grade" value={result.grade} />
              <Box label="Suggested division" value={result.division} />
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Enter a date of birth to see exact age, league age, grade, and division.
          </p>
        )}
      </Card>
    </div>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-bold">{value}</div>
    </div>
  );
}
