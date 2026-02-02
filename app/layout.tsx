import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Motion Graphics Studio | AI-Powered Video Generation",
    description: "Generate professional motion graphics videos with 21 presets. Powered by Remotion and AI.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased bg-black text-white">{children}</body>
        </html>
    );
}
