import { METRICS, type MetricKey } from "@/lib/benchmarks";

export type CalculatorFaq = { q: string; a: string };

export type Calculator = {
  slug: string;
  name: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  kind: "metric" | "bmi" | "age";
  metric?: MetricKey;
  faqs: CalculatorFaq[];
  related: string[];
};

const CTA =
  "Enter your age and result to see your percentile against thousands of youth and high school players, plus a realistic next goal.";

function metricCalc(
  slug: string,
  metric: MetricKey,
  name: string,
  description: string,
  faqs: CalculatorFaq[],
  related: string[],
): Calculator {
  const m = METRICS[metric];
  return {
    slug,
    name,
    h1: name,
    title: `${name} — Percentile by Age | Diamond Development`,
    description,
    intro: `${CTA} ${m.howMeasured}`,
    kind: "metric",
    metric,
    faqs,
    related,
  };
}

export const CALCULATORS: Calculator[] = [
  metricCalc(
    "pitching-velocity-calculator",
    "pitching-velocity",
    "Pitching Velocity Calculator",
    "Find out how your fastball velocity ranks for your age. See average velocity, elite velocity, your percentile, and your next velocity goal.",
    [
      {
        q: "What is a good pitching velocity for my age?",
        a: "Roughly, an average 12-year-old sits around 53 mph and an average 18-year-old around 76 mph. Anything at or above the 90th percentile for your age is considered elite for that level.",
      },
      {
        q: "How is my percentile calculated?",
        a: "We model each age group with its average and 90th-percentile velocity, then estimate where your reading falls in that distribution. It is an estimate, not a scouting grade.",
      },
      {
        q: "How fast can I add velocity safely?",
        a: "Most developing pitchers add 2-5 mph per year through growth, mechanics, and strength work. Chasing more than that in one off-season sharply raises arm injury risk.",
      },
    ],
    ["exit-velocity-calculator", "baseball-weight-calculator", "baseball-age-calculator"],
  ),
  metricCalc(
    "exit-velocity-calculator",
    "exit-velocity",
    "Exit Velocity Calculator",
    "Compare your exit velocity to age-based averages and elite marks, see your percentile, and get a suggested improvement goal.",
    [
      {
        q: "What is a good exit velocity by age?",
        a: "Average exit velocity climbs from roughly 35 mph at age 7 to about 86 mph at 18. College recruits typically show 90+ mph off a tee.",
      },
      {
        q: "Should I measure off a tee or live pitching?",
        a: "Use a tee for consistency. Tee readings remove pitch speed as a variable, so month-to-month comparisons are meaningful.",
      },
      {
        q: "How do I add exit velocity?",
        a: "Lower-body strength, rotational power work, and bat speed training move the number fastest, combined with consistent barrel contact.",
      },
    ],
    ["pitching-velocity-calculator", "baseball-bmi-calculator", "vertical-jump-calculator"],
  ),
  metricCalc(
    "baseball-height-calculator",
    "height",
    "Baseball Height Calculator",
    "Compare your height to baseball players of the same age, see your percentile, and view a growth chart from ages 7 to 18.",
    [
      {
        q: "Does height matter in baseball?",
        a: "It helps with pitching leverage and outfield range, but plenty of elite players are undersized. Skill, speed, and strength matter far more at youth levels.",
      },
      {
        q: "How much will I still grow?",
        a: "Most boys finish the majority of their growth between 16 and 18. A pediatrician can estimate remaining growth from a bone-age x-ray.",
      },
    ],
    ["baseball-weight-calculator", "baseball-bmi-calculator", "baseball-age-calculator"],
  ),
  metricCalc(
    "baseball-weight-calculator",
    "weight",
    "Baseball Weight Calculator",
    "See how your weight compares to baseball players your age, with percentile ranking and an age-by-age growth chart.",
    [
      {
        q: "Do I need to gain weight to play baseball?",
        a: "Playable strength matters more than scale weight. If you are under the 25th percentile and struggling with velocity, adding lean mass usually helps.",
      },
      {
        q: "How fast should a young athlete gain weight?",
        a: "About 0.5-1 pound per week of mostly lean mass is a realistic, healthy pace for a growing high school athlete.",
      },
    ],
    ["baseball-height-calculator", "baseball-bmi-calculator", "exit-velocity-calculator"],
  ),
  metricCalc(
    "throwing-velocity-calculator",
    "throwing-velocity",
    "Throwing Velocity Calculator",
    "Check your position-player throwing velocity against age benchmarks, see your percentile, and set your next arm-strength goal.",
    [
      {
        q: "Is throwing velocity different from pitching velocity?",
        a: "Yes. Crow-hop position throws usually read a few mph higher than mound velocity for the same athlete.",
      },
      {
        q: "How do I throw harder from the outfield?",
        a: "Build arm speed with a structured throwing program, improve lower-half sequencing on the crow hop, and stay consistent with arm care.",
      },
    ],
    ["pitching-velocity-calculator", "sixty-yard-dash-calculator", "vertical-jump-calculator"],
  ),
  metricCalc(
    "sixty-yard-dash-calculator",
    "sixty-yard-dash",
    "60-Yard Dash Calculator",
    "Compare your 60-yard dash time to baseball speed benchmarks by age, get your percentile, and set your next sprint goal.",
    [
      {
        q: "What is a good 60-yard dash time?",
        a: "Under 7.0 seconds is a plus-run at the high school level. Around 6.6-6.7 seconds is a legitimate college recruiting number.",
      },
      {
        q: "Why is my showcase time slower than my practice time?",
        a: "Hand timing at practice is usually 0.2-0.3 seconds faster than laser timing at showcases.",
      },
    ],
    ["vertical-jump-calculator", "baseball-weight-calculator", "throwing-velocity-calculator"],
  ),
  metricCalc(
    "vertical-jump-calculator",
    "vertical-jump",
    "Vertical Jump Calculator",
    "Measure lower-body power against baseball age benchmarks with percentile ranking and a next-goal target.",
    [
      {
        q: "Why does vertical jump matter in baseball?",
        a: "It is a simple proxy for lower-body explosiveness, which correlates with both exit velocity and pitching velocity.",
      },
      {
        q: "How do I improve my vertical?",
        a: "Squat and hinge strength, plus low-volume jump and med-ball work two to three times per week.",
      },
    ],
    ["sixty-yard-dash-calculator", "exit-velocity-calculator", "baseball-bmi-calculator"],
  ),
  {
    slug: "baseball-bmi-calculator",
    name: "Baseball BMI Calculator",
    h1: "Baseball BMI Calculator",
    title: "Baseball BMI Calculator — Lean, Athletic or Strong Build | Diamond Development",
    description:
      "A baseball-specific body composition estimator. Enter height and weight to see where you land on the lean-to-power-build scale, with educational guidance.",
    intro:
      "BMI was never designed for athletes, so we frame it the way a strength coach would: is your current build lean, athletic, strong, or power-oriented for baseball? This is educational information only and is not medical advice.",
    kind: "bmi",
    faqs: [
      {
        q: "Is BMI accurate for baseball players?",
        a: "Not on its own. Muscular athletes often read 'overweight' on standard BMI charts. Use it as one rough data point next to strength, speed, and velocity numbers.",
      },
      {
        q: "What build is best for baseball?",
        a: "There is no single answer. Pitchers often benefit from added mass for leverage and durability; middle infielders and outfielders usually prioritize a leaner, faster build.",
      },
      {
        q: "Is this medical advice?",
        a: "No. It is educational only. Talk to a doctor or registered dietitian before making major changes to nutrition or body weight, especially for growing athletes.",
      },
    ],
    related: ["baseball-weight-calculator", "baseball-height-calculator", "exit-velocity-calculator"],
  },
  {
    slug: "baseball-age-calculator",
    name: "Baseball Age Calculator",
    h1: "Baseball Age Calculator",
    title: "Baseball League Age Calculator — Division & Grade Finder | Diamond Development",
    description:
      "Enter a birth date to get exact age, baseball league age (Aug 31 cutoff), expected school grade, and the suggested baseball division.",
    intro:
      "Youth baseball uses 'league age', not your birthday age. Most organizations set the cutoff at August 31, so a player's league age for the season may differ from their real age by a year.",
    kind: "age",
    faqs: [
      {
        q: "What is baseball league age?",
        a: "League age is the age used to place a player in a division. Little League and most travel organizations use an August 31 cutoff for the upcoming season.",
      },
      {
        q: "Which division should my child play in?",
        a: "Divisions vary by organization, but league age is the primary driver. Use the suggestion here as a starting point and confirm with your local league.",
      },
      {
        q: "Can a player play up an age group?",
        a: "Most organizations allow playing up but not playing down. Playing up should be based on skill, physical maturity, and safety, not just ambition.",
      },
    ],
    related: ["pitching-velocity-calculator", "baseball-height-calculator", "baseball-weight-calculator"],
  },
];

export function calculatorBySlug(slug: string) {
  return CALCULATORS.find((c) => c.slug === slug);
}
