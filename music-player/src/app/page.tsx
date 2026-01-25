"use client";
import { usePlayerStore } from "../store/usePlayerStore";

const TRACKS = [
    {
        id: '1',
        title: 'Ambient Piano',
        artist: 'Relaxing Sounds',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80',
    },
    {
        id: '2',
        title: 'Electronic Vibes',
        artist: 'Future Beats',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    }
];

export default function Home() {
    const { playTrack, setQueue } = usePlayerStore();

    const handlePlay = (track: any) => {
        setQueue(TRACKS);
        playTrack(track);
    };

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Library
            </h1>

            <div className="grid gap-4">
                {TRACKS.map((track) => (
                    <div
                        key={track.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition border border-white/5 cursor-pointer group"
                        onClick={() => handlePlay(track)}
                    >
                        <img src={track.coverUrl} className="w-16 h-16 rounded-md object-cover" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg group-hover:text-cyan-400 transition">{track.title}</h3>
                            <p className="text-gray-400">{track.artist}</p>
                        </div>
                        <button className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition">
                            Play Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}