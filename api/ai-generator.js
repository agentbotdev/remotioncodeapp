// AI Video Generator - Gemini Integration
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Analyze user prompt and generate video parameters
 * @param {string} userPrompt - User's description of desired video
 * @returns {Promise<Object>} Video configuration object
 */
export async function analyzePromptWithAI(userPrompt) {
    console.log(`\n🤖 Analyzing prompt: "${userPrompt}"`);

    // Lazy initialize to ensure process.env is ready
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'YOUR_API_KEY_HERE') {
        console.warn('⚠️ GEMINI_API_KEY not configured. Using Keyword Fallback.');
        return fallbackAnalysis(userPrompt);
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const systemPrompt = `You are an expert motion graphics designer for a social media agency. 
Analyze the user's video request and return a JSON configuration for a Remotion video.

COMPOSITIONS & PROPS:
1. KineticTitle: Bold, fast-paced animated text. Use for high-energy, motivational messages.
   Props: text (string), accentColor (hex), fontSize (number, 80-120), lineThickness (number, 2-6)
2. GradientText: Smooth reveal with elegant gradients. Use for premium, modern, or sleek vibes.
   Props: text (string), gradientColors (array of 2-3 hex colors), glowIntensity (number, 0-2)
3. NeonText: Glowing neon tube effect. Use for tech, crypto, nightlife, or futuristic vibes.
   Props: text (string), color (hex), subtitle (string), flickerEnabled (boolean)
4. GlassCard: Clean glassmorphism layout. Use for info, stats, or professional branding.
   Props: title (string), subtitle (string), accentColor (hex)
5. DataViz: Animated growth charts. Use for "leveling up", stats, or financial progress.
   Props: title (string), subtitle (string), color (hex), showGrid (boolean)
6. ParticleNetwork: Tech background with connected dots. Use for networking, AI, or futuristic themes.
   Props: title (string), subtitle (string), color (hex), particleCount (number, 50-150)
7. IsometricCard: 3D rotating card. Use for product showcases or premium highlights.
   Props: title (string), subtitle (string), accentColor (hex)
8. BentoGrid: Multiple small panels. Use for features lists or mixed content.
   Props: title (string)
9. ParallaxLayers: Deep layered animation. Use for abstract backgrounds or depth.
   Props: title (string), subtitle (string), accentColor (hex)

RULES:
- Return ONLY valid JSON.
- Be creative with colors based on the "vibe" of the prompt (e.g., "success" -> gold/green, "crypto" -> neon green/blue).
- Choose the composition that BEST fits the user's intent.

JSON STRUCTURE:
{
  "composition": "string",
  "text": "string (main text)",
  "subtitle": "string (optional)",
  "primaryColor": "string (main hex color to use)",
  "secondaryColor": "string (secondary hex color)",
  "style": "string (smooth|energetic|glitch|minimal)",
  "duration": 10,
  "fps": 30
}`;

        const prompt = `${systemPrompt}\n\nUSER REQUEST: "${userPrompt}"\n\nReturn JSON:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON in AI response');
        }

        const config = JSON.parse(jsonMatch[0]);
        console.log('✨ Gemini AI Result:', config.composition, '-', config.text);

        return {
            ...config,
            isAiGenerated: true
        };
    } catch (error) {
        console.error('❌ Gemini Error:', error.message);
        console.log('🔄 Swapping to Keyword Fallback...');
        return fallbackAnalysis(userPrompt);
    }
}

/**
 * Fallback analysis when AI fails
 * Smarter keyword matching
 */
function fallbackAnalysis(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    let composition = 'KineticTitle';
    let primaryColor = '#00ff88';
    let style = 'energetic';

    // 1. Detect composition based on keywords
    if (lowerPrompt.includes('data') || lowerPrompt.includes('chart') || lowerPrompt.includes('stats') || lowerPrompt.includes('crecimiento')) {
        composition = 'DataViz';
    } else if (lowerPrompt.includes('neon') || lowerPrompt.includes('glow') || lowerPrompt.includes('brillo')) {
        composition = 'NeonText';
        primaryColor = '#00d4ff';
    } else if (lowerPrompt.includes('glass') || lowerPrompt.includes('cristal') || lowerPrompt.includes('blur')) {
        composition = 'GlassCard';
    } else if (lowerPrompt.includes('particle') || lowerPrompt.includes('particula') || lowerPrompt.includes('tech') || lowerPrompt.includes('futur')) {
        composition = 'ParticleNetwork';
        style = 'futuristic';
    } else if (lowerPrompt.includes('gradient') || lowerPrompt.includes('degradado')) {
        composition = 'GradientText';
    }

    // 2. Detect colors
    const colorMap = {
        'blue': '#3b82f6', 'azul': '#3b82f6',
        'red': '#ef4444', 'rojo': '#ef4444',
        'green': '#22c55e', 'verde': '#22c55e',
        'purple': '#a855f7', 'morado': '#a855f7', 'violet': '#a855f7',
        'orange': '#f97316', 'naranja': '#f97316',
        'yellow': '#eab308', 'amarillo': '#eab308', 'oro': '#ffd700', 'gold': '#ffd700',
        'pink': '#ec4899', 'rosa': '#ec4899',
        'cyan': '#06b6d4', 'celeste': '#06b6d4',
        'white': '#ffffff', 'blanco': '#ffffff',
    };

    for (const [keyword, color] of Object.entries(colorMap)) {
        if (lowerPrompt.includes(keyword)) {
            primaryColor = color;
            break;
        }
    }

    // 3. SMARTER Text Extraction
    let text = '';

    // Try quoted text first
    const quotedMatch = prompt.match(/"([^"]+)"|'([^']+)'/);
    if (quotedMatch) {
        text = (quotedMatch[1] || quotedMatch[2]);
    } else {
        // Try to find the "message" - usually after words like "diga", "que sea", "texto"
        const messageKeywords = ['que diga', 'texto', 'frase', 'dice', 'says', 'text'];
        for (const kw of messageKeywords) {
            const index = lowerPrompt.indexOf(kw);
            if (index !== -1) {
                text = prompt.substring(index + kw.length).trim().split(/[.,]/)[0];
                break;
            }
        }

        // If still empty, look for ALL CAPS words longer than 2 chars
        if (!text) {
            const capsWords = prompt.match(/\b[A-Z]{2,}\b/g);
            if (capsWords && capsWords.length > 0) {
                text = capsWords.join(' ');
            }
        }
    }

    // Default if extraction failed
    if (!text || text.length < 2) {
        text = 'WORK HARD';
    }

    console.log('📝 Fallback Result:', composition, '-', text);

    return {
        composition,
        text: text.toUpperCase().substring(0, 50),
        subtitle: '',
        primaryColor,
        secondaryColor: '#667eea',
        backgroundColor: '#000000',
        style,
        duration: 10,
        fps: 30,
        isAiGenerated: false
    };
}

/**
 * Convert AI config to EXACT Remotion input props for each composition
 */
export function configToRemotionProps(config) {
    const { composition, text, subtitle, primaryColor, secondaryColor, style } = config;

    const baseProps = {
        text: text || 'AMAZING',
        subtitle: subtitle || '',
    };

    switch (composition) {
        case 'KineticTitle':
            return {
                text: baseProps.text,
                accentColor: primaryColor,
                fontSize: 100,
                lineThickness: 4
            };
        case 'GradientText':
            return {
                text: baseProps.text,
                gradientColors: [primaryColor, secondaryColor || '#764ba2'],
                glowIntensity: 1,
                revealStyle: 'clip'
            };
        case 'NeonText':
            return {
                text: baseProps.text,
                color: primaryColor,
                subtitle: baseProps.subtitle,
                flickerEnabled: true
            };
        case 'GlassCard':
        case 'IsometricCard':
        case 'ParallaxLayers':
            return {
                title: baseProps.text,
                subtitle: baseProps.subtitle,
                accentColor: primaryColor
            };
        case 'DataViz':
            return {
                title: baseProps.text,
                subtitle: baseProps.subtitle,
                color: primaryColor,
                showGrid: true,
                data: [
                    { x: 0, y: 10 }, { x: 1, y: 30 }, { x: 2, y: 25 }, { x: 3, y: 60 }, { x: 4, y: 90 }
                ]
            };
        case 'ParticleNetwork':
            return {
                title: baseProps.text,
                subtitle: baseProps.subtitle,
                color: primaryColor,
                particleCount: 100
            };
        case 'BentoGrid':
            return {
                title: baseProps.text
            };
        default:
            return {
                text: baseProps.text,
                accentColor: primaryColor
            };
    }
}
