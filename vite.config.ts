/**
 * Vite config: normal Lovable server build, or a prerendered static build for GitHub Pages (`--mode github-pages`).
 */
// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { ConfigEnv } from "vite";

export default (env: ConfigEnv) => {
  const isGitHubPages = env.mode === "github-pages";
  const base = isGitHubPages
    ? `${(process.env["GITHUB_PAGES_BASE_PATH"] ?? "/my-digital-moodboard").replace(/\/+$/, "")}/`
    : "/";

  return defineConfig({
    vite: { base },
    // Pages serves the prerendered client build; Lovable keeps its server build.
    nitro: !isGitHubPages,
    tanstackStart: {
      server: { entry: "server" },
      ...(isGitHubPages
        ? {
            router: { basepath: base },
            prerender: {
              enabled: true,
              autoStaticPathsDiscovery: false,
              crawlLinks: false,
              failOnError: true,
            },
            pages: [{ path: base }],
          }
        : {}),
    },
  })(env);
};
