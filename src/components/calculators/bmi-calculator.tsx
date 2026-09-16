import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { baseballBmi } from "@/lib/benchmarks";

const BANDS = [
  { name: "Lean", range: "under 17.5", note: "Fast and mobile. Usually the priority is adding lean mass without losing speed." },
  { name: "Athletic", range: "17.5 - 22.4", note: "The most common range for high school middle infielders and outfielders." },
  { name: "Strong build", range: "22.5 - 26.9", note: "Typical of pitchers, catchers, and corner bats carrying real strength." },
  { name: "Power build", range: "27 and up", note: "High mass. Great for leverage, but keep an eye on mobility and conditioning." },
];

export function BmiCalculator() {
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("6");
  const [weight, setWeight] = useState("");

  const heightIn = Number(feet) * 12 + Number(inches);
  const w = Number(weight);
  const valid = heightIn >= 36 && heightIn <= 90 && w >= 30 && w <= 400 && weight.trim() !== "";
  const result = useMemo(
    () => (valid ? baseballBmi(heightIn, w) : null),
    [valid, heightIn, w],
  );

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border p-5 shadow-card sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="bmi-ft">Height (feet)</Label>
            <Input id="bmi-ft" type="number" min={3} max={7} value={feet} onChange={(e) => setFeet(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bmi-in">Height (inches)</Label>
            <Input id="bmi-in" type="number" min={0} max={11} value={inches} onChange={(e) => setInches(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bmi-w">Weight (lb)</Label>
            <Input id="bmi-w" type="number" min={30} max={400} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="150" />
          </div>
        </div>

        {result ? (
          <div className="mt-6 rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
            <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
              Baseball BMI
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-black">{result.bmi}</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                {result.band}
              </span>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Enter height and weight to see your baseball build category.
          </p>
        )}
      </Card>

      <Card className="rounded-2xl border-border p-5 shadow-card sm:p-6">
        <h3 className="text-base font-semibold">What the categories mean</h3>
        <div className="mt-4 divide-y divide-border">
          {BANDS.map((b) => (
            <div key={b.name} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
              <div className="w-32 shrink-0 font-semibold">{b.name}</div>
              <div className="w-28 shrink-0 text-sm text-primary">{b.range}</div>
              <p className="text-sm text-muted-foreground">{b.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-xl border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
          Educational information only, not medical advice. BMI does not distinguish muscle from
          fat, so athletes often score higher than the general population. Talk to a doctor or a
          registered dietitian before changing a young athlete&apos;s nutrition or body weight.
        </p>
      </Card>
    </div>
  );
}
