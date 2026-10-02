import { flushSync } from "react-dom";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Globe, Mail, MoreHorizontal, RotateCcw, Search, Upload, UserRoundPlus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import codeDesk from "@/assets/editorial-code-desk.jpg";
import hardwareStudy from "@/assets/editorial-hardware-study.jpg";
import interfaceStudy from "@/assets/editorial-interface-study.jpg";
import labCorridor from "@/assets/editorial-lab-corridor.jpg";
import pinkAcrylic from "@/assets/pink-acrylic-tech.jpg";
import pinkArchitecture from "@/assets/pink-architecture.jpg";
import pinkCodeStudio from "@/assets/pink-code-studio.jpg";
import pinkEditorialNotes from "@/assets/pink-editorial-notes.jpg";
import pinkHardware from "@/assets/pink-hardware-grid.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sophie Li — Computer Science Portfolio" },
      {
        name: "description",
        content: "An image-led collection of Sophie Li's software projects, experiments, and experience.",
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

type Folder = "Projects" | "Experience" | "Blog" | "About";

type BoardItem = {
  title: string;
  folder: Folder;
  category: string;
  year: string;
  description: string;
  tools: string[];
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  crop?: string;
  ratio?: string;
  sortYear?: number;
};

const boardItems: BoardItem[] = [
  { title: "About Sophie", folder: "About", category: "Computer science student", year: "Hello", description: "I like finding the human detail inside technical problems. I build thoughtful software, learn by making, and keep a camera nearby.", tools: ["Software engineering", "Product thinking", "Curiosity"], image: pinkArchitecture, imageWidth: 1024, imageHeight: 1536, alt: "Curved pink architecture in sunlight", crop: "object-top", ratio: "aspect-[4/5]" },
  { title: "Lumen Notes", folder: "Projects", category: "Product engineering", year: "2026", description: "A distraction-free research workspace that connects notes through semantic search and lightweight visual maps.", tools: ["React", "TypeScript", "Embeddings"], image: pinkEditorialNotes, imageWidth: 1024, imageHeight: 1536, alt: "Open notebook with pink blossoms on a blush desk" },
  { title: "Interface Studies", folder: "Blog", category: "Design systems", year: "2026", description: "A component playground exploring clear information hierarchy, accessible interaction, and tactile interface patterns.", tools: ["React", "Storybook", "Figma"], image: interfaceStudy, imageWidth: 1024, imageHeight: 1024, alt: "Translucent interface cards and sketches", ratio: "aspect-[4/5]" },
  { title: "Campus Compute", folder: "Experience", category: "Research assistant", year: "2025", sortYear: 2025, description: "Built internal tools and data views for a university lab, turning noisy operational data into useful daily decisions.", tools: ["Python", "SQL", "Data visualization"], image: pinkArchitecture, imageWidth: 1024, imageHeight: 1536, alt: "Pink architectural staircase with a red chair" },
  { title: "Field Sensor", folder: "Projects", category: "Physical computing", year: "2025", description: "A low-power environmental sensor prototype with a small web dashboard for exploring live readings and trends.", tools: ["C++", "ESP32", "WebSockets"], image: pinkAcrylic, imageWidth: 1024, imageHeight: 1408, alt: "Pink acrylic forms and a small circuit board" },
  { title: "Key Studies", folder: "Blog", category: "Interaction study", year: "2026", description: "A tactile study of input, feedback, and tiny moments of delight in everyday computing tools.", tools: ["Prototyping", "Motion", "Accessibility"], image: pinkHardware, imageWidth: 1024, imageHeight: 1024, alt: "Pink keyboard parts and red cable", ratio: "aspect-square" },
  { title: "Open Source Log", folder: "Experience", category: "Selected contributions", year: "2024—26", sortYear: 2026, description: "Small, consistent contributions across developer tools: documentation fixes, accessibility improvements, and tested features.", tools: ["Git", "GitHub Actions", "Open source"], image: codeDesk, imageWidth: 1024, imageHeight: 1408, alt: "Code workspace with notebooks and coffee", crop: "object-top", ratio: "aspect-[3/4]" },
  { title: "Material Intelligence", folder: "Blog", category: "Visual research", year: "2026", description: "A visual notebook collecting patterns from hardware, architecture, editorial design, and everyday technical objects.", tools: ["Research", "Photography", "Prototyping"], image: hardwareStudy, imageWidth: 1408, imageHeight: 1024, alt: "Technical materials and a compact circuit board", ratio: "aspect-[4/3]" },
  { title: "Rose Graph", folder: "Projects", category: "Data storytelling", year: "2026", description: "An exploratory graph interface that helps students follow ideas across dense reading lists without losing context.", tools: ["D3", "TypeScript", "Information design"], image: pinkAcrylic, imageWidth: 1024, imageHeight: 1408, alt: "Rose-toned acrylic planes and chrome spheres", crop: "object-bottom", ratio: "aspect-square" },
  { title: "Studio Tools", folder: "Projects", category: "Creative tooling", year: "2025", description: "A compact collection of browser tools for arranging references, saving palettes, and documenting visual decisions.", tools: ["React", "IndexedDB", "Canvas"], image: pinkCodeStudio, imageWidth: 1024, imageHeight: 1536, alt: "A bright pink digital design workspace", crop: "object-bottom", ratio: "aspect-[4/5]" },
  { title: "Systems Seminar", folder: "Experience", category: "Teaching", year: "2025", sortYear: 2025, description: "Led weekly study sessions that made operating systems concepts tangible through diagrams, demos, and collaborative debugging.", tools: ["C", "Linux", "Teaching"], image: labCorridor, imageWidth: 1024, imageHeight: 1536, alt: "A geometric university computer lab", ratio: "aspect-[3/4]" },
  { title: "Soft Hardware", folder: "Blog", category: "Material study", year: "Now", description: "Ongoing experiments pairing electronics with softer visual language, warmer materials, and more inviting physical forms.", tools: ["Electronics", "Industrial design", "Research"], image: pinkHardware, imageWidth: 1024, imageHeight: 1024, alt: "Blush keyboard objects and a burgundy cable", crop: "object-bottom", ratio: "aspect-[4/5]" },
];

const folders = ["All", "About", "Experience", "Projects", "Blog"] as const;

function FlipImage({
  item,
  imageRatio,
  crop,
  eager,
  showTapBadge = false,
  onImageInteraction,
}: {
  item: BoardItem;
  imageRatio: string;
  crop?: string | undefined;
  eager?: boolean | undefined;
  showTapBadge?: boolean | undefined;
  onImageInteraction: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!flipped) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFlipped(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [flipped]);

  return (
    <span className="group relative block" style={{ perspective: "1400px" }}>
      <span
        className={`relative block w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        <button
          type="button"
          className={`relative block w-full overflow-hidden rounded-xl bg-muted [backface-visibility:hidden] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${imageRatio}`}
          onClick={() => {
            onImageInteraction();
            setFlipped(true);
          }}
          aria-expanded={flipped}
          aria-label={`Flip to see details about ${item.title}`}
        >
          <img
            style={{ viewTransitionName: `pin-${item.title.replace(/[^a-zA-Z0-9]/g, "-")}` }}
            src={item.image}
            alt={item.alt}
            width={item.imageWidth}
            height={item.imageHeight}
            loading={eager ? "eager" : "lazy"}
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
          className={`no-scrollbar absolute inset-0 flex flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-background p-4 [transform:rotateY(180deg)] [backface-visibility:hidden] ${flipped ? "" : "pointer-events-none"}`}
          onClick={(event) => {
            if (!(event.target as HTMLElement).closest("a")) {
              onImageInteraction();
              setFlipped(false);
            }
          }}
        >
          <span>
            <span className="block font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {item.category} · {item.year}
            </span>
            <span className="mt-1.5 block font-serif text-2xl leading-tight text-foreground">{item.title}</span>
          </span>
          <span className="font-serif text-sm leading-relaxed text-foreground/75">{item.description}</span>
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
          <span className="flex items-center gap-4 border-t border-border pt-3 text-xs">
            <a
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent-foreground"
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              <Github className="size-3.5" aria-hidden="true" /> GitHub
            </a>
            <a
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent-foreground"
              href="mailto:hello@sophieli.dev"
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
    el.scrollBy({ left: direction === "left" ? -Math.round(el.clientWidth * 0.7) : Math.round(el.clientWidth * 0.7), behavior: "smooth" });
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
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { skipTransition: () => void } };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) return setActiveFolder(folder);
    transitionRef.current?.skipTransition();
    transitionRef.current = doc.startViewTransition(() => flushSync(() => setActiveFolder(folder)));
  };

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return boardItems.filter((item) => {
      const folderMatches = activeFolder === "All" || item.folder === activeFolder;
      const searchMatches = !normalized || `${item.title} ${item.category} ${item.tools.join(" ")}`.toLowerCase().includes(normalized);
      return folderMatches && searchMatches;
    });
  }, [activeFolder, query]);

  const [columnCount, setColumnCount] = useState(5);
  useEffect(() => {
    const compute = () => setColumnCount(window.innerWidth >= 1024 ? 5 : window.innerWidth >= 768 ? 3 : 2);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const columns = useMemo(() => {
    const cols: BoardItem[][] = Array.from({ length: columnCount }, () => []);
    visibleItems.forEach((item, index) => cols[index % columnCount]!.push(item));
    return cols;
  }, [visibleItems, columnCount]);

  const timelineItems = useMemo(
    () => [...visibleItems].sort((a, b) => (b.sortYear ?? 0) - (a.sortYear ?? 0)),
    [visibleItems],
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl">
        <div className="flex h-[68px] items-center gap-3 px-3 sm:px-5">
          <a href="/" className="w-10 shrink-0 font-serif text-2xl leading-none" aria-label="Sophie Li home">SL<span className="text-accent-foreground">.</span></a>
          <label className="flex h-11 flex-1 items-center gap-3 rounded-full bg-muted px-4 text-muted-foreground">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Search portfolio</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
          </label>
        </div>
      </header>

      <section aria-label="About this board" className="flex flex-wrap items-end justify-between gap-4 px-3 pt-6 sm:px-5">
        <div className="min-w-0">
          <h1 className="font-sans text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">sophie's portfolio</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium text-foreground/80">
              <Globe className="size-3.5" aria-hidden="true" />Public board
            </span>
            <span aria-hidden="true">·</span>
            <span>{boardItems.length} Pins</span>
            <span aria-hidden="true">·</span>
            <span>{folders.length} Sections</span>
          </p>
          <p className="mt-3 max-w-2xl font-serif text-base leading-relaxed text-foreground/70 sm:text-lg">
            A small, ongoing collection of what I'm building, studying, and making — software, hardware, and everything in between.
          </p>
          <div className="mt-4 flex -space-x-1.5">
            <span className="grid size-9 place-items-center rounded-full bg-blush/70 font-sans text-xs font-semibold text-foreground ring-2 ring-background">S</span>
            <span className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground ring-2 ring-background">
              <UserRoundPlus className="size-4" aria-hidden="true" />
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 pb-1">
          <div className="flex items-center">
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full hover:bg-muted" aria-label="GitHub profile"><Github className="size-4" /></a>
            <a href="mailto:hello@sophieli.dev" className="grid size-10 place-items-center rounded-full hover:bg-muted" aria-label="Email Sophie Li"><Mail className="size-4" /></a>
          </div>
          <button type="button" onClick={copyLink} className="inline-flex h-11 items-center gap-2 rounded-full bg-muted px-5 font-sans text-sm font-semibold text-foreground transition hover:bg-blush/60">
            {copied ? "Copied!" : (<><Upload className="size-4" aria-hidden="true" />Share</>)}
          </button>
          <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </span>
        </div>
      </section>

      <nav aria-label="Portfolio folders" className="sticky top-[68px] z-30 flex items-center gap-1 bg-background/95 px-2 pb-3 pt-5 backdrop-blur-xl sm:px-4">
        {navScroll.left && (
          <button type="button" onClick={() => scrollNavStrip("left")} className="grid size-8 shrink-0 place-items-center rounded-full bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Scroll folders left"><ChevronLeft className="size-4" aria-hidden="true" /></button>
        )}
        <div className="relative min-w-0 flex-1">
          <div ref={navStripRef} onScroll={updateNavScroll} className="no-scrollbar flex min-w-0 gap-2 overflow-x-auto px-1">
            {folders.map((folder) => (
              <Button key={folder} variant={activeFolder === folder ? "default" : "secondary"} size="sm" className="shrink-0 rounded-full px-4 shadow-none" onClick={() => changeFolder(folder)}>{folder}</Button>
            ))}
          </div>
          {navScroll.left && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-[linear-gradient(to_right,var(--color-background)_40%,transparent)]" />}
          {navScroll.right && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-[linear-gradient(to_left,var(--color-background)_40%,transparent)]" />}
        </div>
        {navScroll.right && (
          <button type="button" onClick={() => scrollNavStrip("right")} className="grid size-8 shrink-0 place-items-center rounded-full bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Scroll folders right"><ChevronRight className="size-4" aria-hidden="true" /></button>
        )}
      </nav>
      <section aria-label="Portfolio board" className="px-2 pb-10 pt-3 sm:px-3">
        {isTimeline ? (
          <ol className="relative mx-auto max-w-2xl space-y-14 border-l border-border pl-8 sm:pl-10">
            {timelineItems.map((item) => (
              <li key={item.title} className="relative">
                <span aria-hidden="true" className="absolute -left-[37px] top-2 size-[9px] rounded-full bg-accent" />
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{item.year} · {item.category}</p>
                <div className="mt-3">
                  <FlipImage
                    item={item}
                    imageRatio="aspect-[16/10]"
                    crop={item.crop}
                    eager
                    showTapBadge={showTapBadge && item === timelineItems[0]}
                    onImageInteraction={restartTapHintTimer}
                  />
                </div>
                <h2 className="mt-4 font-serif text-2xl sm:text-3xl">{item.title}</h2>
                <p className="mt-2 font-serif text-lg leading-relaxed text-foreground/70">{item.description}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <li key={tool} className="rounded-full bg-muted px-3 py-1 font-sans text-[10px] uppercase tracking-wide text-muted-foreground">{tool}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ) : (
        <div className="flex items-start gap-2 sm:gap-3">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
              {column.map((item, index) => (
                <div key={item.title} className="group/cap min-w-0 overflow-hidden rounded-xl pb-3 hover:bg-blush/40">
                  <FlipImage
                    item={item}
                    imageRatio={item.ratio ?? "aspect-auto"}
                    crop={item.crop}
                    eager={index < 4 && columnIndex === 0}
                    showTapBadge={showTapBadge && columnIndex === 0 && index === 0}
                    onImageInteraction={restartTapHintTimer}
                  />
                  <span className="flex min-w-0 items-center justify-between gap-2 px-1.5 pt-[7.5px]">
                    <span className="truncate font-sans text-[13px] font-semibold leading-none text-foreground">{item.title}</span>
                    <span className="shrink-0 rounded-full bg-muted px-1 py-0.5 font-sans text-[8px] uppercase leading-none tracking-wide text-muted-foreground sm:px-2 sm:text-[10px]">{item.folder}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        )}
      </section>

      {visibleItems.length === 0 && <p className="px-5 py-24 text-center font-serif text-2xl text-muted-foreground">Nothing in this folder yet.</p>}
    </main>
  );
}
