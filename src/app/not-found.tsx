import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-[10rem] leading-none text-gold/30">404</p>
        <h2 className="-mt-8 font-display text-3xl">Page not found</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
