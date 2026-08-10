const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.resolve(__dirname, '..', 'public', 'works_images');

async function compressOriginals() {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
    const filePath = path.join(dir, f);
    const stat = fs.statSync(filePath);
    if (stat.size > 300 * 1024) { // Files over 300KB
      console.log(`Compressing ${f} (original size: ${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);
      const tempPath = path.join(dir, `temp_${f}`);
      
      let pipeline = sharp(filePath).resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true });
      if (ext === '.png') {
        await pipeline.png({ quality: 80, compressionLevel: 8 }).toFile(tempPath);
      } else {
        await pipeline.jpeg({ quality: 80, progressive: true }).toFile(tempPath);
      }

      const newStat = fs.statSync(tempPath);
      if (newStat.size < stat.size) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        console.log(`Successfully compressed ${f} down to ${(newStat.size / 1024).toFixed(1)} KB!`);
      } else {
        fs.unlinkSync(tempPath);
      }
    }
  }
}

compressOriginals().catch(console.error);
