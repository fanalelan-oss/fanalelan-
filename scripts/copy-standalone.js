const fs = require('fs');
const path = require('path');

try {
  const standaloneDir = path.join(process.cwd(), '.next', 'standalone');
  if (fs.existsSync(standaloneDir)) {
    console.log('[postbuild] Found .next/standalone! Copying public folder and static assets...');
    
    // 1. Copy public folder to .next/standalone/public
    const publicSrc = path.join(process.cwd(), 'public');
    const publicDest = path.join(standaloneDir, 'public');
    if (fs.existsSync(publicSrc)) {
      fs.cpSync(publicSrc, publicDest, { recursive: true, force: true });
      console.log('[postbuild] Copied public/ -> .next/standalone/public/');
    }

    // 2. Copy .next/static to .next/standalone/.next/static
    const staticSrc = path.join(process.cwd(), '.next', 'static');
    const staticDest = path.join(standaloneDir, '.next', 'static');
    if (fs.existsSync(staticSrc)) {
      fs.cpSync(staticSrc, staticDest, { recursive: true, force: true });
      console.log('[postbuild] Copied .next/static/ -> .next/standalone/.next/static/');
    }

    console.log('[postbuild] Assets successfully bundled into standalone build.');
  } else {
    console.log('[postbuild] Standalone directory not present (standard build).');
  }
} catch (err) {
  console.warn('[postbuild] Non-fatal warning while copying standalone assets:', err.message);
}
