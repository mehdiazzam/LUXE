import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/shop/$category")({
  loader: ({ params }) => {
    throw redirect({
      to: "/shop",
      search: { cat: params.category },
    });
  },
});
