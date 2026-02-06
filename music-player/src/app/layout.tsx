import './globals.css';
import { PlayerContainer } from '../components/PlayerContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Next.js Music Player',
    description: 'Persistent Audio Player',
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "MusicPlayer",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-black text-white min-h-screen relative overflow-x-hidden selection:bg-cyan-500/30">
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
                    <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[130px]" />
                </div>
                <div className="relative z-0">
                    {children}
                </div>
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <PlayerContainer />
                </div>
            </body>
        </html>
    );
}