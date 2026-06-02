import { createFileRoute, notFound } from "@tanstack/react-router";
import { print } from "graphql";

import Prose from "@components/theme/search/Prose";
import { PAGE_BY_URL_KEY } from "@/graphql";
import type { PageData } from "@/types/theme/theme-customization";
import { bagistoGraphql } from "~/lib/bagisto/client";

export const Route = createFileRoute("/_public/$page")({
  loader: async ({ params }) => {
    const data = await bagistoGraphql<{
      pageByUrlKeypages: PageData[];
    }>(print(PAGE_BY_URL_KEY), { pageByUrlKey: params.page });

    const pages = data?.pageByUrlKeypages ?? [];
    if (!pages.length) {
      throw notFound();
    }
    return pages[0];
  },
  component: CmsPage,
});

function CmsPage() {
  const pageData = Route.useLoaderData();
  const translation = pageData?.translation;

  return (
    <div className="my-4 flex flex-col justify-between p-4">
      <div className="flex flex-col gap-4 mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold">
          {translation?.pageTitle}
        </h1>
        <Prose className="mb-8" html={translation?.htmlContent || ""} />
        <p className="text-sm italic">
          {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(pageData?.updatedAt || Date.now()))}.`}
        </p>
      </div>
    </div>
  );
}
