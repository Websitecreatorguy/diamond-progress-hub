// SEO article registry. Each entry powers a route at /resources/[slug].
// Keep content factual and useful; these pages are indexed by Google.

export type FAQ = { q: string; a: string };
export type Section = { heading: string; body: string; sub?: { heading: string; body: string }[] };
export type Article = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  category:
    | "Benchmarks"
    | "Training"
    | "Recovery"
    | "Nutrition"
    | "Calculators"
    | "Guides";
  readMinutes: number;
  updated: string;
  intro: string;
  sections: Section[];
  faqs: FAQ[];
  related?: string[];
};

const UPDATED = "2026-07-15";

export const ARTICLES: Article[] = [
  {
    slug: "average-exit-velocity-by-age",
    title: "Average Exit Velocity by Age (Youth to College) — Diamond Development",
    h1: "Average Exit Velocity by Age",
    description:
      "Age-by-age exit velocity benchmarks for baseball players from 8U through college, plus how to measure and improve your own.",
    category: "Benchmarks",
    readMinutes: 6,
    updated: UPDATED,
    intro:
      "Exit velocity is the speed of the ball off the bat, measured in miles per hour. It is one of the strongest indicators of hitting power at every level of baseball. Below are typical exit velocity ranges by age, based on data collected from thousands of youth and high school players.",
    sections: [
      {
        heading: "Exit velocity benchmarks by age",
        body: "These are typical ranges — the low end represents developing players, and the high end represents advanced players at that age.",
        sub: [
          { heading: "8U", body: "Average: 40–48 mph. Advanced: 52+ mph." },
          { heading: "10U", body: "Average: 45–55 mph. Advanced: 60+ mph." },
          { heading: "12U", body: "Average: 55–65 mph. Advanced: 70+ mph." },
          { heading: "14U", body: "Average: 65–75 mph. Advanced: 80+ mph." },
          { heading: "High School (15–18)", body: "Average: 75–85 mph. Advanced: 90+ mph. D1 recruits routinely hit 95+ mph." },
          { heading: "College", body: "Average: 88–95 mph. Elite: 100+ mph." },
        ],
      },
      {
        heading: "How exit velocity is measured",
        body: "Exit velocity is measured with a radar device (like a HitTrax, Rapsodo, or Pocket Radar) positioned in front of the hitter. Take multiple swings off a tee and average the top 5 hits — that's your true exit velocity, not a lucky single swing.",
      },
      {
        heading: "How to increase exit velocity",
        body: "Exit velo comes from three levers: bat speed, barrel accuracy, and body strength. Improve all three with a structured plan.",
        sub: [
          { heading: "Bat speed", body: "Overload/underload bat training (heavier and lighter bats) 2–3x per week increases bat speed measurably in 6–8 weeks." },
          { heading: "Strength", body: "Lower body power (squats, deadlifts, medicine ball throws) transfers directly to rotational power." },
          { heading: "Barrel accuracy", body: "Tee work and front-toss reps focused on hitting the ball on the sweet spot make your average exit velo climb even if your max stays the same." },
        ],
      },
    ],
    faqs: [
      { q: "What is a good exit velocity for a 12 year old?", a: "A typical 12U hitter is in the 55–65 mph range. Anything above 70 mph is advanced and puts a player among the top performers in their age group." },
      { q: "What exit velocity do college scouts look for?", a: "D1 recruits generally hit 95+ mph exit velo by their junior year of high school. D2/D3 recruits often sit in the 88–94 range." },
      { q: "How often should I measure exit velocity?", a: "Once every 2–4 weeks is enough to see progress. Measuring daily creates noise and stress; the trend line matters more than the daily number." },
    ],
    related: ["average-bat-speed-by-age", "bat-speed-calculator", "baseball-strength-training"],
  },
  {
    slug: "average-pitching-velocity-by-age",
    title: "Average Pitching Velocity by Age — Diamond Development",
    h1: "Average Pitching Velocity by Age",
    description:
      "Fastball velocity benchmarks by age for baseball pitchers, from Little League through college, plus safe ways to add velocity.",
    category: "Benchmarks",
    readMinutes: 6,
    updated: UPDATED,
    intro:
      "Fastball velocity is one of the most tracked metrics in baseball. But raw MPH means very little without context — a 70 mph fastball is dominant at 12U and average at 15U. Use the ranges below as a reference, not a target.",
    sections: [
      {
        heading: "Fastball velocity by age",
        body: "Typical fastball velocity ranges for youth and high school pitchers.",
        sub: [
          { heading: "8U", body: "Average: 40–45 mph. Advanced: 50+ mph." },
          { heading: "10U", body: "Average: 45–55 mph. Advanced: 60+ mph." },
          { heading: "12U", body: "Average: 55–65 mph. Advanced: 70+ mph." },
          { heading: "14U", body: "Average: 65–75 mph. Advanced: 80+ mph." },
          { heading: "High school (JV)", body: "Average: 72–80 mph." },
          { heading: "High school (Varsity)", body: "Average: 78–85 mph. D1 recruits: 88–95 mph." },
          { heading: "College", body: "Average: 87–92 mph. Elite: 95+ mph." },
        ],
      },
      {
        heading: "Safe ways to add velocity",
        body: "Long-toss programs, weighted ball throwing (with proper supervision), and lower body strength work all correlate with added fastball velocity. But arm health comes first — no player under 14 should throw weighted balls without a qualified coach.",
      },
      {
        heading: "Pitch count and rest",
        body: "Follow Pitch Smart guidelines. A 12 year old should throw a maximum of 85 pitches per game and needs 4 days of rest after 66+ pitches. Ignoring rest is the fastest path to Tommy John surgery.",
      },
    ],
    faqs: [
      { q: "What is a good fastball for a 13 year old?", a: "A typical 13U pitcher throws 60–70 mph. Advanced 13U pitchers sit in the mid 70s." },
      { q: "How can I add velocity as a high schooler?", a: "Consistent long toss (3x per week), lower body strength training, and improved mechanics deliver the biggest gains. Most high schoolers can add 3–6 mph in an off-season with a structured plan." },
      { q: "Are radar guns accurate?", a: "Modern radar devices (Pocket Radar, Stalker) are accurate within 1 mph. Older Bushnell units can be off by 2–3 mph and should not be trusted for recruiting numbers." },
    ],
    related: ["baseball-arm-care", "pitch-velocity-calculator"],
  },
  {
    slug: "average-bat-speed-by-age",
    title: "Average Bat Speed by Age — Diamond Development",
    h1: "Average Bat Speed by Age",
    description: "Bat speed benchmarks by age, plus training drills that measurably increase swing speed.",
    category: "Benchmarks",
    readMinutes: 5,
    updated: UPDATED,
    intro:
      "Bat speed is the speed of the barrel at the moment of contact, measured in miles per hour. It's the largest contributor to exit velocity — increase bat speed, and exit velo follows.",
    sections: [
      {
        heading: "Bat speed by age",
        body: "Typical bat speed ranges based on Blast Motion and Diamond Kinetics data.",
        sub: [
          { heading: "10U", body: "Average: 40–48 mph." },
          { heading: "12U", body: "Average: 48–58 mph." },
          { heading: "14U", body: "Average: 58–65 mph." },
          { heading: "High school", body: "Average: 65–75 mph. D1 recruits: 75+ mph." },
          { heading: "College", body: "Average: 72–80 mph." },
        ],
      },
      {
        heading: "Training to increase bat speed",
        body: "Overload/underload bat training (typically a bat 20% heavier and 20% lighter than your gamer) done 3x per week for 6 weeks reliably adds 3–5 mph of bat speed.",
      },
    ],
    faqs: [
      { q: "How is bat speed different from exit velocity?", a: "Bat speed measures the barrel; exit velo measures the ball. A player with high bat speed but poor contact will have inconsistent exit velo." },
      { q: "What sensor should I use?", a: "Blast Motion attaches to the knob and is the most popular for player tracking. Diamond Kinetics is also excellent." },
    ],
    related: ["average-exit-velocity-by-age", "bat-speed-calculator"],
  },
  {
    slug: "average-pop-time-by-age",
    title: "Average Pop Time by Age (Catchers) — Diamond Development",
    h1: "Average Pop Time by Age",
    description: "Catcher pop time benchmarks by age and skill level, plus drills to improve your pop.",
    category: "Benchmarks",
    readMinutes: 4,
    updated: UPDATED,
    intro:
      "Pop time is the elapsed time from the moment the ball hits the catcher's mitt to the moment it lands in the middle infielder's glove at second base on a throw-down. It's the number one recruiting metric for catchers.",
    sections: [
      {
        heading: "Pop time benchmarks",
        body: "",
        sub: [
          { heading: "12U", body: "Average: 2.4–2.6 seconds. Advanced: 2.2s." },
          { heading: "14U", body: "Average: 2.2–2.4 seconds. Advanced: 2.0s." },
          { heading: "High school", body: "Average: 2.0–2.2s. D1 recruits: 1.95 or lower." },
          { heading: "College/Pro", body: "1.85–2.0 seconds." },
        ],
      },
      {
        heading: "How to lower your pop time",
        body: "Footwork (jab step or replace step), exchange speed (glove-to-hand transfer), and arm strength all contribute. Most catchers gain the fastest by drilling exchange with a partner — 100 exchanges per day for a month typically shaves 0.1s off a pop time.",
      },
    ],
    faqs: [
      { q: "What is a college-level pop time?", a: "D1 recruits sit at 1.95 or lower. D2/D3 recruits typically run 2.0–2.05." },
      { q: "How do I measure pop time?", a: "Use a stopwatch or a phone app. Start the timer at ball-in-mitt, stop when the throw is caught at second base. Average 5 attempts." },
    ],
    related: ["average-pitching-velocity-by-age"],
  },
  {
    slug: "baseball-height-by-age",
    title: "Baseball Player Height by Age — Diamond Development",
    h1: "Baseball Player Height by Age",
    description: "Average height ranges for youth, high school, and college baseball players by age.",
    category: "Benchmarks",
    readMinutes: 4,
    updated: UPDATED,
    intro:
      "Height matters at some positions (pitcher, first base) more than others (middle infield, catcher). Below are typical height ranges by age based on CDC data cross-referenced with active roster data.",
    sections: [
      {
        heading: "Height by age",
        body: "",
        sub: [
          { heading: "10U (age 9–10)", body: "4'6\" – 4'11\" (137–150 cm)" },
          { heading: "12U (age 11–12)", body: "4'11\" – 5'4\" (150–163 cm)" },
          { heading: "14U (age 13–14)", body: "5'3\" – 5'9\" (160–175 cm)" },
          { heading: "High school (15–18)", body: "5'8\" – 6'1\" (172–185 cm)" },
          { heading: "College", body: "5'11\" – 6'3\" (180–190 cm)" },
        ],
      },
      {
        heading: "Does height matter for recruiting?",
        body: "For pitchers and corner infielders, yes — but only as a data point. A 5'10\" pitcher throwing 92 is a better prospect than a 6'4\" pitcher throwing 84. Skill trumps size.",
      },
    ],
    faqs: [
      { q: "Can a short player still play college baseball?", a: "Absolutely — many D1 middle infielders and catchers are under 6'0\". Focus on developing plus tools." },
    ],
    related: ["baseball-weight-by-age"],
  },
  {
    slug: "baseball-weight-by-age",
    title: "Baseball Player Weight by Age — Diamond Development",
    h1: "Baseball Player Weight by Age",
    description: "Average weight ranges for baseball players by age, plus safe ways to add muscle mass.",
    category: "Benchmarks",
    readMinutes: 4,
    updated: UPDATED,
    intro:
      "Adding lean mass is one of the most reliable ways to increase exit velocity and pitching velo — but doing it wrong (adding fat or lifting without a plan) can slow you down and increase injury risk.",
    sections: [
      {
        heading: "Weight benchmarks by age",
        body: "",
        sub: [
          { heading: "10U", body: "70–95 lb" },
          { heading: "12U", body: "90–130 lb" },
          { heading: "14U", body: "115–160 lb" },
          { heading: "High school", body: "150–200 lb" },
          { heading: "College", body: "180–220 lb" },
        ],
      },
      {
        heading: "How to safely gain mass",
        body: "Eat in a small caloric surplus (300–500 above maintenance), prioritize 1g of protein per pound of bodyweight, and lift 3–4x per week with progressive overload. Expect 1–1.5 lb of lean mass per month — anything faster is usually fat.",
      },
    ],
    faqs: [
      { q: "How much weight should I gain in a year?", a: "A 15–16 year old can safely add 15–25 pounds of lean mass in a year with structured training and nutrition." },
    ],
    related: ["baseball-nutrition", "baseball-strength-training"],
  },
  {
    slug: "baseball-strength-training",
    title: "Baseball Strength Training: The Complete Guide — Diamond Development",
    h1: "Baseball Strength Training Guide",
    description: "Age-appropriate strength training for baseball players, including sample weekly plans and key lifts.",
    category: "Training",
    readMinutes: 8,
    updated: UPDATED,
    intro:
      "Baseball is a power sport disguised as a skill sport. Every 90-mph throw and 95-mph exit velo starts with lower body force production. Strength training done right is the highest-leverage thing a serious player can do in the offseason.",
    sections: [
      {
        heading: "Foundational lifts",
        body: "Every baseball strength program is built around a few core movements.",
        sub: [
          { heading: "Trap-bar deadlift", body: "The safest full-body lift for young athletes. 3 sets of 5 reps, 2x per week." },
          { heading: "Goblet or front squat", body: "Front-loaded squats teach bracing and are safer for the lower back than back squat." },
          { heading: "Rows and pull-ups", body: "Balance out all the throwing you do with pulling work. 3x per week minimum." },
          { heading: "Medicine ball throws", body: "Rotational power transfers directly to swing and throw. 3–5 sets of 4–6 throws, 3x per week." },
        ],
      },
      {
        heading: "Sample week (15–18 year old)",
        body: "Monday: Lower body strength. Tuesday: Upper push + rotational power. Wednesday: Speed and mobility. Thursday: Lower body power. Friday: Upper pull + arm care. Weekend: Skill work and recovery.",
      },
      {
        heading: "What to avoid",
        body: "Behind-the-neck presses, upright rows, and heavy overhead pressing all put the throwing shoulder in bad positions. Skip them.",
      },
    ],
    faqs: [
      { q: "When can kids start lifting weights?", a: "Age 12–13 with bodyweight and light dumbbell work. Barbell work starts safely at 14–15 with qualified coaching." },
      { q: "How many days per week?", a: "3–4 lifting days is optimal for in-season and off-season. 5+ days interferes with skill work and recovery." },
    ],
    related: ["baseball-workout-plans", "baseball-recovery"],
  },
  {
    slug: "baseball-speed-training",
    title: "Baseball Speed Training — Diamond Development",
    h1: "Baseball Speed Training",
    description: "Sprint mechanics, first-step quickness, and 60-yard dash training for baseball players.",
    category: "Training",
    readMinutes: 6,
    updated: UPDATED,
    intro:
      "Baseball speed is short and explosive — a 90-foot dash between bases. Training for it looks nothing like distance running.",
    sections: [
      {
        heading: "The three speeds baseball players need",
        body: "",
        sub: [
          { heading: "First step (0–10 ft)", body: "This is what wins bag steals and infield hits. Train with resisted starts and lateral shuffles." },
          { heading: "Acceleration (10–30 yards)", body: "Where you make up ground on a fly ball. Train with 10–20 yard sprints from a two-point stance." },
          { heading: "Top speed (30+ yards)", body: "Matters for the 60-yard dash and long fly balls. Train with 40–60 yard flying sprints." },
        ],
      },
      {
        heading: "Sample speed workout",
        body: "Dynamic warm-up (10 min). 4x10-yard sprints. 4x20-yard sprints. 2x40-yard sprints. Full recovery between reps (60–90s).",
      },
    ],
    faqs: [
      { q: "How do I improve my 60?", a: "The biggest gains come from cleaning up sprint mechanics (arm action, forward lean) and adding lower body strength — not just running more." },
    ],
    related: ["baseball-strength-training", "baseball-workout-plans"],
  },
  {
    slug: "baseball-workout-plans",
    title: "Baseball Workout Plans (Free Weekly Program) — Diamond Development",
    h1: "Baseball Workout Plans",
    description: "Free 7-day baseball training plan covering strength, speed, arm care, and skill work.",
    category: "Training",
    readMinutes: 7,
    updated: UPDATED,
    intro:
      "Below is a proven 7-day offseason plan used by players in the Diamond Development app. It balances strength, power, speed, and skill without burning out young athletes.",
    sections: [
      {
        heading: "The 7-day split",
        body: "",
        sub: [
          { heading: "Monday", body: "Lower body strength + hitting (goblet squats, RDLs, tee work, front toss)." },
          { heading: "Tuesday", body: "Upper body push + throwing progression (long toss)." },
          { heading: "Wednesday", body: "Speed, agility, mobility (sprints, lateral work, yoga)." },
          { heading: "Thursday", body: "Lower body power + hitting (box jumps, med ball, hitting)." },
          { heading: "Friday", body: "Upper body pull + arm care (bands, rows, sleeper stretch)." },
          { heading: "Saturday", body: "Live skill work — game or scrimmage." },
          { heading: "Sunday", body: "Full recovery (walk, mobility, sleep)." },
        ],
      },
      {
        heading: "Get personalized plans in the app",
        body: "The Diamond Development app auto-generates this program adjusted for your age, position, and current metrics. Sign up free to get started.",
      },
    ],
    faqs: [
      { q: "How many hours per week?", a: "8–12 hours per week including skill work is a healthy load for a high school player. Little Leaguers should stay under 6 hours." },
    ],
    related: ["baseball-strength-training", "baseball-recovery", "baseball-practice-plans"],
  },
  {
    slug: "baseball-arm-care",
    title: "Baseball Arm Care Program — Diamond Development",
    h1: "Baseball Arm Care Program",
    description: "Complete arm care routine to prevent injury and add pitching velocity safely.",
    category: "Recovery",
    readMinutes: 6,
    updated: UPDATED,
    intro:
      "The number one cause of Tommy John surgery in young players isn't overuse of any single pitch — it's cumulative fatigue and skipped recovery. A 15-minute arm care routine, done daily, dramatically reduces injury risk.",
    sections: [
      {
        heading: "Daily arm care routine",
        body: "",
        sub: [
          { heading: "Bands (Jaeger J-Bands)", body: "10 reps of each movement: external rotation, internal rotation, forward flexion, scap retraction. 5 minutes." },
          { heading: "Rotator cuff", body: "3x10 of face pulls, prone Ys and Ts. 3 minutes." },
          { heading: "Sleeper stretch", body: "2x30 seconds each side to maintain internal rotation range." },
          { heading: "Wrist and forearm", body: "Grippers, wrist rollers, reverse curls. 3 minutes." },
        ],
      },
      {
        heading: "Post-throwing recovery",
        body: "Ice or cold plunge (10 min), foam roll lats and thoracic spine, sleep 8+ hours.",
      },
    ],
    faqs: [
      { q: "Should I ice after every outing?", a: "Yes for pitchers — 10 minutes of ice on the shoulder reduces inflammation. Not necessary after position player throwing." },
    ],
    related: ["baseball-recovery", "average-pitching-velocity-by-age"],
  },
  {
    slug: "baseball-recovery",
    title: "Baseball Recovery Guide — Diamond Development",
    h1: "Baseball Recovery Guide",
    description: "How pro baseball players recover between games and workouts — sleep, nutrition, and active recovery.",
    category: "Recovery",
    readMinutes: 5,
    updated: UPDATED,
    intro:
      "Recovery isn't lazy — it's when adaptation happens. Skip it and every training rep becomes less effective.",
    sections: [
      { heading: "Sleep is the biggest lever", body: "8–10 hours per night for teenage athletes. Every hour of sleep debt measurably reduces reaction time and increases injury risk." },
      { heading: "Fuel the recovery", body: "20–30g of protein and 40–60g of carbs within 60 minutes of training." },
      { heading: "Active recovery days", body: "Walking, easy swimming, or yoga on non-training days. Complete rest is fine too." },
    ],
    faqs: [
      { q: "Should I take rest weeks?", a: "Yes — a full deload week every 6–8 weeks prevents burnout and lets soft tissue catch up." },
    ],
    related: ["baseball-arm-care", "baseball-nutrition"],
  },
  {
    slug: "baseball-nutrition",
    title: "Baseball Nutrition Guide — Diamond Development",
    h1: "Baseball Nutrition Guide",
    description: "Practical nutrition guidance for baseball players — meal timing, macros, and gaining mass the right way.",
    category: "Nutrition",
    readMinutes: 6,
    updated: UPDATED,
    intro:
      "Baseball players don't need exotic supplements — they need enough calories, enough protein, and enough water. Most young athletes eat too little to support growth and training.",
    sections: [
      {
        heading: "How much to eat",
        body: "Multiply bodyweight (lb) by 18–20 for maintenance. Add 300–500 kcal to gain mass. Add 20g of protein at every meal.",
      },
      {
        heading: "Sample game-day meals",
        body: "3 hours before: oatmeal, banana, eggs, peanut butter. 1 hour before: bagel, honey, chocolate milk. Between games: turkey sandwich, fruit, sports drink.",
      },
      {
        heading: "Hydration",
        body: "Half your bodyweight (lb) in ounces of water daily. Add electrolytes in hot weather.",
      },
    ],
    faqs: [
      { q: "Are protein shakes necessary?", a: "Only if you can't hit 1g/lb of protein through whole food. Shakes are convenient, not magical." },
      { q: "What about creatine?", a: "Safe and effective for players 15+. 3–5g per day. Discuss with a parent and doctor first." },
    ],
    related: ["baseball-weight-by-age", "baseball-recovery"],
  },
  {
    slug: "baseball-mobility",
    title: "Baseball Mobility Routine — Diamond Development",
    h1: "Baseball Mobility Routine",
    description: "Mobility exercises for baseball players to improve rotation, shoulder health, and hip range of motion.",
    category: "Training",
    readMinutes: 5,
    updated: UPDATED,
    intro:
      "Mobility is often overlooked but it's the difference between a smooth swing and a stiff one. Focus on the hips, thoracic spine, and shoulders.",
    sections: [
      {
        heading: "Daily mobility flow (10 minutes)",
        body: "",
        sub: [
          { heading: "World's greatest stretch", body: "5 reps per side. Hits hip flexors and thoracic rotation." },
          { heading: "90/90 hip switches", body: "10 per side. Builds internal and external hip rotation." },
          { heading: "Thoracic spine rotations", body: "10 per side. Critical for hitters." },
          { heading: "Sleeper stretch", body: "30 seconds per side. Keeps throwing shoulder healthy." },
        ],
      },
    ],
    faqs: [
      { q: "Should I stretch before games?", a: "Do dynamic warm-ups (leg swings, lunges) before games. Save static stretching for after." },
    ],
    related: ["baseball-stretching", "baseball-arm-care"],
  },
  {
    slug: "baseball-stretching",
    title: "Baseball Stretching Guide — Diamond Development",
    h1: "Baseball Stretching Guide",
    description: "Dynamic warm-up and post-game static stretching routines for baseball players.",
    category: "Training",
    readMinutes: 4,
    updated: UPDATED,
    intro:
      "Stretching is not the same as mobility. Stretching lengthens muscle; mobility improves control through range. Both matter.",
    sections: [
      {
        heading: "Pre-game dynamic warm-up",
        body: "Leg swings, lunges with rotation, arm circles, band pull-aparts. Never static stretch before performing.",
      },
      {
        heading: "Post-game static stretching",
        body: "Hamstrings, quads, chest, lats, forearm. Hold each for 30 seconds.",
      },
    ],
    faqs: [
      { q: "Does static stretching hurt performance?", a: "Only when done immediately before explosive activity. It's fine and helpful after training." },
    ],
    related: ["baseball-mobility"],
  },
  {
    slug: "baseball-practice-plans",
    title: "Baseball Practice Plans (Coaches Guide) — Diamond Development",
    h1: "Baseball Practice Plans",
    description: "Structured practice plans for youth and high school baseball teams.",
    category: "Guides",
    readMinutes: 6,
    updated: UPDATED,
    intro:
      "A great practice keeps every player active for 90+ minutes with minimal standing around. Use station-based drills and small groups.",
    sections: [
      {
        heading: "Sample 90-minute practice",
        body: "10 min warm-up. 15 min throwing progression. 20 min defense (rotate positions). 25 min hitting stations (tee, front toss, live BP). 15 min baserunning + situational. 5 min team meeting.",
      },
    ],
    faqs: [
      { q: "How long should youth practices be?", a: "60–75 minutes for 12U and under. 90–120 for high school." },
    ],
    related: ["baseball-workout-plans"],
  },
  {
    slug: "baseball-development-guide",
    title: "Complete Baseball Development Guide — Diamond Development",
    h1: "Complete Baseball Development Guide",
    description: "Long-term athletic development guide for baseball players from age 8 through college recruiting.",
    category: "Guides",
    readMinutes: 10,
    updated: UPDATED,
    intro:
      "There is no shortcut to elite baseball. But there is a right sequence. Below is a stage-by-stage development guide.",
    sections: [
      { heading: "Ages 8–12: Athletic base", body: "Play multiple sports. Focus on movement quality, throwing mechanics, and love for the game." },
      { heading: "Ages 13–14: Skill acquisition", body: "Start light strength training. Introduce weighted balls under supervision. Begin measurable metric tracking." },
      { heading: "Ages 15–18: Performance", body: "Structured strength and conditioning. Position specialization. Prepare for recruiting exposure at 16." },
      { heading: "Recruiting: Ages 15–17", body: "Attend camps and showcases. Build a highlight reel. Get verified stats." },
    ],
    faqs: [
      { q: "When should I specialize?", a: "Not before 14. Multi-sport athletes tend to have longer careers and fewer overuse injuries." },
    ],
    related: ["baseball-workout-plans", "baseball-position-guide"],
  },
  {
    slug: "exit-velocity-calculator",
    title: "Exit Velocity Calculator — Diamond Development",
    h1: "Exit Velocity Calculator",
    description: "Estimate your projected exit velocity based on bat speed, ball speed, and smash factor.",
    category: "Calculators",
    readMinutes: 3,
    updated: UPDATED,
    intro:
      "Exit velocity is roughly bat speed × smash factor + a fraction of the pitch speed. Use the formulas below to estimate your potential.",
    sections: [
      {
        heading: "The formula",
        body: "Exit velo ≈ 1.23 × bat speed + 0.23 × pitch speed. So a 70 mph bat speed on an 80 mph pitch produces roughly 86 + 18 ≈ ~104 mph max exit velo, though real-world contact rarely hits max.",
      },
      {
        heading: "What smash factor tells you",
        body: "Smash factor = exit velo / bat speed. Elite hitters average 1.4+. Below 1.2 indicates poor contact quality.",
      },
    ],
    faqs: [
      { q: "Can I calculate exit velo without a sensor?", a: "You can estimate — but any real training plan needs measured data. A $99 Pocket Radar is worth the investment." },
    ],
    related: ["average-exit-velocity-by-age", "bat-speed-calculator"],
  },
  {
    slug: "pitch-velocity-calculator",
    title: "Pitch Velocity Calculator (Age Projection) — Diamond Development",
    h1: "Pitch Velocity Age Projection",
    description: "Estimate your projected fastball velocity by high school graduation.",
    category: "Calculators",
    readMinutes: 3,
    updated: UPDATED,
    intro:
      "Fastball velocity typically increases 3–5 mph per year through puberty, then 1–2 mph per year afterward. Project your future velocity using your current age and current fastball.",
    sections: [
      {
        heading: "Rule of thumb",
        body: "Take your current velocity, add (18 – current age) × 3 for players 12–14, or × 2 for players 15–17. A 13-year-old throwing 65 mph projects to roughly 80 mph as a senior. Nature and training determine actual outcomes.",
      },
    ],
    faqs: [
      { q: "Can I project D1 velocity from age 12?", a: "Not reliably. Late bloomers often catch and pass early developers. Focus on the process, not projections." },
    ],
    related: ["average-pitching-velocity-by-age"],
  },
  {
    slug: "baseball-age-calculator",
    title: "Baseball Age Calculator — Diamond Development",
    h1: "Baseball Age Calculator",
    description: "Determine your baseball age for league eligibility under the MLB cutoff date.",
    category: "Calculators",
    readMinutes: 2,
    updated: UPDATED,
    intro:
      "Little League and most travel organizations use an April 30 cutoff. Your baseball age is your age on April 30 of the current season year (or August 31 in some organizations — check with your league).",
    sections: [
      {
        heading: "How to calculate",
        body: "If your birthday falls after April 30, your baseball age is your calendar age minus one. If your birthday is on or before April 30, your baseball age equals your calendar age.",
      },
    ],
    faqs: [
      { q: "Which cutoff does my league use?", a: "Little League Baseball uses August 31. Perfect Game and most travel use April 30 or May 1. Always confirm with your league office." },
    ],
    related: [],
  },
  {
    slug: "bat-speed-calculator",
    title: "Bat Speed Calculator — Diamond Development",
    h1: "Bat Speed Calculator",
    description: "Estimate bat speed from exit velocity and pitch speed.",
    category: "Calculators",
    readMinutes: 2,
    updated: UPDATED,
    intro:
      "If you know your exit velocity and the pitch speed, you can estimate bat speed with a simple formula.",
    sections: [
      {
        heading: "The formula",
        body: "Bat speed ≈ (Exit velocity − 0.23 × Pitch speed) ÷ 1.23. Example: 95 mph exit velo on an 80 mph pitch = (95 − 18) / 1.23 ≈ 63 mph bat speed.",
      },
    ],
    faqs: [
      { q: "Is estimated bat speed accurate?", a: "It's a ballpark. Real Blast Motion or Diamond Kinetics data is always more reliable." },
    ],
    related: ["average-bat-speed-by-age", "exit-velocity-calculator"],
  },
  {
    slug: "baseball-position-guide",
    title: "Baseball Position Guide — Diamond Development",
    h1: "Baseball Position Guide",
    description: "The physical and skill requirements for every baseball position, from pitcher to right field.",
    category: "Guides",
    readMinutes: 8,
    updated: UPDATED,
    intro:
      "Every position has a body type and skill set. Understanding what scouts value at each position helps you focus your development.",
    sections: [
      { heading: "Pitcher", body: "Size and arm strength matter. Recruit-level velocity varies by class." },
      { heading: "Catcher", body: "Pop time, receiving, and leadership. Size less important than skill." },
      { heading: "First base", body: "Left-handed hitting bonus. Power and pick ability at scoops." },
      { heading: "Middle infield", body: "Hands, range, first-step quickness. Speed and contact hitting." },
      { heading: "Third base", body: "Arm strength, reactions, power bat." },
      { heading: "Outfield", body: "Speed and arm strength. Center field prioritizes speed; corner outfield prioritizes bat." },
    ],
    faqs: [
      { q: "Can I play multiple positions?", a: "Yes — versatility is highly valued through high school. Specialize only when you have a clear best position." },
    ],
    related: ["baseball-development-guide"],
  },
];

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export const ARTICLE_CATEGORIES = [
  "Benchmarks",
  "Training",
  "Recovery",
  "Nutrition",
  "Calculators",
  "Guides",
] as const;
