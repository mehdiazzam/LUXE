import { createFileRoute } from "@tanstack/react-router";
import { CheckoutPage } from "@/features/checkout/checkout-page";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — LUXE" }, { name: "description", content: "Complete your order." }],
  }),
  component: CheckoutPage,
});
