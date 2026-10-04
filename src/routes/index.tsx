import { flushSync } from "react-dom";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Globe, Mail, MoreHorizontal, RotateCcw, Search, Upload, UserRoundPlus, X } from "lucide-react";
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
  { title: "About Sophie", folder: "About", category: "CS @ University of Washington", year: "Class of 2028", description: "Hi, I'm Sophie (Yunrui) Li, a computer science student at UW's Paul G. Allen School. I'm happiest somewhere between research and systems — teaching robots to learn from video, reading the Earth through satellite imagery, and building distributed software that holds up when things go wrong.", tools: ["Machine learning", "Distributed systems", "Research"], image: pinkArchitecture, imageWidth: 1024, imageHeight: 1536, alt: "Curved pink architecture in sunlight", crop: "object-top", ratio: "aspect-[4/5]" },
  { title: "Distributed Key-Value Store", folder: "Projects", category: "Distributed systems", year: "2026", description: "A linearizable, sharded key-value store written in Java. It layers exactly-once RPCs, primary-backup replication, and Paxos consensus, then adds load-balanced sharding and atomic multi-key transactions through two-phase commit. I verified it against 14 adversarial scenarios that drop, reorder, and duplicate messages and crash nodes mid-flight.", tools: ["Java", "Paxos", "Two-phase commit"], image: pinkEditorialNotes, imageWidth: 1024, imageHeight: 1536, alt: "Open notebook with pink blossoms on a blush desk" },
  { title: "Relevant Coursework", folder: "Blog", category: "Notes from school", year: "UW", description: "The classes shaping how I think: AI-Assisted Software Development, Distributed Systems, Systems Programming, Machine Learning, Artificial Intelligence, Data Structures, and Algorithms.", tools: ["Systems", "ML", "Algorithms"], image: interfaceStudy, imageWidth: 1024, imageHeight: 1024, alt: "Translucent interface cards and sketches", ratio: "aspect-[4/5]" },
  { title: "Research Assistant", folder: "Experience", category: "UW Civil & Environmental Engineering", year: "Jan — Jun 2026", sortYear: 2026.1, description: "Worked as an undergraduate researcher with Prof. Nicoleta Cristea. I explored how far a tiny amount of labeled data could go. By training a simple logistic-regression head on embeddings from OlmoEarth's frozen 300M-parameter vision transformer, I reached an F1 of 0.84 (0.975 precision) from just 20 labeled points, eliminating the need for costly fine-tuning. I also built a geospatial data pipelines aligning Sentinel-1 SAR, Sentinel-2, and LiDAR imagery over the Tuolumne River basin and finally presented the work to about 20 researchers at a symposium.", tools: ["Python", "scikit-learn", "geopandas", "AWS"], image: pinkArchitecture, imageWidth: 1024, imageHeight: 1536, alt: "Pink architectural staircase with a red chair" },
  { title: "Multithreaded HTTP Server", folder: "Projects", category: "Systems programming", year: "2026", description: "A concurrent web server in C++ on Linux, built on a thread pool with IPv4/IPv6 sockets. It serves static files and keyword search over an inverted index of roughly 250 documents, and it's hardened against cross-site scripting and directory traversal through careful input sanitization and path normalization.", tools: ["C++", "Linux", "Sockets"], image: pinkAcrylic, imageWidth: 1024, imageHeight: 1408, alt: "Pink acrylic forms and a small circuit board" },
  { title: "Technical Toolkit", folder: "Blog", category: "What I work with", year: "Now", description: "Day to day I write Java, Python, C++, C, JavaScript, HTML/CSS, and SQL. For ML and data I reach for PyTorch, NumPy, Pandas, scikit-learn, HuggingFace, and rasterio, and I live in Git, Linux, Jupyter, GDB, AWS, and Weights & Biases.", tools: ["PyTorch", "AWS", "Git"], image: pinkHardware, imageWidth: 1024, imageHeight: 1024, alt: "Pink keyboard parts and red cable", ratio: "aspect-square" },
  { title: "virtual vla !", folder: "Experience", category: "Ai2 + UW RAIVN Lab", year: "Mar — Jun 2026", sortYear: 2026.3, description: "Worked as a undergraduate researcher with Xiang Fan. Virtual VLA is a robot learning system that compresses vision, actions, and proprioception into one shared latent space, enabling unlabeled video to stand in as action data across different robots. I added temporal timestep conditioning across the encoders so the model could reason about variable frame gaps, and ran 40+ careful hyperparameter sweeps that cut validation loss 11.3% below baseline.", tools: ["PyTorch", "Weights & Biases", "Robot learning"], image: codeDesk, imageWidth: 1024, imageHeight: 1408, alt: "Code workspace with notebooks and coffee", crop: "object-top", ratio: "aspect-[3/4]" },
  { title: "i2 ta !", folder: "Experience", category: "Interactive Intelligence", year: "Oct 2025 — Jun 2026", sortYear: 2025.8, description: "I mentor a group of ~10 students exploring machine learning, deep learning, computer vision, reinforcement learning, natural language processing, and computational neuroscience. Through weekly sessions I've guided and answered questions across ten projects from MNIST classifiers to ConvNets to fine-tuning HuggingFace models.", tools: ["Mentorship", "Deep learning", "HuggingFace"], image: labCorridor, imageWidth: 1024, imageHeight: 1536, alt: "A geometric university computer lab", ratio: "aspect-[3/4]" },
  { title: "Frontend Developer Intern", folder: "Experience", category: "Husky Coding Project", year: "Oct 2024 — May 2025", sortYear: 2024.8, description: "On a team of six, I helped build a full-stack React web app that lets UW students follow live sports, owning features end to end from design through deployment. Along the way I got a taste of an industry-style workflow — standups, reviews, version control — and presented our work to industry professionals at the HCP showcase.", tools: ["React.js", "JavaScript", "Teamwork"], image: pinkCodeStudio, imageWidth: 1024, imageHeight: 1536, alt: "A bright pink digital design workspace", crop: "object-bottom", ratio: "aspect-[4/5]" },
];

const folders = ["All", "About", "Experience", "Projects", "Blog"] as const;

function FlipImage({
  item,
  imageRatio,
  crop,
  eager,
  showTapBadge = false,
  openKey = null,
  onOpenChange,
  onImageInteraction,
}: {
  item: BoardItem;
  imageRatio: string;
  crop?: string | undefined;
  eager?: boolean | undefined;
  showTapBadge?: boolean | undefined;
  openKey?: string | null;
  onOpenChange: (key: string | null) => void;
  onImageInteraction: () => void;
}) {
  const [localFlipped, setLocalFlipped] = useState(false);
  const flipped = openKey === item.title || localFlipped;
  const clearExternalOpen = () => {
    if (openKey === item.title) onOpenChange(null);
  };

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
  }, [flipped]);

  return (
    <span id={`pin-${item.title.replace(/[^a-zA-Z0-9]/g, "-")}`} className="group relative block" style={{ perspective: "1400px" }}>
      <span
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
              setLocalFlipped(false);
              clearExternalOpen();
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

  // The board itself only responds to tabs — search is a pure dropdown finder.
  const visibleItems = useMemo(() => {
    return boardItems.filter((item) => activeFolder === "All" || item.folder === activeFolder);
  }, [activeFolder]);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return boardItems
      .filter((item) => {
        const haystack = `${item.title} ${item.description} ${item.category} ${item.year} ${item.folder} ${item.tools.join(" ")}`.toLowerCase();
        return !normalized || haystack.includes(normalized);
      })
      .slice(0, 8);
  }, [query]);

  const recommendations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const pool = Array.from(
      new Set(boardItems.flatMap((item) => [...item.tools, item.category])),
    );
    if (!normalized) return ["PyTorch", "Python", "Java", "C++", "AWS", "React.js"].filter((t) => pool.some((p) => p.toLowerCase().includes(t.toLowerCase()))).concat(pool).filter((v, i, a) => a.indexOf(v) === i).slice(0, 6);
    return pool
      .filter((term) => term.toLowerCase().includes(normalized) && term.toLowerCase() !== normalized)
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
                    setHighlightIndex((index) => Math.min(index + 1, Math.max(suggestions.length - 1, 0)));
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
                aria-expanded={searchFocused && (suggestions.length > 0 || recommendations.length > 0 || query.trim() !== "")}
                aria-controls="search-suggestions"
                aria-autocomplete="list"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="grid size-5 shrink-0 place-items-center rounded-full bg-muted-foreground/20 text-muted-foreground transition hover:bg-muted-foreground/30 hover:text-foreground" aria-label="Clear search">
                  <X className="size-3" aria-hidden="true" />
                </button>
              )}
            </label>
            {searchFocused && (suggestions.length > 0 || recommendations.length > 0 || query.trim() !== "") && (
              <div id="search-suggestions" role="listbox" aria-label="Search suggestions" className="absolute inset-x-0 top-full z-50 mt-2 max-h-[min(60vh,26rem)] overflow-y-auto rounded-2xl border border-border bg-background p-1.5 shadow-lg">
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
                    <img src={item.image} alt="" className="size-10 shrink-0 rounded-lg object-cover" loading="lazy" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-sans text-sm font-semibold text-foreground">{item.title}</span>
                      <span className="block truncate font-sans text-[11px] text-muted-foreground">{item.category} · {item.year}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-sans text-[10px] uppercase tracking-wide text-muted-foreground">{item.folder}</span>
                  </button>
                ))}
                {query.trim() && suggestions.length === 0 && (
                  <div className="flex items-center gap-3 px-2.5 py-3" role="status">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                      <Search className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-sans text-sm font-semibold text-foreground">No results for “{query.trim()}”</span>
                      <span className="block font-sans text-[11px] text-muted-foreground">Try a different name, tool, or category.</span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <section aria-label="About this board" className="flex flex-wrap items-end justify-between gap-4 px-3 pt-2 sm:px-5">
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

      <nav aria-label="Portfolio folders" className="sticky top-[68px] z-30 flex items-center gap-1 bg-background/95 px-2 pb-3 pt-2 backdrop-blur-xl sm:px-4">
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
                    openKey={openKey}
                    onOpenChange={setOpenKey}
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
                    openKey={openKey}
                    onOpenChange={setOpenKey}
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

      {visibleItems.length === 0 && (
        <p className="px-5 py-24 text-center font-serif text-2xl text-muted-foreground">Nothing in this folder yet.</p>
      )}
    </main>
  );
}
