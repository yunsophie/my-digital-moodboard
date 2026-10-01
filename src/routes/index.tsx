import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Github, Mail } from "lucide-react";

import codeDesk from "@/assets/editorial-code-desk.jpg";
import hardwareStudy from "@/assets/editorial-hardware-study.jpg";
import interfaceStudy from "@/assets/editorial-interface-study.jpg";
import labCorridor from "@/assets/editorial-lab-corridor.jpg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

type BoardItem = {
  title: string;
  category: string;
  year: string;
  description: string;
  tools: string[];
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  position?: string;
};

const boardItems: BoardItem[] = [
  {
    title: "Lumen Notes",
    category: "Product engineering",
    year: "2026",
    description:
      "A distraction-free research workspace that connects notes through semantic search and lightweight visual maps.",
    tools: ["React", "TypeScript", "Embeddings"],
    image: codeDesk,
    imageWidth: 1024,
    imageHeight: 1408,
    alt: "Laptop and interface sketches on a sunlit desk",
  },
  {
    title: "Interface Studies",
    category: "Design systems",
    year: "2026",
    description:
      "A component playground exploring clear information hierarchy, accessible interaction, and tactile interface patterns.",
    tools: ["React", "Storybook", "Figma"],
    image: interfaceStudy,
    imageWidth: 1024,
    imageHeight: 1024,
    alt: "Translucent interface cards and sketches",
  },
  {
    title: "Campus Compute",
    category: "Experience",
    year: "2025",
    description:
      "Built internal tools and data views for a university lab, turning noisy operational data into useful daily decisions.",
    tools: ["Python", "SQL", "Data visualization"],
    image: labCorridor,
    imageWidth: 1024,
    imageHeight: 1536,
    alt: "A geometric university computer lab",
  },
  {
    title: "Field Sensor",
    category: "Physical computing",
    year: "2025",
    description:
      "A low-power environmental sensor prototype with a small web dashboard for exploring live readings and trends.",
    tools: ["C++", "ESP32", "WebSockets"],
    image: hardwareStudy,
    imageWidth: 1408,
    imageHeight: 1024,
    alt: "Circuit board and material samples arranged on paper",
  },
  {
    title: "Quiet Systems",
    category: "Current interests",
    year: "Now",
    description:
      "I am interested in calm software: tools that are fast, understandable, and respectful of the person using them.",
    tools: ["Human-computer interaction", "Systems", "Typography"],
    image: interfaceStudy,
    imageWidth: 1024,
    imageHeight: 1024,
    alt: "Minimal interface objects in soft daylight",
    position: "object-bottom",
  },
  {
    title: "Open Source Log",
    category: "Selected contributions",
    year: "2024—26",
    description:
      "Small, consistent contributions across developer tools: documentation fixes, accessibility improvements, and tested features.",
    tools: ["Git", "GitHub Actions", "Open source"],
    image: codeDesk,
    imageWidth: 1024,
    imageHeight: 1408,
    alt: "Code workspace with notebooks and coffee",
    position: "object-top",
  },
  {
    title: "Material Intelligence",
    category: "Visual research",
    year: "2026",
    description:
      "A visual notebook collecting patterns from hardware, architecture, editorial design, and everyday technical objects.",
    tools: ["Research", "Photography", "Prototyping"],
    image: hardwareStudy,
    imageWidth: 1408,
    imageHeight: 1024,
    alt: "Technical materials and a compact circuit board",
    position: "object-left",
  },
  {
    title: "About Sophie",
    category: "Computer science student",
    year: "Hello",
    description:
      "I like finding the human detail inside technical problems. I build thoughtful software, learn by making, and keep a camera nearby.",
    tools: ["Software engineering", "Product thinking", "Curiosity"],
    image: labCorridor,
    imageWidth: 1024,
    imageHeight: 1536,
    alt: "Light and geometry in a modern computer lab",
    position: "object-center",
  },
];

function BoardCard({ item, index }: { item: BoardItem; index: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="group relative mb-3 h-auto w-full break-inside-avoid overflow-hidden rounded-[4px] p-0 shadow-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:mb-4"
          aria-label={`Open ${item.title}`}
        >
          <img
            src={item.image}
            alt={item.alt}
            width={item.imageWidth}
            height={item.imageHeight}
            loading={index === 0 ? "eager" : "lazy"}
            className={`block h-auto w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025] group-focus-visible:scale-[1.025] ${item.position ?? "object-center"}`}
          />
          <span className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/15 group-focus-visible:bg-foreground/15" />
          <span className="absolute bottom-3 right-3 grid size-9 translate-y-2 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto border-border bg-background p-0 sm:rounded-[6px]">
        <div className="grid md:grid-cols-[1.15fr_0.85fr]">
          <img
            src={item.image}
            alt=""
            width={item.imageWidth}
            height={item.imageHeight}
            className={`h-72 w-full object-cover md:h-full md:min-h-[620px] ${item.position ?? "object-center"}`}
          />
          <div className="flex min-h-[360px] flex-col p-7 sm:p-10">
            <p className="font-sans text-[10px] uppercase text-muted-foreground">{item.category} · {item.year}</p>
            <DialogTitle className="mt-8 font-serif text-5xl font-normal leading-[0.95] sm:text-6xl">
              {item.title}
            </DialogTitle>
            <DialogDescription className="mt-7 font-serif text-xl leading-relaxed text-foreground/75">
              {item.description}
            </DialogDescription>
            <ul className="mt-8 border-t border-border pt-5 font-sans text-xs text-muted-foreground">
              {item.tools.map((tool) => (
                <li key={tool} className="border-b border-border py-3">{tool}</li>
              ))}
            </ul>
            <div className="mt-auto flex items-center gap-3 pt-10">
              <Button asChild variant="outline" size="sm" className="rounded-full shadow-none">
                <a href="https://github.com/" target="_blank" rel="noreferrer">
                  <Github aria-hidden="true" /> View GitHub
                </a>
              </Button>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <a href="mailto:hello@example.com">
                  <Mail aria-hidden="true" /> Contact
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background px-3 pb-10 text-foreground sm:px-5 lg:px-7">
      <header className="flex h-20 items-center justify-between">
        <a href="/" className="font-serif text-2xl leading-none" aria-label="Sophie Li home">
          SL<span className="text-accent-foreground">.</span>
        </a>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="icon" className="rounded-full" title="GitHub">
            <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub profile">
              <Github aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="icon" className="rounded-full" title="Email">
            <a href="mailto:hello@example.com" aria-label="Email Sophie">
              <Mail aria-hidden="true" />
            </a>
          </Button>
        </div>
      </header>

      <h1 className="sr-only">Sophie Li — computer science projects and experience</h1>
      <section aria-label="Portfolio board" className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {boardItems.map((item, index) => (
          <BoardCard key={item.title} item={item} index={index} />
        ))}
      </section>

      <footer className="flex items-end justify-between border-t border-border pb-2 pt-8">
        <p className="font-serif text-2xl">Sophie Li</p>
        <p className="font-sans text-[10px] uppercase text-muted-foreground">CS · 2026</p>
      </footer>
    </main>
  );
}