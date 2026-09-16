import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticleView, articleHead } from "@/components/article-view";
import { articleBySlug } from "@/lib/resources";

const SLUG = "how-to-throw-harder";

export const Route = createFileRoute("/how-to-throw-harder")({
  loader: () => {
    const article = articleBySlug(SLUG);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) =>
    loaderData ? articleHead(SLUG, loaderData.article, "/how-to-throw-harder") : {},
  component: () => <ArticleView article={Route.useLoaderData().article} />,
});
