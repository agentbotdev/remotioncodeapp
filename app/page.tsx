'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || ''; // Empty string means same origin in production

export default function Home() {
    const [mode, setMode] = useState<'ai' | 'preset'>('ai');
    const [aiPrompt, setAiPrompt] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');
    const [presetList, setPresetList] = useState<string[]>([]);
    const [status, setStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [generatedVideo, setGeneratedVideo] = useState<{ url: string; size: string } | null>(null);
    const [jobId, setJobId] = useState<string | null>(null);

    // Initial constants
    const staticPresets = [
        'focus', 'grind', 'execute', 'discipline', 'gradient_power',
        'neon_crypto', 'glass_revenue', 'chart_growth', 'particle_tech',
        'iso_premium', 'bento_features', 'parallax_depth'
    ];

    useEffect(() => {
        const fetchPresets = async () => {
            try {
                const res = await fetch(`${API_URL}/presets`);
                if (res.ok) {
                    const data = await res.json();
                    setPresetList(data.list || staticPresets);
                } else {
                    setPresetList(staticPresets);
                }
            } catch (error) {
                console.error('Error fetching presets:', error);
                setPresetList(staticPresets);
            }
        };
        fetchPresets();
    }, []);

    // Polling setup
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (jobId && loading) {
            interval = setInterval(async () => {
                try {
                    const res = await fetch(`${API_URL}/status/${jobId}`);
                    const data = await res.json();

                    if (data.progress !== undefined) setProgress(data.progress);

                    const statusMessages: Record<string, string> = {
                        'queued': '⏳ En cola...',
                        'bundling': '📦 Preparando proyecto...',
                        'processing': '⚙️ Configurando render...',
                        'rendering': `🎬 Renderizando... ${data.progress}%`,
                        'encoding': '🔄 Codificando video...',
                        'completed': '✅ ¡Listo!',
                        'failed': '❌ Falló'
                    };

                    setStatus({
                        type: data.status === 'failed' ? 'error' : 'info',
                        message: statusMessages[data.status] || `🔄 ${data.status}...`
                    });

                    if (data.status === 'completed') {
                        clearInterval(interval);
                        setLoading(false);
                        const videoUrl = `${API_URL}${data.downloadUrl}`;
                        setGeneratedVideo({ url: videoUrl, size: data.fileSize });
                        setStatus({ type: 'success', message: `✅ ¡Video generado con éxito! (${data.fileSize}MB)` });
                    } else if (data.status === 'failed') {
                        clearInterval(interval);
                        setLoading(false);
                        setStatus({ type: 'error', message: `❌ Error: ${data.error || 'Fallo desconocido'}` });
                    }
                } catch (error) {
                    console.error('Polling error:', error);
                }
            }, 2000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [jobId, loading]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'ai' && !aiPrompt.trim()) {
            setStatus({ type: 'error', message: '⚠️ Por favor describí el video' });
            return;
        }

        if (mode === 'preset' && !selectedPreset) {
            setStatus({ type: 'error', message: '⚠️ Por favor seleccioná un preset' });
            return;
        }

        setLoading(true);
        setGeneratedVideo(null);
        setProgress(0);
        setStatus({ type: 'info', message: '🚀 Iniciando generación...' });

        try {
            const body: any = {
                preset: mode === 'ai' ? 'focus' : selectedPreset
            };
            if (mode === 'ai') body.aiPrompt = aiPrompt;

            const res = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (res.ok && data.jobId) {
                setJobId(data.jobId);
                setStatus({ type: 'info', message: '🔄 Job aceptado, esperando render...' });
            } else {
                throw new Error(data.message || data.error || 'Error al iniciar job');
            }
        } catch (error: any) {
            setLoading(false);
            setStatus({ type: 'error', message: `❌ Error: ${error.message}` });
        }
    };

    const examples = [
        { label: '💪 Motivacional', prompt: 'Un video motivacional con la frase "SUCCESS" en azul neon y fondo negro' },
        { label: '🚀 Tech Noir', prompt: 'Hombre caminando bajo la lluvia, traje negro, lluvia intensa, estilo cinematográfico noir' },
        { label: '🎮 RGB Gaming', prompt: 'Intro gamer con muchos colores RGB, texto "GAME OVER" parpadeando, efectos glitch' }
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto py-12">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 gradient-text tracking-tight">
                        AI Motion Studio <span className="text-xs bg-red-600 px-2 py-1 rounded align-middle uppercase">Beta</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Crea videos cinematográficos con un solo prompt</p>
                </header>

                <div className="glass rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                    {/* Tab Selector */}
                    <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit mx-auto mb-10 border border-white/10">
                        <button
                            onClick={() => setMode('ai')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${mode === 'ai' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'hover:bg-white/5'}`}
                        >
                            ✨ AI Generation
                        </button>
                        <button
                            onClick={() => setMode('preset')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all ${mode === 'preset' ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' : 'hover:bg-white/5'}`}
                        >
                            📋 Presets
                        </button>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-8">
                        {mode === 'ai' ? (
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-300 ml-1">💬 ¿Qué video imaginás?</label>
                                <textarea
                                    className="w-full h-32 bg-black/50 border-2 border-white/10 rounded-2xl p-4 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="Ej: Un hombre de blanco fumando bajo la lluvia, estilo cinematográfico noir..."
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                />
                                <div className="flex flex-wrap gap-2">
                                    {examples.map((ex) => (
                                        <button
                                            key={ex.label}
                                            type="button"
                                            onClick={() => setAiPrompt(ex.prompt)}
                                            className="text-xs px-4 py-2 border border-blue-500/30 bg-blue-500/5 text-blue-400 rounded-lg hover:bg-blue-500/10"
                                        >
                                            {ex.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <label className="block text-sm font-semibold text-gray-300 ml-1">Elegí una plantilla:</label>
                                <select
                                    className="w-full bg-black/50 border-2 border-white/10 rounded-2xl p-4 focus:border-indigo-500 outline-none"
                                    value={selectedPreset}
                                    onChange={(e) => setSelectedPreset(e.target.value)}
                                >
                                    <option value="">Selecciona un preset...</option>
                                    {presetList.map(p => (
                                        <option key={p} value={p}>{p.toUpperCase().replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl text-xl font-black transition-all ${loading ? 'bg-gray-800 animate-pulse' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-500/20'}`}
                        >
                            {loading ? 'Generando...' : '✨ GENERAR VIDEO'}
                        </button>
                    </form>

                    {/* Status & Progress */}
                    {status && (
                        <div className={`mt-8 p-4 rounded-xl border font-bold text-center ${status.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : status.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-blue-500/10 border-blue-500/50 text-blue-400'}`}>
                            {status.message}
                        </div>
                    )}

                    {loading && (
                        <div className="mt-4 space-y-2">
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Video Result */}
                    {generatedVideo && (
                        <div className="mt-12 space-y-6 animate-in fade-in zoom-in duration-500">
                            <h3 className="text-2xl font-black text-center text-green-400">✅ ¡VIDEO LISTO!</h3>
                            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-black">
                                <video src={generatedVideo.url} controls className="w-full aspect-[9/16]" />
                            </div>
                            <a
                                href={generatedVideo.url}
                                download
                                className="block w-full py-5 bg-green-600 text-center font-bold rounded-2xl hover:bg-green-500 transition-colors"
                            >
                                📥 Descargar Video
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer details */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-500 text-sm">
                    <div className="p-6 glass rounded-2xl">
                        <span className="text-3xl block mb-2">🤖</span>
                        <p className="font-bold text-gray-300">Powered by Gemini Pro</p>
                        Análisis inteligente de prompts
                    </div>
                    <div className="p-6 glass rounded-2xl">
                        <span className="text-3xl block mb-2">⚡</span>
                        <p className="font-bold text-gray-300">High Speed Render</p>
                        Video listo en segundos
                    </div>
                    <div className="p-6 glass rounded-2xl">
                        <span className="text-3xl block mb-2">🎬</span>
                        <p className="font-bold text-gray-300">22+ Presets</p>
                        Biblioteca profesional completa
                    </div>
                </div>
            </div>
        </main>
    );
}
