import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticleView, articleHead } from "@/components/article-view";
import { articleBySlug } from "@/lib/resources";

const SLUG = "average-pitching-velocity-by-age";

export const Route = createFileRoute("/pitching-velocity-by-age")({
  loader: () => {
    const article = articleBySlug(SLUG);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) =>
    loaderData ? articleHead(SLUG, loaderData.article, "/pitching-velocity-by-age") : {},
  component: () => <ArticleView article={Route.useLoaderData().article} />,
});
