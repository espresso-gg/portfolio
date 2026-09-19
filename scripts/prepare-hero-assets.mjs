import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const [masterPath] = process.argv.slice(2);

if (!masterPath) {
  throw new Error(
    "Usage: node scripts/prepare-hero-assets.mjs <clean-master-scene>",
  );
}

const outputDirectory = path.join(process.cwd(), "public", "hero");
await mkdir(outputDirectory, { recursive: true });

await Promise.all([
  sharp(masterPath)
    .resize(2752, 1536, { fit: "fill" })
    .webp({ quality: 96, effort: 6 })
    .toFile(path.join(outputDirectory, "scene-desktop.webp")),
  sharp(masterPath)
    .resize(1920, 1072, { fit: "fill" })
    .webp({ quality: 94, effort: 6 })
    .toFile(path.join(outputDirectory, "scene-mobile.webp")),
]);

console.log(`Prepared high-quality hero scenes in ${outputDirectory}`);
