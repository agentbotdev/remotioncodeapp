// presets.js - Predefined configurations for quick video generation
// Each preset maps to a composition with specific props

export const presets = {
    // ============================================
    // KINETIC TITLE PRESETS (Motivational/Focus)
    // ============================================

    focus: {
        composition: 'KineticTitle',
        props: {
            text: 'FOCUS ON WHAT MATTERS',
            accentColor: '#00ff88',
            fontSize: 100,
            lineThickness: 4,
        },
    },

    grind: {
        composition: 'KineticTitle',
        props: {
            text: 'THE GRIND NEVER STOPS',
            accentColor: '#ff0044',
            fontSize: 90,
            lineThickness: 5,
        },
    },

    execute: {
        composition: 'KineticTitle',
        props: {
            text: 'EXECUTION > IDEAS',
            accentColor: '#ff6b00',
            fontSize: 95,
            lineThickness: 4,
        },
    },

    discipline: {
        composition: 'KineticTitle',
        props: {
            text: 'DISCIPLINE EQUALS FREEDOM',
            accentColor: '#6c5ce7',
            fontSize: 85,
            lineThickness: 3,
        },
    },

    // ============================================
    // GRADIENT TEXT PRESETS
    // ============================================

    gradient_power: {
        composition: 'GradientText',
        props: {
            text: 'UNLEASH YOUR POWER',
            gradientColors: ['#667eea', '#764ba2'],
            glowIntensity: 1,
            fontSize: 120,
            revealStyle: 'clip',
        },
    },

    gradient_limitless: {
        composition: 'GradientText',
        props: {
            text: 'LIMITLESS',
            gradientColors: ['#ff6b6b', '#feca57', '#48dbfb'],
            glowIntensity: 1,
            fontSize: 120,
            revealStyle: 'clip',
        },
    },

    gradient_rise: {
        composition: 'GradientText',
        props: {
            text: 'RISE ABOVE',
            gradientColors: ['#f093fb', '#f5576c'],
            glowIntensity: 0.8,
            fontSize: 110,
            revealStyle: 'clip',
        },
    },

    // ============================================
    // NEON TEXT PRESETS
    // ============================================

    neon_crypto: {
        composition: 'NeonText',
        props: {
            text: 'CRYPTO',
            color: '#00ff88',
            subtitle: 'the future is now',
            flickerEnabled: true,
        },
    },

    neon_electric: {
        composition: 'NeonText',
        props: {
            text: 'ELECTRIC',
            color: '#00d4ff',
            subtitle: 'high voltage energy',
            flickerEnabled: true,
        },
    },

    neon_future: {
        composition: 'NeonText',
        props: {
            text: 'FUTURE',
            color: '#ff00ff',
            subtitle: 'embrace tomorrow',
            flickerEnabled: false,
        },
    },

    // ============================================
    // GLASS CARD PRESETS (Stats/Data)
    // ============================================

    glass_revenue: {
        composition: 'GlassCard',
        props: {
            title: 'REVENUE GROWTH',
            subtitle: 'Q4 Performance Dashboard',
            accentColor: '#00ff88',
        },
    },

    glass_clarity: {
        composition: 'GlassCard',
        props: {
            title: 'CLARITY',
            subtitle: 'See through the noise',
            accentColor: '#a78bfa',
        },
    },

    glass_premium: {
        composition: 'GlassCard',
        props: {
            title: 'PREMIUM',
            subtitle: 'Ultra-refined design',
            accentColor: '#6c5ce7',
        },
    },

    // ============================================
    // DATA VISUALIZATION PRESETS
    // ============================================

    chart_growth: {
        composition: 'DataViz',
        props: {
            data: [
                { x: 0, y: 20 },
                { x: 1, y: 45 },
                { x: 2, y: 35 },
                { x: 3, y: 65 },
                { x: 4, y: 55 },
                { x: 5, y: 80 },
                { x: 6, y: 70 },
                { x: 7, y: 95 },
            ],
            color: '#00ff88',
            showGrid: true,
            title: 'GROWTH',
            subtitle: '+240% this quarter',
        },
    },

    chart_moonshot: {
        composition: 'DataViz',
        props: {
            data: [
                { x: 0, y: 10 },
                { x: 1, y: 15 },
                { x: 2, y: 25 },
                { x: 3, y: 50 },
                { x: 4, y: 90 },
            ],
            color: '#ff6b00',
            showGrid: true,
            title: 'EXPONENTIAL',
            subtitle: '9x growth in 5 months',
        },
    },

    // ============================================
    // PARTICLE NETWORK PRESETS
    // ============================================

    particle_tech: {
        composition: 'ParticleNetwork',
        props: {
            particleCount: 80,
            color: '#00ff88',
            connectionDistance: 120,
            speed: 1,
            title: 'CONNECTED',
            subtitle: 'Everything is linked',
        },
    },

    particle_matrix: {
        composition: 'ParticleNetwork',
        props: {
            particleCount: 100,
            color: '#00ff00',
            connectionDistance: 100,
            speed: 1.5,
            title: 'MATRIX',
            subtitle: 'neural networks',
        },
    },

    // ============================================
    // ISOMETRIC CARD PRESETS
    // ============================================

    iso_premium: {
        composition: 'IsometricCard',
        props: {
            title: 'PREMIUM',
            subtitle: 'Next Level Design',
            accentColor: '#6c5ce7',
            rotationIntensity: 0.5,
        },
    },

    iso_tech: {
        composition: 'IsometricCard',
        props: {
            title: 'TECH',
            subtitle: '3D Showcase',
            accentColor: '#00d4ff',
            rotationIntensity: 0.7,
        },
    },

    // ============================================
    // BENTO GRID PRESET
    // ============================================

    bento_features: {
        composition: 'BentoGrid',
        props: {
            title: 'FEATURES',
        },
    },

    // ============================================
    // CINEMATIC PRESETS
    // ============================================

    noir_smoking: {
        composition: 'WalkingMan',
        props: {
            manColor: '#111111',
            smokeColor: '#999999',
            showRain: true,
            gridColor: '#0a0a0a',
            accentColor: '#333333',
        },
    },

    white_walker: {
        composition: 'WalkingMan',
        props: {
            manColor: '#ffffff',
            smokeColor: '#ffffff',
            showRain: false,
            gridColor: '#1a1a1a',
            accentColor: '#00ff88',
        },
    },

    // ============================================
    // N8N + CHATWOOT + AI DEMO PRESETS
    // ============================================

    n8n_chatwoot_ai: {
        composition: 'N8nChatwootDemo',
        props: {
            accentColor: '#ff6d5a',
            chatwootColor: '#1F93FF',
            aiColor: '#8b5cf6',
            n8nColor: '#ff6d5a',
        },
    },

    n8n_chatwoot_green: {
        composition: 'N8nChatwootDemo',
        props: {
            accentColor: '#00ff88',
            chatwootColor: '#1F93FF',
            aiColor: '#00d4ff',
            n8nColor: '#00ff88',
        },
    },

    // ============================================
    // N8N + CHATWOOT EPIC (30s cinematic)
    // ============================================

    n8n_epic: {
        composition: 'N8nChatwootEpic',
        props: {},
    },
};

// Export preset names for easy discovery
export const presetNames = Object.keys(presets);

// Helper function to get preset by name
export function getPreset(name) {
    return presets[name];
}

// Helper function to list all presets
export function listPresets() {
    console.log('\n📦 Available Presets:\n');
    console.log('━'.repeat(60));

    const grouped = {
        'KineticTitle': [],
        'GradientText': [],
        'NeonText': [],
        'GlassCard': [],
        'DataViz': [],
        'ParticleNetwork': [],
        'IsometricCard': [],
        'BentoGrid': [],
        'ParallaxLayers': [],
        'N8nChatwootDemo': [],
    };

    Object.entries(presets).forEach(([name, config]) => {
        grouped[config.composition].push(name);
    });

    Object.entries(grouped).forEach(([composition, names]) => {
        if (names.length > 0) {
            console.log(`\n🎬 ${composition}:`);
            names.forEach(name => {
                console.log(`   • ${name}`);
            });
        }
    });

    console.log('\n━'.repeat(60));
    console.log(`\nTotal: ${presetNames.length} presets\n`);
}
