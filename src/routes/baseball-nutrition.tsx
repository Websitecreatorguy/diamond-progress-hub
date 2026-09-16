import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticleView, articleHead } from "@/components/article-view";
import { articleBySlug } from "@/lib/resources";

const SLUG = "baseball-nutrition";

export const Route = createFileRoute("/baseball-nutrition")({
  loader: () => {
    const article = articleBySlug(SLUG);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) =>
    loaderData ? articleHead(SLUG, loaderData.article, "/baseball-nutrition") : {},
  component: () => <ArticleView article={Route.useLoaderData().article} />,
});
