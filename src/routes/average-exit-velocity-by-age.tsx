import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticleView, articleHead } from "@/components/article-view";
import { articleBySlug } from "@/lib/resources";

const SLUG = "average-exit-velocity-by-age";

export const Route = createFileRoute("/average-exit-velocity-by-age")({
  loader: () => {
    const article = articleBySlug(SLUG);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) =>
    loaderData ? articleHead(SLUG, loaderData.article, "/average-exit-velocity-by-age") : {},
  component: () => <ArticleView article={Route.useLoaderData().article} />,
});
