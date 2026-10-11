import { expect, test, type Locator } from "@playwright/test";
import sharp from "sharp";

import manifest from "../src/assets/optimized/manifest.json" with { type: "json" };

type ImageFamily = (typeof manifest.images)["aboutSophie"];
const imageFamilies: Record<string, ImageFamily> = manifest.images;

async function expectImageLoaded(image: Locator) {
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute("alt", /\S/);
  await expect
    .poll(() =>
      image.evaluate((element: HTMLImageElement) => {
        return element.complete && element.naturalWidth > 0 && element.naturalHeight > 0;
      }),
    )
    .toBe(true);
  const dimensions = await image.evaluate((element: HTMLImageElement) => ({
    declared: [Number(element.getAttribute("width")), Number(element.getAttribute("height"))],
    actual: [element.naturalWidth, element.naturalHeight],
    currentSrc: element.currentSrc,
    id: element.dataset["imageId"]!,
    slotWidth: element.getBoundingClientRect().width,
    dpr: window.devicePixelRatio,
  }));
  const family = imageFamilies[dimensions.id]!;
  expect(family, "The image must belong to a generated asset family").toBeDefined();
  expect(dimensions.declared).toEqual([family.width, family.height]);
  const file = new URL(dimensions.currentSrc).pathname.split("/").at(-1)!;
  const candidate = family.variants.find((variant) =>
    file.startsWith(`${variant.file.replace(/\.webp$/, "")}-`),
  );
  expect(candidate, "currentSrc must belong to this pin's asset family").toBeDefined();
  const requiredWidth = Math.min(
    dimensions.slotWidth * dimensions.dpr,
    family.variants.at(-1)!.width,
  );
  const nextWidth =
    family.variants.find((variant) => variant.width >= requiredWidth)?.width ??
    family.variants.at(-1)!.width;
  // Allow normal browser rounding/cache selection, but catch a wrong sizes
  // value that downloads a full-width photo for a much smaller slot.
  expect(candidate!.width).toBeGreaterThanOrEqual(requiredWidth * 0.9);
  expect(candidate!.width).toBeLessThanOrEqual(nextWidth * 1.3);
  // naturalWidth is density-corrected for w descriptors. Decode the fetched
  // file separately instead of assuming it equals the declared logical width.
  const response = await image.page().request.get(dimensions.currentSrc);
  expect(response.ok()).toBe(true);
  const decoded = await sharp(await response.body()).metadata();
  expect([decoded.width, decoded.height]).toEqual([candidate!.width, candidate!.height]);
  expect(
    Math.abs(dimensions.actual[0]! / dimensions.actual[1]! - family.width / family.height),
  ).toBeLessThan(0.02);
}

async function expectRotation(pin: Locator, facing: "front" | "back") {
  // aria-expanded alone cannot prove the visual flip works. Check the actual
  // computed CSS rotation after the animation has finished as well.
  await expect
    .poll(() =>
      pin.getByTestId("pin-flipper").evaluate((element) => {
        return new DOMMatrixReadOnly(getComputedStyle(element).transform).m11;
      }),
    )
    .toBeCloseTo(facing === "back" ? -1 : 1, 3);
}

test.beforeEach(async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "sophie's portfolio" })).toBeVisible();
});

test.afterEach(async ({ page }) => {
  // Include errors during navigation/hydration, before the test body starts.
  expect((await page.pageErrors()).map((error) => error.message)).toEqual([]);
});

test("every pin loads its image and flips to complete details and back", async ({ page }) => {
  const pins = page.getByTestId("portfolio-pin");
  const summary = await page.getByText(/^\d+ Pins$/).innerText();
  await expect(pins).toHaveCount(Number.parseInt(summary, 10));

  for (const pin of await pins.all()) {
    const front = pin.locator("button").first();
    const title = (await front.getAttribute("aria-label"))!.replace(
      "Flip to see details about ",
      "",
    );
    expect(title.trim()).not.toBe("");
    await expectImageLoaded(front.locator("img"));
    const initialBounds = await pin.boundingBox();
    await expect(pin.getByRole("region")).toHaveCount(0);
    await front.click();
    await expect(front).toHaveAttribute("aria-expanded", "true");
    await expectRotation(pin, "back");
    const details = pin.getByRole("region", { name: `Details about ${title}`, exact: true });
    await expect(details).toBeVisible();
    await expect(details.getByText(title, { exact: true })).toBeVisible();
    await expect(details.getByTestId("pin-description")).toHaveText(/\S/);
    await details.getByTestId("pin-description").scrollIntoViewIfNeeded();
    await expect(details.getByTestId("pin-description")).toBeVisible();
    expect(
      await details.evaluate((element) => element.scrollWidth - element.clientWidth),
      `${title}: details must fit without horizontal scrolling`,
    ).toBeLessThanOrEqual(1);
    for (const image of await details.locator("img").all()) {
      await expectImageLoaded(image);
    }
    const flippedBounds = await pin.boundingBox();
    expect(flippedBounds!.width).toBeCloseTo(initialBounds!.width, 1);
    expect(flippedBounds!.height).toBeCloseTo(initialBounds!.height, 1);
    // Click the back, just as a visitor would, rather than dispatching an event.
    await details.getByText(title, { exact: true }).click();
    await expectRotation(pin, "front");
    await expect(front).toHaveAttribute("aria-expanded", "false");
  }
});

test("all pins fit the responsive grid without overlap or horizontal overflow", async ({
  page,
}) => {
  const width = page.viewportSize()!.width;
  const grid = page.getByTestId("board-grid");
  expect(await grid.evaluate((element) => Number(getComputedStyle(element).columnCount))).toBe(
    width >= 1024 ? 5 : width >= 768 ? 3 : 2,
  );
  for (const image of await grid.locator("button img").all()) {
    await expectImageLoaded(image);
  }
  const gridBounds = (await grid.boundingBox())!;
  const boxes = [];
  for (const pin of await grid.getByTestId("portfolio-pin").all()) {
    const bounds = (await pin.boundingBox())!;
    expect(bounds.width).toBeGreaterThan(0);
    expect(bounds.height).toBeGreaterThan(0);
    expect(bounds.x).toBeGreaterThanOrEqual(gridBounds.x - 1);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(gridBounds.x + gridBounds.width + 1);
    boxes.push(bounds);
  }
  for (let first = 0; first < boxes.length; first++) {
    for (let second = first + 1; second < boxes.length; second++) {
      const a = boxes[first]!;
      const b = boxes[second]!;
      const overlaps =
        a.x < b.x + b.width - 1 &&
        b.x < a.x + a.width - 1 &&
        a.y < b.y + b.height - 1 &&
        b.y < a.y + a.height - 1;
      expect(overlaps, `Pins ${first + 1} and ${second + 1} must not overlap`).toBe(false);
    }
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    width,
  );
});

test("folder views include every matching pin and support keyboard flipping", async ({ page }) => {
  const expectedCounts = await page.getByTestId("portfolio-pin").evaluateAll((pins) => {
    const counts: Record<string, number> = {};
    for (const pin of pins) {
      const folder = pin.getAttribute("data-folder")!;
      counts[folder] = (counts[folder] ?? 0) + 1;
    }
    return counts;
  });
  for (const folder of ["Projects", "Experience", "About"]) {
    await page
      .getByRole("navigation", { name: "Portfolio folders" })
      .getByRole("button", { name: folder, exact: true })
      .click();
    const pins = page.getByTestId("portfolio-pin");
    const expectedCount = expectedCounts[folder] ?? 0;
    await expect(pins).toHaveCount(expectedCount);
    if (expectedCount === 0) {
      await expect(page.getByText("Nothing in this folder yet.")).toBeVisible();
    }
    for (const pin of await pins.all()) {
      await expect(pin).toHaveAttribute("data-folder", folder);
      const front = pin.locator("button").first();
      await front.focus();
      await front.press("Enter");
      await expectRotation(pin, "back");
      await expect(pin.getByRole("region").getByTestId("pin-description")).toHaveText(/\S/);
      await page.keyboard.press("Escape");
      await expectRotation(pin, "front");
      await expect(front).toHaveAttribute("aria-expanded", "false");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      page.viewportSize()!.width,
    );
  }
});

test("closed posters stay deferred and search thumbnails use small candidates", async ({
  page,
}) => {
  const posterRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("huskybids-poster-")) posterRequests.push(request.url());
  });
  // Resource timing also covers requests from before the listener was attached.
  await page.waitForLoadState("networkidle");
  expect(
    await page.evaluate(
      () =>
        performance
          .getEntriesByType("resource")
          .filter((entry) => entry.name.includes("huskybids-poster-")).length,
    ),
  ).toBe(0);
  const posterPin = page.getByTestId("portfolio-pin").filter({
    // The front becomes aria-hidden when flipped. Include it in this locator
    // so the pin remains addressable while its poster is being inspected.
    has: page.getByRole("button", {
      name: "Flip to see details about huskybids !",
      exact: true,
      includeHidden: true,
    }),
  });
  await posterPin.locator("button").first().click();
  const poster = posterPin.getByRole("img", { name: "The HuskyBids team presentation poster" });
  await expectImageLoaded(poster);
  expect(posterRequests).toHaveLength(1);
  await page.keyboard.press("Escape");
  await posterPin.locator("button").first().click();
  await expectImageLoaded(poster);
  expect(posterRequests, "Reopening should reuse the mounted poster").toHaveLength(1);
  await page.keyboard.press("Escape");

  await page.getByRole("combobox", { name: "Search portfolio" }).fill("study ducky");
  const option = page.getByRole("option").filter({ hasText: "study ducky !" });
  const thumbnail = option.locator("img");
  await expect
    .poll(() => thumbnail.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
    .toBe(true);
  const thumbnailUrl = await thumbnail.evaluate((img: HTMLImageElement) => img.currentSrc);
  expect(thumbnailUrl).toMatch(/study-ducky-v2-160w-/);
  await expect(thumbnail).toHaveAttribute("sizes", "40px");
  await option.click();
  const selected = page.getByRole("region", { name: "Details about study ducky !", exact: true });
  await expect(selected).toBeVisible();
});

test.describe("Cold mobile image budget", () => {
  test.use({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75 });

  test("startup images stay below the measured 30% reduction budget", async ({ page }) => {
    // No scrolling or card interaction: this is a navigation transfer budget,
    // not the sum of all responsive files emitted by the build.
    await page.waitForLoadState("networkidle");
    const resources = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .filter((entry) => /\/assets\/.*\.webp(?:$|\?)/.test(entry.name))
        .map((entry) => ({
          name: entry.name,
          bytes: (entry as PerformanceResourceTiming).transferSize,
        })),
    );
    expect(resources.length).toBeGreaterThan(0);
    expect(resources.every((entry) => entry.bytes > 0)).toBe(true);
    expect(resources.some((entry) => entry.name.includes("huskybids-poster-"))).toBe(false);
    const bytes = resources.reduce((sum, entry) => sum + entry.bytes, 0);
    expect(bytes, "Cold navigation image bytes must fall by at least 30%").toBeLessThanOrEqual(
      1_467_894,
    );
  });
});

test("masonry is responsive before JavaScript and at breakpoint boundaries", async ({
  browser,
  page,
  baseURL,
}) => {
  // Read the prerendered document without hydration. A responsive-only effect
  // could pass ordinary browser checks while still causing a first-paint jump.
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: page.viewportSize()!,
    deviceScaleFactor: 3,
  });
  try {
    const staticPage = await context.newPage();
    await staticPage.goto(baseURL!);
    const grid = staticPage.getByTestId("board-grid");
    const summary = await staticPage.getByText(/^\d+ Pins$/).innerText();
    await expect(grid.getByTestId("portfolio-pin")).toHaveCount(Number.parseInt(summary, 10));
    for (const width of [375, 639, 640, 767, 768, 1023, 1024, 1440]) {
      await staticPage.setViewportSize({ width, height: 900 });
      const geometry = await grid.evaluate((element) => {
        const style = getComputedStyle(element);
        const columns = Number(style.columnCount);
        const gap = Number.parseFloat(style.columnGap);
        const width = element.getBoundingClientRect().width;
        const image = element.querySelector("button img")!;
        return {
          columns,
          expectedSlot: (width - gap * (columns - 1)) / columns,
          actualSlot: image.getBoundingClientRect().width,
          scrollWidth: document.documentElement.scrollWidth,
        };
      });
      expect(geometry.columns).toBe(width >= 1024 ? 5 : width >= 768 ? 3 : 2);
      expect(Math.abs(geometry.actualSlot - geometry.expectedSlot)).toBeLessThan(1);
      expect(geometry.scrollWidth).toBeLessThanOrEqual(width);
    }
  } finally {
    await context.close();
  }
});
