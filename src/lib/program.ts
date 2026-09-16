// Baseball Development Program — drill library, weekly template, and
// personalization engine. Pure functions only; no DB access.

export type DrillCategory =
  | "Warm-Up"
  | "Strength"
  | "Power"
  | "Speed"
  | "Hitting"
  | "Fielding"
  | "Throwing"
  | "Baserunning"
  | "Recovery";

export type Prescription = {
  sets?: number;
  reps?: number; // per set (or per side)
  perSide?: boolean;
  durationSec?: number; // for holds
  distanceYd?: number; // for carries / sprints
  swings?: number; // for hitting drills
  minutes?: number; // for open blocks (warm-up, cool down, etc.)
  note?: string; // free-form addendum
};

export type Drill = {
  id: string;
  name: string;
  category: DrillCategory;
  base: Prescription;
  weighted?: boolean; // if true, scaled/removed for <13 yr olds
  positions?: Array<"P" | "C" | "IF" | "OF" | "Any">;
  technique: string[];
  commonMistakes: string[];
  coachingTips: string[];
  safety: string[];
  videoUrl?: string;
};

export const DRILLS: Record<string, Drill> = {
  // ── Warm-up / mobility / recovery ───────────────────────────────────────
  dynamic_warmup: {
    id: "dynamic_warmup",
    name: "Dynamic Warm-Up",
    category: "Warm-Up",
    base: { minutes: 10 },
    technique: [
      "Jog easy for 2 minutes to raise body temperature.",
      "Move through leg swings, arm circles, hip openers, and inchworms.",
      "Finish with 2 sets of A-skips and high knees for 15 yards.",
    ],
    commonMistakes: ["Skipping the warm-up", "Static stretching before movement"],
    coachingTips: ["Keep it moving — no long pauses.", "Break a light sweat before you're done."],
    safety: ["Stop if anything sharp — pain is not tightness.", "Warm up longer in cold weather."],
  },
  sprint_warmup: {
    id: "sprint_warmup",
    name: "Sprint Warm-Up",
    category: "Warm-Up",
    base: { minutes: 10 },
    technique: [
      "Jog 400 yards easy.",
      "2×20 yd A-skips, B-skips, high knees, butt kicks.",
      "Build-ups: 3×40 yd at 60 → 80 → 90% speed.",
    ],
    commonMistakes: ["Going 100% before hips are loose"],
    coachingTips: ["Rehearse posture — tall, relaxed shoulders."],
    safety: ["Never sprint cold. Add extra prep on turf or in cold weather."],
  },
  cool_down: {
    id: "cool_down",
    name: "Cool Down & Stretch",
    category: "Recovery",
    base: { minutes: 8 },
    technique: [
      "Walk easy 3 minutes to drop the heart rate.",
      "Static stretch major groups 20–30 seconds each.",
      "Deep breathing 5 slow reps to finish.",
    ],
    commonMistakes: ["Bouncing in stretches"],
    coachingTips: ["Hold each stretch, breathe out into it."],
    safety: ["Never stretch to sharp pain."],
  },
  mobility_recovery: {
    id: "mobility_recovery",
    name: "Mobility & Recovery",
    category: "Recovery",
    base: { minutes: 10 },
    technique: [
      "World's greatest stretch — 5 reps each side.",
      "90/90 hip switches — 8 reps each side.",
      "T-spine openers — 8 reps each side.",
    ],
    commonMistakes: ["Rushing — mobility rewards slow reps."],
    coachingTips: ["Breathe out at end range."],
    safety: ["No pain. Work into stiffness, not through it."],
  },
  foam_rolling: {
    id: "foam_rolling",
    name: "Foam Rolling",
    category: "Recovery",
    base: { minutes: 8 },
    technique: [
      "Roll quads, hamstrings, calves, glutes, upper back — 45 sec each.",
      "Pause 15 sec on tender spots and breathe.",
    ],
    commonMistakes: ["Rolling directly on joints or low back"],
    coachingTips: ["Slow. If it hurts to breathe, ease off."],
    safety: ["Avoid bony areas and the lumbar spine."],
  },
  light_jog: {
    id: "light_jog",
    name: "Light Jog",
    category: "Recovery",
    base: { minutes: 15 },
    technique: ["Easy conversational pace. Nose breathing if possible."],
    commonMistakes: ["Turning recovery into a workout"],
    coachingTips: ["If you can't sing, slow down."],
    safety: ["Hydrate before heading out."],
  },
  recovery_walk: {
    id: "recovery_walk",
    name: "Recovery Walk",
    category: "Recovery",
    base: { minutes: 20 },
    technique: ["Brisk but relaxed walk outside if possible."],
    commonMistakes: ["Skipping it because it feels easy — this is where you rebuild."],
    coachingTips: ["Leave the phone in your pocket. Reset."],
    safety: [],
  },
  stretching: {
    id: "stretching",
    name: "Full Body Stretching",
    category: "Recovery",
    base: { minutes: 10 },
    technique: ["Hold each stretch 30 sec, both sides. Cover legs, hips, back, shoulders."],
    commonMistakes: ["Bouncing", "Holding your breath"],
    coachingTips: ["Exhale into the stretch."],
    safety: ["No sharp pain."],
  },
  hydration_goal: {
    id: "hydration_goal",
    name: "Hydration Goal",
    category: "Recovery",
    base: { note: "Half your bodyweight in ounces of water today." },
    technique: [
      "Start the day with 16 oz.",
      "Sip through the day — don't chug.",
      "Add electrolytes on heavy training days.",
    ],
    commonMistakes: ["Only drinking when thirsty"],
    coachingTips: ["Pale-yellow pee = you're on track."],
    safety: ["Watch for dizziness — sign of dehydration."],
  },
  nutrition_goal: {
    id: "nutrition_goal",
    name: "Nutrition Goal",
    category: "Recovery",
    base: { note: "Protein at every meal. Fruits or veggies twice." },
    technique: [
      "Palm-sized protein each meal.",
      "Add colorful fruit or veg at 2+ meals.",
      "Post-workout: protein + carbs within 60 min.",
    ],
    commonMistakes: ["Skipping breakfast on training days"],
    coachingTips: ["Fuel like an athlete, not a snack machine."],
    safety: ["Talk to a parent or coach before any strict diet."],
  },
  rest: {
    id: "rest",
    name: "Full Rest",
    category: "Recovery",
    base: { note: "8–10 hours of sleep." },
    technique: ["Screens off 30 min before bed.", "Cool, dark room."],
    commonMistakes: ["Late-night gaming on rest day"],
    coachingTips: ["Recovery is when you actually get better."],
    safety: [],
  },

  // ── Lower body strength ─────────────────────────────────────────────────
  goblet_squats: {
    id: "goblet_squats",
    name: "Goblet Squats",
    category: "Strength",
    weighted: true,
    base: { sets: 3, reps: 10 },
    technique: [
      "Hold dumbbell at chest, elbows tucked.",
      "Feet shoulder-width, toes slightly out.",
      "Sit hips back and down until thighs are parallel.",
      "Drive through mid-foot to stand tall.",
    ],
    commonMistakes: ["Knees caving in", "Heels lifting off floor", "Rounded lower back"],
    coachingTips: ["Chest up, proud posture.", "Push the floor away."],
    safety: ["Bodyweight only until form is clean.", "Under 13: use bodyweight."],
  },
  reverse_lunges: {
    id: "reverse_lunges",
    name: "Reverse Lunges",
    category: "Strength",
    weighted: true,
    base: { sets: 3, reps: 8, perSide: true },
    technique: [
      "Step one foot back into a long stride.",
      "Drop back knee toward floor without slamming.",
      "Drive through front heel to return.",
    ],
    commonMistakes: ["Short stride collapsing front knee over toes"],
    coachingTips: ["Front shin close to vertical."],
    safety: ["Bodyweight first, add dumbbells only when balance is solid."],
  },
  romanian_deadlifts: {
    id: "romanian_deadlifts",
    name: "Romanian Deadlifts",
    category: "Strength",
    weighted: true,
    base: { sets: 3, reps: 10 },
    technique: [
      "Dumbbells in front of thighs, soft bend in knees.",
      "Push hips back, lower weights along legs.",
      "Feel a stretch in hamstrings, then drive hips forward.",
    ],
    commonMistakes: ["Rounding the back", "Squatting instead of hinging"],
    coachingTips: ["Long spine, proud chest."],
    safety: ["Light weight first. Stop if lower back rounds."],
  },
  glute_bridges: {
    id: "glute_bridges",
    name: "Glute Bridges",
    category: "Strength",
    base: { sets: 3, reps: 15 },
    technique: [
      "Lie on back, feet flat, heels close to hips.",
      "Drive through heels, squeeze glutes to lift hips.",
      "Pause at the top; lower under control.",
    ],
    commonMistakes: ["Hyperextending low back", "Pushing through toes"],
    coachingTips: ["Ribs down, squeeze glutes hard at top."],
    safety: [],
  },
  calf_raises: {
    id: "calf_raises",
    name: "Calf Raises",
    category: "Strength",
    base: { sets: 3, reps: 15 },
    technique: ["Stand tall, rise onto balls of feet, pause, lower slow."],
    commonMistakes: ["Bouncing at the bottom"],
    coachingTips: ["Full range — all the way up, all the way down."],
    safety: [],
  },
  planks: {
    id: "planks",
    name: "Planks",
    category: "Strength",
    base: { sets: 3, durationSec: 30 },
    technique: [
      "Elbows under shoulders, forearms flat.",
      "Body in a straight line from ears to heels.",
      "Squeeze glutes and brace core.",
    ],
    commonMistakes: ["Sagging hips", "Butt in the air", "Holding breath"],
    coachingTips: ["Breathe through it — quality over time."],
    safety: ["Drop when form breaks. Bad plank isn't a plank."],
  },
  dead_bugs: {
    id: "dead_bugs",
    name: "Dead Bugs",
    category: "Strength",
    base: { sets: 3, reps: 10, perSide: true },
    technique: [
      "Lie on back, arms up, knees over hips.",
      "Slowly lower opposite arm and leg until just above floor.",
      "Return and switch sides.",
    ],
    commonMistakes: ["Low back arching off the floor"],
    coachingTips: ["Press low back into floor the whole time."],
    safety: [],
  },

  // ── Upper body strength ─────────────────────────────────────────────────
  pushups: {
    id: "pushups",
    name: "Push-Ups",
    category: "Strength",
    base: { sets: 3, reps: 12 },
    technique: [
      "Hands under shoulders, body one straight line.",
      "Lower chest to just above the floor.",
      "Press back up, elbows about 45° from body.",
    ],
    commonMistakes: ["Flared elbows", "Sagging hips"],
    coachingTips: ["Squeeze glutes, brace core, own the plank position."],
    safety: ["Drop to knees rather than break form."],
  },
  db_bench_press: {
    id: "db_bench_press",
    name: "Dumbbell Bench Press",
    category: "Strength",
    weighted: true,
    base: { sets: 3, reps: 10 },
    technique: [
      "Lie flat, dumbbells at chest, elbows ~45°.",
      "Press up until arms are straight — don't lock hard.",
      "Lower under control to chest level.",
    ],
    commonMistakes: ["Bouncing weights off chest"],
    coachingTips: ["Feet planted, upper back tight to the bench."],
    safety: ["Have a spotter for heavier sets. Under 13: use push-up variations."],
  },
  one_arm_rows: {
    id: "one_arm_rows",
    name: "One-Arm Rows",
    category: "Strength",
    weighted: true,
    base: { sets: 3, reps: 10, perSide: true },
    technique: [
      "Free hand on bench, back flat and parallel to floor.",
      "Pull dumbbell to hip, elbow close to body.",
      "Lower with control.",
    ],
    commonMistakes: ["Twisting the torso", "Shrugging the shoulder"],
    coachingTips: ["Drive the elbow, not the hand."],
    safety: ["Keep neck neutral — eyes on the floor in front of you."],
  },
  db_shoulder_press: {
    id: "db_shoulder_press",
    name: "Dumbbell Shoulder Press",
    category: "Strength",
    weighted: true,
    base: { sets: 3, reps: 10 },
    technique: [
      "Seated or standing tall, dumbbells at shoulders.",
      "Press up to full extension without shrugging.",
      "Lower to shoulder height under control.",
    ],
    commonMistakes: ["Arching low back to press heavier weight"],
    coachingTips: ["Ribs down, core braced."],
    safety: ["Light weight for young athletes. Stop if shoulder pinches."],
  },
  pullups_or_pulldowns: {
    id: "pullups_or_pulldowns",
    name: "Pull-Ups or Lat Pulldowns",
    category: "Strength",
    weighted: true,
    base: { sets: 3, reps: 8 },
    technique: [
      "Grip slightly wider than shoulders.",
      "Pull chest toward bar, shoulder blades down and back.",
      "Control the negative.",
    ],
    commonMistakes: ["Kipping / swinging", "Chin only reaching bar via neck strain"],
    coachingTips: ["Think elbows to ribs."],
    safety: ["Use a band or assisted machine to build up honestly."],
  },
  band_external_rotations: {
    id: "band_external_rotations",
    name: "Band External Rotations",
    category: "Strength",
    base: { sets: 2, reps: 15, perSide: true },
    technique: [
      "Elbow tucked at side, forearm across body holding band.",
      "Rotate hand away from body, keeping elbow pinned.",
      "Return slow.",
    ],
    commonMistakes: ["Elbow drifting away from body", "Yanking the band"],
    coachingTips: ["Slow tempo — this is health work, not a max lift."],
    safety: ["No pain in shoulder joint — light band only."],
  },
  face_pulls: {
    id: "face_pulls",
    name: "Face Pulls",
    category: "Strength",
    base: { sets: 2, reps: 15 },
    technique: [
      "Band at eye level. Pull hands toward temples, elbows high.",
      "Squeeze rear delts and mid-back.",
    ],
    commonMistakes: ["Pulling low toward chin"],
    coachingTips: ["Elbows above wrists the whole rep."],
    safety: [],
  },

  // ── Power ───────────────────────────────────────────────────────────────
  step_ups: {
    id: "step_ups",
    name: "Step-Ups",
    category: "Strength",
    weighted: true,
    base: { sets: 3, reps: 10, perSide: true },
    technique: [
      "Box or bench at knee height.",
      "Full foot on box, drive through heel to stand tall.",
      "Lower under control — no bouncing.",
    ],
    commonMistakes: ["Pushing off the trailing leg"],
    coachingTips: ["All the work in the top leg."],
    safety: ["Bodyweight first. Add DBs only when balance is clean."],
  },
  db_deadlifts: {
    id: "db_deadlifts",
    name: "Dumbbell Deadlifts",
    category: "Strength",
    weighted: true,
    base: { sets: 3, reps: 10 },
    technique: [
      "Dumbbells outside feet, hips back, chest proud.",
      "Drive through floor, standing tall at the top.",
      "Reverse under control.",
    ],
    commonMistakes: ["Rounded back", "Squatting instead of hinging"],
    coachingTips: ["Bar path stays close to legs."],
    safety: ["Coach must clear form before adding meaningful weight."],
  },
  farmer_carries: {
    id: "farmer_carries",
    name: "Farmer Carries",
    category: "Strength",
    weighted: true,
    base: { sets: 3, distanceYd: 30 },
    technique: [
      "Heavy dumbbell each hand, stand tall.",
      "Short, quick steps. Ribs down, shoulders packed.",
    ],
    commonMistakes: ["Leaning to one side"],
    coachingTips: ["Squeeze handles as if crushing them."],
    safety: ["Grip fatigue is fine — dropping on your foot is not. Use clear space."],
  },
  trx_rows: {
    id: "trx_rows",
    name: "TRX Rows",
    category: "Strength",
    base: { sets: 3, reps: 10 },
    technique: [
      "Straps at chest level, body straight, feet forward.",
      "Pull chest to hands, elbows to ribs.",
    ],
    commonMistakes: ["Sagging hips"],
    coachingTips: ["Feet farther forward = harder. Adjust to hit 10 clean reps."],
    safety: ["Check strap anchor before every set."],
  },
  box_jumps: {
    id: "box_jumps",
    name: "Box Jumps",
    category: "Power",
    base: { sets: 3, reps: 6 },
    technique: [
      "Athletic stance, dip, arms swing.",
      "Jump onto box, land soft with bent knees.",
      "Stand tall, step down — don't jump down.",
    ],
    commonMistakes: ["Jumping down (knee injury risk)", "Collapsing landing"],
    coachingTips: ["Land like a cat, not a brick."],
    safety: ["Start with a low box. Never jump down."],
  },
  broad_jumps: {
    id: "broad_jumps",
    name: "Broad Jumps",
    category: "Power",
    base: { sets: 3, reps: 5 },
    technique: [
      "Dip, arms back, then forward and up.",
      "Jump for distance, land soft and balanced.",
    ],
    commonMistakes: ["Falling forward on landing"],
    coachingTips: ["Stick every landing before you chase distance."],
    safety: ["Grass or turf. No slippery surfaces."],
  },
  med_ball_slams: {
    id: "med_ball_slams",
    name: "Medicine Ball Slams",
    category: "Power",
    base: { sets: 3, reps: 10 },
    technique: [
      "Ball overhead, up on toes.",
      "Slam ball to ground with full body.",
      "Squat down to pick up, repeat.",
    ],
    commonMistakes: ["Only using arms"],
    coachingTips: ["Whole body — legs to hips to arms."],
    safety: ["Use non-bouncing slam ball. Clear space."],
  },
  med_ball_rot_throws: {
    id: "med_ball_rot_throws",
    name: "Medicine Ball Rotational Throws",
    category: "Power",
    base: { sets: 3, reps: 8, perSide: true },
    technique: [
      "Side-on to a wall, ball at hip.",
      "Rotate hips first, then torso, then arms — fire ball into wall.",
      "Catch and reset.",
    ],
    commonMistakes: ["All arms, no hips"],
    coachingTips: ["Same sequencing as a swing or a throw. Hips lead."],
    safety: ["Sturdy wall only — never a window or drywall."],
  },
  core_circuit: {
    id: "core_circuit",
    name: "Core Circuit",
    category: "Strength",
    base: { sets: 3, note: "Plank 30s → Side Plank 20s/side → Hollow Hold 20s" },
    technique: [
      "Move through the 3 exercises with minimal rest.",
      "Rest 60 seconds between rounds.",
    ],
    commonMistakes: ["Turning it into a race — form first"],
    coachingTips: ["Brace the core, breathe steady."],
    safety: [],
  },

  // ── Speed / agility ─────────────────────────────────────────────────────
  sprints_20yd: {
    id: "sprints_20yd",
    name: "20-yard Sprints",
    category: "Speed",
    base: { sets: 6, distanceYd: 20 },
    technique: [
      "Athletic stance, weight forward.",
      "Drive first 3 steps low and hard.",
      "Rise into tall sprint posture.",
    ],
    commonMistakes: ["Standing up too fast", "Tight shoulders"],
    coachingTips: ["Full recovery — walk back before the next rep."],
    safety: ["Warm up thoroughly. Never sprint tight."],
  },
  explosive_starts: {
    id: "explosive_starts",
    name: "10-yard Explosive Starts",
    category: "Speed",
    base: { sets: 4, distanceYd: 10 },
    technique: [
      "Static or falling start.",
      "First 3 steps: powerful, low, arms driving.",
    ],
    commonMistakes: ["Popping straight up on step 1"],
    coachingTips: ["Push the ground back — don't reach."],
    safety: ["Full recovery between reps."],
  },
  cone_agility: {
    id: "cone_agility",
    name: "Cone Agility Drills",
    category: "Speed",
    base: { sets: 4, note: "Pro-agility 5-10-5 or box drill" },
    technique: [
      "Sharp change of direction — plant outside foot, drop hips, drive.",
    ],
    commonMistakes: ["Rounded turns", "Standing tall at the cone"],
    coachingTips: ["Sink into the turn. Explode out."],
    safety: ["Clean, non-slippery surface only."],
  },
  ladder_drills: {
    id: "ladder_drills",
    name: "Ladder Drills",
    category: "Speed",
    base: { sets: 4, note: "Two-feet in, lateral, in-in-out-out" },
    technique: [
      "Feet quick and light — chest tall.",
      "Eyes up, not staring at the ladder.",
    ],
    commonMistakes: ["Heavy stomping feet"],
    coachingTips: ["Quality reps, not fastest reps."],
    safety: [],
  },
  reaction_ball: {
    id: "reaction_ball",
    name: "Reaction Ball Drills",
    category: "Speed",
    base: { sets: 3, reps: 10 },
    technique: [
      "Partner drops or bounces the ball unpredictably.",
      "React with soft, quick hands and feet.",
    ],
    commonMistakes: ["Flat feet"],
    coachingTips: ["Athletic stance the whole time."],
    safety: ["Clear the area. Ball moves in random directions."],
  },

  // ── Fielding ────────────────────────────────────────────────────────────
  ground_ball_fundamentals: {
    id: "ground_ball_fundamentals",
    name: "Ground Ball Fundamentals",
    category: "Fielding",
    positions: ["IF", "Any"],
    base: { sets: 3, reps: 10 },
    technique: [
      "Wide, athletic base. Butt down, glove out in front.",
      "Funnel ball to belt as feet cycle into throwing position.",
    ],
    commonMistakes: ["Fielding off back foot", "Glove tucked under belly"],
    coachingTips: ["See it, catch it out front, then throw it."],
    safety: ["Warm up your arm before firing throws."],
  },
  forehand_backhand: {
    id: "forehand_backhand",
    name: "Forehand & Backhand Fielding",
    category: "Fielding",
    positions: ["IF", "Any"],
    base: { sets: 2, reps: 10, perSide: true },
    technique: [
      "Read hop early, angle body to the ball.",
      "Backhand: right foot forward (RH thrower), glove low.",
    ],
    commonMistakes: ["Reaching across body instead of moving feet"],
    coachingTips: ["Feet first, glove second."],
    safety: [],
  },
  double_play_footwork: {
    id: "double_play_footwork",
    name: "Double Play Footwork",
    category: "Fielding",
    positions: ["IF"],
    base: { sets: 3, reps: 8 },
    technique: [
      "Feed: catch, replace feet, quick throw to chest of pivot.",
      "Pivot: touch bag, clear the runner, throw on the move.",
    ],
    commonMistakes: ["Rushing the feed — accuracy first"],
    coachingTips: ["Slow is smooth, smooth is fast."],
    safety: ["Practice clearing the runner every rep."],
  },
  infield_footwork: {
    id: "infield_footwork",
    name: "Infield Footwork",
    category: "Fielding",
    positions: ["IF"],
    base: { sets: 3, reps: 10 },
    technique: [
      "Shuffle drills, replace-step to throw, crossover pursuits.",
    ],
    commonMistakes: ["Crossing feet on the shuffle"],
    coachingTips: ["Stay low, chest over knees."],
    safety: [],
  },
  outfield_drop_steps: {
    id: "outfield_drop_steps",
    name: "Outfield Drop Steps",
    category: "Fielding",
    positions: ["OF"],
    base: { sets: 3, reps: 8, perSide: true },
    technique: [
      "First move: open hip toward the ball, drop back foot.",
      "Sprint on angle to the spot — don't drift.",
    ],
    commonMistakes: ["First step going backward with a straight body"],
    coachingTips: ["Turn and run — glance for the ball once."],
    safety: ["Know the fence. Practice fence awareness."],
  },
  fly_ball_drills: {
    id: "fly_ball_drills",
    name: "Fly Ball Drills",
    category: "Fielding",
    positions: ["OF", "Any"],
    base: { sets: 3, reps: 8 },
    technique: [
      "Catch above the throwing shoulder with two hands.",
      "Come through the ball — momentum toward the target.",
    ],
    commonMistakes: ["Basket catch on routine fly balls"],
    coachingTips: ["Round off — never drift straight back."],
    safety: ["Communicate loudly with teammates."],
  },
  slow_roller_plays: {
    id: "slow_roller_plays",
    name: "Slow Roller Plays",
    category: "Fielding",
    positions: ["IF"],
    base: { sets: 3, reps: 8 },
    technique: [
      "Charge hard, bare-hand or glove-scoop.",
      "Throw off the correct foot on the run.",
    ],
    commonMistakes: ["Slowing down to be safe — you'll be late"],
    coachingTips: ["Commit — attack the ball."],
    safety: [],
  },
  short_hop_drills: {
    id: "short_hop_drills",
    name: "Short Hop Drills",
    category: "Fielding",
    base: { sets: 3, reps: 15 },
    technique: [
      "Partner rolls / short-hops from 10–15 ft.",
      "Soft hands — receive the ball, don't stab at it.",
    ],
    commonMistakes: ["Locked elbows"],
    coachingTips: ["Give with the ball on contact."],
    safety: ["Mask up if catching, especially for catchers."],
  },
  position_specific_drills: {
    id: "position_specific_drills",
    name: "Position-Specific Drills",
    category: "Fielding",
    base: { minutes: 15, note: "Coach or self-directed based on primary position" },
    technique: [
      "Pick 2–3 drills specific to your primary position.",
      "Quality reps only — stop when technique slips.",
    ],
    commonMistakes: ["Random drills that don't match your role"],
    coachingTips: ["Ask your coach for one focus per week."],
    safety: [],
  },
  defensive_reps: {
    id: "defensive_reps",
    name: "Defensive Reps",
    category: "Fielding",
    base: { minutes: 20 },
    technique: [
      "Live reads at game speed. Cycle through infield and outfield rotations.",
    ],
    commonMistakes: ["Half-speed reps — you'll play how you practice"],
    coachingTips: ["Every rep, pretend a runner is at first."],
    safety: [],
  },

  // ── Throwing ────────────────────────────────────────────────────────────
  long_toss: {
    id: "long_toss",
    name: "Long Toss",
    category: "Throwing",
    base: { minutes: 15 },
    technique: [
      "Start at 30 ft, throw on a line.",
      "Stretch out in 15-ft increments until max distance.",
      "Pull-down: shorten and throw hard on a line.",
    ],
    commonMistakes: ["Rainbow arcs — throw with intent"],
    coachingTips: ["Full body throw. Not just the arm."],
    safety: ["Never throw cold. Warm the arm gradually."],
  },
  long_toss_program: {
    id: "long_toss_program",
    name: "Long Toss Program",
    category: "Throwing",
    base: { minutes: 20 },
    technique: [
      "Warm up at 30 ft.",
      "Stretch out to comfortable max in stages.",
      "Finish with 15 pull-down throws on a line.",
    ],
    commonMistakes: ["Maxing effort before extending distance"],
    coachingTips: ["Track how far you reach each week."],
    safety: ["Stop if elbow or shoulder pain shows up — do not push through."],
  },
  throwing_accuracy: {
    id: "throwing_accuracy",
    name: "Throwing Accuracy",
    category: "Throwing",
    base: { sets: 3, reps: 10 },
    technique: [
      "Pick a target (partner's chest, net square).",
      "10 throws from 60 ft — score hits.",
    ],
    commonMistakes: ["Rushing throws"],
    coachingTips: ["Aim small, miss small."],
    safety: [],
  },
  throwing_accuracy_challenge: {
    id: "throwing_accuracy_challenge",
    name: "Throwing Accuracy Challenge",
    category: "Throwing",
    base: { sets: 3, reps: 15 },
    technique: [
      "3 rounds of 15 throws. Track hits on a target.",
      "Beat last session's score.",
    ],
    commonMistakes: ["Trying to throw hard instead of accurate"],
    coachingTips: ["Compete against yourself."],
    safety: [],
  },
  position_specific_throwing: {
    id: "position_specific_throwing",
    name: "Position-Specific Throwing",
    category: "Throwing",
    base: { minutes: 15 },
    technique: [
      "Infield: quick release from field position.",
      "Outfield: crow-hop and throw on a line.",
      "Catcher: pop times to second.",
      "Pitcher: bullpen (light) with intent.",
    ],
    commonMistakes: ["Skipping position-specific footwork"],
    coachingTips: ["Simulate a game situation each throw."],
    safety: ["Arm care first — track throw counts."],
  },
  throwing_program: {
    id: "throwing_program",
    name: "Throwing Program",
    category: "Throwing",
    base: { minutes: 20 },
    technique: [
      "Full warm-up throwing progression.",
      "Position throws + long toss finisher.",
    ],
    commonMistakes: ["Skipping catch play warm-up"],
    coachingTips: ["Track throw counts and arm feel weekly."],
    safety: ["No max-effort throws when tight or fatigued."],
  },

  // ── Hitting ─────────────────────────────────────────────────────────────
  tee_work: {
    id: "tee_work",
    name: "Tee Work",
    category: "Hitting",
    base: { swings: 50 },
    technique: [
      "Set tee at belt height, middle of plate.",
      "Focus on a balanced load and short path to the ball.",
      "Take 5–10 swings per focus, then reset.",
    ],
    commonMistakes: ["Casting hands — long swing path"],
    coachingTips: ["Quality swings — put the ball where you aimed."],
    safety: ["Clear net area. Watch bat path when others are nearby."],
  },
  front_toss: {
    id: "front_toss",
    name: "Front Toss",
    category: "Hitting",
    base: { swings: 30 },
    technique: [
      "Partner tosses from behind an L-screen at ~15 ft.",
      "Track ball deep, drive line drives up the middle.",
    ],
    commonMistakes: ["Lunging at the ball"],
    coachingTips: ["Stay in your legs, let the ball travel."],
    safety: ["Tosser MUST use an L-screen."],
  },
  exit_velo_drills: {
    id: "exit_velo_drills",
    name: "Exit Velocity Drills",
    category: "Hitting",
    base: { sets: 3, reps: 10 },
    technique: [
      "Warm-up swings, then 10 max-effort swings off the tee.",
      "Measure with a HitTrax, Rapsodo, or bat sensor if available.",
    ],
    commonMistakes: ["Grip too tight kills bat speed"],
    coachingTips: ["Full commit — swing to drive the ball."],
    safety: ["Bat control — never swing in a crowded space."],
  },
  bat_speed_training: {
    id: "bat_speed_training",
    name: "Bat Speed Training",
    category: "Hitting",
    base: { sets: 3, reps: 8 },
    technique: [
      "Overload/underload bat protocol: 3 heavy → 3 normal → 3 light.",
      "Focus on quick, connected swings.",
    ],
    commonMistakes: ["Muscling the bat instead of whipping it"],
    coachingTips: ["Loose grip, fast hands."],
    safety: ["Only use rated training bats. Space cleared."],
  },
  soft_toss: {
    id: "soft_toss",
    name: "Soft Toss",
    category: "Hitting",
    base: { swings: 40 },
    technique: [
      "Partner tosses from the side into the hitting zone.",
      "Work timing and contact point.",
    ],
    commonMistakes: ["Rolling over on inside pitches"],
    coachingTips: ["Stay through the middle of the ball."],
    safety: ["Tosser is behind a screen or well clear of the swing path."],
  },
  situational_hitting: {
    id: "situational_hitting",
    name: "Situational Hitting",
    category: "Hitting",
    base: { sets: 3, reps: 5, note: "Runner on 2nd/no outs, 3-1 count, etc." },
    technique: [
      "Coach calls a game situation.",
      "Take an appropriate at-bat: move runner, get a fly, etc.",
    ],
    commonMistakes: ["Always swinging for the fence"],
    coachingTips: ["Great hitters win with the plan, not just power."],
    safety: [],
  },
  opposite_field_drills: {
    id: "opposite_field_drills",
    name: "Opposite Field Drills",
    category: "Hitting",
    base: { swings: 25 },
    technique: [
      "Outside tee position, or tosses on the outer half.",
      "Let the ball travel, drive to the opposite gap.",
    ],
    commonMistakes: ["Pulling off the ball"],
    coachingTips: ["Stay closed — inside-out the barrel."],
    safety: [],
  },
  batting_practice: {
    id: "batting_practice",
    name: "Batting Practice",
    category: "Hitting",
    base: { swings: 40 },
    technique: [
      "Rounds: 10 sac-bunt / hit-and-run, 10 opposite field, 10 pull, 10 free.",
    ],
    commonMistakes: ["Free swinging every round"],
    coachingTips: ["Every round has a purpose."],
    safety: ["Coach behind L-screen."],
  },
  live_bp: {
    id: "live_bp",
    name: "Live BP",
    category: "Hitting",
    base: { swings: 20, note: "Live arm from ~45–55 ft" },
    technique: [
      "See velocity from a live arm.",
      "Track pitches, take pro-style at-bats.",
    ],
    commonMistakes: ["Not taking pitches — treat like a game AB"],
    coachingTips: ["Compete every pitch."],
    safety: ["Helmet on. Pitcher behind L-screen."],
  },
  baserunning: {
    id: "baserunning",
    name: "Baserunning",
    category: "Baserunning",
    base: { sets: 3, reps: 5 },
    technique: [
      "Home to first through the bag.",
      "Rounded turns at first, second, third.",
      "Read-and-react on secondary leads.",
    ],
    commonMistakes: ["Slowing down at the bag"],
    coachingTips: ["Aggressive turns — always looking for the extra base."],
    safety: [],
  },
  stealing_starts: {
    id: "stealing_starts",
    name: "Stealing Starts",
    category: "Baserunning",
    base: { sets: 3, reps: 6 },
    technique: [
      "Primary lead, secondary lead, first-step crossover.",
      "First 3 steps low and hard.",
    ],
    commonMistakes: ["Standing tall on first step"],
    coachingTips: ["React to pitcher's first move."],
    safety: ["Practice on dirt with normal bases."],
  },
  sliding_practice: {
    id: "sliding_practice",
    name: "Sliding Practice",
    category: "Baserunning",
    base: { sets: 3, reps: 5 },
    technique: [
      "Bent-leg slide: figure-4 legs, hands up.",
      "Head-first: only where coach approves. Hands up, chin tucked.",
    ],
    commonMistakes: ["Slowing down before the bag"],
    coachingTips: ["Commit — a hesitant slide is how you get hurt."],
    safety: ["Wet grass or a slide mat only. Sliding shorts recommended."],
  },
  competitive_games: {
    id: "competitive_games",
    name: "Competitive Games",
    category: "Baserunning",
    base: { minutes: 30, note: "Sim game, HR derby, target hitting comp" },
    technique: [
      "Play with a scoreboard — winner and loser.",
      "Practice at game intensity.",
    ],
    commonMistakes: ["Loafing when it 'doesn't count'"],
    coachingTips: ["Compete or don't bother."],
    safety: ["Same PPE as a game — helmet, protective gear."],
  },
};

// ── Weekly template ──────────────────────────────────────────────────────
export type DayId = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export const WEEKLY_TEMPLATE: Record<
  DayId,
  { title: string; focus: string; drillIds: string[] }
> = {
  Mon: {
    title: "Lower Body Strength + Hitting",
    focus: "Legs, core, and pure swing quality.",
    drillIds: [
      "dynamic_warmup",
      "goblet_squats",
      "reverse_lunges",
      "romanian_deadlifts",
      "glute_bridges",
      "calf_raises",
      "planks",
      "dead_bugs",
      "tee_work",
      "front_toss",
      "exit_velo_drills",
      "bat_speed_training",
      "cool_down",
    ],
  },
  Tue: {
    title: "Speed + Fielding",
    focus: "Explosive first-step and clean glove work.",
    drillIds: [
      "sprint_warmup",
      "sprints_20yd",
      "explosive_starts",
      "cone_agility",
      "ladder_drills",
      "reaction_ball",
      "ground_ball_fundamentals",
      "forehand_backhand",
      "double_play_footwork",
      "throwing_accuracy",
      "long_toss",
      "mobility_recovery",
    ],
  },
  Wed: {
    title: "Upper Body Strength + Hitting",
    focus: "Push, pull, shoulder health, and swing feel.",
    drillIds: [
      "dynamic_warmup",
      "pushups",
      "db_bench_press",
      "one_arm_rows",
      "db_shoulder_press",
      "pullups_or_pulldowns",
      "band_external_rotations",
      "face_pulls",
      "tee_work",
      "soft_toss",
      "situational_hitting",
      "opposite_field_drills",
      "cool_down",
    ],
  },
  Thu: {
    title: "Defense + Throwing",
    focus: "Position-specific reps and a healthy arm.",
    drillIds: [
      "dynamic_warmup",
      "long_toss_program",
      "position_specific_throwing",
      "infield_footwork",
      "outfield_drop_steps",
      "fly_ball_drills",
      "forehand_backhand",
      "slow_roller_plays",
      "short_hop_drills",
      "throwing_accuracy_challenge",
      "mobility_recovery",
    ],
  },
  Fri: {
    title: "Full Body Strength + Power",
    focus: "Ground force, rotation, and jumps.",
    drillIds: [
      "dynamic_warmup",
      "step_ups",
      "db_deadlifts",
      "farmer_carries",
      "pushups",
      "trx_rows",
      "box_jumps",
      "broad_jumps",
      "med_ball_slams",
      "med_ball_rot_throws",
      "core_circuit",
      "cool_down",
    ],
  },
  Sat: {
    title: "Baseball Skills Day",
    focus: "Play the game.",
    drillIds: [
      "batting_practice",
      "live_bp",
      "situational_hitting",
      "baserunning",
      "stealing_starts",
      "sliding_practice",
      "defensive_reps",
      "position_specific_drills",
      "throwing_program",
      "competitive_games",
    ],
  },
  Sun: {
    title: "Recovery",
    focus: "Rebuild for next week.",
    drillIds: [
      "light_jog",
      "mobility_recovery",
      "foam_rolling",
      "stretching",
      "recovery_walk",
      "hydration_goal",
      "nutrition_goal",
      "rest",
    ],
  },
};

// ── Personalization ──────────────────────────────────────────────────────
export type SkillLevel = "Beginner" | "Developing" | "Advanced";

export type AthleteInputs = {
  age: number | null;
  positions: string[] | null;
  latest: {
    exit_velo_mph?: number | null;
    throw_velo_mph?: number | null;
    pitch_velo_mph?: number | null;
    bat_speed_mph?: number | null;
    sixty_yd_sec?: number | null;
  } | null;
  prior?: AthleteInputs["latest"];
};

type Benchmark = { advanced: number; developing: number; lowerBetter?: boolean };

function benchmarksFor(age: number | null): Record<string, Benchmark> {
  // Rough age-appropriate benchmarks (mph, sec)
  if (age && age < 12)
    return {
      exit_velo_mph: { advanced: 60, developing: 50 },
      throw_velo_mph: { advanced: 55, developing: 45 },
      bat_speed_mph: { advanced: 55, developing: 45 },
      sixty_yd_sec: { advanced: 8.4, developing: 9.2, lowerBetter: true },
    };
  if (age && age < 15)
    return {
      exit_velo_mph: { advanced: 75, developing: 65 },
      throw_velo_mph: { advanced: 70, developing: 60 },
      bat_speed_mph: { advanced: 65, developing: 55 },
      sixty_yd_sec: { advanced: 7.6, developing: 8.2, lowerBetter: true },
    };
  return {
    exit_velo_mph: { advanced: 90, developing: 80 },
    throw_velo_mph: { advanced: 82, developing: 72 },
    bat_speed_mph: { advanced: 75, developing: 65 },
    sixty_yd_sec: { advanced: 6.9, developing: 7.4, lowerBetter: true },
  };
}

export function deriveSkillLevel(inputs: AthleteInputs): SkillLevel {
  if (!inputs.latest) return "Beginner";
  const bench = benchmarksFor(inputs.age);
  let score = 0;
  let counted = 0;
  for (const [key, mark] of Object.entries(bench)) {
    const v = inputs.latest[key as keyof typeof inputs.latest];
    if (v == null) continue;
    counted++;
    if (mark.lowerBetter) {
      if (v <= mark.advanced) score += 2;
      else if (v <= mark.developing) score += 1;
    } else {
      if (v >= mark.advanced) score += 2;
      else if (v >= mark.developing) score += 1;
    }
  }
  if (!counted) return "Beginner";
  const avg = score / counted;
  if (avg >= 1.5) return "Advanced";
  if (avg >= 0.75) return "Developing";
  return "Beginner";
}

// Progression: +1 tier if any tracked metric improved ≥5% vs prior.
function progressionTier(inputs: AthleteInputs): -1 | 0 | 1 {
  if (!inputs.latest || !inputs.prior) return 0;
  const keys = ["exit_velo_mph", "throw_velo_mph", "bat_speed_mph"] as const;
  const speedKeys = ["sixty_yd_sec"] as const;
  let improved = false;
  let regressed = false;
  for (const k of keys) {
    const l = inputs.latest[k];
    const p = inputs.prior[k];
    if (l == null || p == null || p === 0) continue;
    const change = (l - p) / p;
    if (change >= 0.05) improved = true;
    if (change <= -0.05) regressed = true;
  }
  for (const k of speedKeys) {
    const l = inputs.latest[k];
    const p = inputs.prior[k];
    if (l == null || p == null || p === 0) continue;
    const change = (p - l) / p; // faster = smaller time
    if (change >= 0.05) improved = true;
    if (change <= -0.05) regressed = true;
  }
  if (improved) return 1;
  if (regressed) return -1;
  return 0;
}

function ageScale(age: number | null): number {
  if (age == null) return 1;
  if (age < 12) return 0.6;
  if (age < 15) return 0.8;
  if (age < 18) return 1;
  return 1.1;
}

function scalePrescription(
  base: Prescription,
  factor: number,
  drill: Drill,
  age: number | null,
): Prescription {
  const out: Prescription = { ...base };
  const scale = (n: number) => Math.max(1, Math.round(n * factor));
  if (out.sets != null) out.sets = scale(out.sets);
  if (out.reps != null) out.reps = scale(out.reps);
  if (out.swings != null) out.swings = scale(out.swings);
  if (out.durationSec != null) out.durationSec = scale(out.durationSec);
  if (out.distanceYd != null) out.distanceYd = scale(out.distanceYd);
  // Safety: no external load for very young athletes
  if (drill.weighted && age != null && age < 13) {
    out.note = [out.note, "Bodyweight only — no external load."].filter(Boolean).join(" ");
  }
  return out;
}

export function formatPrescription(p: Prescription): string {
  const parts: string[] = [];
  if (p.sets && p.reps) {
    parts.push(`${p.sets}×${p.reps}${p.perSide ? " each side" : ""}`);
  } else if (p.sets && p.durationSec) {
    parts.push(`${p.sets}×${p.durationSec} sec`);
  } else if (p.sets && p.distanceYd) {
    parts.push(`${p.sets}×${p.distanceYd} yd`);
  } else if (p.sets) {
    parts.push(`${p.sets} sets`);
  }
  if (p.swings) parts.push(`${p.swings} swings`);
  if (p.minutes) parts.push(`${p.minutes} min`);
  if (p.note && parts.length === 0) parts.push(p.note);
  return parts.join(" · ");
}

function positionFilter(drill: Drill, positions: string[] | null): boolean {
  if (!drill.positions || drill.positions.includes("Any")) return true;
  if (!positions || positions.length === 0) return true;
  const posGroups = new Set<string>();
  for (const p of positions) {
    if (p === "P") posGroups.add("P");
    else if (p === "C") posGroups.add("C");
    else if (["1B", "2B", "3B", "SS"].includes(p)) posGroups.add("IF");
    else if (["LF", "CF", "RF"].includes(p)) posGroups.add("OF");
  }
  return drill.positions.some((p) => posGroups.has(p));
}

export type PlannedDrill = {
  drill: Drill;
  prescription: Prescription;
  displayTitle: string;
};

export type PlannedDay = {
  day: DayId;
  title: string;
  focus: string;
  drills: PlannedDrill[];
};

export function generateWeek(inputs: AthleteInputs): PlannedDay[] {
  const factor = ageScale(inputs.age) * (1 + progressionTier(inputs) * 0.1);
  const days: PlannedDay[] = [];
  for (const day of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as DayId[]) {
    const t = WEEKLY_TEMPLATE[day];
    const drills: PlannedDrill[] = [];
    for (const id of t.drillIds) {
      const d = DRILLS[id];
      if (!d) continue;
      if (!positionFilter(d, inputs.positions)) continue;
      const rx = scalePrescription(d.base, factor, d, inputs.age);
      const fmt = formatPrescription(rx);
      drills.push({
        drill: d,
        prescription: rx,
        displayTitle: fmt ? `${d.name} — ${fmt}` : d.name,
      });
    }
    // Position emphasis add-ons
    if (day === "Thu" && inputs.positions?.includes("P")) {
      // pitchers already get plenty; add extra long toss note via last drill
    }
    days.push({ day, title: t.title, focus: t.focus, drills });
  }
  return days;
}

export const DAY_INDEX: Record<DayId, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

// Map drill category → workouts.category enum used by the DB (best-fit)
export function toWorkoutCategory(cat: DrillCategory): string {
  switch (cat) {
    case "Hitting":
      return "Hitting";
    case "Throwing":
      return "Throwing";
    case "Fielding":
      return "Fielding";
    case "Speed":
    case "Power":
      return "Speed";
    case "Strength":
      return "Strength";
    case "Warm-Up":
    case "Baserunning":
      return "Speed";
    case "Recovery":
      return "Recovery";
  }
}
