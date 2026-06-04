import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { Check } from "lucide-react";

const schema = z.object({
  id: fallback(z.string(), "LX-XXXXXXXX").default("LX-XXXXXXXX"),
});

export const Route = createFileRoute("/checkout/success")({
  validateSearch: zodValidator(schema),
  head: () => ({
    meta: [
      { title: "Order placed — LUXE" },
      { name: "description", content: "Your order has been received." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { id } = Route.useSearch();
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold">
        <Check className="h-7 w-7" />
      </div>
      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Order received
      </p>
      <h1 className="font-display mt-3 text-balance text-5xl leading-tight sm:text-6xl">
        Thank you.
      </h1>
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        Your order <span className="text-gold">{id}</span> has been received. A confirmation has
        been sent to your inbox.
      </p>
      <div className="mt-10 flex gap-3">
        <Link
          to="/shop"
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Continue shopping
        </Link>
        <Link
          to="/"
          className="rounded-full border border-hairline px-6 py-3 text-sm hover:border-gold hover:text-gold"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
