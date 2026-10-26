const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  if (!fs.existsSync(src)) return;
  const exists = fs.existsSync(dest);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

const standaloneDir = path.join(process.cwd(), '.next', 'standalone');
if (fs.existsSync(standaloneDir)) {
  console.log('[postbuild] Found .next/standalone! Copying public folder and static assets...');
  
  // 1. Copy public folder to .next/standalone/public
  const publicSrc = path.join(process.cwd(), 'public');
  const publicDest = path.join(standaloneDir, 'public');
  if (fs.existsSync(publicSrc)) {
    copyRecursiveSync(publicSrc, publicDest);
    console.log('[postbuild] Copied public/ -> .next/standalone/public/');
  }

  // 2. Copy .next/static to .next/standalone/.next/static
  const staticSrc = path.join(process.cwd(), '.next', 'static');
  const staticDest = path.join(standaloneDir, '.next', 'static');
  if (fs.existsSync(staticSrc)) {
    copyRecursiveSync(staticSrc, staticDest);
    console.log('[postbuild] Copied .next/static/ -> .next/standalone/.next/static/');
  }

  console.log('[postbuild] Assets successfully bundled into standalone build.');
} else {
  console.log('[postbuild] Standalone directory not present (standard build).');
}
