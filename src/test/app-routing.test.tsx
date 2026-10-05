import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { routeTree } from "@/routeTree.gen";

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
