import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlayerContainer } from "../components/PlayerContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Persistent Music Player",
    description: "Next.js 14 Audio Architecture",
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