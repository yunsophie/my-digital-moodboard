import { flushSync } from "react-dom";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Github, Mail, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import codeDesk from "@/assets/editorial-code-desk.jpg";
import hardwareStudy from "@/assets/editorial-hardware-study.jpg";
import interfaceStudy from "@/assets/editorial-interface-study.jpg";
import labCorridor from "@/assets/editorial-lab-corridor.jpg";
import pinkAcrylic from "@/assets/pink-acrylic-tech.jpg";
import pinkArchitecture from "@/assets/pink-architecture.jpg";
import pinkCodeStudio from "@/assets/pink-code-studio.jpg";
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
  { title: "Lumen Notes", folder: "Projects", category: "Product engineering", year: "2026", description: "A distraction-free research workspace that connects notes through semantic search and lightweight visual maps.", tools: ["React", "TypeScript", "Embeddings"], image: pinkCodeStudio, imageWidth: 1024, imageHeight: 1536, alt: "Pink coding studio with a laptop and sculptural flower" },
  { title: "Interface Studies", folder: "Blog", category: "Design systems", year: "2026", description: "A component playground exploring clear information hierarchy, accessible interaction, and tactile interface patterns.", tools: ["React", "Storybook", "Figma"], image: interfaceStudy, imageWidth: 1024, imageHeight: 1024, alt: "Translucent interface cards and sketches", ratio: "aspect-[4/5]" },
  { title: "Campus Compute", folder: "Experience", category: "Research assistant", year: "2025", sortYear: 2025, description: "Built internal tools and data views for a university lab, turning noisy operational data into useful daily decisions.", tools: ["Python", "SQL", "Data visualization"], image: pinkArchitecture, imageWidth: 1024, imageHeight: 1536, alt: "Pink architectural staircase with a red chair" },
  { title: "Field Sensor", folder: "Projects", category: "Physical computing", year: "2025", description: "A low-power environmental sensor prototype with a small web dashboard for exploring live readings and trends.", tools: ["C++", "ESP32", "WebSockets"], image: pinkAcrylic, imageWidth: 1024, imageHeight: 1408, alt: "Pink acrylic forms and a small circuit board" },
  { title: "Key Studies", folder: "Blog", category: "Interaction study", year: "2026", description: "A tactile study of input, feedback, and tiny moments of delight in everyday computing tools.", tools: ["Prototyping", "Motion", "Accessibility"], image: pinkHardware, imageWidth: 1024, imageHeight: 1024, alt: "Pink keyboard parts and red cable", ratio: "aspect-square" },
  { title: "Open Source Log", folder: "Experience", category: "Selected contributions", year: "2024—26", sortYear: 2026, description: "Small, consistent contributions across developer tools: documentation fixes, accessibility improvements, and tested features.", tools: ["Git", "GitHub Actions", "Open source"], image: codeDesk, imageWidth: 1024, imageHeight: 1408, alt: "Code workspace with notebooks and coffee", crop: "object-top", ratio: "aspect-[3/4]" },
  { title: "Material Intelligence", folder: "Blog", category: "Visual research", year: "2026", description: "A visual notebook collecting patterns from hardware, architecture, editorial design, and everyday technical objects.", tools: ["Research", "Photography", "Prototyping"], image: hardwareStudy, imageWidth: 1408, imageHeight: 1024, alt: "Technical materials and a compact circuit board", ratio: "aspect-[4/3]" },
  { title: "About Sophie", folder: "About", category: "Computer science student", year: "Hello", description: "I like finding the human detail inside technical problems. I build thoughtful software, learn by making, and keep a camera nearby.", tools: ["Software engineering", "Product thinking", "Curiosity"], image: pinkArchitecture, imageWidth: 1024, imageHeight: 1536, alt: "Curved pink architecture in sunlight", crop: "object-top", ratio: "aspect-[4/5]" },
  { title: "Rose Graph", folder: "Projects", category: "Data storytelling", year: "2026", description: "An exploratory graph interface that helps students follow ideas across dense reading lists without losing context.", tools: ["D3", "TypeScript", "Information design"], image: pinkAcrylic, imageWidth: 1024, imageHeight: 1408, alt: "Rose-toned acrylic planes and chrome spheres", crop: "object-bottom", ratio: "aspect-square" },
  { title: "Studio Tools", folder: "Projects", category: "Creative tooling", year: "2025", description: "A compact collection of browser tools for arranging references, saving palettes, and documenting visual decisions.", tools: ["React", "IndexedDB", "Canvas"], image: pinkCodeStudio, imageWidth: 1024, imageHeight: 1536, alt: "A bright pink digital design workspace", crop: "object-bottom", ratio: "aspect-[4/5]" },
  { title: "Systems Seminar", folder: "Experience", category: "Teaching", year: "2025", sortYear: 2025, description: "Led weekly study sessions that made operating systems concepts tangible through diagrams, demos, and collaborative debugging.", tools: ["C", "Linux", "Teaching"], image: labCorridor, imageWidth: 1024, imageHeight: 1536, alt: "A geometric university computer lab", ratio: "aspect-[3/4]" },
  { title: "Soft Hardware", folder: "Blog", category: "Material study", year: "Now", description: "Ongoing experiments pairing electronics with softer visual language, warmer materials, and more inviting physical forms.", tools: ["Electronics", "Industrial design", "Research"], image: pinkHardware, imageWidth: 1024, imageHeight: 1024, alt: "Blush keyboard objects and a burgundy cable", crop: "object-bottom", ratio: "aspect-[4/5]" },
];

const folders = ["All", "About", "Experience", "Projects", "Blog"] as const;

function ProjectModal({ item, onClose }: { item: BoardItem; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/65 p-3 backdrop-blur-sm" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="project-title" className="relative max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-[6px] border border-border bg-background shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <Button variant="outline" size="icon" className="absolute right-3 top-3 z-10 rounded-full bg-background/90 shadow-sm backdrop-blur" onClick={onClose} aria-label="Close project details">
          <X aria-hidden="true" />
        </Button>
        <div className="grid md:grid-cols-[1.12fr_0.88fr]">
          <img src={item.image} alt="" width={item.imageWidth} height={item.imageHeight} className={`h-72 w-full object-cover md:h-full md:min-h-[620px] ${item.crop ?? "object-center"}`} />
          <div className="flex min-h-[390px] flex-col p-7 sm:p-10">
            <p className="font-sans text-[10px] uppercase text-muted-foreground">{item.category} · {item.year}</p>
            <h2 id="project-title" className="mt-8 font-serif text-5xl font-normal leading-[0.95] sm:text-6xl">{item.title}</h2>
            <p className="mt-7 font-serif text-xl leading-relaxed text-foreground/75">{item.description}</p>
            <ul className="mt-8 border-t border-border pt-5 font-sans text-xs text-muted-foreground">
              {item.tools.map((tool) => <li key={tool} className="border-b border-border py-3">{tool}</li>)}
            </ul>
            <div className="mt-auto flex items-center gap-5 pt-10 text-xs">
              <a className="inline-flex items-center gap-2 hover:text-accent-foreground" href="https://github.com/" target="_blank" rel="noreferrer"><Github className="size-4" aria-hidden="true" /> View GitHub</a>
              <a className="inline-flex items-center gap-2 hover:text-accent-foreground" href="mailto:hello@sophieli.dev"><Mail className="size-4" aria-hidden="true" /> Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Index() {
  const [activeFolder, setActiveFolder] = useState<(typeof folders)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BoardItem | null>(null);
  const isTimeline = activeFolder === "Experience";
  const transitionRef = useRef<{ skipTransition: () => void } | null>(null);
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

  const columns = useMemo(() => {
    const cols: BoardItem[][] = [[], [], []];
    visibleItems.forEach((item, index) => cols[index % 3]!.push(item));
    return cols;
  }, [visibleItems]);

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
          <div className="flex shrink-0 items-center gap-0">
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full hover:bg-muted" aria-label="GitHub profile"><Github className="size-4" /></a>
            <a href="mailto:hello@sophieli.dev" className="grid size-10 place-items-center rounded-full hover:bg-muted" aria-label="Email Sophie Li"><Mail className="size-4" /></a>
          </div>
        </div>
        <nav aria-label="Portfolio folders" className="flex gap-2 overflow-x-auto px-3 pb-3 sm:px-5">
          {folders.map((folder) => (
            <Button key={folder} variant={activeFolder === folder ? "default" : "secondary"} size="sm" className="shrink-0 rounded-full px-4 shadow-none" onClick={() => changeFolder(folder)}>{folder}</Button>
          ))}
        </nav>
      </header>

      <h1 className="sr-only">Sophie Li — computer science projects and experience</h1>
      <section aria-label="Portfolio board" className="px-2 pb-10 pt-3 sm:px-3">
        {isTimeline ? (
          <ol className="relative mx-auto max-w-2xl space-y-14 border-l border-border pl-8 sm:pl-10">
            {timelineItems.map((item) => (
              <li key={item.title} className="relative">
                <span aria-hidden="true" className="absolute -left-[37px] top-2 size-[9px] rounded-full bg-accent" />
                <p className="font-sans text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{item.year} · {item.category}</p>
                <Button onClick={() => setSelected(item)} className="group relative mt-3 block h-auto w-full overflow-hidden rounded-xl p-0 shadow-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label={`Open ${item.title}`}>
                  <img style={{ viewTransitionName: `pin-${item.title.replace(/[^a-zA-Z0-9]/g, "-")}` }} src={item.image} alt={item.alt} width={item.imageWidth} height={item.imageHeight} decoding="async" className={`block aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02] ${item.crop ?? "object-center"}`} />
                  <span className="absolute inset-0 bg-foreground/0 transition-colors group-hover:bg-foreground/10" />
                  <span className="absolute bottom-2 right-2 grid size-8 translate-y-1 place-items-center rounded-full bg-background/90 opacity-0 shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"><ArrowUpRight className="size-4" aria-hidden="true" /></span>
                </Button>
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
                <Button key={item.title} variant="ghost" className="group flex h-auto w-full flex-col items-stretch gap-0 overflow-hidden rounded-xl p-0 pb-3 text-left shadow-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onClick={() => setSelected(item)} aria-label={`Open ${item.title}`}>
                  <span className="relative block overflow-hidden rounded-xl transition-shadow group-hover:shadow-[0_12px_28px_-10px_var(--color-blush)]">
                    <img style={{ viewTransitionName: `pin-${item.title.replace(/[^a-zA-Z0-9]/g, "-")}` }} src={item.image} alt={item.alt} width={item.imageWidth} height={item.imageHeight} loading={index < 4 && columnIndex === 0 ? "eager" : "lazy"} className={`block w-full object-cover transition duration-500 group-hover:scale-[1.02] ${item.ratio ?? "aspect-auto"} ${item.crop ?? "object-center"}`} />
                    <span className="absolute inset-0 rounded-xl bg-blush/0 transition-colors group-hover:bg-blush/30" />
                    <span className="absolute bottom-2 right-2 grid size-8 translate-y-1 place-items-center rounded-full bg-background/90 opacity-0 shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100"><ArrowUpRight className="size-4" aria-hidden="true" /></span>
                  </span>
                  <span className="flex min-w-0 items-center justify-between gap-2 px-1.5 pt-[7.5px]">
                    <span className="truncate font-sans text-[13px] font-semibold leading-none text-foreground">{item.title}</span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-sans text-[10px] uppercase leading-none tracking-wide text-muted-foreground">{item.folder}</span>
                  </span>
                </Button>
              ))}
            </div>
          ))}
        </div>
        )}
      </section>

      {visibleItems.length === 0 && <p className="px-5 py-24 text-center font-serif text-2xl text-muted-foreground">Nothing in this folder yet.</p>}
      {selected && <ProjectModal item={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}