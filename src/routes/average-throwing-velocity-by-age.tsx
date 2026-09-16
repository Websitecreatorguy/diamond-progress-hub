import { createFileRoute } from "@tanstack/react-router";
import { StatByAgePage } from "@/components/seo/stat-by-age-page";
import { statPageByPath } from "@/lib/stat-pages";
import { breadcrumbLd, buildHead } from "@/lib/seo-head";

const PATH = "/average-throwing-velocity-by-age";
const page = statPageByPath(PATH)!;

export const Route = createFileRoute("/average-throwing-velocity-by-age")({
  head: () =>
    buildHead({
      title: page.title,
      description: page.description,
      path: PATH,
      type: "article",
      faqs: page.faqs,
      jsonLd: [
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Baseball stats", path: "/baseball-stats" },
          { name: page.h1, path: PATH },
        ]),
      ],
    }),
  component: () => <StatByAgePage page={page} />,
});
