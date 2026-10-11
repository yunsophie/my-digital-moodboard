# Pin test audit

Audited on 2026-10-10. This is a record of a manual fault-injection audit, not an exhaustive proof or an additional CI job.

The tests were challenged with individual faults in a temporary copy of the project. Content faults changed source files; browser faults changed the copied static build. Each run had to fail at the assertion relevant to the injected fault, rather than fail because the test runner could not start.

| Deliberately introduced fault                         | Observed failure                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------------------ |
| Whitespace-only description                           | Content test rejected the blank description.                                   |
| Duplicate pin title                                   | Content test rejected duplicate titles/identifiers.                            |
| Incorrect rendered description                        | Rendering test rejected the text mismatch.                                     |
| Incorrect text appended to the correct description    | Exact description assertion rejected the extra text.                           |
| Pin rendered with a different image source            | Rendering test rejected the image association.                                 |
| Image removed from the static build                   | Browser image-loading assertion failed.                                        |
| CSS rotation disabled while click state still changed | Browser rotation assertion expected the back face and received the front face. |
| Grid columns forced to overlap                        | Browser geometry assertion reported overlapping pins.                          |
| Uncaught JavaScript error during page startup         | Browser runtime-error assertion reported the injected error.                   |

All nine faults were detected. Temporary mutations were restored, and the working project's source and built files were not used for fault injection.

## Weak assertions found during review

The earlier description assertion checked whether the correct text was contained in the rendered description. With incorrect extra text appended, all four routing/rendering tests still passed. Repeating the same fault with an exact-match assertion produced one expected failure. The permanent test now checks the complete description.

The browser error listener originally started after navigation and only applied to one test. The tests now inspect stored page errors after every browser test, including startup errors. Expected folder counts also default to zero for valid empty folders, and the empty-state message is checked.

## Verification after the audit

- 14 content/routing/rendering tests passed.
- 9 browser tests passed across Chromium phone, tablet, and desktop viewports.
- TypeScript and lint passed; lint retains existing warnings.

Run `npm run test` for content/rendering checks. Run `npm run build:pages` followed by `npm run test:e2e` for checks against the static site. Use `npm run test:e2e:report` to inspect the browser report; failed runs also save screenshots and traces.

## What these results establish

The tested faults exercise the requirements for pin content, configured images, flipping, and layout. New collection entries are included automatically. This audit provides evidence that the selected assertions can detect these faults; it is not a mutation score for the entire application.

The current browser suite covers Chromium at three viewport sizes. It does not cover every browser, physical touch device, or viewport width. Image subject matter, cropping, portfolio accuracy, and design quality still require human review. When a bug escapes the suite, add a test that reproduces it before fixing it.
