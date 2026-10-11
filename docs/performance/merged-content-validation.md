# Validation after syncing portfolio content

The merge joins the responsive-image implementation in `c90e12d` with the thirteen published commits through `5e31100`, preserving both histories. It retains the updated 333gle Search Engine and Study Ducky descriptions, the Visual Discovery card, the shortened introduction, card-back link cleanup, source comments, and Lovable build configuration **2.25.3**.

Portfolio content remains in `src/data/board-items.ts`. The new Visual Discovery image is registered and generated through the same pipeline: **ten cards, twelve image families, and 57 WebP candidates**. The architecture guide now points to the typed collection and generation workflow rather than the former inline array.

Adding the tenth card changes CSS column balancing. The teaching-assistant image becomes the mobile LCP element in all three checks, while the nine-card audit identified VLA. The grid now supplies early priority to the measured teaching-assistant family; `FlipImage` makes a priority image eager. Priority is chosen by the caller so the Experience timeline does not inherit a gallery-specific boost.

| Local three-run median | Before priority correction | After correction |
| ---------------------- | -------------------------: | ---------------: |
| Performance score      |                         90 |               95 |
| FCP                    |                     1.81 s |           1.95 s |
| LCP                    |                     3.46 s |           2.78 s |
| CLS                    |                    0.00054 |          0.00054 |
| Startup image transfer |                   0.288 MB |         0.288 MB |

All runs use the original mobile Lighthouse settings and complete without failed requests or warnings. The final LCP range is **2.74–2.78 s**. The poster is absent until opened, and image transfer remains below the existing **1,467,894-byte** CI budget. These ten-card local results are separate from the [historical nine-card results](image-optimization-results.md) and the earlier deployed baseline. This comparison isolates the priority correction on the merged content; it does not establish deployed performance.

Frozen-lockfile installation, TypeScript, generated-image verification, lint, and **15 content/routing tests** pass. Lint retains seven existing warnings. The **18 browser checks** validate all ten cards, source selection, poster deferral and reuse, search, folder views, and layout before JavaScript at breakpoint boundaries.

The [measurement JSON](merged-content-validation.json) preserves the individual runs, settings, LCP nodes, lazy-loading diagnostics, and build hashes. Full reports are retained locally under ignored `artifacts/performance/merged-ten-pin-checkpoint/` and `artifacts/performance/merged-ten-pin-priority/` directories.
