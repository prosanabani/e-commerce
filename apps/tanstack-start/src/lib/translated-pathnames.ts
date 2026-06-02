import type { FileRoutesByTo } from "../routeTree.gen";
import type { Locale } from "~/paraglide/runtime";

type RoutePath = keyof FileRoutesByTo;

const excludedPaths = ["api"] as const;

type PublicRoutePath = Exclude<
  RoutePath,
  `${string}${(typeof excludedPaths)[number]}${string}`
>;

interface TranslatedPathname {
  pattern: string;
  localized: [Locale, string][];
}

function toUrlPattern(path: string) {
  return path
    .replace(/\/\$$/, "/:path(.*)?")
    .replace(/\{-\$([a-zA-Z0-9_]+)\}/g, ":$1?")
    .replace(/\$([a-zA-Z0-9_]+)/g, ":$1")
    .replace(/\/+$/, "");
}

function createTranslatedPathnames(
  input: Record<PublicRoutePath, Record<Locale, string>>,
): TranslatedPathname[] {
  return Object.entries(input).map(([pattern, locales]) => ({
    pattern: toUrlPattern(pattern),
    localized: Object.entries(locales).map(
      ([locale, path]) =>
        [
          locale as Locale,
          locale === "en"
            ? toUrlPattern(path)
            : `/${locale}${toUrlPattern(path)}`,
        ] satisfies [Locale, string],
    ),
  }));
}

export const translatedPathnames = createTranslatedPathnames({
  "/": {
    en: "/",
    ar: "/",
  },
  "/search": {
    en: "/search",
    ar: "/search",
  },
  "/checkout": {
    en: "/checkout",
    ar: "/checkout",
  },
});
