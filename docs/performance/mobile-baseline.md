# Mobile loading baseline

Measured on October 10, 2026, using the current working-tree production build. The build and three audits completed without failed network requests or Lighthouse warnings.

## Results

| Metric                                            | Run 1    | Run 2    | Run 3    | Median       |
| ------------------------------------------------- | -------- | -------- | -------- | ------------ |
| Lighthouse performance                            | 76       | 76       | 75       | **76 / 100** |
| First Contentful Paint: first visible content     | 1.81 s   | 2.02 s   | 1.95 s   | **1.95 s**   |
| Largest Contentful Paint: largest content visible | 3.16 s   | 3.29 s   | 3.23 s   | **3.23 s**   |
| Speed Index                                       | 1.81 s   | 2.02 s   | 1.95 s   | **1.95 s**   |
| Total Blocking Time                               | 0 ms     | 0 ms     | 0 ms     | **0 ms**     |
| Cumulative Layout Shift                           | 0.330    | 0.291    | 0.330    | **0.330**    |
| Startup image transfer                            | 2.097 MB | 2.097 MB | 2.097 MB | **2.097 MB** |
| Total startup transfer                            | 2.313 MB | 2.313 MB | 2.313 MB | **2.313 MB** |
| Startup raster image requests                     | 10       | 10       | 10       | **10**       |

MB and KB in this document use decimal units. Transfer measurements include response overhead; source-file sizes below exclude it. Metric medians are calculated independently across the three runs.

Images account for **90.7% of startup transfer**. The initial navigation requested all nine primary pin images and the HuskyBids poster on the back of a closed pin. There was no scrolling, searching, folder selection, or card flipping during the audits.

The two script requests total 128.4 KB, fonts total 62.4 KB, and stylesheets total 16.0 KB. Total Blocking Time is a loading metric; this navigation audit did not measure Interaction to Next Paint or establish real-user Core Web Vitals results.

## Conditions and scope

- Lighthouse **12.8.2**, Chrome for Testing **156**, Node.js **22.13.0**.
- Mobile profile: **412 × 823 CSS pixels**, device pixel ratio **1.75**, Moto G Power user-agent emulation.
- Lighthouse simulated slow 4G: **150 ms RTT**, **1,638.4 Kbps throughput**, **4× CPU slowdown**.
- Three sequential runs, each with a fresh Chrome profile and browser storage reset.
- Production output from `npm run build:pages`, served at `http://127.0.0.1:4173/my-digital-moodboard/`.
- The measurement server compresses HTML, JavaScript, CSS, JSON, and SVG with gzip. Raster image bytes are served unchanged. Responses use `Cache-Control: no-store` to maintain a cold-load comparison.
- The existing Google Fonts stylesheet and fonts load normally; no font substitution or request blocking was used.

This is a controlled local lab baseline. GitHub Pages CDN latency, HTTP/2 behavior, warm caches, and visitors' devices can produce different results. Compare changes using this same harness, tool/browser versions, mobile profile, and host. Check the deployed site separately after publishing. [Lighthouse throttling methodology](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)

The subsequent [deployed-site audit](deployed-mobile-baseline.md) measures the actual GitHub Pages endpoint and records the differences between the live build and this local build.

## Image inventory

| Source asset               | Native dimensions | File size | Requested during startup? |
| -------------------------- | ----------------- | --------- | ------------------------- |
| uw-cherry-blossoms.jpg     | 768 × 1024        | 550.1 KB  | No; Experience view       |
| about-sophie.jpg           | 768 × 1024        | 382.9 KB  | Yes                       |
| dubhacks-swag.jpg          | 768 × 1024        | 381.6 KB  | Yes                       |
| olmo-snow-symposium.jpg    | 768 × 1024        | 339.4 KB  | Yes                       |
| huskybids-poster.jpg       | 1280 × 1920       | 216.0 KB  | Yes                       |
| study-ducky-v2.png         | 334 × 488         | 177.4 KB  | Yes                       |
| editorial-http-server.jpg  | 1024 × 1408       | 150.4 KB  | Yes                       |
| editorial-i2-ta.jpg        | 1024 × 1536       | 131.4 KB  | Yes                       |
| editorial-kv-store.jpg     | 1024 × 1536       | 110.7 KB  | Yes                       |
| vla-robot-arm.jpg          | 605 × 1077        | 107.0 KB  | Yes                       |
| huskybids-presentation.jpg | 1920 × 1280       | 98.1 KB   | Yes                       |

These eleven bundled assets total **2.645 MB**. The 550.1 KB campus image is the largest file, but it contributes to a later folder view. Start with images requested on the homepage. Three other source images are currently unused and absent from the production asset bundle.

At this viewport, primary pin images render about **194 CSS pixels wide**, while their source widths range from 334 to 1920 pixels. Device pixel ratio must be accounted for when choosing replacements: at DPR 1.75 a 194-pixel slot needs roughly 340 image pixels for sharp output.

## Findings that affect the plan

1. **The LCP element is the introductory paragraph**, beginning “A small, ongoing collection…”, in all three runs. Image compression will reduce transfer and image-delivery cost, but the current Lighthouse format/resize opportunities model zero direct LCP savings. Verify actual LCP changes rather than attributing a score increase to compression in advance.
2. **The largest layout shift is on a board column.** In the representative run, it contributes 0.3286 of the total 0.3303 CLS. The route initializes five columns and changes to two after hydration on this viewport. That transition is a likely cause; confirm it while implementing a layout fix. Smaller font-related shifts also appear.
3. **The hidden poster downloads during startup.** Its transfer is 216.2 KB, about 10.3% of the initial image transfer. Conditional rendering can defer this request until someone opens the card.
4. **The three largest homepage photos transfer about 1.10 MB together.** About Sophie, DubHacks swag, and Olmo Snow account for approximately 52.7% of initial image transfer.
5. **Google Fonts is in the render-blocking chain.** The report identifies its stylesheet alongside the app stylesheet. Because LCP is text, font delivery deserves a separate measured follow-up.

Lighthouse's image-delivery insight estimates roughly 2.03 MB of potential savings. This is a heuristic, not an encoded result or a quality-preserving guarantee. Format and resizing estimates overlap and must not be added together.

## Saved evidence and reproduction

The tracked [baseline JSON](mobile-baseline.json) contains individual results, settings, asset hashes, image inventory, and diagnostic observations. Full HTML/JSON reports and the measurement harness are available locally in `artifacts/performance/mobile-baseline/`, which is ignored by Git.

- [Run 1 report](../../artifacts/performance/mobile-baseline/run-1.report.html)
- [Run 2 report](../../artifacts/performance/mobile-baseline/run-2.report.html)
- [Run 3 report](../../artifacts/performance/mobile-baseline/run-3.report.html), representing the median LCP; this individual run scores 75, while the median score is 76.
- [Measurement harness](../../artifacts/performance/mobile-baseline/measurement-harness.mjs)

To reproduce on this workstation, rebuild with `npm run build:pages`, ensure port 4173 is free, and run:

```sh
node artifacts/performance/mobile-baseline/measurement-harness.mjs artifacts/performance/mobile-comparison
```

The saved harness uses the temporary Lighthouse installation and Chrome paths from this audit. For another workstation, install the same versions and update those paths. Save comparisons to a new directory to retain this baseline. See the [image optimization plan](image-optimization-plan.md) for implementation and acceptance criteria.
