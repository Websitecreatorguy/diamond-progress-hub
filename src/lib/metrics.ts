export type MetricKey =
  | "pitch_velo"
  | "exit_velo"
  | "bat_speed"
  | "throw_velo"
  | "pop_time"
  | "sprint_10yd"
  | "home_to_first"
  | "sixty_yd"
  | "vertical_jump"
  | "grip_strength"
  | "height"
  | "weight";

export type MetricDef = {
  key: MetricKey;
  label: string;
  short: string;
  unit: string;
  /** lower value = better result (times) */
  lowerIsBetter?: boolean;
  /** shown only when the player plays one of these positions */
  positions?: string[];
  min: number;
  max: number;
  step: number;
  decimals: number;
};

export const METRICS: MetricDef[] = [
  {
    key: "pitch_velo",
    label: "Pitch Velocity",
    short: "Pitch Velo",
    unit: "mph",
    positions: ["P"],
    min: 20,
    max: 110,
    step: 0.1,
    decimals: 1,
  },
  { key: "exit_velo", label: "Exit Velocity", short: "Exit Velo", unit: "mph", min: 20, max: 125, step: 0.1, decimals: 1 },
  { key: "bat_speed", label: "Bat Speed", short: "Bat Speed", unit: "mph", min: 20, max: 100, step: 0.1, decimals: 1 },
  { key: "throw_velo", label: "Throwing Velocity", short: "Throw Velo", unit: "mph", min: 20, max: 110, step: 0.1, decimals: 1 },
  {
    key: "pop_time",
    label: "Catcher Pop Time",
    short: "Pop Time",
    unit: "sec",
    lowerIsBetter: true,
    positions: ["C"],
    min: 1.5,
    max: 3.5,
    step: 0.01,
    decimals: 2,
  },
  { key: "sprint_10yd", label: "10-Yard Sprint", short: "10-yd", unit: "sec", lowerIsBetter: true, min: 1, max: 4, step: 0.01, decimals: 2 },
  { key: "home_to_first", label: "Home-to-First", short: "H-to-1B", unit: "sec", lowerIsBetter: true, min: 3, max: 8, step: 0.01, decimals: 2 },
  { key: "sixty_yd", label: "60-Yard Dash", short: "60-yd", unit: "sec", lowerIsBetter: true, min: 5, max: 12, step: 0.01, decimals: 2 },
  { key: "vertical_jump", label: "Vertical Jump", short: "Vertical", unit: "in", min: 4, max: 50, step: 0.1, decimals: 1 },
  { key: "grip_strength", label: "Grip Strength", short: "Grip", unit: "kg", min: 5, max: 100, step: 0.5, decimals: 1 },
  { key: "height", label: "Height", short: "Height", unit: "in", min: 36, max: 90, step: 0.1, decimals: 1 },
  { key: "weight", label: "Weight", short: "Weight", unit: "lb", min: 40, max: 350, step: 0.5, decimals: 1 },
];

export const METRIC_MAP: Record<string, MetricDef> = Object.fromEntries(
  METRICS.map((m) => [m.key, m]),
) as Record<string, MetricDef>;

export function metricLabel(key: string) {
  return METRIC_MAP[key]?.label ?? key;
}

export function metricUnit(key: string) {
  return METRIC_MAP[key]?.unit ?? "";
}

export function formatMetric(key: string, value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const def = METRIC_MAP[key];
  return value.toFixed(def?.decimals ?? 1);
}

/** Metrics relevant to the positions a player lists. Position-agnostic metrics always show. */
export function relevantMetrics(positions: string[] | null | undefined): MetricDef[] {
  const pos = new Set(positions ?? []);
  return METRICS.filter((m) => !m.positions || m.positions.some((p) => pos.has(p)));
}

export function isImprovement(key: string, next: number, prev: number) {
  return METRIC_MAP[key]?.lowerIsBetter ? next < prev : next > prev;
}

/** Signed "better by" delta, always positive when it's an improvement. */
export function improvementDelta(key: string, next: number, prev: number) {
  return METRIC_MAP[key]?.lowerIsBetter ? prev - next : next - prev;
}

export function validateMetricValue(key: string, value: number): string | null {
  const def = METRIC_MAP[key];
  if (!def) return "Pick a metric type.";
  if (!Number.isFinite(value)) return "Enter a number.";
  if (value < def.min || value > def.max)
    return `${def.label} should be between ${def.min} and ${def.max} ${def.unit}.`;
  return null;
}

export const RANGES = [
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
  { key: "6m", label: "6 months", days: 182 },
  { key: "1y", label: "1 year", days: 365 },
  { key: "all", label: "All time", days: null as number | null },
] as const;

export type RangeKey = (typeof RANGES)[number]["key"];
