import type { MetricKey } from "@/lib/benchmarks";

export type StatPage = {
  path: string;
  metric: MetricKey;
  h1: string;
  title: string;
  description: string;
  intro: string;
  improve: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
  calculators: string[];
};

export const STAT_PAGES: StatPage[] = [
  {
    path: "/average-height-by-age",
    metric: "height",
    h1: "Average Baseball Player Height by Age",
    title: "Average Baseball Player Height by Age (7-18) | Diamond Development",
    description:
      "Average and elite height for baseball players ages 7 through 18, with a growth chart, percentile table, and a free height percentile calculator.",
    intro:
      "Height is one of the most-asked-about numbers in youth baseball, mostly because families want to know whether a player is on pace. Below are typical heights for baseball players from age 7 through 18, along with the 90th-percentile mark at each age.",
    improve: [
      {
        heading: "Sleep is the growth lever you control",
        body: "Most growth hormone release happens during deep sleep. Nine to ten hours per night through the growth years does more for height than any supplement.",
      },
      {
        heading: "Fuel the growth spurt",
        body: "Underfeeding during a growth spurt costs strength, not height. Prioritize protein at every meal plus enough total calories to support training.",
      },
      {
        heading: "Train what height cannot give you",
        body: "Bat speed, sprint speed, and arm strength are all trainable. Undersized players who move well keep getting recruited every year.",
      },
    ],
    faqs: [
      {
        q: "What is the average height for a 12-year-old baseball player?",
        a: "Roughly 59-60 inches, or about 4 feet 11 inches. The 90th percentile at that age is close to 63.5 inches.",
      },
      {
        q: "Is being short a problem in baseball?",
        a: "No. Height helps pitchers with leverage, but there is no height requirement for hitting, fielding, or speed, and short players succeed at every level.",
      },
      {
        q: "When do baseball players stop growing?",
        a: "Most male athletes finish growing between 16 and 18, though some add another inch into their late teens.",
      },
    ],
    calculators: ["baseball-height-calculator", "baseball-weight-calculator", "baseball-bmi-calculator"],
  },
  {
    path: "/average-weight-by-age",
    metric: "weight",
    h1: "Average Baseball Player Weight by Age",
    title: "Average Baseball Player Weight by Age (7-18) | Diamond Development",
    description:
      "Average and 90th-percentile weight for baseball players ages 7-18, plus a growth chart and a free weight percentile calculator.",
    intro:
      "Body weight tracks closely with the ability to produce force, which is why it shows up in nearly every velocity conversation. Here is what typical and high-end weight looks like for baseball players from age 7 to 18.",
    improve: [
      {
        heading: "Eat like you train",
        body: "Three meals plus two substantial snacks, with protein at each. Most players who cannot gain weight are simply under-eating on training days.",
      },
      {
        heading: "Lift for mass, not just conditioning",
        body: "Progressive squats, hinges, presses, and pulls two to three times per week build the lean mass that shows up on the scale and the radar gun.",
      },
      {
        heading: "Track the scale weekly, not daily",
        body: "Weigh in at the same time each week. A steady half-pound to one pound per week is a healthy climb for a high schooler.",
      },
    ],
    faqs: [
      {
        q: "How much should a 14-year-old baseball player weigh?",
        a: "The average is around 115 pounds, with the 90th percentile near 141 pounds. Frame size and growth timing matter more than hitting an exact number.",
      },
      {
        q: "Does weight increase pitching velocity?",
        a: "Added lean mass usually helps, because more usable force in the lower half tends to raise velocity. Added fat mass does not have the same effect.",
      },
      {
        q: "Should young players cut weight?",
        a: "Growing athletes should almost never diet aggressively. Focus on food quality and training volume, and consult a doctor before any weight-loss plan.",
      },
    ],
    calculators: ["baseball-weight-calculator", "baseball-bmi-calculator", "baseball-height-calculator"],
  },
  {
    path: "/average-60-yard-dash-by-age",
    metric: "sixty-yard-dash",
    h1: "Average 60-Yard Dash Time by Age",
    title: "Average 60-Yard Dash Time by Age in Baseball (7-18) | Diamond Development",
    description:
      "Average and elite 60-yard dash times for baseball players ages 7-18, with a speed chart, benchmark table, and a free 60 time percentile calculator.",
    intro:
      "The 60-yard dash is the standard speed test at baseball showcases and camps. It is the number recruiters check first, because speed plays on both sides of the ball. Here are the typical and elite times by age.",
    improve: [
      {
        heading: "Sprint at full speed every week",
        body: "Speed is a skill. Two short sessions per week of maximal 20-40 yard sprints with full recovery beat any amount of conditioning work.",
      },
      {
        heading: "Fix the first three steps",
        body: "Most youth 60 times are lost in the start. Practice a rolling start with an aggressive forward lean and long, powerful early strides.",
      },
      {
        heading: "Get stronger in the weight room",
        body: "Squats, single-leg work, and hip extension strength directly raise the force you can put into the ground.",
      },
    ],
    faqs: [
      {
        q: "What is a good 60-yard dash time for a high school player?",
        a: "Under 7.0 seconds is above average, around 6.8 is a plus runner, and 6.6 or faster gets attention from college programs.",
      },
      {
        q: "How is the 60 timed?",
        a: "From a rolling start over 60 yards, either hand-timed or laser-timed. Laser times generally read 0.2-0.3 seconds slower than hand times.",
      },
      {
        q: "How much can I improve my 60 time?",
        a: "A focused off-season of sprint work and strength training often takes 0.2-0.4 seconds off a young player's time.",
      },
    ],
    calculators: ["sixty-yard-dash-calculator", "vertical-jump-calculator", "baseball-weight-calculator"],
  },
  {
    path: "/average-throwing-velocity-by-age",
    metric: "throwing-velocity",
    h1: "Average Throwing Velocity by Age",
    title: "Average Baseball Throwing Velocity by Age (7-18) | Diamond Development",
    description:
      "Position-player throwing velocity averages and elite marks for ages 7-18, with a chart, table, and free throwing velocity percentile calculator.",
    intro:
      "Position-player arm strength is measured on a crow-hop throw, not off a mound, and it usually reads a few miles per hour higher than the same athlete's pitching velocity. Here is what average and elite look like by age.",
    improve: [
      {
        heading: "Run a real throwing program",
        body: "Long toss two to three times per week with a structured build-up and pull-down phase is the most reliable way to add arm speed.",
      },
      {
        heading: "Use the lower half",
        body: "A strong, directional crow hop transfers ground force into the throw. Many players leave 5 mph on the field with a lazy footwork pattern.",
      },
      {
        heading: "Protect the arm",
        body: "Daily arm care, shoulder and scap work, and honest rest days keep arm speed available all season.",
      },
    ],
    faqs: [
      {
        q: "What is a good outfield throwing velocity in high school?",
        a: "Around 78-82 mph is solid at the varsity level, and 85+ mph is a college-level arm from the outfield.",
      },
      {
        q: "Why is my throwing velocity higher than my pitching velocity?",
        a: "A crow hop lets you build momentum before release, while pitching starts from a controlled position on a mound.",
      },
      {
        q: "How often should I test arm strength?",
        a: "Every six to eight weeks, always fully warmed up and never on a day you are already fatigued.",
      },
    ],
    calculators: ["throwing-velocity-calculator", "pitching-velocity-calculator", "vertical-jump-calculator"],
  },
  {
    path: "/average-vertical-jump-by-age",
    metric: "vertical-jump",
    h1: "Average Vertical Jump by Age for Baseball Players",
    title: "Average Vertical Jump by Age for Baseball Players (7-18) | Diamond Development",
    description:
      "Vertical jump averages and elite marks for baseball players ages 7-18, with a power chart, table, and a free vertical jump percentile calculator.",
    intro:
      "Vertical jump is the simplest test of lower-body explosiveness, and it correlates with both exit velocity and pitching velocity. Here is how baseball players typically test from age 7 through 18.",
    improve: [
      {
        heading: "Build the base first",
        body: "Squat and hinge strength drive jump height. Get strong before adding heavy plyometric volume.",
      },
      {
        heading: "Jump fresh, not tired",
        body: "Low-volume, high-quality jumps two to three times per week train the nervous system. Jumping while fatigued trains conditioning, not power.",
      },
      {
        heading: "Train the whole force curve",
        body: "Pair heavy lifting with med-ball throws and short sprints so force is produced fast, not just produced.",
      },
    ],
    faqs: [
      {
        q: "What is a good vertical jump for a high school baseball player?",
        a: "Around 24-26 inches is typical for a 16-18 year old, and 30+ inches is elite for that age group.",
      },
      {
        q: "Does vertical jump predict exit velocity?",
        a: "Not perfectly, but higher jumpers tend to hit the ball harder because both depend on lower-body force production.",
      },
      {
        q: "How is the vertical jump measured?",
        a: "A standing countermovement jump on a Vertec or jump mat, taking the best of three attempts.",
      },
    ],
    calculators: ["vertical-jump-calculator", "sixty-yard-dash-calculator", "exit-velocity-calculator"],
  },
];

export function statPageByPath(path: string) {
  return STAT_PAGES.find((p) => p.path === path);
}

/** Age-specific pitching velocity pages: /average-pitching-velocity/7-year-olds */
export const PITCH_AGE_SLUGS = Array.from({ length: 12 }, (_, i) => `${i + 7}-year-olds`);

export function ageFromSlug(slug: string): number | null {
  const m = /^(\d{1,2})-year-olds$/.exec(slug);
  if (!m) return null;
  const age = Number(m[1]);
  return age >= 7 && age <= 18 ? age : null;
}
