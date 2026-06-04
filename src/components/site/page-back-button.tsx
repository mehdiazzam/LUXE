import { ArrowLeft } from "lucide-react";

export function PageBackButton({
  fallbackHref = "/shop",
}: {
  fallbackHref?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) {
          window.history.back();
          return;
        }

        window.location.assign(fallbackHref);
      }}
      className="inline-flex items-center pb-10 gap-2 rounded-full border-none border-hairline px-4 py-2 text-sm text-muted-foreground transition hover:border-gold hover:text-gold"
    >
      <ArrowLeft className="h-4 w-8" />
    </button>
  );
}
