import sharp from 'sharp';
import { stat } from 'node:fs/promises';

// Preserve source artwork; create reproducible delivery assets only.
const sources = ['lunar-stage1-bg', 'lunar-observatory', 'lunar-surface-destination', 'lunar-hero-bg', 'lunar-gemini-hero'];
for (const name of sources) {
  for (const width of [960, 1920]) {
    const output = `public/${name}-${width}.webp`;
    await sharp(`public/${name}.png`).resize({ width, withoutEnlargement: true }).webp({ quality: 88 }).toFile(output);
    console.log(`${output}: ${(await stat(output)).size} bytes`);
  }
}
