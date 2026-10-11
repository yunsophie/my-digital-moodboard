import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { boardItems } from "@/data/board-items";

async function renderAt(path: string, basepath = "/") {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    basepath,
    context: { queryClient },
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await router.load();
  // The root shell renders <html>, so React 19 must mount it into the document.
  return render(<RouterProvider router={router} />, { container: document });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("App routing", () => {
  it("renders the index route", async () => {
    const { findByRole } = await renderAt("/");

    expect(await findByRole("main")).toBeInTheDocument();
  });

  it("renders every pin with its associated image, title, and description", async () => {
    const { findByRole } = await renderAt("/");
    const board = within(await findByRole("main"));
    expect(board.getAllByRole("button", { name: /^Flip to see details about / })).toHaveLength(
      boardItems.length,
    );
    for (const item of boardItems) {
      const front = board.getByRole("button", {
        name: `Flip to see details about ${item.title}`,
      });
      expect(within(front).getByRole("img", { name: item.alt })).toHaveAttribute(
        "src",
        item.image.src,
      );
      fireEvent.click(front);
      const details = board.getByRole("region", {
        name: `Details about ${item.title}`,
      });
      expect(within(details).getByText(item.title, { exact: true })).toBeInTheDocument();
      expect(within(details).getByTestId("pin-description").textContent?.trim()).toBe(
        item.description.trim(),
      );
      fireEvent.click(within(details).getByText(item.title, { exact: true }));
      expect(front).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("renders the not-found route", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);

    const { findByRole } = await renderAt("/this-route-does-not-exist");

    expect(await findByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });

  it("keeps the home link under the GitHub Pages base path", async () => {
    const { findByRole } = await renderAt("/my-digital-moodboard/", "/my-digital-moodboard");

    expect(await findByRole("main")).toBeInTheDocument();
    expect(await findByRole("link", { name: "Sophie Li home" })).toHaveAttribute(
      "href",
      "/my-digital-moodboard/",
    );
  });
});
