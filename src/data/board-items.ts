/** Curated portfolio cards shared by the home route and content checks. */
import { imageAssets } from "@/data/image-assets.generated";
import type { ResponsiveImageAsset } from "@/lib/responsive-image";

// Add portfolio pins here using generated imageAssets. The image catalog keeps
// encoding details separate from content; tests cover every entry automatically.
export type Folder = "Projects" | "Experience" | "About";

export type BoardItem = {
  title: string;
  folder: Folder;
  category: string;
  year: string;
  description: string;
  tools: string[];
  image: ResponsiveImageAsset;
  alt: string;
  crop?: string;
  ratio?: string;
  sortYear?: number;
  link?: { url: string; label: string };
  extraLink?: { url: string; label: string };
  extraImage?: { image: ResponsiveImageAsset; alt: string };
};

export const boardItems: readonly BoardItem[] = [
  {
    title: "all about me !",
    folder: "About",
    category: "CS @ University of Washington",
    year: "Class of 2028",
    description:
      "Hello, I'm Sophie ! I'm a computer science student at the University of Washington, and I love bringing my technical and creative interests together. I've worked on teaching robots to learn from video, mapping snow with satellite imagery, and building distributed systems that hold up through failures. I also make room for side projects inspired by how I study and the images I save. Pinterest was my first social media platform in early middle school, so a moodboard felt like home for my portfolio ! Outside of coding and research, you'll find me reading, running, playing piano, or cheering for the Montreal Canadiens.",
    tools: ["Machine learning", "Distributed systems", "Research"],
    image: imageAssets.aboutSophie,
    alt: "Sophie sitting on a bench next to a Milky mascot statue in Japan",
    crop: "object-top",
    ratio: "aspect-[4/5]",
  },
  {
    title: "distributed key-value store !",
    folder: "Projects",
    category: "Distributed systems",
    year: "2026",
    description:
      "For CSE 452, I built a Java key-value store to keep data consistent through unreliable networks and server failures. I started with asynchronous RPCs, timeout retries, sequence tracking, and request deduplication for exactly-once execution. Then I added primary–backup replication with heartbeats, automatic failover, and acknowledged state transfer, followed by Multi-Paxos with majority quorums, leader election, replica catch-up, and log garbage collection. I sharded storage across Paxos groups with configuration-aware routing, deterministic load balancing, and shard migration that preserves deduplication state. For cross-shard reads, writes, and swaps, I implemented two-phase commit with key-level locks, configuration checks, and commit/abort retries. I debugged the protocols with JUnit and model-checking suites covering message loss, duplication, network partitions, concurrent requests, and safety/liveness violations.",
    tools: ["Java", "Paxos", "Two-phase commit"],
    image: imageAssets.editorialKvStore,
    alt: "Floating frosted geometric clusters connected by translucent bridges",
  },
  {
    title: "olmo-snow !",
    folder: "Experience",
    category: "UW Civil & Environmental Engineering",
    year: "Jan — Jun 2026",
    sortYear: 2026.1,
    description:
      "As an undergraduate researcher with Prof. Nicoleta Cristea, I explored how far a small set of labels could take snow-cover mapping. I trained a scikit-learn logistic-regression classifier on 128-dimensional embeddings from OlmoEarth's frozen 300M-parameter vision transformer, reaching 0.756 weighted F1 on 264 held-out points with only 20 training labels. For the Tuolumne River basin, I paired Sentinel-1 SAR and Sentinel-2 imagery with 10 LiDAR surveys. Using Python, NumPy, Rasterio, rslearn, and multiprocessing, I generated 723 labeled training windows with nodata filtering and deterministic train/validation/test splits. I also built Rasterio, PyProj, and Shapely tools for coordinate conversion, flight-date extraction, and GeoJSON export, producing 600 balanced point labels and polygon annotations. I validated predictions across 1.64 million pixels in 100,000-pixel batches against three LiDAR surveys, reporting F1, IoU, precision, recall, and confusion matrices. For repeatable fine-tuning, I configured PyTorch Lightning and rslearn through YAML, staged encoder freezing, learning-rate scheduling, checkpoint selection, and Weights & Biases tracking. I shared the work with about 20 researchers at a symposium !",
    tools: ["Python", "scikit-learn", "geopandas", "AWS"],
    image: imageAssets.olmoSymposium,
    alt: "Sophie presenting her snow cover research poster at a symposium",
  },
  {
    title: "333gle search engine !",
    folder: "Projects",
    category: "Systems programming",
    year: "CSE 333",
    description:
      "Building my own search engine meant getting into the details of what happens between a browser and a server. For CSE 333, I built a C++17 HTTP engine that serves static files and ranked search results over IPv4/IPv6 POSIX TCP sockets. I coordinated eight worker threads with mutexes, condition variables, a task queue, and graceful shutdown. I tested HTTP parsing and socket I/O with back-to-back and fragmented requests, including keep-alive and connection-close behavior. For file serving, I added path traversal protection, URI decoding, HTML escaping, MIME detection for 7+ file types, and binary-safe reads. I tested the thread pool with 10 workers processing 300 queued tasks and used GoogleTest to check networking, parsing, file I/O, URL handling, and security.",
    tools: ["C++", "POSIX TCP", "IPv4/IPv6", "Unix", "pthreads"],
    image: imageAssets.editorialHttpServer,
    alt: "Frosted acrylic panels with glowing circuit traces",
  },
  {
    title: "virtual vla !",
    folder: "Experience",
    category: "Ai2 + UW RAIVN Lab",
    year: "Mar — Jun 2026",
    sortYear: 2026.3,
    description:
      "At Ai2 + UW's RAIVN Lab, I worked on a robot learning system that represents vision, actions, and proprioception (a robot's sense of its own position) in a shared latent space. Our goal was to learn from unlabeled video across different robots. I added temporal timestep conditioning to the observation, proprioception, and action encoders using sinusoidal embeddings and modality-specific MLPs, so the model could account for variable frame gaps. In PyTorch, I ran 40+ controlled experiments varying learning rates, KL divergence coefficients, loss weights, and flow-matching noise schedules. I tracked the runs in Weights & Biases and reduced validation loss by 11.3% relative to baseline.",
    tools: ["PyTorch", "Weights & Biases", "Robot learning"],
    image: imageAssets.vlaRobotArm,
    alt: "A robotic arm at a café counter",
    crop: "object-top",
    ratio: "aspect-[3/4]",
  },
  {
    title: "i2 teaching assistant !",
    folder: "Experience",
    category: "Interactive Intelligence",
    year: "Oct 2025 — Jun 2026",
    sortYear: 2025.8,
    description:
      "As an Interactive Intelligence TA, I mentored about 10 students exploring machine learning, deep learning, computer vision, reinforcement learning, natural language processing, and computational neuroscience. I helped them work through seven projects, from MNIST classifiers and ConvNets to fine-tuning Hugging Face models. In our weekly sessions, we asked questions and worked through the ideas behind the code together !",
    tools: [
      "Machine learning",
      "Deep learning",
      "Computer vision",
      "Reinforcement learning",
      "Natural language processing",
      "Computer ethics",
      "Mentorship",
      "HuggingFace",
    ],
    image: imageAssets.editorialI2Ta,
    alt: "A glass lattice manifold with glowing nodes",
    ratio: "aspect-[3/4]",
  },
  {
    title: "huskybids !",
    folder: "Experience",
    category: "Husky Coding Project",
    year: "Oct 2024 — May 2025",
    sortYear: 2024.8,
    description:
      "I helped build a React and JavaScript web app where UW students could follow live sports and take part in a betting system. On a six-person team, I contributed to the frontend from design through deployment, using standups, project reviews, and Git version control to coordinate our work. We wrapped up by presenting the app to industry professionals at the HCP showcase !",
    tools: ["React.js", "JavaScript", "Teamwork"],
    image: imageAssets.huskybidsPresentation,
    alt: "Sophie presenting HuskyBids at the HCP showcase",
    ratio: "aspect-[3/2]",
    extraImage: {
      image: imageAssets.huskybidsPoster,
      alt: "The HuskyBids team presentation poster",
    },
  },
  {
    title: "sustAIn !",
    folder: "Projects",
    category: "Hackathon",
    year: "DubHacks '24",
    description:
      "For DubHacks '24, I worked on a sustainability tool to help shoppers compare products before buying. We used Python, AWS Bedrock, and APIs to pull product data from several online platforms and compare sustainability information in real time, with Figma for the design. The challenge was making sense of incomplete or inconsistent product data and standardizing records across platforms. I learned about sustainability metrics, data integration, and developing machine learning models as we worked through it. Next, I'd love to improve rating accuracy, support more retailers, and let shoppers contribute feedback on the ratings !",
    tools: ["Python", "AWS Bedrock", "Amazon Web Services", "APIs", "Figma"],
    image: imageAssets.dubhacksSwag,
    alt: "DubHacks '24 swag: a cap, pouches, stickers, and tumblers",
    crop: "object-top",
    link: { url: "https://www.figma.com", label: "Try it out" },
  },
  {
    title: "study ducky !",
    folder: "Projects",
    category: "Hackathon",
    year: "DubHacks '25",
    description:
      "For DubHacks '25, I built a study companion inspired by rubber duck debugging: you teach your Ducky a topic, and it asks questions to help you think it through ! I built the full stack with React, Tailwind CSS, and Node.js/Express, with REST APIs for context-aware tutoring and conversation analysis. I used conversation history in Gemini prompts to adapt question difficulty and probe misconceptions. To analyze each session, I requested schema-constrained JSON responses to estimate topic understanding, identify knowledge gaps, and generate personalized study recommendations. In Firestore, I kept messages in timestamp order and used incremental batch writes to save new messages and update session metadata in one atomic commit.",
    tools: ["React.js", "Node.js", "Express", "Firebase", "Gemini API", "Tailwind"],
    image: imageAssets.studyDucky,
    alt: "A round yellow cartoon duck standing on a blue tiled floor",
    ratio: "aspect-[2/3]",
    link: { url: "https://yblii.github.io", label: "Try it out" },
    extraLink: { url: "https://devpost.com/software/study-ducky-yuape9", label: "Devpost" },
  },
  {
    title: "visual discovery !",
    folder: "Projects",
    category: "Personal project",
    year: "2026",
    description:
      "I wanted a way to search for interiors when I knew what I liked but couldn't name the style. For Visual Discovery, I designed an interface where you choose images, explore descriptive vocabulary, and refine results around your taste. I wrote the MVP specification, from user journeys and feature scope to success criteria, security, and cost limits. For the retrieval pipeline, I planned OpenCLIP embeddings, MMR reranking to balance relevance and variety, and Cloudflare R2 storage, with React for the interface and Python, FastAPI, and PyTorch for the backend.",
    tools: ["React", "JavaScript", "CLIP", "Cloudflare R2"],
    image: imageAssets.pinkHardwareGrid,
    alt: "A soft pink grid of hardware pieces",
  },
];
