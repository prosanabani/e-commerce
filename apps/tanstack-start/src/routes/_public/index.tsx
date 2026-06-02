import { createFileRoute } from "@tanstack/react-router";
import { print } from "graphql";

import RenderThemeCustomization from "@components/home/RenderThemeCustomization";
import { GET_THEME_CUSTOMIZATION } from "@/graphql";
import type { ThemeCustomizationResponse } from "@/types/theme/theme-customization";
import { bagistoGraphql } from "~/lib/bagisto/client";

export const Route = createFileRoute("/_public/")({
  loader: async () => {
    const data = await bagistoGraphql<ThemeCustomizationResponse>(
      print(GET_THEME_CUSTOMIZATION),
      { first: 20 },
    );
    return data;
  },
  component: HomePage,
});

function HomePage() {
  const data = Route.useLoaderData();
  return (
    <RenderThemeCustomization themeCustomizations={data?.themeCustomizations} />
  );
}
