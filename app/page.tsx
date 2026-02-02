import Link from 'next/link';

// Import presets 
const presets = {
    focus: { composition: 'KineticTitle', color: '#00ff88' },
    grind: { composition: 'KineticTitle', color: '#ff0044' },
    execute: { composition: 'KineticTitle', color: '#ff6b00' },
    discipline: { composition: 'KineticTitle', color: '#6c5ce7' },
    gradient_power: { composition: 'GradientText', color: '#667eea' },
    neon_crypto: { composition: 'NeonText', color: '#00ff88' },
    glass_revenue: { composition: 'GlassCard', color: '#00ff88' },
    chart_growth: { composition: 'DataViz', color: '#00ff88' },
    particle_tech: { composition: 'ParticleNetwork', color: '#00ff88' },
    iso_premium: { composition: 'IsometricCard', color: '#6c5ce7' },
    bento_features: { composition: 'BentoGrid', color: '#6c5ce7' },
    parallax_depth: { composition: 'ParallaxLayers', color: '#ff6b6b' },
};

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold mb-6 gradient-text">
                        Motion Graphics Studio
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        21 Professional Presets | AI-Powered | Production Ready
                    </p>
                    <div className="mt-8 flex gap-4 justify-center">
                        <a
                            href="/api"
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                        >
                            API Docs
                        </a>
                        <a
                            href="https://github.com/agentbotdev/remotioncodeapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-3 glass hover:bg-white/10 rounded-lg font-semibold transition"
                        >
                            GitHub
                        </a>
                    </div>
                </div>

                {/* Preset Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Object.entries(presets).map(([name, { composition, color }]) => (
                        <Link
                            key={name}
                            href={`/preview/${name}`}
                            className="glass rounded-xl p-6 hover:scale-105 transition-all duration-300 group cursor-pointer"
                        >
                            <div
                                className="w-full aspect-[9/16] rounded-lg mb-4 flex items-center justify-center"
                                style={{ backgroundColor: `${color}22`, border: `2px solid ${color}` }}
                            >
                                <svg
                                    className="w-16 h-16 opacity-50"
                                    fill={color}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-bold mb-2 capitalize">
                                {name.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-sm text-gray-400 mb-3">{composition}</p>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition">
                                    Preview
                                </button>
                                <button className="px-4 py-2 glass hover:bg-white/10 rounded text-sm font-semibold transition">
                                    Render
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Stats Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-500 mb-2">21</div>
                        <div className="text-gray-400">Presets</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-500 mb-2">12</div>
                        <div className="text-gray-400">Compositions</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-500 mb-2">15s</div>
                        <div className="text-gray-400">Avg Render</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-500 mb-2">1080p</div>
                        <div className="text-gray-400">Quality</div>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass rounded-xl p-8">
                            <div className="text-4xl mb-4">🎬</div>
                            <h3 className="text-xl font-bold mb-3">Professional Templates</h3>
                            <p className="text-gray-400">
                                21 hand-crafted presets covering kinetic typography, data viz, and effects
                            </p>
                        </div>
                        <div className="glass rounded-xl p-8">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold mb-3">REST API</h3>
                            <p className="text-gray-400">
                                Programmatic video generation via simple HTTOP endpoints. Perfect for n8n.
                            </p>
                        </div>
                        <div className="glass rounded-xl p-8">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="text-xl font-bold mb-3">Fast Rendering</h3>
                            <p className="text-gray-400">
                                15-30 second render times with Chrome Headless Shell optimization
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
