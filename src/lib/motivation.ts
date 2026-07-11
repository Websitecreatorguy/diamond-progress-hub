export const QUOTES = [
  "Hard work beats talent when talent doesn't work hard.",
  "Small improvements every day lead to big results.",
  "Trust the process.",
  "Every rep counts. Every day matters.",
  "Champions are built in the offseason.",
  "Be the player nobody wants to face.",
];

export function todayQuote(seed = new Date().toDateString()) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return QUOTES[Math.abs(h) % QUOTES.length];
}

export const CATEGORIES = [
  "Hitting",
  "Pitching",
  "Throwing",
  "Fielding",
  "Catching",
  "Speed",
  "Strength",
  "Recovery",
] as const;
export type Category = (typeof CATEGORIES)[number];
