# Image optimization implementation and results

Implemented on October 10, 2026. The final **nine-pin local production build** has a median Lighthouse performance score of **95/100**, downloads **87.5% fewer startup image bytes**, and has **0.00054 CLS**. Median LCP improved from **3.23 s to 2.75 s**. The image budget, score target, and layout-shift target pass; the **2.5 s LCP target remains open**.

The current ten-pin GitHub Pages deployment has not been changed. Its [deployed baseline](deployed-mobile-baseline.md) is retained separately. These gains compare matching local content rather than attributing the deployed/local difference to hosting.

## Measured stages

| Stage                                          | Score |    FCP |    LCP |     CLS | Image transfer |
| ---------------------------------------------- | ----: | -----: | -----: | ------: | -------------: |
| Original local build                           |    76 | 1.95 s | 3.23 s | 0.33035 |       2.097 MB |
| Poster deferred                                |    75 | 1.95 s | 3.23 s | 0.33029 |       1.881 MB |
| Responsive WebP images                         |    80 | 1.96 s | 2.70 s | 0.33029 |       0.263 MB |
| CSS masonry and font preconnects               |    95 | 1.89 s | 2.63 s | 0.00054 |       0.263 MB |
| Measured VLA priority hint                     |    95 | 1.95 s | 2.70 s | 0.00054 |       0.263 MB |
| Self-hosted fonts with preloads (rejected)     |    93 | 1.66 s | 3.08 s | 0.00000 |       0.263 MB |
| Self-hosted fonts discovered in CSS (rejected) |    92 | 2.10 s | 3.08 s | 0.00054 |       0.263 MB |
| Final selected build                           |    95 | 1.88 s | 2.75 s | 0.00054 |       0.263 MB |

The final three runs scored **95, 95, and 92**. Their LCP values were **2.746, 2.704, and 2.949 s**. Final FCP has a **1.88 s** median; total startup transfer fell **79.2%**, from **2.313 MB to 0.482 MB**. All three final runs transferred **262,912 image bytes** in **nine requests**, with no failed requests or Lighthouse warnings. The poster was absent from startup traffic.

Conditions match the original baseline: Lighthouse 12.8.2, Chrome for Testing 156, 412 × 823 CSS pixels, DPR 1.75, simulated slow 4G with 150 ms RTT and 1,638.4 Kbps throughput, and 4× CPU slowdown. Each run uses a fresh browser profile, gzip text responses, and no scrolling or interaction. The image-only checkpoint used an equivalent server on port 4174; the original and final measurements use port 4173. One idle browser test was winding down during the first image-only run; the final audits ran after the browser suite completed. Retain individual measurements and their variance rather than treating these lab medians as real-user guarantees.

## Step 1: Select the comparison target

The live site contained ten pins and different application assets, while this workspace contained nine. The implementation preserved the workspace's typed portfolio collection and compared it with its saved nine-pin baseline. The three unused image masters remain unbundled. No portfolio text, titles, links, or subjects were replaced to improve the measured byte count.

## Step 2: Defer the closed poster

`FlipImage` now records whether a card has opened. The HuskyBids poster mounts only after the first opening and remains mounted afterward. This prevents a hidden backface from downloading during startup and avoids remounting the poster on repeated flips. Its conditional mounting is independent of accessibility hiding and native lazy-loading margins.

The isolated checkpoint removed the poster request in all three audits and saved approximately **216 KB**, or **10.3%** of the original startup image bytes. One checkpoint run fetched the teaching-assistant image twice during the old hydration reshuffle; the other two fetched each primary image once. The final CSS layout removes that reshuffle, and final requests contain no duplicate image URLs.

## Step 3: Generate repeatable responsive assets

`scripts/image-sources.json` explicitly lists the eleven active masters. `scripts/generate-images.mjs` uses the pinned **Sharp 0.35.5** development dependency, applies source orientation, and generates WebP quality **80** at widths **160, 320, 480, 640, and 960**, capped at native width. A native-width endpoint is included below 960; duplicate widths are removed. The duck remains capped at **334 pixels**, and original masters are preserved.

The quality pilot compared WebP 75/80/85 against lossless resized references for About Sophie, DubHacks swag, Olmo Snow, and Study Ducky. Quality 80 preserves detail with substantial savings. All eleven image families were subsequently reviewed against resized references, including editorial gradients, faces, poster text, the campus photo, and the robot arm. Review sheets remain in `artifacts/performance/image-pilot/`. AVIF was optional and was unnecessary to meet the byte target; one output format keeps generation and review simpler.

The generator emits **52 candidates**, a machine-readable manifest with source/output hashes, actual dimensions, bytes, and encoder settings, and `src/data/image-assets.generated.ts` with typed Vite URL imports. URL imports preserve both root hosting and the GitHub Pages repository base path. The generated files total **2.311 MB**, compared with **2.645 MB** of original bundled images. That aggregate inventory is distinct from the **0.263 MB** actually downloaded by the mobile audit.

## Step 4: Share image rendering and choose appropriate slots

`BoardItem.image` references a generated asset family rather than repeating an image URL and dimensions in each pin. `ResponsiveImage` supplies the fallback, source set, logical width/height, alt text, and asset identifier. Image encoding details stay separate from portfolio content.

The shared component handles grid pins, timeline photos, education, and posters. Slot expressions in `src/lib/responsive-image.ts` account for padding, gaps, column breakpoints, and the 320px timeline cap. The poster subtracts back-panel padding and borders. Search previews use a **40px slot** and source sets capped at **160 pixels**, preventing a cached large pin candidate from being selected for a thumbnail. Crop classes and image view-transition names stay on the actual image element.

The leading five grid entries load eagerly to include visible LCP candidates across CSS-balanced columns; later entries use native lazy loading. The timeline eagerly loads its leading entry. After layout changed, the VLA image became LCP in all three layout-stage audits, so only that measured family receives high fetch priority. The priority-hint experiment did **not** demonstrate a clear median LCP gain; the hint is retained for the identified critical image, without claiming a performance win from it. Re-audit loading choices when the collection or layout changes. [LCP prioritization guidance](https://web.dev/articles/optimize-lcp)

## Step 5: Stabilize masonry before hydration

The old route rendered five columns initially and redistributed items after reading the browser width. CSS multi-column masonry now sets **two columns below 768px, three from 768px, and five from 1024px**, using the existing 8px/12px gaps. `break-inside: avoid` keeps each card together. The React resize listener, column state, and redistribution calculation were removed.

Pins now follow **collection order down each column**, changing some positions from the prior interleaved arrangement. The first mobile row is About Sophie and Virtual VLA. Before/after viewport screenshots were reviewed; typography, imagery, and card proportions remain consistent. This simpler CSS layout reserves image proportions before decoding and avoids a responsive DOM reshuffle. The large layout shift fell from approximately **0.330 to 0.00054**.

## Step 6: Measure font options and retain the better variant

Font preconnects were added without changing the original Cormorant Garamond and Manrope stylesheet, weights, or swap behavior. CSS masonry and preconnects were measured together; their individual contributions to the score are not isolated.

The remaining rendering chain justified an additional local experiment with the exact audited Latin WOFF2 files. Both self-hosted variants were measured separately, with and without font preloads. Preloading improved first paint, but both variants worsened LCP to approximately **3.08 s**. The final implementation therefore retains Google Fonts with preconnects. Trial font files, their source hashes, and redistribution licenses were moved to ignored experiment artifacts; unused fonts are absent from the application. Their behavior could differ on HTTP/2 hosting, so this local result should not be generalized to all deployments. [Font delivery guidance](https://web.dev/articles/font-best-practices)

## Step 7: Validate behavior and enforce the budget

Final validation passes:

- `npm run images:check`: eleven families and all 52 candidate files verified against source hashes, actual decoded metadata, encoder settings, and the generated TypeScript module.
- `npm run typecheck` and `npm run test`: TypeScript passes; all **14 content/routing tests** pass with exact description and image associations.
- `npm run lint`: zero errors and seven existing warnings. The flip effect's callback dependencies were corrected while updating that component.
- `npm run build:pages`: the static production build and prerender succeed.
- `npm run test:e2e`: all **18 browser tests** pass across phone, tablet, and desktop.

Browser checks decode the chosen files independently, verify asset-family membership and width descriptors, allow normal density rounding, and reject oversized selections caused by an incorrect slot expression. They preserve the visual rotation, description, keyboard, folder, overflow, and overlap checks. New checks require zero closed-poster requests, successful poster loading on opening, reuse on reopening, small search thumbnails, and correct search selection.

Static layout is also checked with JavaScript disabled at **375, 639, 640, 767, 768, 1023, 1024, and 1440 pixels**, including DPR 3. Ordinary image selection is exercised at DPR 1, 1.75, and 2. The cold 412px/DPR 1.75 navigation test enforces **at most 1,467,894 image bytes**, the original 30% reduction budget. CI checks generated assets and this budget before uploading or deploying the website.

In an isolated copy, deliberately changing a master and appending corrupt bytes to a candidate both made `images:check` fail. Restoring the copied assets made it pass. The actual workspace assets were not mutated for these fault checks.

## Maintenance and remaining measurement

The [README](../../README.md#maintaining-responsive-images) explains how to add a master, register it, regenerate, review it, and commit the generated files together. Code comments document the poster lifecycle, image-slot geometry, encoder ownership, loading policy, CSS source order, and the reasons behind the font choice. Generated TypeScript is explicitly marked as generated; edit the catalog or masters instead.

The image milestone is complete. The separate **2.5 s LCP** target remains unmet at the final **2.75 s** median. Further tuning should use the VLA image's measured waterfall on a matching hosted build. No commit, push, or deployment was performed here. The existing live baseline must not be presented as an optimized before/after result until a matching deployed comparison is available.

## Evidence

The tracked [results JSON](image-optimization-results.json) records every stage, all individual runs, settings, LCP candidates, build hashes, acceptance criteria, and validation results. Full HTML/JSON reports remain locally under the ignored `artifacts/performance/` directory:

- [Final median-LCP report](../../artifacts/performance/mobile-optimized-selected/run-1.report.html).
- [Final viewport](../../artifacts/performance/mobile-optimized-selected/viewport.jpg), [original viewport](../../artifacts/performance/mobile-baseline/viewport.jpg).
- [Pilot quality review](../../artifacts/performance/image-pilot/pilot-review.png).
- [Final measured document](../../artifacts/performance/mobile-optimized-selected/measured-index.html) and [measurement harness](../../artifacts/performance/mobile-optimized-selected/measurement-harness.mjs).

The final document snapshot and current `dist/client/index.html` agree with the final audit's SHA-256. The original [local baseline](mobile-baseline.md) and [deployed baseline](deployed-mobile-baseline.md) remain unchanged as historical evidence.
