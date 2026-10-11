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
      "Hello I'm Sophie, a computer science student at the University of Washington. I'm happiest somewhere between research and systems and design. I have worked on teaching robots to learn from video, reading the Earth through satellite imagery, building distributed software that holds up when things go wrong, and many other fun side projects where I let my creativity take control. Outside of work, I am an avid reader, runner, pianist, and a fan of the Montreal Canadiens.",
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
    description: "A distributed key-value store built with Java, Paxos, and two-phase commit.",
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
      "Worked as an undergraduate researcher with Prof. Nicoleta Cristea. I explored how far a tiny amount of labeled data could go. By training a simple logistic-regression head on embeddings from OlmoEarth's frozen 300M-parameter vision transformer, I reached an F1 of 0.84 (0.975 precision) from just 20 labeled points, eliminating the need for costly fine-tuning. I also built a geospatial data pipelines aligning Sentinel-1 SAR, Sentinel-2, and LiDAR imagery over the Tuolumne River basin and finally presented the work to about 20 researchers at a symposium.",
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
      "A concurrent HTTP search engine written in C++ that handles many clients at once, keeps connections alive across requests, serves static files, and returns ranked search results. I built a POSIX thread pool that coordinates up to eight worker threads with mutexes, condition variables, a task queue, and graceful shutdown, and made file serving safe with path traversal protection, URI decoding, HTML escaping, MIME detection, and binary-safe reads.",
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
      "Worked as a undergraduate researcher on a robot learning system that compresses vision, actions, and proprioception into one shared latent space, enabling unlabeled video to stand in as action data across different robots. I added temporal timestep conditioning across the encoders so the model could reason about variable frame gaps, and ran 40+ careful hyperparameter sweeps that cut validation loss 11.3% below baseline.",
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
      "I mentor a group of ~10 students exploring machine learning, deep learning, computer vision, reinforcement learning, natural language processing, and computational neuroscience. Through weekly sessions I've guided and answered questions across ten projects from MNIST classifiers to ConvNets to fine-tuning HuggingFace models.",
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
      "On a team of six, I helped build a full-stack React web app that lets UW students follow live sports with an engaging betting system. Along the way I got a taste of an industry-style workflow by participating in standups, reviews, version control, and finally presented our work to industry professionals at the HCP showcase.",
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
      "A sustainability tool that makes product information accessible. It pulls product data from several online platforms and compares it in real time, so shoppers can see sustainability side by side before they buy. The hardest parts were assessing sustainability when product data was incomplete or inconsistent and standardizing records across different platforms — along the way I learned a lot about sustainability metrics, data integration, and developing machine learning models. Next up: a more accurate model, support for more retailers, and a feedback feature so users can improve the ratings.",
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
      "An AI study companion inspired by rubber duck debugging — except the AI is the student and you're the teacher. You teach your Ducky about any topic while it asks adaptive questions, and afterwards it analyzes the exchange to highlight strengths, misunderstandings, and gaps. I built the full stack with React and Node/Express, writing REST APIs for context-aware tutoring and conversation analysis. Gemini returns schema-constrained JSON to estimate topic understanding and generate personalized study recommendations, and Firestore stores timestamp-ordered messages with batch writes that save new messages and session metadata in a single atomic commit.",
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
      "An interior-design discovery interface that helps people turn a vague aesthetic feeling into words they can search with — by picking images they love, browsing descriptive vocabulary, and refining results visually. I wrote the MVP specification covering user journeys, feature scope, success criteria, and security and cost constraints, and planned CLIP-based image retrieval with MMR reranking and Cloudflare R2 storage.",
    tools: ["React", "JavaScript", "CLIP", "Cloudflare R2"],
    image: imageAssets.pinkHardwareGrid,
    alt: "A soft pink grid of hardware pieces",
  },
];
