// Standalone render script for the N8nChatwootDemo video
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = '/root/.cache/ms-playwright/chromium_headless_shell-1194/chrome-linux/headless_shell';

async function main() {
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'n8n-chatwoot-ai-demo.mp4');

  console.log('Bundling project...');
  const bundled = await bundle({
    entryPoint: path.join(__dirname, 'src', 'index.js'),
    webpackOverride: (config) => config,
  });
  console.log('Bundle complete.');

  console.log('Loading composition...');
  const inputProps = {
    accentColor: '#ff6d5a',
    chatwootColor: '#1F93FF',
    aiColor: '#8b5cf6',
    n8nColor: '#ff6d5a',
  };

  const chromiumOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
    ],
  };

  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'N8nChatwootDemo',
    inputProps,
    chromiumOptions,
    browserExecutable: CHROME_PATH,
    timeoutInMilliseconds: 60000,
  });

  console.log(`Composition: ${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames`);

  console.log('Rendering video...');
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
    chromiumOptions,
    browserExecutable: CHROME_PATH,
    timeoutInMilliseconds: 120000,
    onBrowserLog: () => {},
    logLevel: 'error',
    onProgress: ({ renderedFrames }) => {
      const pct = Math.round((renderedFrames / composition.durationInFrames) * 100);
      process.stdout.write(`\rProgress: ${pct}% (${renderedFrames}/${composition.durationInFrames} frames)`);
    },
  });

  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`\nVideo rendered: ${outputPath} (${sizeMB} MB)`);
}

main().catch((err) => {
  console.error('Render failed:', err);
  process.exit(1);
});
