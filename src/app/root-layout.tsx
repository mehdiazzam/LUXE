import { QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { CartDrawer } from "@/components/site/cart-drawer";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/app/providers";

export function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="noise min-h-screen bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export function RootLayout({ queryClient }: { queryClient: QueryClient }) {
  return (
    <AppProviders queryClient={queryClient}>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <CartDrawer />
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </AppProviders>
  );
}
