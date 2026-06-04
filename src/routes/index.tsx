import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LUXE — Curated objects worth keeping" },
      {
        name: "description",
        content: "A curated multi-category marketplace. Considered design, shipped worldwide.",
      },
      { property: "og:title", content: "LUXE — Curated objects worth keeping" },
      {
        property: "og:description",
        content: "Considered design across categories. Shipped worldwide.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <Hero />
      <Marquee />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="spotlight absolute inset-0 -z-10" />
      <div className="mx-auto flex h-16 pt-4 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-medium tracking-tight">LUXE</span>
          <span className="hidden h-1.5 w-1.5 rounded-full bg-gold sm:block" />
        </Link>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-32 lg:pt-22">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display mt-6 text-balance text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-[6.5rem]"
            >
              Objects worth
              <br />
              <span className="italic text-gold">keeping</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              A curated marketplace for the considered modern home, wardrobe and workspace. Sourced
              from independent makers, shipped worldwide.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Shop
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:col-span-5"
          >
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-hairline">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80"
                alt="Curated edit"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/70">
                    Featured
                  </p>
                  <p className="font-display text-2xl text-foreground">The Quiet Edit</p>
                </div>
                <Link
                  to="/shop"
                  className="rounded-full bg-background/80 p-3 backdrop-blur transition hover:bg-gold hover:text-primary-foreground"
                  aria-label="Open shop"
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [
    "Tailored essentials",
    "Seasonal outerwear",
    "Premium basics",
    "Street-ready layers",
    "Footwear edits",
    "New arrivals weekly",
  ];
  return (
    <section className="overflow-hidden border-y border-hairline bg-surface/30 py-6">
      <div className="marquee flex gap-16 whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-16 font-display text-2xl italic text-foreground/70"
          >
            {t}
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </section>
  );
}
