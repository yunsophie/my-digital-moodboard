import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const options = [
  {
    id: "v1" as const,
    label: "Frosted Editorial",
    src: "/protos/v1.html",
    blurb: "Soft glass cards over a cool gradient — modern, airy, product-designer energy.",
  },
  {
    id: "v2" as const,
    label: "Editorial Serif Board",
    src: "/protos/v2.html",
    blurb: "Warm paper, big serif headlines, a timeline path and a moodboard board section.",
  },
  {
    id: "v3" as const,
    label: "Curated Gallery",
    src: "/protos/v3.html",
    blurb: "Museum-placard grid, numbered index nav, mono captions — quiet and precise.",
  },
];

function Index() {
  const [active, setActive] = useState<"v1" | "v2" | "v3">("v2");
  const current = options.find((o) => o.id === active)!;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="sticky top-0 z-10 border-b border-stone-300 bg-stone-100/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
            Design directions · pick one to build
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {options.map((o) => (
              <button
                key={o.id}
                onClick={() => setActive(o.id)}
                className={
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                  (active === o.id
                    ? "bg-stone-900 text-white"
                    : "border border-stone-300 text-stone-600 hover:text-stone-900")
                }
              >
                {o.label}
              </button>
            ))}
            <span className="ml-auto hidden text-sm text-stone-500 md:block">
              {current.blurb}
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <iframe
          key={current.id}
          src={current.src}
          title={current.label}
          className="h-[1800px] w-full rounded-xl border border-stone-300 bg-white shadow-sm"
        />
      </main>
    </div>
  );
}
