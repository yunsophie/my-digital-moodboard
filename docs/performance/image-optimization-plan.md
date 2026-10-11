# Image optimization plan

This plan follows the measured [mobile baseline](mobile-baseline.md): performance 76/100, LCP 3.23 seconds, CLS 0.330, and 2.097 MB of startup image transfer. The implementation and measured results are recorded in [image optimization results](image-optimization-results.md). This document retains the original reasoning and acceptance criteria; the current workspace is the nine-pin comparison target.

## Deployed-site checkpoint before implementation

The subsequent [live GitHub Pages audit](deployed-mobile-baseline.md) measures **72/100 performance, 9.10 s LCP, 0.082 CLS, and 2.241 MB of image transfer**. It serves a different build with 10 pins, while this plan's local build has 9. Its LCP candidates are the Olmo Snow and key-value-store images; the first run flags lazy loading on the visible key-value-store image. The live build also includes a `pink-hardware-grid` asset absent from the current local build.

The implementation uses the matching nine-pin local baseline before attributing before/after gains to image optimization. Apply the loading-priority decisions in step 4 to the actual LCP candidates of that build. For unchanged live content, the 30% image-transfer goal is **≤1.569 MB**; the **≤1.468 MB** goal below applies to the current local content. The live deployment has not been changed.

## Goals and acceptance criteria

| Goal                                           | Baseline                               | Acceptance criterion                                                                                                            |
| ---------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Reduce startup image transfer                  | 2,096,991 bytes                        | **At most 1,467,894 bytes**, a reduction of at least 30%, using the same mobile audit conditions.                               |
| Defer the closed-card poster                   | One 216.2 KB startup request           | **Zero poster requests before opening the card**; the poster loads successfully after opening it.                               |
| Preserve quality and behavior                  | Current originals and 23 passing tests | Maintain image subject matter, color, crop, aspect ratio, alt text, card flipping, search, folder views, and responsive layout. |
| Preserve loading performance during image work | Median LCP 3.23 s; FCP 1.95 s          | Compare three-run medians and ranges; investigate regressions beyond ordinary baseline variation.                               |
| Reach the next overall performance milestone   | Score 76; CLS 0.330                    | **Score ≥90, LCP ≤2.5 s, CLS ≤0.1** after separately addressing the measured grid/font issues and confirming results.           |

The 30% budget applies to images actually transferred during initial navigation. Responsive variants can increase the aggregate number of bundled files while reducing the bytes a visitor downloads. Record both totals and avoid treating an increase in variant inventory as an increase in page transfer.

## Step 1: Defer the hidden poster

**Change:** In `FlipImage` in `src/routes/index.tsx`, mount `extraImage` when the card first opens. Retain it after that first opening so closing and reopening the card does not unnecessarily remount the image. Keep the title, description, and links available immediately.

**Reason:** CSS backface hiding, `aria-hidden`, and `loading="lazy"` currently allow the poster request to happen during startup. The audit confirms this request costs 216.2 KB. Deferring it can remove approximately 10.3% of startup image transfer before any re-encoding; verify the observed saving.

**Validation:** Add a browser assertion that the closed card generates no poster request, then open it and verify the image loads, has its alt text, and fits the back of the card. Keep existing click-back and Escape behavior. Save a checkpoint measurement to distinguish this saving from compression.

## Step 2: Pilot compression on the images that matter first

Use a deterministic local encoder such as **Sharp** in a development script. Keep originals as source masters and generate new files into `src/assets/optimized/`. Image generation should run locally or during the build, with output served as static files by GitHub Pages. The portfolio collection remains static and typed.

Start with:

| Asset                   | Current size | Why prioritize it?                                        |
| ----------------------- | ------------ | --------------------------------------------------------- |
| about-sophie.jpg        | 382.9 KB     | First visible pin; substantial photo payload.             |
| dubhacks-swag.jpg       | 381.6 KB     | Large homepage request, including when below the fold.    |
| olmo-snow-symposium.jpg | 339.4 KB     | Large homepage request near the initial viewport.         |
| study-ducky-v2.png      | 177.4 KB     | Small native dimensions with an unusually large PNG file. |

For the pilot, compare **WebP quality 75, 80, and 85**. Start with quality 80, then select the smallest encoding that passes visual review. Compare **AVIF quality 40, 50, and 60** as an optional second format; quality numbers across formats are not equivalent. Retain transparency where the source uses it. Apply orientation before resizing and review color against the original.

Use the same input masters for each candidate. Record the encoder version, width, format, quality, output dimensions, and bytes in a generated manifest. Review the duck's edges, photo faces, subtle editorial gradients, and poster text at their rendered sizes and on high-density screens. [Sharp output options](https://sharp.pixelplumbing.com/api-output/)

The campus image can follow in the Experience-view pass. Its 550.1 KB file does not appear in the homepage startup requests, so optimizing it will improve that view rather than this initial-load baseline.

## Step 3: Generate responsive widths and integrate one shared renderer

Compression alone leaves unnecessarily large pixel dimensions. Generate width candidates of **160, 320, 480, 640, and 960 pixels**, capped at the source width and the largest supported display need. Include a native-width candidate when it fills a gap in that set, and deduplicate identical output widths. Use the actual encoded width in each `w` descriptor. Avoid upscaling: the 334-pixel duck should retain its maximum native width. [Sharp resizing](https://sharp.pixelplumbing.com/api-resize/)

Create `scripts/generate-images.mjs` and a generated typed image manifest. Update `src/data/board-items.ts` to reference optimized fallback files and their source sets while retaining logical dimensions and alt text. Original masters should remain in the repository without being imported into the production client solely as oversized fallbacks.

Create a shared `ResponsiveImage` component, using `<picture>` for optional AVIF sources and `<img>` with WebP `src`/`srcSet` as the broadly supported fallback. Reuse it for:

- Primary grid pin images.
- Experience timeline images and the campus image.
- The poster inside a flipped card.
- Search suggestion thumbnails, which display at 40 CSS pixels.

Keep `width` and `height` attributes and a consistent aspect ratio so the browser reserves space before decoding. Preserve crop classes, `decoding="async"`, loading behavior, and the unique view-transition name on the actual image element.

Each context needs an accurate `sizes` value. At the baseline viewport, a pin is 194 CSS pixels wide; DPR 1.75 requires roughly 340 source pixels, making a 480-pixel candidate a reasonable initial choice. High-density phones and the 320-pixel timeline need larger candidates.

For the current grid geometry, use this starting expression and validate it against measured card bounds:

```text
(min-width: 1024px) calc((100vw - 72px) / 5),
(min-width: 768px) calc((100vw - 48px) / 3),
(min-width: 640px) calc((100vw - 36px) / 2),
calc((100vw - 24px) / 2)
```

These terms account for the section padding and column gaps. Search thumbnails use `sizes="40px"`; timeline images cap at 320 pixels; the poster's slot subtracts the back-panel padding and border from the card width. Check sizes at breakpoint boundaries and DPR 1, 1.75, 2, and 3. [Responsive image selection](https://web.dev/learn/images/responsive-images/)

Roll the pilot into the homepage first, then convert the remaining active images. Skip the three unused source images, which are not part of the current production bundle.

## Step 4: Correct loading priorities

The current grid eagerly loads up to four images in its first column, including images below the initial viewport. Make first-row pin images eligible for eager loading and keep later rows lazy. Apply the same principle to the timeline. Supply small search-thumbnail candidates so opening search does not request full-resolution photos solely for 40-pixel previews.

Reserve high fetch priority or image preloading for an image that measurements identify as critical. The original local LCP was text, so high-priority photo requests were not added speculatively. The final CSS masonry layout eagerly loads the leading five entries to include the tall visible LCP candidates across its balanced columns; later entries remain lazy. Measurements confirm the chosen policy. CSS balancing changes the visual reading order to follow the collection down each column. The typography and app stylesheet must retain access to loading resources. [LCP resource prioritization](https://web.dev/articles/optimize-lcp)

Check the resulting network waterfall. Native lazy-loading margins can still fetch below-the-fold images, so measure the effect rather than assuming every lazy image is deferred. A custom intersection-based loader should only follow if responsive formats and the native policy leave a demonstrated problem; test scrolling and card opening if one is introduced.

## Step 5: Update image tests and compare the result

The existing browser helper compares `naturalWidth` and `naturalHeight` with declared logical dimensions. Responsive candidates can legitimately differ, so update that assertion before introducing `srcSet`:

- Require a successfully loaded image with nonzero natural dimensions.
- Check that its aspect ratio agrees with the declared ratio, allowing the rounding of resized heights.
- Verify `currentSrc` belongs to the correct pin's generated asset family.
- Validate candidate file dimensions and width descriptors against the generated manifest.
- Check an appropriate candidate is selected for the actual slot and DPR, with reasonable allowance for browser selection rules.
- Keep the exact title/description association, CSS rotation, grid overlap, overflow, folder, and keyboard assertions.

Add the closed-poster network assertion and checks for the small search thumbnails. Confirm no duplicate requests arise from incorrect preloads or `<picture>` integration. These tests should protect resource selection and pin behavior; avoid snapshots that merely reproduce manifest data.

Run the existing checks after implementation:

```sh
npm run typecheck
npm run lint
npm run test
npm run build:pages
npm run test:e2e
```

Then repeat the three-run mobile measurement with the saved harness, same browser/tool versions, fresh profiles, gzip server, and mobile settings. Store results in a new comparison directory. Compare per-resource bytes, total image transfer, image request count, and LCP/FCP/CLS medians and ranges.

The image milestone is complete when startup images transfer at most **1.468 MB**, the poster is absent until opened, quality passes visual review, and existing interactions pass. Add a CI byte-budget check after the optimized baseline is stable. A fixed navigation measurement should back a network-byte budget; aggregate variant file sizes are a separate build-size metric.

## Separate follow-up: grid stability and text loading

Image work is valuable for transfer and visible image delivery. The current Lighthouse image opportunities estimate zero direct modeled LCP improvement, and the largest layout shift occurs in the grid. To pursue the overall score goal, keep these changes as separate measured steps:

1. **Stabilize the initial responsive grid.** In `src/routes/index.tsx` and `src/styles.css`, replace the five-column first paint followed by a two-column hydration reshuffle with layout that is correct at first paint. Evaluate a CSS-driven masonry/column arrangement with a stable DOM; compare pin order, spacing, and timeline behavior against baseline screenshots before adopting it. A mobile-first initial column count alone could move the shift to larger screens, so check all breakpoints.
2. **Profile font delivery for the introductory text.** In `src/routes/__root.tsx`, begin with measured preconnects to the Google Fonts stylesheet and font-file origins. Compare self-hosted, subset WOFF2 fonts only if that produces a benefit on the actual host. Preserve the current typography and use compatible fallback metrics to limit swaps. Font display already uses `swap`. [Font performance guidance](https://web.dev/articles/font-best-practices)
3. **Measure the final combination.** Re-audit and compare the deployed site after publication. Claim image-byte savings from the image changes, and attribute CLS/LCP changes to the measured layout/font steps that produced them.

The CSS masonry and font preconnect steps are implemented and measured together after the image-only checkpoint. The subsequent high-priority LCP hint did not show a clear median gain. Self-hosted copies of the two existing Latin WOFF2 fonts were then measured separately because the external stylesheet remained in the render chain. Both self-hosted variants worsened LCP and were rejected; Google Fonts with preconnects is retained. Custom intersection loaders were unnecessary for this iteration. See the results report for stage-by-stage measurements and the remaining live-deployment comparison.
