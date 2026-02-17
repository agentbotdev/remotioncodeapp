// Render script for the N8nChatwootEpic video (30s cinematic)
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
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, 'n8n-chatwoot-epic.mp4');

  console.log('Bundling...');
  const bundled = await bundle({
    entryPoint: path.join(__dirname, 'src', 'index.js'),
    webpackOverride: (config) => config,
  });
  console.log('Bundle OK.');

  const chromiumOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  };

  console.log('Loading composition...');
  const composition = await selectComposition({
    serveUrl: bundled,
    id: 'N8nChatwootEpic',
    inputProps: {},
    chromiumOptions,
    browserExecutable: CHROME_PATH,
    timeoutInMilliseconds: 60000,
  });

  console.log(`${composition.width}x${composition.height} @ ${composition.fps}fps, ${composition.durationInFrames} frames (${composition.durationInFrames / composition.fps}s)`);

  console.log('Rendering...');
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {},
    chromiumOptions,
    browserExecutable: CHROME_PATH,
    timeoutInMilliseconds: 300000,
    onBrowserLog: () => {},
    logLevel: 'error',
    onProgress: ({ renderedFrames }) => {
      const pct = Math.round((renderedFrames / composition.durationInFrames) * 100);
      if (renderedFrames % 30 === 0 || renderedFrames === composition.durationInFrames) {
        process.stdout.write(`\rProgress: ${pct}% (${renderedFrames}/${composition.durationInFrames})`);
      }
    },
  });

  const stats = fs.statSync(outputPath);
  console.log(`\nDone: ${outputPath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
}

main().catch((err) => { console.error('FAIL:', err); process.exit(1); });
