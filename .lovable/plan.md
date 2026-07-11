# Weekly Baseball Development Program

Build a complete, auto-generated 7-day training program that plugs into the existing Training page. Every athlete gets a personalized plan based on profile (age, height, weight, position) and latest measurements (exit velo, throw velo, 60yd, bat speed). The plan adapts as metrics improve.

## What we're building

### 1. Exercise & Drill Library (`src/lib/program.ts`)
A typed catalog of every exercise/drill from the Mon–Sun spec. Each entry has:
- `name`, `category` (Hitting / Strength / Speed / Fielding / Throwing / Recovery)
- `baseSets`, `baseReps` (or duration/distance)
- `technique[]` — step-by-step
- `commonMistakes[]`
- `coachingTips[]`
- `safety[]`
- `videoPlaceholder` (URL slot, empty for now)

Plus a `WEEKLY_TEMPLATE` mapping each weekday → ordered list of drill IDs matching the spec exactly (Monday lower body + hitting, Tuesday speed + fielding, etc.).

### 2. Personalization engine (`src/lib/program.ts`)
Pure function `generateWeek(profile, latestMeasurements) → DayPlan[]`:
- **Age scaling**: <12 = 60% volume, 12–14 = 80%, 15–17 = 100%, 18+ = 110%. Caps weighted lifts for <13 (bodyweight variants only).
- **Skill level** derived from measurements vs age-band benchmarks (Beginner / Developing / Advanced).
- **Position filter**: pitchers get extra long toss + recovery, catchers get blocking/footwork emphasis, outfielders extra drop steps, infielders extra double-play work.
- **Progression**: if latest exit velo / throw velo / 60yd / bat speed improved ≥5% vs 30 days ago, bump sets/reps one tier (with age cap). Downgrade on regression.
- Output: 7 days, each with title, focus, and a list of prescribed drills (with the athlete-specific sets/reps).

### 3. "Generate my week" flow
On the Training page, add a **Generate Program** button. It:
- Loads profile + most recent measurement.
- Runs `generateWeek(...)`.
- Inserts one `workouts` row per drill for the current week (skipping days already populated, or wiping the week first — user confirms via dialog).
- Existing weekly view already renders `workouts` rows and checklist.

### 4. Drill detail sheet
Clicking a workout row opens a drawer/sheet showing the full exercise instructions (technique, mistakes, tips, safety, video placeholder). Uses shadcn `Sheet`.

### 5. Encouragement + milestones
- On checkbox complete: toast with a rotating encouraging message ("Nice work — one more rep than yesterday.").
- On week 100% complete: celebratory toast + confetti-style banner on Dashboard.
- On new measurement PR (compared to prior best): toast "New personal best — throw velo 68 → 72 mph!" (hooks into Progress page save flow).

### 6. Weekly completion %
Already computed on Training page — surface the same number on Dashboard as "This week."

## Technical layout

```
src/lib/program.ts              # library + generator (pure, tested-shape)
src/lib/encouragement.ts        # message pool + milestone helpers
src/components/drill-sheet.tsx  # exercise detail Sheet
src/routes/_authenticated/training.tsx  # + Generate button, sheet trigger
src/routes/_authenticated/progress.tsx  # + PR detection on save
src/routes/_authenticated/dashboard.tsx # + week % + latest milestone
```

No schema changes — everything fits current `workouts` / `measurements` / `profiles` tables. The generated drills persist as normal `workouts` rows, so the existing checklist, completion %, and progression tracking Just Work.

## Notes for you
- Instructions live in code (not the DB) so they're free to display, easy to edit, and load instantly.
- Video URLs are left as placeholders you can fill in later per drill.
- Progression is conservative and age-capped — safety reminders always render in the drill sheet.
