// Age-by-age baseball performance benchmarks (ages 7-18).
// Values are pooled estimates from public youth/HS testing data and are used for
// percentile estimation across calculators and the "by age" SEO pages.

export const AGES = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] as const;
export type Age = (typeof AGES)[number];

export type MetricKey =
  | "pitching-velocity"
  | "exit-velocity"
  | "throwing-velocity"
  | "height"
  | "weight"
  | "sixty-yard-dash"
  | "vertical-jump";

export type Metric = {
  key: MetricKey;
  label: string;
  shortLabel: string;
  unit: string;
  /** true when a lower value is better (e.g. sprint times) */
  lowerIsBetter?: boolean;
  step: number;
  min: number;
  max: number;
  /** avg = 50th percentile, elite ≈ 90th percentile, indexed by age 7..18 */
  avg: Record<number, number>;
  elite: Record<number, number>;
  /** How the metric is measured, used in copy */
  howMeasured: string;
};

function byAge(values: number[]): Record<number, number> {
  const out: Record<number, number> = {};
  AGES.forEach((a, i) => (out[a] = values[i]));
  return out;
}

export const METRICS: Record<MetricKey, Metric> = {
  "pitching-velocity": {
    key: "pitching-velocity",
    label: "Pitching velocity",
    shortLabel: "Pitch velo",
    unit: "mph",
    step: 1,
    min: 20,
    max: 105,
    avg: byAge([38, 41, 44, 47, 50, 53, 57, 62, 66, 70, 74, 76]),
    elite: byAge([46, 49, 52, 56, 59, 62, 67, 72, 77, 82, 86, 88]),
    howMeasured:
      "Measured off a mound with a radar gun or pocket radar placed behind the catcher, using a player's best of 5-10 competitive fastballs.",
  },
  "exit-velocity": {
    key: "exit-velocity",
    label: "Exit velocity",
    shortLabel: "Exit velo",
    unit: "mph",
    step: 1,
    min: 20,
    max: 120,
    avg: byAge([35, 39, 43, 47, 52, 57, 62, 68, 73, 78, 83, 86]),
    elite: byAge([45, 49, 53, 58, 63, 68, 74, 80, 86, 91, 95, 98]),
    howMeasured:
      "Measured off a tee or front toss with a radar device or bat sensor, using the average of a player's top 3-5 batted balls.",
  },
  "throwing-velocity": {
    key: "throwing-velocity",
    label: "Throwing velocity",
    shortLabel: "Throw velo",
    unit: "mph",
    step: 1,
    min: 20,
    max: 105,
    avg: byAge([33, 36, 40, 44, 48, 52, 57, 62, 67, 72, 76, 79]),
    elite: byAge([41, 45, 49, 53, 57, 62, 67, 72, 78, 83, 87, 90]),
    howMeasured:
      "Measured on a flat-ground crow-hop throw from the outfield or infield position, best of 3-5 throws.",
  },
  height: {
    key: "height",
    label: "Height",
    shortLabel: "Height",
    unit: "in",
    step: 0.5,
    min: 36,
    max: 84,
    avg: byAge([48.5, 50.5, 52.5, 54.5, 57, 59.5, 62, 65, 67.5, 69, 69.8, 70.2]),
    elite: byAge([51.5, 53.5, 55.8, 58, 60.5, 63.5, 66.5, 69, 71, 72.2, 73, 73.4]),
    howMeasured:
      "Measured barefoot against a wall, heels together, first thing in the morning for consistency.",
  },
  weight: {
    key: "weight",
    label: "Weight",
    shortLabel: "Weight",
    unit: "lb",
    step: 1,
    min: 30,
    max: 320,
    avg: byAge([51, 57, 63, 71, 80, 90, 102, 115, 130, 145, 157, 165]),
    elite: byAge([62, 70, 77, 87, 98, 110, 125, 141, 159, 177, 191, 201]),
    howMeasured:
      "Measured in the morning, before eating, in light clothing, on the same scale each time.",
  },
  "sixty-yard-dash": {
    key: "sixty-yard-dash",
    label: "60-yard dash",
    shortLabel: "60 yard",
    unit: "sec",
    lowerIsBetter: true,
    step: 0.05,
    min: 5.5,
    max: 15,
    avg: byAge([11.5, 11.0, 10.5, 10.0, 9.6, 9.2, 8.8, 8.3, 7.9, 7.6, 7.4, 7.2]),
    elite: byAge([10.3, 9.9, 9.4, 9.0, 8.6, 8.2, 7.8, 7.4, 7.1, 6.9, 6.8, 6.7]),
    howMeasured:
      "Hand-timed or laser-timed from a rolling start over 60 yards on dirt or turf in cleats.",
  },
  "vertical-jump": {
    key: "vertical-jump",
    label: "Vertical jump",
    shortLabel: "Vertical",
    unit: "in",
    step: 0.5,
    min: 4,
    max: 45,
    avg: byAge([9, 10, 11.5, 13, 14.5, 16, 18, 20, 22, 24, 25.5, 26.5]),
    elite: byAge([14, 15, 16.5, 18, 19.5, 21, 23, 25.5, 27.5, 29.5, 31, 32]),
    howMeasured:
      "Standing countermovement jump measured with a Vertec or jump mat, best of 3 attempts.",
  },
};

export const METRIC_LIST = Object.values(METRICS);

export function clampAge(age: number): Age {
  return Math.min(18, Math.max(7, Math.round(age))) as Age;
}

/** Standard normal CDF (Abramowitz & Stegun approximation). */
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

const Z90 = 1.2816;

export type MetricResult = {
  percentile: number;
  average: number;
  elite: number;
  /** difference vs. the age average, sign-normalized so positive = better */
  vsAverage: number;
  /** next meaningful target for this athlete */
  nextGoal: number;
  goalLabel: string;
  band: "Developing" | "Below average" | "Average" | "Above average" | "Elite";
};

export function evaluate(metric: Metric, age: number, value: number): MetricResult {
  const a = clampAge(age);
  const average = metric.avg[a];
  const elite = metric.elite[a];
  const sd = Math.abs(elite - average) / Z90 || 1;
  const z = metric.lowerIsBetter ? (average - value) / sd : (value - average) / sd;
  const percentile = Math.min(99, Math.max(1, Math.round(normalCdf(z) * 100)));

  const vsAverage = metric.lowerIsBetter ? average - value : value - average;

  // Next goal: reach the next 10-percentile step, capped at the elite mark + a stretch.
  const targetPct = Math.min(99, Math.floor(percentile / 10) * 10 + 10);
  const targetZ = inverseNormal(targetPct / 100);
  const raw = metric.lowerIsBetter ? average - targetZ * sd : average + targetZ * sd;
  const nextGoal = round(raw, metric.step >= 1 ? 0 : 2);

  const band: MetricResult["band"] =
    percentile >= 90
      ? "Elite"
      : percentile >= 70
        ? "Above average"
        : percentile >= 40
          ? "Average"
          : percentile >= 20
            ? "Below average"
            : "Developing";

  return {
    percentile,
    average,
    elite,
    vsAverage: round(vsAverage, 1),
    nextGoal,
    goalLabel: `${targetPct}th percentile for age ${a}`,
    band,
  };
}

function round(n: number, digits: number) {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

/** Inverse standard normal (Beasley-Springer-Moro style approximation). */
function inverseNormal(p: number): number {
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const pl = 0.02425;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - pl) return -inverseNormal(1 - p);
  const q = p - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

export function formatValue(metric: Metric, value: number) {
  const digits = metric.unit === "sec" ? 2 : metric.step < 1 ? 1 : 0;
  return `${value.toFixed(digits)} ${metric.unit}`;
}

export function chartData(metric: Metric) {
  return AGES.map((a) => ({
    age: a,
    average: metric.avg[a],
    elite: metric.elite[a],
  }));
}

/** Baseball-specific BMI banding (educational, not medical advice). */
export function baseballBmi(heightIn: number, weightLb: number) {
  const bmi = (703 * weightLb) / (heightIn * heightIn);
  const band =
    bmi < 17.5
      ? "Lean"
      : bmi < 22.5
        ? "Athletic"
        : bmi < 27
          ? "Strong build"
          : "Power build";
  return { bmi: Math.round(bmi * 10) / 10, band };
}

/** League age uses an Aug 31 cutoff (Little League / most youth orgs). */
export function leagueAge(birthDate: Date, on = new Date()) {
  const seasonYear = on.getMonth() >= 8 ? on.getFullYear() + 1 : on.getFullYear();
  const cutoff = new Date(seasonYear - 1, 7, 31); // Aug 31 of prior year
  let age = cutoff.getFullYear() - birthDate.getFullYear();
  const m = cutoff.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && cutoff.getDate() < birthDate.getDate())) age--;
  return age;
}

export function exactAge(birthDate: Date, on = new Date()) {
  let years = on.getFullYear() - birthDate.getFullYear();
  let months = on.getMonth() - birthDate.getMonth();
  let days = on.getDate() - birthDate.getDate();
  if (days < 0) {
    months--;
    days += new Date(on.getFullYear(), on.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

export function suggestedDivision(la: number) {
  if (la <= 6) return "Tee Ball (4-6U)";
  if (la <= 8) return "Coach Pitch / 8U";
  if (la <= 10) return "Minors / 10U (46/60 field)";
  if (la <= 12) return "Majors / 12U (46/60 field)";
  if (la <= 13) return "Intermediate 50/70 or 13U";
  if (la <= 14) return "Junior / 14U (60/90 field)";
  if (la <= 16) return "Senior / JV 16U";
  return "Varsity / 18U";
}

export function schoolGrade(la: number) {
  const grade = la - 5;
  if (grade < 1) return "Pre-K / Kindergarten";
  if (grade > 12) return "Post-graduate";
  const suffix = grade === 1 ? "st" : grade === 2 ? "nd" : grade === 3 ? "rd" : "th";
  return `${grade}${suffix} grade`;
}
