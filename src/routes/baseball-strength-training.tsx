import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticleView, articleHead } from "@/components/article-view";
import { articleBySlug } from "@/lib/resources";

const SLUG = "baseball-strength-training";

export const Route = createFileRoute("/baseball-strength-training")({
  loader: () => {
    const article = articleBySlug(SLUG);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) =>
    loaderData ? articleHead(SLUG, loaderData.article, "/baseball-strength-training") : {},
  component: () => <ArticleView article={Route.useLoaderData().article} />,
});
