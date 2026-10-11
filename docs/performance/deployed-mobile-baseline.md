# Deployed mobile performance baseline

Measured on October 10, 2026, against the actual [GitHub Pages site](https://yunsophie.github.io/my-digital-moodboard/) before implementing the image optimization plan. Three mobile Lighthouse audits completed with no failed network requests or Lighthouse warnings. The deployed document hash and ETag were unchanged before and after the runs.

## Results

| Metric                   | Run 1    | Run 2    | Run 3    | Median       |
| ------------------------ | -------- | -------- | -------- | ------------ |
| Lighthouse performance   | 67       | 72       | 72       | **72 / 100** |
| First Contentful Paint   | 2.92 s   | 2.16 s   | 2.17 s   | **2.17 s**   |
| Largest Contentful Paint | 12.80 s  | 9.10 s   | 8.96 s   | **9.10 s**   |
| Speed Index              | 2.93 s   | 2.16 s   | 2.17 s   | **2.17 s**   |
| Total Blocking Time      | 0 ms     | 0 ms     | 0 ms     | **0 ms**     |
| Cumulative Layout Shift  | 0.098    | 0.082    | 0.082    | **0.082**    |
| Startup image transfer   | 2.241 MB | 2.241 MB | 2.241 MB | **2.241 MB** |
| Total startup transfer   | 2.459 MB | 2.459 MB | 2.459 MB | **2.459 MB** |
| Startup image requests   | 11       | 11       | 11       | **11**       |

The LCP range is **8.96–12.80 seconds**, so retain individual results as well as the median. MB uses decimal units; transfer includes response overhead. Medians are calculated independently for each metric.

## Matching audit conditions

The deployed audit uses the same workstation, Lighthouse **12.8.2**, Chrome for Testing **156**, Node.js **22.13.0**, and mobile settings as the local baseline:

- 412 × 823 CSS pixels and DPR 1.75.
- Simulated slow 4G: 150 ms RTT, 1,638.4 Kbps throughput, and 4× CPU slowdown.
- Three sequential runs with fresh Chrome profiles and browser storage reset.
- No scrolling, searching, folder selection, or card flipping.
- The real HTTPS endpoint, hosting responses, fonts, and cache policy are used directly. No local preview server or request substitutions are involved.

These are lab measurements of the live deployment, not real-user field data or INP measurements. Fresh browser profiles do not imply an empty GitHub CDN cache. [Lighthouse throttling methodology](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)

## Comparison with the local production build

| Metric                   | Local build median | Deployed-site median |
| ------------------------ | ------------------ | -------------------- |
| Performance score        | 76                 | 72                   |
| First Contentful Paint   | 1.95 s             | 2.17 s               |
| Largest Contentful Paint | 3.23 s             | 9.10 s               |
| Cumulative Layout Shift  | 0.330              | 0.082                |
| Startup image transfer   | 2.097 MB           | 2.241 MB             |
| Total startup transfer   | 2.313 MB           | 2.459 MB             |
| Startup image requests   | 10                 | 11                   |

**The deployments contain different application builds.** The live page has 10 pins; the current workspace has 9. The live page includes a Visual Discovery pin using `pink-hardware-grid`, and its JavaScript/CSS filenames differ:

| Resource         | Local               | Deployed            |
| ---------------- | ------------------- | ------------------- |
| Main JavaScript  | index-CursdNWv.js   | index-JH6YkW96.js   |
| Route JavaScript | routes-QUVS361f.js  | routes-Lo7LTReA.js  |
| Stylesheet       | styles-DUixIk_b.css | styles-DWMCgLDB.css |

The deployed document was last modified on October 10 at **1:20:13 p.m. Pacific time**. These differences prevent attributing the entire performance gap to hosting. Retain this result as the baseline for the current live build; measure a matching unoptimized deployment before claiming improvement from later changes to the current workspace.

## Hosting observations

- The document responds with HTTP 200, and the document and image audit requests use **HTTP/2**.
- The deployed HTML uses **gzip** and advertises `Cache-Control: max-age=600`.
- The observed Lighthouse document/server-response diagnostic has an 8.6 ms median. This diagnostic is captured during the unthrottled gathering pass; it is distinct from simulated slow-4G TTFB. The representative report models approximately 613 ms TTFB within its LCP breakdown.
- No HTTP errors or missing assets were observed in the three runs.

These observations do not point to a failing origin response. The main loading issue in this audit is when visible images become the largest painted content, under the simulated mobile conditions.

## Findings that change prioritization

1. **The deployed LCP is image-based.** The key-value-store image is the LCP element in run 1. The Olmo Snow image is the LCP element in runs 2 and 3. This differs from the introductory text identified in all local-build runs.
2. **The key-value-store image uses `loading="lazy"` despite being in the first visible row.** Lighthouse flags the LCP lazy-loading condition in run 1. Prioritization should cover the actual visible LCP candidates, then be remeasured on the chosen target build. [LCP image loading guidance](https://web.dev/articles/optimize-lcp)
3. **Image transfer is 91.1% of startup data.** The audit loads the ten primary live pins and the HuskyBids poster on the back of a closed card. The additional `pink-hardware-grid` image is approximately 143 KB of transfer and explains most of the image-data difference from the local build.
4. **The median-LCP run has a long image discovery delay.** Its modeled breakdown is approximately 0.61 s TTFB, 4.46 s resource load delay, 1.67 s download time, and 2.35 s render delay. Review eager/lazy priorities, responsive image sizes, and startup request competition together; compressing bytes addresses only part of this chain.
5. **Layout shift is lower on the deployed build.** Its median 0.082 is below the usual 0.1 lab target. The local build's 0.330 still needs attention before replacing the live version; preserve this distinction when evaluating changes.

Lighthouse estimates material LCP savings from modern image formats and responsive resizing on this live build. Those opportunity estimates overlap and are not promised implementation results.

## Effect on the plan

The existing image plan remains grounded in the 9-pin local build. For this unchanged 10-pin live build, a 30% startup-image reduction would mean **2.241 MB → at most 1.569 MB** (1,568,812 bytes). Keep that budget separate from the local build's **1.468 MB** goal.

Before implementation, decide which application build will be evaluated. Prioritize its measured LCP candidates, defer the hidden poster, resize/compress the active assets, and compare before/after using matching content and deployment conditions. This audit did not change images, application code, or the deployment.

## Saved evidence

The tracked [deployed baseline JSON](deployed-mobile-baseline.json) contains the metrics, settings, per-run LCP candidates, request data, and deployed-version snapshots. Full reports and HTML snapshots are available locally in the ignored `artifacts/performance/deployed-mobile-baseline/` directory:

- [Run 1 report](../../artifacts/performance/deployed-mobile-baseline/run-1.report.html)
- [Run 2 report](../../artifacts/performance/deployed-mobile-baseline/run-2.report.html), representing the median LCP and score.
- [Run 3 report](../../artifacts/performance/deployed-mobile-baseline/run-3.report.html)
- [Measurement harness](../../artifacts/performance/deployed-mobile-baseline/measurement-harness.mjs)

To repeat on this workstation, retain the same tool/browser paths and settings, then run:

```sh
node artifacts/performance/deployed-mobile-baseline/measurement-harness.mjs artifacts/performance/deployed-mobile-comparison
```

Save subsequent runs in a new directory. Check the deployed version remains stable throughout each audit series.
