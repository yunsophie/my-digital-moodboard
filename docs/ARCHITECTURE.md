# Codebase guide

Every source file starts with a short comment explaining its purpose. This page is the map.

## Editing portfolio content

All cards live in the static, typed `boardItems` collection in `src/data/board-items.ts`. Each item has a title, folder (About / Experience / Projects), category, year, description, tools, image, and optional links or an extra image. Add a master photo to `src/assets/`, register it in `scripts/image-sources.json`, and run `npm run images:generate`. Reference its generated `imageAssets` family in the card. See the README for the full authoring and validation workflow.

## Files

| Path                                                                | Purpose                                                                      |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/routes/index.tsx`                                              | Home moodboard: hero, search, folder tabs, flip cards, Experience timeline   |
| `src/data/board-items.ts`                                           | Typed portfolio content rendered by the home route                           |
| `src/data/image-assets.generated.ts`                                | Generated image families and hosting-safe URL imports                        |
| `src/components/ResponsiveImage.tsx`, `src/lib/responsive-image.ts` | Shared image renderer and context-specific slot sizes                        |
| `scripts/generate-images.mjs`, `scripts/image-sources.json`         | Repeatable image generation and active source catalog                        |
| `src/assets/optimized/*`                                            | Generated WebP candidates and manifest; preserve source masters              |
| `src/routes/__root.tsx`                                             | HTML shell, metadata, fonts, 404 and error pages                             |
| `src/routes/README.md`                                              | File-based routing conventions                                               |
| `src/routeTree.gen.ts`                                              | Auto-generated route tree — do not edit                                      |
| `src/router.tsx`                                                    | Router + React Query client setup                                            |
| `src/server.ts`                                                     | Server entry with crash-safe error page                                      |
| `src/start.ts`                                                      | Error-handling and CSRF middleware                                           |
| `src/styles.css`                                                    | Tailwind v4 setup and design tokens                                          |
| `src/lib/*`                                                         | Helpers: class merging, error capture/reporting, fallback error page         |
| `src/hooks/use-mobile.tsx`                                          | Mobile-viewport hook                                                         |
| `src/components/ui/*`                                               | shadcn/ui primitives (buttons, dialogs, etc.)                                |
| `src/assets/*`                                                      | Images; `*.asset.json` files point to uploaded photos                        |
| `src/test/*`                                                        | Vitest setup, content validation, and routing tests                          |
| `e2e/*`, `playwright.config.ts`                                     | Browser checks for cards, responsive images, layout, and startup byte budget |
| `docs/performance/*`                                                | Historical loading baselines, optimization plan, and measured results        |
| `public/*`                                                          | Static files (favicon, robots.txt, `.nojekyll` for GitHub Pages)             |
| `vite.config.ts`                                                    | Builds for Lovable or static GitHub Pages                                    |
| `vitest.config.ts`, `eslint.config.js`, `.prettierrc`               | Testing, linting, formatting                                                 |
| `.github/workflows/static.yml`                                      | Validates pull requests; checks artifacts before deploying `main` to Pages   |
| `README.md`                                                         | Setup and deployment instructions                                            |
| `AGENTS.md`, `roadmap.md`, `.lovable/`                              | Project decisions, task list, and build plans                                |
