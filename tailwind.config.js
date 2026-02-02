/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'neon-green': '#00ff88',
                'neon-blue': '#00d4ff',
                'neon-pink': '#ff00ff',
            },
        },
    },
    plugins: [],
}
