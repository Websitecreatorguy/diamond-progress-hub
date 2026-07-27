import { SITE_URL } from "@/lib/seo";

type Faq = { q: string; a: string };

export function buildHead(opts: {
  title: string;
  description: string;
  path: string;
  faqs?: Faq[];
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>[];
}) {
  const url = `${SITE_URL}${opts.path}`;
  const scripts: { type: "application/ld+json"; children: string }[] = [];

  if (opts.faqs?.length) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: opts.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }),
    });
  }
  for (const ld of opts.jsonLd ?? []) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({ "@context": "https://schema.org", ...ld }),
    });
  }

  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:url", content: url },
      { property: "og:type", content: opts.type ?? "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts,
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}
