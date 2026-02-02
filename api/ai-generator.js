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

        const systemPrompt = `You are a high-end motion graphics director. 
Analyze the user's video request and return a JSON configuration.

COMPOSITIONS & PROPS:
1. WalkingMan: A cinematic silhouette of a man walking and smoking. Use for: cinematic, deep, atmospheric, rain, smoking, noir, or character-based prompts.
   Props: manColor (hex), smokeColor (hex), showRain (boolean), gridColor (hex), accentColor (hex)
2. KineticTitle: Bold animated text. Use for high-energy motivational quotes.
   Props: text (string), accentColor (hex)
3. NeonText: Glowing neon. Use for tech, futuristic, or nightlife vibes.
   Props: text (string), color (hex), subtitle (string)
4. GradientText: Smooth reveal. Use for premium, modern vibes.
   Props: text (string), gradientColors (array)
5. GlassCard: Information card. Use for stats/professional info.
   Props: title (string), subtitle (string), accentColor (hex)
6. DataViz: Growth charts. Use for showing progress/numbers.
   Props: title (string), color (hex)
7. ParticleNetwork: Tech dots. Use for networking/AI themes.
   Props: title (string), color (hex)

RULES:
- If the user describes a SCENE (e.g., "man in the rain", "smoking under a bridge", "cinematic man"), ALWAYS prefer 'WalkingMan'.
- For WalkingMan, map the described "man color" to manColor. If they say "man in white", set manColor to #ffffff.
- Return ONLY valid JSON.

JSON STRUCTURE:
{
  "composition": "string",
  "text": "string (main text if applicable)",
  "subtitle": "string (optional)",
  "primaryColor": "string (hex)",
  "secondaryColor": "string (hex)",
  "manColor": "string (hex, if applicable)",
  "showRain": boolean,
  "style": "string (smooth|energetic|cinematic)",
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
        console.log('✨ Gemini AI Result:', config.composition, '-', config.text || config.manColor);

        return {
            ...config,
            isAiGenerated: true
        };
    } catch (error) {
        console.error('❌ Gemini Error:', error.message);
        return fallbackAnalysis(userPrompt);
    }
}

/**
 * Fallback analysis when AI fails
 */
function fallbackAnalysis(prompt) {
    const lowerPrompt = prompt.toLowerCase();

    let composition = 'KineticTitle';
    let primaryColor = '#00ff88';
    let manColor = '#111111';
    let showRain = false;

    // Detect high-priority artistic keywords
    if (lowerPrompt.includes('hombre') || lowerPrompt.includes('fumando') || lowerPrompt.includes('man') || lowerPrompt.includes('smoking') || lowerPrompt.includes('lluvia') || lowerPrompt.includes('rain')) {
        composition = 'WalkingMan';
        if (lowerPrompt.includes('lluvia') || lowerPrompt.includes('rain')) showRain = true;
        if (lowerPrompt.includes('white') || lowerPrompt.includes('blanco')) manColor = '#ffffff';
    } else if (lowerPrompt.includes('data') || lowerPrompt.includes('stats')) {
        composition = 'DataViz';
    } else if (lowerPrompt.includes('neon')) {
        composition = 'NeonText';
    } else if (lowerPrompt.includes('gradient')) {
        composition = 'GradientText';
    }

    return {
        composition,
        text: 'WORK HARD',
        primaryColor,
        manColor,
        showRain,
        duration: 10,
        fps: 30,
        isAiGenerated: false
    };
}

/**
 * Convert AI config to EXACT Remotion input props
 */
export function configToRemotionProps(config) {
    const { composition, text, subtitle, primaryColor, secondaryColor, manColor, showRain } = config;

    switch (composition) {
        case 'WalkingMan':
            return {
                manColor: manColor || '#111111',
                smokeColor: '#aaaaaa',
                showRain: showRain !== undefined ? showRain : true,
                accentColor: primaryColor || '#00ff88',
                gridColor: '#111111'
            };
        case 'KineticTitle':
            return {
                text: text || 'AMAZING',
                accentColor: primaryColor || '#00ff88',
                fontSize: 100
            };
        case 'NeonText':
            return {
                text: text || 'NEON',
                color: primaryColor || '#00ff88',
                subtitle: subtitle || ''
            };
        case 'GradientText':
            return {
                text: text || 'LIMITLESS',
                gradientColors: [primaryColor || '#667eea', secondaryColor || '#764ba2']
            };
        case 'DataViz':
            return {
                title: text || 'GROWTH',
                color: primaryColor || '#00ff88'
            };
        default:
            return { text: text || 'FOCUS' };
    }
}
