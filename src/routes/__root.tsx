import { createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { NotFoundPage } from "@/app/not-found";
import { RootLayout, RootShell } from "@/app/root-layout";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LUXE — Curated objects worth keeping" },
      {
        name: "description",
        content: "A curated multi-category marketplace. Considered design, shipped worldwide.",
      },
      { name: "author", content: "LUXE" },
      { property: "og:title", content: "LUXE — Curated objects worth keeping" },
      {
        property: "og:description",
        content: "A curated multi-category marketplace. Considered design, shipped worldwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return <RootLayout queryClient={queryClient} />;
}
