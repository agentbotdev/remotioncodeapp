// server.js - Production API Server for Motion Graphics Rendering
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { presets, presetNames } from './presets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/outputs', express.static(path.join(__dirname, 'output')));

// Queue system
const renderQueue = [];
let isProcessing = false;
let currentRender = null;
let bundleCache = null;

// ============================================
// ROOT DOCUMENTATION
// ============================================
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto; background: #0a0a0a; color: #fff; min-height: 100vh;">
            <h1 style="color: #00ff88; border-left: 5px solid #00ff88; padding-left: 20px;">🎬 Motion Graphics API</h1>
            <p>El servidor de renderizado está <b>Online</b> y listo para procesar videos.</p>
            
            <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border: 1px solid #333;">
                <h3 style="margin-top: 0;">📡 Endpoints de la API:</h3>
                <ul style="list-style: none; padding-left: 0;">
                    <li style="margin-bottom: 15px;">
                        <b style="color: #6c5ce7;">GET /health</b><br/>
                        <span style="color: #888;">Verificar estado del servidor y cola de renderizado.</span>
                    </li>
                    <li style="margin-bottom: 15px;">
                        <b style="color: #6c5ce7;">GET /presets</b><br/>
                        <span style="color: #888;">Listar todos los diseños y composiciones disponibles.</span>
                    </li>
                    <li style="margin-bottom: 15px;">
                        <b style="color: #6c5ce7;">POST /generate</b><br/>
                        <span style="color: #888;">Crear un nuevo video pasándole un preset o composición.</span>
                    </li>
                </ul>
            </div>
            
            <p style="margin-top: 40px; color: #666; font-size: 0.9em;">
                Para usar la interfaz visual, visita: 
                <a href="https://videolab.limitlessmediagrowth.com" style="color: #00ff88; text-decoration: none;">videolab.limitlessmediagrowth.com</a>
            </p>
        </div>
    `);
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        queue: {
            pending: renderQueue.length,
            processing: isProcessing,
            current: currentRender,
        },
        timestamp: new Date().toISOString(),
    });
});

// ============================================
// LIST PRESETS
// ============================================
app.get('/presets', (req, res) => {
    const groupedPresets = {};

    Object.entries(presets).forEach(([name, config]) => {
        if (!groupedPresets[config.composition]) {
            groupedPresets[config.composition] = [];
        }
        groupedPresets[config.composition].push({
            name,
            props: config.props,
        });
    });

    res.json({
        total: presetNames.length,
        presets: groupedPresets,
        list: presetNames,
    });
});

// ============================================
// LIST OUTPUTS
// ============================================
app.get('/outputs', (req, res) => {
    const outputDir = path.join(__dirname, 'output');

    if (!fs.existsSync(outputDir)) {
        return res.json({ files: [] });
    }

    const files = fs.readdirSync(outputDir)
        .filter(file => file.endsWith('.mp4'))
        .map(file => {
            const stats = fs.statSync(path.join(outputDir, file));
            return {
                name: file,
                size: stats.size,
                sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
                created: stats.birthtime,
                url: `/outputs/${file}`,
            };
        })
        .sort((a, b) => b.created - a.created);

    res.json({
        total: files.length,
        files,
    });
});

// ============================================
// DOWNLOAD VIDEO
// ============================================
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'output', filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath);
});

// ============================================
// GENERATE VIDEO
// ============================================
app.post('/generate', async (req, res) => {
    const { preset, composition, outputName, props, aiPrompt } = req.body;

    // AI Prompt Mode
    if (aiPrompt) {
        try {
            console.log('🤖 AI Prompt received:', aiPrompt);

            // Import AI generator
            const { analyzePromptWithAI, configToRemotionProps } = await import('./ai-generator.js');

            // Analyze prompt with AI
            const aiConfig = await analyzePromptWithAI(aiPrompt);
            console.log('✨ AI Generated Config:', aiConfig);

            // Create job with AI config
            const jobId = `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const job = {
                id: jobId,
                status: 'queued',
                progress: 0,
                composition: aiConfig.composition,
                inputProps: aiConfig, // AI config contains all props
                outputFilename: outputName ? `${outputName}.mp4` : `ai-video-${Date.now()}.mp4`,
                createdAt: new Date().toISOString(),
                aiGenerated: true,
                originalPrompt: aiPrompt,
            };

            renderQueue.push(job);

            res.json({
                success: true,
                jobId: job.id,
                message: 'AI video generation started',
                aiConfig,
                queuePosition: renderQueue.length,
            });

            if (!isProcessing) {
                processQueue();
            }

            return;
        } catch (error) {
            console.error('AI Generation Error:', error);
            return res.status(500).json({
                error: 'AI generation failed',
                message: error.message,
            });
        }
    }

    // Validation for non-AI mode
    if (!preset && !composition) {
        return res.status(400).json({
            error: 'Missing required parameter',
            message: 'You must provide either "preset", "composition", or "aiPrompt"',
        });
    }

    if (preset && !presets[preset]) {
        return res.status(400).json({
            error: 'Invalid preset',
            message: `Preset "${preset}" does not exist`,
            availablePresets: presetNames,
        });
    }

    // Create job
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const presetConfig = preset ? presets[preset] : null;
    const compositionId = composition || presetConfig.composition;
    const inputProps = props || presetConfig?.props || {};
    const outputFilename = outputName
        ? `${outputName}.mp4`
        : `${preset || composition}-${Date.now()}.mp4`;

    const job = {
        id: jobId,
        preset,
        composition: compositionId,
        outputFilename,
        inputProps,
        status: 'queued',
        createdAt: new Date().toISOString(),
        progress: 0,
    };

    renderQueue.push(job);

    // Start processing if not already processing
    if (!isProcessing) {
        processQueue();
    }

    res.json({
        jobId,
        status: 'queued',
        position: renderQueue.length,
        message: 'Video generation started',
        checkStatus: `/status/${jobId}`,
    });
});

// ============================================
// JOB STATUS
// ============================================
app.get('/status/:jobId', (req, res) => {
    const jobId = req.params.jobId;

    // Check if it's the current job
    if (currentRender && currentRender.id === jobId) {
        return res.json(currentRender);
    }

    // Check if it's in queue
    const queuedJob = renderQueue.find(j => j.id === jobId);
    if (queuedJob) {
        const position = renderQueue.indexOf(queuedJob) + 1;
        return res.json({
            ...queuedJob,
            position,
        });
    }

    // Job not found
    res.status(404).json({
        error: 'Job not found',
        message: `Job ${jobId} does not exist or has been completed`,
    });
});

// ============================================
// QUEUE PROCESSOR
// ============================================
async function processQueue() {
    if (isProcessing || renderQueue.length === 0) {
        return;
    }

    isProcessing = true;
    const job = renderQueue.shift();
    currentRender = { ...job, status: 'processing' };

    try {
        console.log(`\n🎬 Processing job: ${job.id}`);
        console.log(`   Composition: ${job.composition}`);
        console.log(`   Output: ${job.outputFilename}`);

        // Ensure output directory exists
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, job.outputFilename);

        // Bundle (use cache if available)
        if (!bundleCache) {
            console.log('   📦 Bundling project (first render)...');
            currentRender.status = 'bundling';
            bundleCache = await bundle({
                entryPoint: path.join(__dirname, 'src', 'index.js'),
                webpackOverride: (config) => config,
            });
            console.log('   ✅ Bundle cached');
        }

        // Get composition
        currentRender.status = 'loading-metadata';
        const composition = await selectComposition({
            serveUrl: bundleCache,
            id: job.composition,
            inputProps: job.inputProps,
            chromiumOptions: {
                gl: 'angle',
                headless: true,
            },
        });

        console.log(`   ✅ Composition: ${composition.width}x${composition.height} @ ${composition.fps}fps`);

        // Render
        currentRender.status = 'rendering';
        await renderMedia({
            composition,
            serveUrl: bundleCache,
            codec: 'h264',
            outputLocation: outputPath,
            inputProps: job.inputProps,
            chromiumOptions: {
                gl: 'angle',
                headless: true,
            },
            onProgress: ({ renderedFrames, encodedFrames, renderedDoneIn, encodedDoneIn }) => {
                const totalFrames = composition.durationInFrames;
                currentRender.progress = Math.round((renderedFrames / totalFrames) * 100);

                if (renderedDoneIn !== null) {
                    currentRender.status = 'encoding';
                }
            },
        });

        // Get file stats
        const stats = fs.statSync(outputPath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

        currentRender.status = 'completed';
        currentRender.completedAt = new Date().toISOString();
        currentRender.outputFile = job.outputFilename;
        currentRender.fileSize = fileSizeMB;
        currentRender.downloadUrl = `/outputs/${job.outputFilename}`;

        console.log(`   ✅ Video generated: ${job.outputFilename} (${fileSizeMB}MB)`);

    } catch (error) {
        console.error(`   ❌ Error processing job ${job.id}:`, error.message);
        currentRender.status = 'failed';
        currentRender.error = error.message;
    }

    // Move to next job
    setTimeout(() => {
        currentRender = null;
        isProcessing = false;
        processQueue();
    }, 1000);
}

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎬 MOTION GRAPHICS API SERVER
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  🚀 Server running on: http://localhost:${PORT}
  
  📋 Endpoints:
     GET  /health          - Server health check
     GET  /presets         - List all available presets
     GET  /outputs         - List all rendered videos
     POST /generate        - Generate a new video
     GET  /status/:jobId   - Check job status
     GET  /outputs/:file   - Stream video file
     GET  /download/:file  - Download video file
  
  💡 Examples:
     curl http://localhost:${PORT}/presets
     curl -X POST http://localhost:${PORT}/generate -H "Content-Type: application/json" -d '{"preset":"focus"}'
  
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down gracefully...');
    process.exit(0);
});
