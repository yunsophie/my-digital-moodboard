import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

// Serve exactly the Pages artifact, including its repository subpath. Missing
// files return 404 rather than an SPA fallback that could hide broken assets.
const root = resolve("dist/client");
const base = `/${(process.env.GITHUB_PAGES_BASE_PATH ?? "/my-digital-moodboard").replace(/^\/+|\/+$/g, "")}`;
const prefix = base === "/" ? "/" : `${base}/`;
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (base !== "/" && pathname === base) {
      response.writeHead(308, { Location: prefix }).end();
      return;
    }
    if (!pathname.startsWith(prefix)) {
      response.writeHead(404).end();
      return;
    }
    const relativePath = pathname.slice(prefix.length);
    const file = resolve(root, relativePath || "index.html");
    if (!file.startsWith(`${root}${sep}`)) {
      response.writeHead(404).end();
      return;
    }
    const contents = await readFile(file);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(file)] ?? "application/octet-stream",
    });
    response.end(request.method === "HEAD" ? undefined : contents);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4173, "127.0.0.1", () => {
  console.log(`Pages artifact available at http://127.0.0.1:4173${prefix}`);
});
