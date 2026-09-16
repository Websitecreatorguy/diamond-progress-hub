import { CALCULATORS } from "@/lib/calculators";
import { ARTICLES } from "@/lib/resources";
import { STAT_PAGES, PITCH_AGE_SLUGS } from "@/lib/stat-pages";

export type SearchItem = {
  title: string;
  description: string;
  href: string;
  type: "Calculator" | "Statistics" | "Article" | "Page" | "Teams" | "Players";
  keywords: string;
};

const PAGES: SearchItem[] = [
  { title: "Player dashboard", description: "Your stats, goals, and progress charts.", href: "/dashboard", type: "Players", keywords: "player dashboard profile stats me" },
  { title: "Training plan", description: "Your personalized weekly baseball program.", href: "/training", type: "Page", keywords: "training program workouts weekly" },
  { title: "Progress check", description: "Log measurements and track personal records.", href: "/progress", type: "Players", keywords: "progress growth tracker measurements log" },
  { title: "Progress charts", description: "Visualize your metrics over time.", href: "/charts", type: "Players", keywords: "charts graphs trends" },
  { title: "Teams", description: "Team invite codes, rosters, and coach tools.", href: "/teams", type: "Teams", keywords: "team teams coach roster invite code" },
  { title: "Leaderboards", description: "Coach-verified rankings across key metrics.", href: "/leaderboards", type: "Teams", keywords: "leaderboard rankings top players team leaders" },
  { title: "Features", description: "Everything inside Diamond Development.", href: "/features", type: "Page", keywords: "features platform product" },
  { title: "Blog", description: "Training guides, benchmarks, nutrition, and recovery.", href: "/blog", type: "Page", keywords: "blog articles guides" },
  { title: "Resources", description: "Every Diamond Development guide and benchmark.", href: "/resources", type: "Page", keywords: "resources library" },
  { title: "Baseball calculators", description: "All free baseball percentile calculators.", href: "/calculators", type: "Calculator", keywords: "calculator calculators tools" },
  { title: "Baseball statistics by age", description: "Every age-by-age baseball benchmark page.", href: "/baseball-stats", type: "Statistics", keywords: "statistics stats benchmarks by age averages" },
];

export const SEARCH_INDEX: SearchItem[] = [
  ...PAGES,
  ...CALCULATORS.map<SearchItem>((c) => ({
    title: c.name,
    description: c.description,
    href: `/calculators/${c.slug}`,
    type: "Calculator",
    keywords: `${c.slug} calculator percentile`,
  })),
  ...STAT_PAGES.map<SearchItem>((p) => ({
    title: p.h1,
    description: p.description,
    href: p.path,
    type: "Statistics",
    keywords: `${p.path} average by age benchmark`,
  })),
  ...PITCH_AGE_SLUGS.map<SearchItem>((slug) => {
    const age = slug.split("-")[0];
    return {
      title: `Average Pitching Velocity for ${age}-Year-Olds`,
      description: `Average and elite fastball velocity for ${age}-year-old pitchers, plus a percentile calculator.`,
      href: `/average-pitching-velocity/${slug}`,
      type: "Statistics",
      keywords: `pitching velocity age ${age} mph average`,
    };
  }),
  ...ARTICLES.map<SearchItem>((a) => ({
    title: a.h1,
    description: a.description,
    href: `/resources/${a.slug}`,
    type: "Article",
    keywords: `${a.slug} ${a.category}`,
  })),
];

export function searchSite(query: string, limit = 30): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return SEARCH_INDEX.map((item) => {
    const hay = `${item.title} ${item.description} ${item.keywords} ${item.type}`.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (!hay.includes(t)) return { item, score: -1 };
      score += item.title.toLowerCase().includes(t) ? 3 : 1;
      if (item.title.toLowerCase().startsWith(t)) score += 2;
    }
    return { item, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}
