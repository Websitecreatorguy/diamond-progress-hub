import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  AGES,
  chartData,
  clampAge,
  evaluate,
  formatValue,
  METRICS,
  type MetricKey,
} from "@/lib/benchmarks";

export function MetricCalculator({
  metricKey,
  defaultAge = 13,
}: {
  metricKey: MetricKey;
  defaultAge?: number;
}) {
  const metric = METRICS[metricKey];
  const [age, setAge] = useState<string>(String(defaultAge));
  const [value, setValue] = useState<string>("");

  const numericAge = Number(age);
  const numericValue = Number(value);
  const valid =
    Number.isFinite(numericAge) &&
    numericAge >= 7 &&
    numericAge <= 18 &&
    Number.isFinite(numericValue) &&
    numericValue >= metric.min &&
    numericValue <= metric.max &&
    value.trim() !== "";

  const result = useMemo(
    () => (valid ? evaluate(metric, numericAge, numericValue) : null),
    [valid, metric, numericAge, numericValue],
  );

  const data = useMemo(() => chartData(metric), [metric]);
  const shownAge = clampAge(Number.isFinite(numericAge) ? numericAge : defaultAge);

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border p-5 shadow-card sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="calc-age">Age</Label>
            <Input
              id="calc-age"
              type="number"
              inputMode="numeric"
              min={7}
              max={18}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="13"
            />
            <p className="text-xs text-muted-foreground">Ages 7-18</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="calc-value">
              {metric.label} ({metric.unit})
            </Label>
            <Input
              id="calc-value"
              type="number"
              inputMode="decimal"
              step={metric.step}
              min={metric.min}
              max={metric.max}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={String(metric.avg[shownAge])}
            />
            <p className="text-xs text-muted-foreground">
              {metric.min}-{metric.max} {metric.unit}
            </p>
          </div>
        </div>

        {result ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-glow">
              <div className="text-xs font-semibold uppercase tracking-widest opacity-80">
                Your result
              </div>
              <div className="mt-1 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-black">{result.percentile}th</span>
                <span className="text-sm opacity-90">percentile for age {shownAge}</span>
              </div>
              <div className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                {result.band}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label={`Average (age ${shownAge})`} value={formatValue(metric, result.average)} />
              <Stat label={`Elite (90th pct)`} value={formatValue(metric, result.elite)} />
              <Stat
                label="Vs. average"
                value={`${result.vsAverage >= 0 ? "+" : ""}${result.vsAverage} ${metric.unit}`}
              />
            </div>

            <div className="rounded-2xl border border-border bg-secondary/40 p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">
                Suggested next goal
              </div>
              <div className="mt-1 text-2xl font-bold">
                {formatValue(metric, result.nextGoal)}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Reaching the {result.goalLabel}. Re-test every 6-8 weeks and log it to see the
                trend.
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-5 text-sm text-muted-foreground">
            Enter an age (7-18) and a {metric.label.toLowerCase()} to see your percentile.
          </p>
        )}
      </Card>

      <Card className="rounded-2xl border-border p-5 shadow-card sm:p-6">
        <h3 className="text-base font-semibold">
          {metric.label} by age: average vs. elite
        </h3>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="age"
                ticks={AGES as unknown as number[]}
                tick={{ fontSize: 12 }}
                stroke="currentColor"
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="currentColor"
                className="text-muted-foreground"
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-card)",
                  fontSize: 12,
                }}
                formatter={(v: number, name: string) => [`${v} ${metric.unit}`, name]}
                labelFormatter={(l) => `Age ${l}`}
              />
              <Line
                type="monotone"
                dataKey="average"
                name="Average"
                stroke="var(--color-primary-glow)"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="elite"
                name="Elite"
                stroke="var(--color-muted-foreground)"
                strokeDasharray="5 4"
                strokeWidth={2}
                dot={false}
              />
              {result && (
                <ReferenceDot
                  x={shownAge}
                  y={numericValue}
                  r={6}
                  fill="var(--color-primary-glow)"
                  stroke="var(--color-background)"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Solid line: age average (50th percentile). Dashed line: elite (about 90th percentile).
          {result ? " The dot is your result." : ""}
        </p>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}
