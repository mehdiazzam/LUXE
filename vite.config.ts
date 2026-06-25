import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const isGithubPagesBuild = process.env.npm_lifecycle_event === "build:github";
const githubPagesBase = "/LUXE/";

export default defineConfig(({ command }) => {
  const useCloudflare = command === "build" && !isGithubPagesBuild;

  return {
    base: isGithubPagesBuild ? githubPagesBase : "/",
    server: {
      host: "::",
      port: 8080,
    },
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      ...(useCloudflare ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
      tanstackStart({
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
        spa: isGithubPagesBuild
          ? {
              enabled: true,
              maskPath: "/",
              prerender: {
                outputPath: "/index.html",
              },
            }
          : {
              enabled: false,
            },
      }),
      viteReact(),
    ],
  };
});
