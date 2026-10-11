/** Checks every portfolio entry for complete content and usable image metadata. */
import { describe, expect, it } from "vitest";

import { boardItems } from "@/data/board-items";

describe("Portfolio pin content", () => {
  it("has entries with unique titles and unique DOM identifiers", () => {
    expect(boardItems.length).toBeGreaterThan(0);
    const titles = boardItems.map((item) => item.title.trim());
    const ids = titles.map((title) => title.replace(/[^a-zA-Z0-9]/g, "-"));
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(boardItems)("$title has complete content and image metadata", (item) => {
    for (const field of ["title", "description", "category", "year", "alt"] as const) {
      expect(item[field].trim(), `${item.title}: ${field} must not be blank`).not.toBe("");
    }
    expect(["Projects", "Experience", "About"]).toContain(item.folder);
    expect(item.tools.length).toBeGreaterThan(0);
    expect(item.tools.every((tool) => tool.trim().length > 0)).toBe(true);
    expect(new Set(item.tools).size).toBe(item.tools.length);

    const images = [
      { ...item.image, alt: item.alt },
      ...(item.extraImage ? [{ ...item.extraImage.image, alt: item.extraImage.alt }] : []),
    ];
    for (const image of images) {
      expect(image.src.trim()).not.toBe("");
      expect(image.alt.trim()).not.toBe("");
      expect(Number.isInteger(image.width) && image.width > 0).toBe(true);
      expect(Number.isInteger(image.height) && image.height > 0).toBe(true);
      expect(image.candidates.length).toBeGreaterThan(0);
      expect(image.candidates.every((candidate) => candidate.width <= image.width)).toBe(true);
    }
  });
});
