// AI Video Generator - Gemini Integration
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE');

/**
 * Analyze user prompt and generate video parameters
 * @param {string} userPrompt - User's description of desired video
 * @returns {Promise<Object>} Video configuration object
 */
export async function analyzePromptWithAI(userPrompt) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const systemPrompt = `You are an expert motion graphics designer. Analyze the user's video request and return a JSON configuration for a Remotion video.

Available compositions and their purposes:
- KineticTitle: Bold animated text, perfect for motivational/inspiring messages
- GradientText: Smooth gradient text animations
- NeonText: Glowing neon-style text
- GlassCard: Glassmorphism card with text
- DataViz: Animated charts and data visualization
- ParticleNetwork: Tech-style particle background
- IsometricCard: 3D isometric card design
- BentoGrid: Grid layout with multiple elements
- ParallaxLayers: Layered parallax effect

Return ONLY a valid JSON object with this structure:
{
  "composition": "string (one of the available compositions)",
  "text": "string (main text to display, keep it short and impactful)",
  "subtitle": "string (optional secondary text)",
  "primaryColor": "string (hex color)",
  "secondaryColor": "string (hex color)",
  "backgroundColor": "string (hex color)",
  "style": "string (animation style: smooth, energetic, minimal, glitch, futuristic)",
  "duration": number (duration in seconds, typically 5-15),
  "fps": 30
}

Analyze the user's request and choose the best composition and styling.`;

        const prompt = `${systemPrompt}\n\nUser request: "${userPrompt}"\n\nGenerate the JSON configuration:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON in AI response');
        }

        const config = JSON.parse(jsonMatch[0]);

        // Validate required fields
        if (!config.composition || !config.text || !config.primaryColor) {
            throw new Error('Invalid configuration from AI');
        }

        // Add default values
        return {
            composition: config.composition,
            text: config.text || 'AMAZING',
            subtitle: config.subtitle || '',
            primaryColor: config.primaryColor || '#00ff88',
            secondaryColor: config.secondaryColor || '#667eea',
            backgroundColor: config.backgroundColor || '#000000',
            style: config.style || 'energetic',
            duration: config.duration || 10,
            fps: config.fps || 30,
        };
    } catch (error) {
        console.error('AI Analysis Error:', error);

        // Fallback: simple keyword-based system
        return fallbackAnalysis(userPrompt);
    }
}

/**
 * Fallback analysis when AI fails
 * Simple keyword matching
 */
function fallbackAnalysis(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    let composition = 'KineticTitle';
    let primaryColor = '#00ff88';
    let style = 'energetic';

    // Detect composition based on keywords
    if (lowerPrompt.includes('data') || lowerPrompt.includes('chart') || lowerPrompt.includes('stats')) {
        composition = 'DataViz';
    } else if (lowerPrompt.includes('neon') || lowerPrompt.includes('glow')) {
        composition = 'NeonText';
        primaryColor = '#00d4ff';
    } else if (lowerPrompt.includes('glass') || lowerPrompt.includes('blur')) {
        composition = 'GlassCard';
    } else if (lowerPrompt.includes('particle') || lowerPrompt.includes('tech') || lowerPrompt.includes('futur')) {
        composition = 'ParticleNetwork';
        style = 'futuristic';
    } else if (lowerPrompt.includes('gradient')) {
        composition = 'GradientText';
    }

    // Detect colors
    const colorMap = {
        'blue': '#3b82f6',
        'azul': '#3b82f6',
        'red': '#ef4444',
        'rojo': '#ef4444',
        'green': '#22c55e',
        'verde': '#22c55e',
        'purple': '#a855f7',
        'morado': '#a855f7',
        'violet': '#a855f7',
        'orange': '#f97316',
        'naranja': '#f97316',
        'yellow': '#eab308',
        'amarillo': '#eab308',
        'pink': '#ec4899',
        'rosa': '#ec4899',
        'cyan': '#06b6d4',
    };

    for (const [keyword, color] of Object.entries(colorMap)) {
        if (lowerPrompt.includes(keyword)) {
            primaryColor = color;
            break;
        }
    }

    // Extract main text (try to find quoted text or capitalized words)
    let text = 'FOCUS';
    const quotedMatch = prompt.match(/"([^"]+)"|'([^']+)'/);
    if (quotedMatch) {
        text = (quotedMatch[1] || quotedMatch[2]).toUpperCase();
    } else {
        const capsWords = prompt.match(/\b[A-Z]{2,}\b/g);
        if (capsWords && capsWords.length > 0) {
            text = capsWords[0];
        }
    }

    return {
        composition,
        text: text.substring(0, 30), // Limit length
        subtitle: '',
        primaryColor,
        secondaryColor: '#667eea',
        backgroundColor: '#000000',
        style,
        duration: 10,
        fps: 30,
    };
}

/**
 * Convert AI config to Remotion input props
 */
export function configToRemotionProps(config) {
    return {
        text: config.text,
        subtitle: config.subtitle,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
        backgroundColor: config.backgroundColor,
        animationStyle: config.style,
        // Add any other props needed by your compositions
    };
}
