const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.resolve(__dirname, '..', 'public', 'works_images');
const outputDir = inputDir; // write next to originals

const sizes = [320, 640, 1024, 2048];

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;
  const base = path.basename(file, ext);
  const inputPath = path.join(inputDir, file);
  try {
    const img = sharp(inputPath);
    const meta = await img.metadata();
    for (const w of sizes) {
      if (meta.width && meta.width < w) continue;
      const webpOut = path.join(outputDir, `${base}-${w}.webp`);
      const avifOut = path.join(outputDir, `${base}-${w}.avif`);
      await img.resize(w).webp({ quality: 75 }).toFile(webpOut);
      await img.resize(w).avif({ quality: 60 }).toFile(avifOut);
      console.log(`Created ${webpOut} and ${avifOut}`);
    }
    // also create a responsibly sized webp at original width if not present
    if (meta.width) {
      const webpOrig = path.join(outputDir, `${base}-${meta.width}.webp`);
      if (!fs.existsSync(webpOrig)) {
        await img.webp({ quality: 75 }).toFile(webpOrig);
        console.log(`Created ${webpOrig}`);
      }
    }
  } catch (err) {
    console.error(`Failed processing ${file}:`, err.message);
  }
}

async function run() {
  const files = fs.readdirSync(inputDir);
  for (const f of files) {
    await processFile(f);
  }
  console.log('Image conversion completed.');
}

run().catch((e) => { console.error(e); process.exit(1); });
