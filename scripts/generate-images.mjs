import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";
import sharp from "sharp";

// Only this explicit catalog is generated. Unused masters stay out of the bundle.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sources = JSON.parse(await readFile(resolve(root, "scripts/image-sources.json"), "utf8"));
const output = resolve(root, "src/assets/optimized");
const manifestPath = resolve(output, "manifest.json");
const modulePath = resolve(root, "src/data/image-assets.generated.ts");
const widths = [160, 320, 480, 640, 960];
const quality = 80;
const check = process.argv.includes("--check");
const pilot = process.argv.includes("--pilot");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function encode(source, width, candidateQuality) {
  // Apply EXIF orientation before resizing; Sharp preserves alpha and converts
  // colors to sRGB by default. No enlargement or destructive edits to masters.
  return sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: candidateQuality, effort: 6 })
    .toBuffer({ resolveWithObject: true });
}

if (pilot) {
  const pilotDir = resolve(root, "artifacts/performance/image-pilot");
  await mkdir(pilotDir, { recursive: true });
  const rows = [];
  for (const id of ["aboutSophie", "dubhacksSwag", "olmoSymposium", "studyDucky"]) {
    const source = resolve(root, "src/assets", sources[id]);
    const metadata = await sharp(source).metadata();
    const width = Math.min(480, metadata.autoOrient.width);
    // A lossless resized reference makes comparisons use the same pixel size.
    const reference = `${id}-reference.png`;
    await sharp(source).rotate().resize({ width }).png().toFile(resolve(pilotDir, reference));
    const candidates = [];
    for (const q of [75, 80, 85]) {
      const result = await encode(source, width, q);
      const file = `${id}-q${q}.webp`;
      await writeFile(resolve(pilotDir, file), result.data);
      candidates.push({ quality: q, bytes: result.data.length, file });
    }
    rows.push({ id, width, reference, candidates });
  }
  await writeFile(resolve(pilotDir, "comparison.json"), JSON.stringify(rows, null, 2) + "\n");
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

const manifest = check
  ? JSON.parse(await readFile(manifestPath, "utf8"))
  : {
      encoder: { sharp: sharp.versions.sharp, vips: sharp.versions.vips, format: "webp", quality },
      widths,
      images: {},
    };

if (
  check &&
  (manifest.encoder.sharp !== sharp.versions.sharp || manifest.encoder.vips !== sharp.versions.vips)
) {
  throw new Error("Encoder version changed. Regenerate images and review the output.");
}
if (
  check &&
  (manifest.encoder.quality !== quality ||
    manifest.encoder.format !== "webp" ||
    JSON.stringify(manifest.widths) !== JSON.stringify(widths))
) {
  throw new Error("Encoding settings changed. Regenerate images and review the output.");
}
if (!check) await mkdir(output, { recursive: true });

for (const [id, file] of Object.entries(sources)) {
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(id) || basename(file) !== file) {
    throw new Error(`Invalid image catalog entry: ${id}`);
  }
  const source = resolve(root, "src/assets", file);
  const original = await readFile(source);
  const metadata = await sharp(original).metadata();
  const { width, height } = metadata.autoOrient;
  // Include the native width below 960px to avoid missing the final density step.
  const selectedWidths = [...new Set([...widths.filter((w) => w < width), Math.min(width, 960)])];
  if (check) {
    const recorded = manifest.images[id];
    if (!recorded || recorded.source !== file || recorded.sourceSha256 !== sha256(original)) {
      throw new Error(
        `${id}: master changed or missing from manifest. Run npm run images:generate.`,
      );
    }
    if (
      recorded.width !== width ||
      recorded.height !== height ||
      JSON.stringify(recorded.variants.map((v) => v.width)) !== JSON.stringify(selectedWidths)
    ) {
      throw new Error(`${id}: generated dimensions or widths are stale.`);
    }
    for (const variant of recorded.variants) {
      const bytes = await readFile(resolve(output, variant.file));
      const actual = await sharp(bytes).metadata();
      // Decode metadata independently; a manifest typo cannot validate itself.
      if (
        sha256(bytes) !== variant.sha256 ||
        bytes.length !== variant.bytes ||
        actual.width !== variant.width ||
        actual.height !== variant.height ||
        actual.format !== "webp"
      ) {
        throw new Error(`${variant.file}: output does not match the manifest.`);
      }
    }
  } else {
    const variants = [];
    for (const w of selectedWidths) {
      const result = await encode(original, w, quality);
      const filename = `${file.replace(/\.[^.]+$/, "")}-${result.info.width}w.webp`;
      await writeFile(resolve(output, filename), result.data);
      variants.push({
        file: filename,
        width: result.info.width,
        height: result.info.height,
        bytes: result.data.length,
        sha256: sha256(result.data),
      });
    }
    manifest.images[id] = {
      source: file,
      sourceBytes: original.length,
      sourceSha256: sha256(original),
      width,
      height,
      variants,
    };
  }
}

if (JSON.stringify(Object.keys(manifest.images)) !== JSON.stringify(Object.keys(sources))) {
  throw new Error("Catalog and manifest disagree. Regenerate image assets.");
}

// Emit URL imports rather than public paths so both Lovable and Pages work.
const imports = [];
const entries = [];
for (const [id, image] of Object.entries(manifest.images)) {
  const candidates = image.variants.map((v) => {
    const name = `${id}${v.width}`;
    imports.push(`import ${name} from "@/assets/optimized/${v.file}";`);
    return `{ src: ${name}, width: ${v.width}, height: ${v.height}, bytes: ${v.bytes} }`;
  });
  const fallback = image.variants.find((v) => v.width >= 640) ?? image.variants.at(-1);
  const srcSet = image.variants.map((v) => `\${${id}${v.width}} ${v.width}w`).join(", ");
  entries.push(
    `${id}: { id: "${id}", src: ${id}${fallback.width}, srcSet: \`${srcSet}\`, width: ${image.width}, height: ${image.height}, candidates: [${candidates.join(", ")}] }`,
  );
}
const moduleText = await format(
  `// Generated by scripts/generate-images.mjs. Edit the catalog or masters, then regenerate.\n` +
    `// Checked URL imports keep source sets valid under the Pages repository base path.\n` +
    `import type { ResponsiveImageAsset } from "@/lib/responsive-image";\n${imports.join("\n")}\n` +
    `export const imageAssets = { ${entries.join(",\n")} } as const satisfies Record<string, ResponsiveImageAsset>;\n`,
  { parser: "typescript", printWidth: 100 },
);
if (check) {
  if ((await readFile(modulePath, "utf8")) !== moduleText) {
    throw new Error("Generated TypeScript is stale. Run npm run images:generate.");
  }
  console.log(
    `Verified ${Object.keys(sources).length} image families and every encoded candidate.`,
  );
} else {
  const files = new Set(
    Object.values(manifest.images).flatMap((image) => image.variants.map((v) => v.file)),
  );
  // Remove only encoder-owned stale WebP files, never original source assets.
  for (const file of await readdir(output)) {
    if (/^[a-z0-9-]+-\d+w\.webp$/.test(file) && !files.has(file))
      await unlink(resolve(output, file));
  }
  await writeFile(
    manifestPath,
    await format(JSON.stringify(manifest), { parser: "json", printWidth: 100 }),
  );
  await writeFile(modulePath, moduleText);
  console.log(
    `Generated ${files.size} WebP candidates for ${Object.keys(sources).length} image families.`,
  );
}
