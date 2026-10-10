# Codebase guide

Every source file starts with a short comment explaining its purpose. This page is the map.

## Editing portfolio content
All cards live in the `boardItems` array in `src/routes/index.tsx`. Each item has a title, folder (About / Experience / Projects), category, year, description, tools, image, and optional links or an extra image. Add a photo to `src/assets/`, import it, and reference it in an item.

## Files

| Path | Purpose |
| --- | --- |
| `src/routes/index.tsx` | Home moodboard: data, hero, search, folder tabs, flip cards, Experience timeline |
| `src/routes/__root.tsx` | HTML shell, metadata, fonts, 404 and error pages |
| `src/routes/README.md` | File-based routing conventions |
| `src/routeTree.gen.ts` | Auto-generated route tree — do not edit |
| `src/router.tsx` | Router + React Query client setup |
| `src/server.ts` | Server entry with crash-safe error page |
| `src/start.ts` | Error-handling and CSRF middleware |
| `src/styles.css` | Tailwind v4 setup and design tokens |
| `src/lib/*` | Helpers: class merging, error capture/reporting, fallback error page |
| `src/hooks/use-mobile.tsx` | Mobile-viewport hook |
| `src/components/ui/*` | shadcn/ui primitives (buttons, dialogs, etc.) |
| `src/assets/*` | Images; `*.asset.json` files point to uploaded photos |
| `src/test/*` | Vitest setup and routing tests |
| `public/*` | Static files (favicon, robots.txt, `.nojekyll` for GitHub Pages) |
| `vite.config.ts` | Builds for Lovable or static GitHub Pages |
| `vitest.config.ts`, `eslint.config.js`, `.prettierrc` | Testing, linting, formatting |
| `.github/workflows/static.yml` | Deploys to GitHub Pages on push to `main` |
| `README.md` | Setup and deployment instructions |
| `AGENTS.md`, `roadmap.md`, `.lovable/` | Project decisions, task list, and build plans |
