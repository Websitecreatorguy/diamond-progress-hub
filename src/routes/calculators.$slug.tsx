import { createFileRoute, notFound } from "@tanstack/react-router";
import { CalculatorPage } from "@/components/calculators/calculator-page";
import { calculatorBySlug } from "@/lib/calculators";
import { breadcrumbLd, buildHead } from "@/lib/seo-head";

export const Route = createFileRoute("/calculators/$slug")({
  loader: ({ params }) => {
    const calculator = calculatorBySlug(params.slug);
    if (!calculator) throw notFound();
    return { calculator };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Calculator not found" }, { name: "robots", content: "noindex" }] };
    }
    const c = loaderData.calculator;
    return buildHead({
      title: c.title,
      description: c.description,
      path: `/calculators/${params.slug}`,
      faqs: c.faqs,
      jsonLd: [
        {
          "@type": "WebApplication",
          name: c.name,
          applicationCategory: "SportsApplication",
          operatingSystem: "Web",
          description: c.description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: c.name, path: `/calculators/${params.slug}` },
        ]),
      ],
    });
  },
  component: () => <CalculatorPage calculator={Route.useLoaderData().calculator} />,
});
