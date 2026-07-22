import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ARTICLES } from "@/lib/resources";
import { TOP_LEVEL_ARTICLE_PATHS } from "@/components/article-view";
import { SITE_URL } from "@/lib/seo";

interface Entry {
  path: string;
  changefreq?: "weekly" | "monthly" | "yearly";
  priority?: string;
  lastmod?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticEntries: Entry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/features", changefreq: "monthly", priority: "0.9" },
          { path: "/teams", changefreq: "monthly", priority: "0.8" },
          { path: "/leaderboards", changefreq: "monthly", priority: "0.8" },
          { path: "/resources", changefreq: "weekly", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.9" },
          { path: "/auth", changefreq: "yearly", priority: "0.4" },
        ];
        // Top-level canonical article URLs
        const topLevelEntries: Entry[] = Object.entries(TOP_LEVEL_ARTICLE_PATHS).map(
          ([slug, path]) => {
            const a = ARTICLES.find((x) => x.slug === slug);
            return {
              path,
              changefreq: "monthly",
              priority: "0.85",
              lastmod: a?.updated,
            };
          },
        );
        // /resources/[slug] pages that don't have a top-level canonical
        const articleEntries: Entry[] = ARTICLES.filter(
          (a) => !TOP_LEVEL_ARTICLE_PATHS[a.slug],
        ).map((a) => ({
          path: `/resources/${a.slug}`,
          changefreq: "monthly",
          priority: "0.7",
          lastmod: a.updated,
        }));

        const all = [...staticEntries, ...topLevelEntries, ...articleEntries];

        const urls = all.map((e) =>
          [
            "  <url>",
            `    <loc>${SITE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            "  </url>",
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
