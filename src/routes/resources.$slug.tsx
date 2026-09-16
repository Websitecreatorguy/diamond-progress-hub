import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { ArticleView, TOP_LEVEL_ARTICLE_PATHS, articleHead } from "@/components/article-view";
import { articleBySlug } from "@/lib/resources";

export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => {
    const article = articleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Not found — Diamond Development" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    // If a slug has a top-level canonical URL, defer canonical there so
    // search engines consolidate signals on the primary URL.
    const canonicalPath =
      TOP_LEVEL_ARTICLE_PATHS[params.slug] ?? `/resources/${params.slug}`;
    return articleHead(params.slug, loaderData.article, canonicalPath);
  },
  notFoundComponent: NotFound,
  component: ArticlePage,
});

function NotFound() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-black">Article not found</h1>
        <p className="mt-3 text-muted-foreground">
          Browse all baseball guides in our resources hub.
        </p>
        <Link to="/resources" className="mt-6 inline-block text-primary underline">
          Back to resources
        </Link>
      </div>
    </MarketingLayout>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  return <ArticleView article={article} />;
}
