# My Digital Moodboard
Welcome to my personal portfolio ! As an avid user of Pinterest since early middle school (my first social media platform in fact), I have loved to create and curate art, music and fashion inspiration so I thought I'd do the same for my technical projects.

## GitHub Pages

The site deploys to [yunsophie.github.io/my-digital-moodboard](https://yunsophie.github.io/my-digital-moodboard/) when changes are pushed to `main`. In the repository's **Settings → Pages**, select **GitHub Actions** as the publishing source.

The workflow installs dependencies from `bun.lock`, checks TypeScript, lint, pin content, and routing, then runs `bun run build:pages`. Playwright tests the resulting `dist/client` files before they are uploaded and deployed. Pull requests to `main` run the same checks without publishing. That build prerenders the homepage to `index.html`, bundles the portfolio images, and uses the base path supplied by GitHub Pages. GitHub Pages serves these files without a running server.

To build the same static site locally:

```sh
npm run build:pages
```

Set `GITHUB_PAGES_BASE_PATH` to override the default `/my-digital-moodboard` path. For a custom domain or a user site hosted at the domain root, set it to `/`. The regular `npm run build` keeps the Lovable server deployment.

## Adding and checking pins

Add entries to the static, typed collection in `src/data/board-items.ts`. Keep image masters in `src/assets`, register them in `scripts/image-sources.json`, and run `npm run images:generate`. Reference the resulting `imageAssets` family and provide a nonblank title, description, category, year, and alt text. Pixel dimensions and source sets come from the generated manifest. The home route renders this collection; no upload service or database is needed.

Content tests automatically validate every entry. Browser tests check every rendered pin at phone, tablet, and desktop widths, including the selected responsive image family and decoded dimensions, the visual click-to-flip rotation, title and description on the back, flipping back, keyboard interaction, folder views, and grid bounds/overlap/overflow. These checks test layout mechanics; review image cropping and visual design when editing content.

To run the checks locally:

```sh
npm run images:check
npm run typecheck
npm run lint
npm run test
npx playwright install chromium
npm run build:pages
npm run test:e2e
```

Rebuild before rerunning browser tests after an edit: they serve the actual Pages artifact, not the development server. Use the same `GITHUB_PAGES_BASE_PATH` for both the build and the browser tests if you override it.

Failed browser tests save screenshots and traces. Open the HTML report with `npm run test:e2e:report`, or download `portfolio-browser-report` from the workflow's artifacts in GitHub Actions. A failed check prevents the website artifact from being uploaded or deployed.

The [pin test audit](docs/test-audit.md) records nine deliberately introduced faults and the assertions that caught them, including a description assertion that was strengthened after a false positive.

The [mobile loading baseline](docs/performance/mobile-baseline.md) records three production-build Lighthouse runs. The [image optimization plan](docs/performance/image-optimization-plan.md) uses those measurements to prioritize smaller responsive images and deferred card-back assets.

The [deployed mobile baseline](docs/performance/deployed-mobile-baseline.md) measures the actual GitHub Pages site using the same mobile settings and records how its live build differs from the current workspace.

## Maintaining responsive images

Original photos remain in `src/assets`; generated WebP files and their manifest live in `src/assets/optimized`. Only active image families are imported into the application. Sharp is a development dependency and runs locally, not in a visitor's browser.

When adding or replacing an image:

1. Add its original file to `src/assets` and its identifier/filename to `scripts/image-sources.json`.
2. Run `npm run images:generate`. Commit the master, generated WebP files, manifest, and `src/data/image-assets.generated.ts` together. Do not edit generated files by hand.
3. Import `imageAssets` into the typed portfolio collection and use the matching family. The generator supplies oriented dimensions, responsive candidates, and a fallback automatically.
4. Run `npm run images:check` and the checks above. Review cropping and readability on a phone and a large screen.

`npm run images:pilot` writes quality comparisons to the ignored `artifacts/performance/image-pilot/` directory. Generation uses WebP quality 80, widths 160/320/480/640/960 capped at the original size, and preserves originals. Changes to encoder settings require regeneration and visual review.

The shared `ResponsiveImage` component uses context-specific `sizes`, reserves the source aspect ratio, and limits 40px search previews to 160px files. The HuskyBids poster mounts after the first card opening and stays mounted for subsequent flips. CI verifies source hashes and actual encoded dimensions, checks responsive selection at DPR 1/1.75/2, checks static layout through DPR 3, and rejects a cold mobile navigation that exceeds **1,467,894 image bytes**, the original 30% reduction target. This is a startup transfer budget, not a limit on the sum of every generated variant.

The [image optimization results](docs/performance/image-optimization-results.md) record the implementation, stage-by-stage measurements, visual review, and validation. CSS masonry now chooses two, three, or five columns before hydration; pins follow collection order down each column. Google Fonts retains the existing typography with preconnects. Self-hosted font experiments worsened the measured LCP, so their reports and provenance are retained only as local experiment artifacts.

The [merged-content validation](docs/performance/merged-content-validation.md) records the ten-card portfolio after syncing remote edits, including the Visual Discovery image and the updated mobile loading priority. Historical nine-card measurements remain separate.
