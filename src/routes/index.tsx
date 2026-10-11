import { flushSync } from "react-dom";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Github,
  Globe,
  Linkedin,
  Mail,
  MoreHorizontal,
  RotateCcw,
  Search,
  Upload,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ResponsiveImage } from "@/components/ResponsiveImage";
import { Button } from "@/components/ui/button";
import { boardItems, type BoardItem } from "@/data/board-items";
import { imageAssets } from "@/data/image-assets.generated";
import {
  GRID_IMAGE_SIZES,
  GRID_POSTER_SIZES,
  TIMELINE_IMAGE_SIZES,
  TIMELINE_POSTER_SIZES,
} from "@/lib/responsive-image";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sophie Li — Computer Science Portfolio" },
      {
        name: "description",
        content:
          "An image-led collection of Sophie Li's software projects, experiments, and experience.",
      },
      { property: "og:title", content: "Sophie Li — Computer Science Portfolio" },
      {
        property: "og:description",
        content: "An image-led collection of software projects, experiments, and experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const folders = ["All", "About", "Experience", "Projects"] as const;

const coursework = [
  "AI-Assisted Software Development",
  "Distributed Systems",
  "Systems Programming",
  "Machine Learning",
  "Artificial Intelligence",
  "Data Structures",
  "Algorithms",
];

function EducationPanel() {
  return (
    <div className="min-w-0">
      <div className="max-w-[320px] overflow-hidden rounded-xl">
        <ResponsiveImage
          image={imageAssets.uwCherry}
          sizes={TIMELINE_IMAGE_SIZES}
          alt="Cherry blossoms in front of a UW campus building"
          loading="lazy"
          decoding="async"
          className="block aspect-auto w-full object-cover"
        />
      </div>
      <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        Seattle, WA · Paul G. Allen School
      </p>
      <h2 className="mt-3 font-serif text-2xl sm:text-3xl">university of washington</h2>
      <p className="mt-2 font-serif text-lg leading-relaxed text-foreground/70">
        Currently getting my B.A. in Computer Science, expected in June 2028 !
      </p>
      <p className="mt-4 font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        Relevant coursework
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {coursework.map((course) => (
          <li
            key={course}
            className="rounded-full bg-muted px-3 py-1 font-sans text-[10px] uppercase tracking-wide text-muted-foreground"
          >
            {course}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlipImage({
  item,
  imageRatio,
  crop,
  eager,
  sizes = GRID_IMAGE_SIZES,
  posterSizes = GRID_POSTER_SIZES,
  showTapBadge = false,
  openKey = null,
  onOpenChange,
  onImageInteraction,
}: {
  item: BoardItem;
  imageRatio: string;
  crop?: string | undefined;
  eager?: boolean | undefined;
  sizes?: string;
  posterSizes?: string;
  showTapBadge?: boolean | undefined;
  openKey?: string | null;
  onOpenChange: (key: string | null) => void;
  onImageInteraction: () => void;
}) {
  const [localFlipped, setLocalFlipped] = useState(false);
  const flipped = openKey === item.title || localFlipped;
  const [hasOpened, setHasOpened] = useState(false);

  // Backface hiding does not prevent an image request. Mount the poster only
  // after opening, then retain it so subsequent flips reuse the loaded image.
  useEffect(() => {
    if (flipped) setHasOpened(true);
  }, [flipped]);
  const clearExternalOpen = useCallback(() => {
    if (openKey === item.title) onOpenChange(null);
  }, [openKey, item.title, onOpenChange]);

  useEffect(() => {
    if (!flipped) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLocalFlipped(false);
        clearExternalOpen();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [flipped, clearExternalOpen]);

  return (
    <span
      id={`pin-${item.title.replace(/[^a-zA-Z0-9]/g, "-")}`}
      data-testid="portfolio-pin"
      data-folder={item.folder}
      className="group relative block"
      style={{ perspective: "1400px" }}
    >
      <span
        data-testid="pin-flipper"
        className={`relative block w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        <button
          type="button"
          className={`relative block w-full overflow-hidden rounded-xl bg-muted [backface-visibility:hidden] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${imageRatio}`}
          onClick={() => {
            onImageInteraction();
            setLocalFlipped(true);
            onOpenChange(item.title);
          }}
          aria-expanded={flipped}
          aria-hidden={flipped}
          tabIndex={flipped ? -1 : 0}
          aria-label={`Flip to see details about ${item.title}`}
        >
          <ResponsiveImage
            style={{ viewTransitionName: `pin-${item.title.replace(/[^a-zA-Z0-9]/g, "-")}` }}
            image={item.image}
            sizes={sizes}
            alt={item.alt}
            loading={eager ? "eager" : "lazy"}
            // The post-layout mobile audits identify this photo as LCP in all
            // three runs. Keep high priority limited to that measured family;
            // update the choice when a future content/layout audit changes LCP.
            fetchPriority={item.image.id === imageAssets.vlaRobotArm.id ? "high" : "auto"}
            decoding="async"
            className={`block h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] ${crop ?? "object-center"}`}
          />
          <span className="absolute inset-0 rounded-xl bg-blush/0 transition-colors group-hover:bg-blush/50" />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-2 bg-gradient-to-t from-foreground/80 via-foreground/35 to-transparent px-3 pb-3 pt-12 text-background opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
            <span className="block truncate font-serif text-xl leading-tight">{item.title}</span>
            <span className="mt-1 block truncate font-sans text-[10px] uppercase tracking-[0.12em]">
              {item.year} · {item.tools.slice(0, 3).join(" · ")}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`tap-hint pointer-events-none absolute right-1.5 top-1.5 rounded-full bg-background/90 px-2 py-1 font-sans text-[9px] font-semibold uppercase leading-none tracking-wide text-foreground shadow-sm transition-opacity duration-700 lg:hidden ${showTapBadge ? "tap-hint--visible" : "opacity-0"}`}
          >
            Tap
          </span>
          <span className="absolute bottom-2 right-2 hidden size-8 translate-y-1 place-items-center rounded-full bg-background/90 opacity-0 shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100 lg:grid">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </button>
        <span
          role="region"
          aria-label={`Details about ${item.title}`}
          aria-hidden={!flipped}
          inert={!flipped}
          className={`no-scrollbar absolute inset-0 flex flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-background p-4 [overflow-wrap:anywhere] [transform:rotateY(180deg)] [backface-visibility:hidden] ${flipped ? "" : "pointer-events-none"}`}
          onClick={(event) => {
            if (!(event.target as HTMLElement).closest("a")) {
              onImageInteraction();
              setLocalFlipped(false);
              clearExternalOpen();
            }
          }}
        >
          <span>
            <span className="block font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {item.category} · {item.year}
            </span>
            <span className="mt-1.5 block font-serif text-2xl leading-tight text-foreground">
              {item.title}
            </span>
          </span>
          <span
            data-testid="pin-description"
            className="font-serif text-sm leading-relaxed text-foreground/75"
          >
            {item.description}
          </span>
          {hasOpened && item.extraImage && (
            <ResponsiveImage
              image={item.extraImage.image}
              sizes={posterSizes}
              alt={item.extraImage.alt}
              loading="eager"
              decoding="async"
              className="w-full rounded-lg bg-muted"
            />
          )}
          <span className="mt-auto flex flex-wrap gap-1.5">
            {item.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full bg-muted px-2.5 py-1 font-sans text-[10px] uppercase tracking-wide text-muted-foreground"
              >
                {tool}
              </span>
            ))}
          </span>
          <span className="flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs">
            {[item.link, item.extraLink].filter(Boolean).map((l) => (
              <a
                key={l!.url}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent-foreground"
                href={l!.url}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                <Globe className="size-3.5" aria-hidden="true" /> {l!.label}
              </a>
            ))}
            <a
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent-foreground"
              href="https://www.linkedin.com/in/yunrui-sophie-li/"
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              <Linkedin className="size-3.5" aria-hidden="true" /> LinkedIn
            </a>
            <a
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent-foreground"
              href="https://github.com/yunsophie"
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              <Github className="size-3.5" aria-hidden="true" /> GitHub
            </a>
            <a
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent-foreground"
              href="mailto:yunsophieli@gmail.com"
              onClick={(event) => event.stopPropagation()}
            >
              <Mail className="size-3.5" aria-hidden="true" /> Contact
            </a>
            <RotateCcw className="ml-auto size-3.5 text-muted-foreground/60" aria-hidden="true" />
          </span>
        </span>
      </span>
    </span>
  );
}

function Index() {
  const [activeFolder, setActiveFolder] = useState<(typeof folders)[number]>("All");
  const [query, setQuery] = useState("");
  const [showTapBadge, setShowTapBadge] = useState(false);
  const isTimeline = activeFolder === "Experience";
  const transitionRef = useRef<{ skipTransition: () => void } | null>(null);
  const tapHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navStripRef = useRef<HTMLDivElement | null>(null);
  const [navScroll, setNavScroll] = useState({ left: false, right: false });
  const [copied, setCopied] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const searchWrapRef = useRef<HTMLDivElement | null>(null);

  const copyLink = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const updateNavScroll = () => {
    const el = navStripRef.current;
    if (!el) return;
    const canLeft = el.scrollLeft > 1;
    const canRight = el.scrollWidth - el.clientWidth - el.scrollLeft > 1;
    setNavScroll((prev) => {
      if (prev.left === canLeft && prev.right === canRight) return prev;
      setTimeout(updateNavScroll, 60);
      return { left: canLeft, right: canRight };
    });
  };

  const scrollNavStrip = (direction: "left" | "right") => {
    const el = navStripRef.current;
    if (!el) return;
    el.scrollBy({
      left:
        direction === "left" ? -Math.round(el.clientWidth * 0.7) : Math.round(el.clientWidth * 0.7),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    updateNavScroll();
    window.addEventListener("resize", updateNavScroll);
    return () => window.removeEventListener("resize", updateNavScroll);
  }, []);

  const restartTapHintTimer = () => {
    setShowTapBadge(false);
    if (tapHintTimerRef.current) clearTimeout(tapHintTimerRef.current);
    tapHintTimerRef.current = setTimeout(() => setShowTapBadge(true), 30_000);
  };

  useEffect(() => {
    tapHintTimerRef.current = setTimeout(() => setShowTapBadge(true), 30_000);
    return () => {
      if (tapHintTimerRef.current) clearTimeout(tapHintTimerRef.current);
    };
  }, []);

  const changeFolder = (folder: (typeof folders)[number]) => {
    if (folder === activeFolder) return;
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { skipTransition: () => void };
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) return setActiveFolder(folder);
    transitionRef.current?.skipTransition();
    transitionRef.current = doc.startViewTransition(() => flushSync(() => setActiveFolder(folder)));
  };

  // The board itself only responds to tabs — search is a pure dropdown finder.
  const visibleItems = useMemo(() => {
    return boardItems.filter((item) => activeFolder === "All" || item.folder === activeFolder);
  }, [activeFolder]);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return boardItems
      .filter((item) => {
        const haystack =
          `${item.title} ${item.description} ${item.category} ${item.year} ${item.folder} ${item.tools.join(" ")}`.toLowerCase();
        return !normalized || haystack.includes(normalized);
      })
      .slice(0, 8);
  }, [query]);

  const recommendations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const pool = Array.from(new Set(boardItems.flatMap((item) => [...item.tools, item.category])));
    if (!normalized)
      return ["PyTorch", "Python", "Java", "C++", "AWS", "React.js"]
        .filter((t) => pool.some((p) => p.toLowerCase().includes(t.toLowerCase())))
        .concat(pool)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 6);
    return pool
      .filter(
        (term) => term.toLowerCase().includes(normalized) && term.toLowerCase() !== normalized,
      )
      .slice(0, 6);
  }, [query]);

  const selectSuggestion = (item: BoardItem) => {
    setQuery(item.title);
    setSearchFocused(false);
    setHighlightIndex(0);
    if (item.folder !== activeFolder) changeFolder(item.folder);
    window.setTimeout(() => {
      document
        .getElementById(`pin-${item.title.replace(/[^a-zA-Z0-9]/g, "-")}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      setOpenKey(item.title);
    }, 240);
  };

  useEffect(() => {
    if (!searchFocused) return;
    const onPointerDown = (event: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [searchFocused]);

  const timelineItems = useMemo(
    () => [...visibleItems].sort((a, b) => (b.sortYear ?? 0) - (a.sortYear ?? 0)),
    [visibleItems],
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl">
        <div className="flex h-[68px] items-center gap-3 px-3 sm:px-5">
          <Link
            to="/"
            className="w-10 shrink-0 font-serif text-2xl leading-none"
            aria-label="Sophie Li home"
          >
            SL<span className="text-accent-foreground">.</span>
          </Link>
          <div ref={searchWrapRef} className="relative min-w-0 flex-1">
            <label className="flex h-11 items-center gap-3 rounded-full bg-muted px-4 text-muted-foreground">
              <Search className="size-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">Search portfolio</span>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setHighlightIndex(0);
                  setSearchFocused(true);
                }}
                onFocus={() => {
                  setSearchFocused(true);
                  setHighlightIndex(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setHighlightIndex((index) =>
                      Math.min(index + 1, Math.max(suggestions.length - 1, 0)),
                    );
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setHighlightIndex((index) => Math.max(index - 1, 0));
                  } else if (event.key === "Enter") {
                    const picked = suggestions[highlightIndex];
                    if (picked) {
                      event.preventDefault();
                      selectSuggestion(picked);
                    }
                  } else if (event.key === "Escape") {
                    setSearchFocused(false);
                  }
                }}
                placeholder="Search the whole board"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                role="combobox"
                aria-expanded={
                  searchFocused &&
                  (suggestions.length > 0 || recommendations.length > 0 || query.trim() !== "")
                }
                aria-controls="search-suggestions"
                aria-autocomplete="list"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="grid size-5 shrink-0 place-items-center rounded-full bg-muted-foreground/20 text-muted-foreground transition hover:bg-muted-foreground/30 hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              )}
            </label>
            {searchFocused &&
              (suggestions.length > 0 || recommendations.length > 0 || query.trim() !== "") && (
                <div
                  id="search-suggestions"
                  role="listbox"
                  aria-label="Search suggestions"
                  className="absolute inset-x-0 top-full z-50 mt-2 max-h-[min(60vh,26rem)] overflow-y-auto rounded-2xl border border-border bg-background p-1.5 shadow-lg"
                >
                  {recommendations.length > 0 && (
                    <div className="px-2.5 pb-2 pt-1.5">
                      <p className="pb-2 font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {query.trim() ? "Related searches" : "Recommended searches"}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {recommendations.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => {
                              setQuery(term);
                              setHighlightIndex(0);
                            }}
                            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-sans text-xs font-medium text-foreground/80 transition hover:bg-blush/60"
                          >
                            <Search className="size-3" aria-hidden="true" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {suggestions.length > 0 && (
                    <p className="px-2.5 pb-1 pt-1.5 font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {query.trim() ? "Matches on this board" : "Browse the board"}
                    </p>
                  )}
                  {suggestions.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      role="option"
                      aria-selected={index === highlightIndex}
                      onClick={() => selectSuggestion(item)}
                      onMouseEnter={() => setHighlightIndex(index)}
                      className={`flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition ${index === highlightIndex ? "bg-blush/50" : ""}`}
                    >
                      <ResponsiveImage
                        image={item.image}
                        sizes="40px"
                        maxSourceWidth={160}
                        alt=""
                        className="size-10 shrink-0 rounded-lg object-cover"
                        loading="lazy"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-sans text-sm font-semibold text-foreground">
                          {item.title}
                        </span>
                        <span className="block truncate font-sans text-[11px] text-muted-foreground">
                          {item.category} · {item.year}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-sans text-[10px] uppercase tracking-wide text-muted-foreground">
                        {item.folder}
                      </span>
                    </button>
                  ))}
                  {query.trim() && suggestions.length === 0 && (
                    <div className="flex items-center gap-3 px-2.5 py-3" role="status">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                        <Search className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-sans text-sm font-semibold text-foreground">
                          No results for “{query.trim()}”
                        </span>
                        <span className="block font-sans text-[11px] text-muted-foreground">
                          Try a different name, tool, or category.
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </header>

      <section
        aria-label="About this board"
        className="flex flex-wrap items-end justify-between gap-4 px-3 pt-2 sm:px-5"
      >
        <div className="min-w-0">
          <h1 className="font-sans text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            sophie's portfolio
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-foreground/80">
              <Globe className="size-3.5" aria-hidden="true" />
              Public board
            </span>
            <span aria-hidden="true">·</span>
            <span>{boardItems.length} Pins</span>
            <span aria-hidden="true">·</span>
            <span>{folders.length} Sections</span>
          </p>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-foreground/70 sm:text-lg">
            A small, ongoing collection of what I'm building, studying, and making. From software,
            and hardware, and everything in between.
          </p>
          <div className="mt-4 flex -space-x-1.5">
            <span className="grid size-9 place-items-center rounded-full bg-blush/70 font-sans text-xs font-semibold text-foreground ring-2 ring-background">
              S
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground ring-2 ring-background">
              <UserRoundPlus className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 pb-1">
          <div className="flex items-center">
            <a
              href="https://github.com/yunsophie"
              target="_blank"
              rel="noreferrer"
              className="grid size-10 place-items-center rounded-full hover:bg-muted"
              aria-label="Sophie Li on GitHub"
            >
              <Github className="size-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/yunrui-sophie-li/"
              target="_blank"
              rel="noreferrer"
              className="grid size-10 place-items-center rounded-full hover:bg-muted"
              aria-label="Sophie Li on LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href="mailto:yunsophieli@gmail.com"
              className="grid size-10 place-items-center rounded-full hover:bg-muted"
              aria-label="Email Sophie Li"
            >
              <Mail className="size-4" />
            </a>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-muted px-5 font-sans text-sm font-semibold text-foreground transition hover:bg-blush/60"
          >
            {copied ? (
              "Copied!"
            ) : (
              <>
                <Upload className="size-4" aria-hidden="true" />
                Share
              </>
            )}
          </button>
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </span>
        </div>
      </section>

      <nav
        aria-label="Portfolio folders"
        className="sticky top-[68px] z-30 flex items-center gap-1 bg-background/95 px-2 pb-3 pt-2 backdrop-blur-xl sm:px-4"
      >
        {navScroll.left && (
          <button
            type="button"
            onClick={() => scrollNavStrip("left")}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Scroll folders left"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
        )}
        <div className="relative min-w-0 flex-1">
          <div
            ref={navStripRef}
            onScroll={updateNavScroll}
            className="no-scrollbar flex min-w-0 gap-2 overflow-x-auto px-1"
          >
            {folders.map((folder) => (
              <Button
                key={folder}
                variant={activeFolder === folder ? "default" : "secondary"}
                size="sm"
                className="shrink-0 rounded-full px-4 shadow-none"
                onClick={() => changeFolder(folder)}
              >
                {folder}
              </Button>
            ))}
          </div>
          {navScroll.left && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-[linear-gradient(to_right,var(--color-background)_40%,transparent)]"
            />
          )}
          {navScroll.right && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-[linear-gradient(to_left,var(--color-background)_40%,transparent)]"
            />
          )}
        </div>
        {navScroll.right && (
          <button
            type="button"
            onClick={() => scrollNavStrip("right")}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Scroll folders right"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        )}
      </nav>
      <section aria-label="Portfolio board" className="px-2 pb-10 pt-3 sm:px-3">
        {isTimeline ? (
          <div className="relative mx-auto max-w-4xl">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-px bg-border md:left-1/2"
            />
            <div className="relative mb-14 pl-8 md:hidden">
              <span
                aria-hidden="true"
                className="absolute -left-[37px] top-2 size-[9px] rounded-full bg-accent"
              />
              <EducationPanel />
            </div>
            <ol className="space-y-14">
              {timelineItems.map((item, index) => (
                <li key={item.title} className="relative grid gap-10 pl-8 md:grid-cols-2 md:pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[37px] top-2 size-[9px] rounded-full bg-accent md:left-1/2 md:-translate-x-1/2"
                  />
                  {index === 0 && (
                    <div className="hidden min-w-0 self-start md:block">
                      <EducationPanel />
                    </div>
                  )}
                  <div className={`min-w-0 md:col-start-2 ${index === 0 ? "" : "md:row-start-1"}`}>
                    <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {item.year} · {item.category}
                    </p>
                    <div className="mt-3 max-w-[320px]">
                      <FlipImage
                        item={item}
                        imageRatio="aspect-auto"
                        crop={item.crop}
                        // Eager-load the leading timeline entry; native lazy
                        // loading handles the remaining entries as we scroll.
                        eager={index === 0}
                        sizes={TIMELINE_IMAGE_SIZES}
                        posterSizes={TIMELINE_POSTER_SIZES}
                        showTapBadge={showTapBadge && item === timelineItems[0]}
                        openKey={openKey}
                        onOpenChange={setOpenKey}
                        onImageInteraction={restartTapHintTimer}
                      />
                    </div>
                    <h2 className="mt-4 font-serif text-2xl sm:text-3xl">{item.title}</h2>
                    <p className="mt-2 font-serif text-lg leading-relaxed text-foreground/70">
                      {item.description}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {item.tools.map((tool) => (
                        <li
                          key={tool}
                          className="rounded-full bg-muted px-3 py-1 font-sans text-[10px] uppercase tracking-wide text-muted-foreground"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          // CSS columns keep the same DOM across breakpoints and hydration.
          // Pins read down each column in collection order; no resize listener
          // or five-column server render can reshuffle the mobile first paint.
          <div data-testid="board-grid" className="portfolio-masonry">
            {visibleItems.map((item, index) => (
              <div
                key={item.title}
                className="portfolio-masonry-item group/cap min-w-0 overflow-hidden rounded-xl pb-3 hover:bg-blush/40"
              >
                <FlipImage
                  item={item}
                  imageRatio="aspect-auto"
                  crop={item.crop}
                  // CSS balancing determines column starts. The leading group
                  // includes the tall mobile LCP candidates; later pins remain
                  // native-lazy. Revisit this policy when the collection grows.
                  eager={index < 5}
                  showTapBadge={showTapBadge && index === 0}
                  openKey={openKey}
                  onOpenChange={setOpenKey}
                  onImageInteraction={restartTapHintTimer}
                />
                <span className="flex min-w-0 items-center justify-between gap-2 px-1.5 pt-[7.5px]">
                  <span className="truncate font-sans text-[13px] font-semibold leading-none text-foreground">
                    {item.title}
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-1 py-0.5 font-sans text-[8px] uppercase leading-none tracking-wide text-muted-foreground sm:px-2 sm:text-[10px]">
                    {item.folder}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {visibleItems.length === 0 && (
        <p className="px-5 py-24 text-center font-serif text-2xl text-muted-foreground">
          Nothing in this folder yet.
        </p>
      )}
    </main>
  );
}
