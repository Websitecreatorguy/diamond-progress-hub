const MESSAGES = [
  "Nice work — reps in the bank.",
  "That's how champions are built.",
  "Small wins stack. Keep going.",
  "One rep better than yesterday.",
  "Consistency > intensity. You're doing it.",
  "Coach would be proud.",
  "Trust the process — this is it.",
  "That effort shows up in games.",
];

export function encouragement(seed: number = Date.now()): string {
  return MESSAGES[Math.abs(seed) % MESSAGES.length];
}

export function milestoneFor(count: number): string | null {
  const marks: Record<number, string> = {
    1: "First workout in the books!",
    10: "10 workouts — habit forming.",
    25: "25 workouts. You're grinding.",
    50: "50 workouts — half a century!",
    100: "100 workouts. That's dedication.",
    250: "250 workouts. Elite level effort.",
  };
  return marks[count] ?? null;
}

export function prCelebration(metric: string, prev: number, curr: number, unit: string): string {
  return `New personal best — ${metric} ${prev} → ${curr} ${unit}!`;
}
