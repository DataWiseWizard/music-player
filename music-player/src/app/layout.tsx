import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlayerContainer } from "../components/PlayerContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Persistent Music Player",
    description: "Next.js 14 Audio Architecture",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "MusicPlayer",
    },
};

export const viewport: Viewport = {
    themeColor: "#020617",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-black min-h-screen text-white antialiased`}>
                <main className="pb-32">
                    {children}
                </main>
                <PlayerContainer />
            </body>
        </html>
    );
}