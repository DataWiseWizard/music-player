"use client";
import { useState } from "react";
import { usePlayerStore, Track } from "../store/usePlayerStore";
import { FiHeart, FiPlay, FiPlus, FiMusic, FiFolder } from "react-icons/fi";
import { motion } from "framer-motion";

const DISCOVERY_TRACKS: Track[] = [
    {
        id: '1',
        title: 'Ambient Piano',
        artist: 'Relaxing Sounds',
        url: '/music/SoundHelix-Song-1.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80',
    },
    {
        id: '2',
        title: 'Electronic Vibes',
        artist: 'Future Beats',
        url: '/music/SoundHelix-Song-8.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    }
];

export default function LibraryDashboard() {
    const store = usePlayerStore();
    const [activeTab, setActiveTab] = useState<'discover' | 'liked' | 'playlists'>('discover');
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

    const handleAddToPlaylist = (track: Track) => {
        if (store.playlists.length === 0) {
            alert("Create a playlist first!");
            return;
        }
        const playlistName = prompt(
            `Add "${track.title}" to which playlist?\n\nAvailable:\n${store.playlists.map(p => `- ${p.name}`).join('\n')}\n\nType the EXACT name:`
        );

        const target = store.playlists.find(p => p.name === playlistName);
        if (target) {
            store.addToPlaylist(target.id, track);
            alert("Added!");
        } else if (playlistName) {
            alert("Playlist not found.");
        }
    };

    const TrackList = ({ tracks, contextName }: { tracks: Track[], contextName: string }) => (
        <div className="space-y-2">
            {tracks.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <FiMusic size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No tracks found in {contextName}</p>
                </div>
            )}

            {tracks.map((track) => {
                const isLiked = store.likedTracks.some(t => t.id === track.id);
                const isPlaying = store.activeTrack?.id === track.id && store.isPlaying;

                return (
                    <div
                        key={track.id}
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/5"
                    >
                        <div className="relative w-12 h-12 flex-shrink-0 cursor-pointer" onClick={() => {
                            store.setQueue(tracks);
                            store.playTrack(track);
                        }}>
                            <img src={track.coverUrl} className="w-full h-full rounded-md object-cover" />
                            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                {isPlaying ? (
                                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                                ) : (
                                    <FiPlay className="text-white" />
                                )}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className={`font-medium truncate ${isPlaying ? 'text-cyan-400' : 'text-white'}`}>{track.title}</h4>
                            <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                        </div>


                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => store.toggleLike(track)}
                                className={`p-2 rounded-full hover:bg-white/10 ${isLiked ? 'text-pink-500' : 'text-gray-400'}`}
                                title={isLiked ? "Unlike" : "Like"}
                            >
                                <FiHeart fill={isLiked ? "currentColor" : "none"} />
                            </button>

                            <button
                                onClick={() => handleAddToPlaylist(track)}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                                title="Add to Playlist"
                            >
                                <FiPlus />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-40">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                    My Library
                </h1>
                <button
                    onClick={() => {
                        const name = prompt("Enter Playlist Name:");
                        if (name) store.createPlaylist(name);
                    }}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition"
                >
                    <FiFolder /> New Playlist
                </button>
            </header>

            <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
                <TabButton
                    active={activeTab === 'discover'}
                    onClick={() => { setActiveTab('discover'); setSelectedPlaylistId(null); }}
                    label="Discover"
                />
                <TabButton
                    active={activeTab === 'liked'}
                    onClick={() => { setActiveTab('liked'); setSelectedPlaylistId(null); }}
                    label="Liked Songs"
                />
                <TabButton
                    active={activeTab === 'playlists'}
                    onClick={() => setActiveTab('playlists')}
                    label="Playlists"
                />
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'discover' && (
                    <TrackList tracks={DISCOVERY_TRACKS} contextName="Discover" />
                )}

                {activeTab === 'liked' && (
                    <TrackList tracks={store.likedTracks} contextName="Liked Songs" />
                )}

                {activeTab === 'playlists' && (
                    <div>
                        {!selectedPlaylistId ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {store.playlists.map(playlist => (
                                    <div
                                        key={playlist.id}
                                        onClick={() => setSelectedPlaylistId(playlist.id)}
                                        className="aspect-square bg-slate-900 border border-white/10 rounded-xl hover:bg-slate-800 transition cursor-pointer flex flex-col items-center justify-center group"
                                    >
                                        <FiFolder size={48} className="text-cyan-500 mb-2 group-hover:scale-110 transition" />
                                        <h3 className="font-bold truncate w-full text-center px-2">{playlist.name}</h3>
                                        <p className="text-xs text-gray-500">{playlist.tracks.length} tracks</p>
                                    </div>
                                ))}
                                {store.playlists.length === 0 && (
                                    <p className="col-span-full text-gray-500">No playlists yet. Create one above!</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <button
                                    onClick={() => setSelectedPlaylistId(null)}
                                    className="mb-4 text-sm text-cyan-400 hover:underline"
                                >
                                    ← Back to Playlists
                                </button>
                                <h2 className="text-2xl font-bold mb-4">
                                    {store.playlists.find(p => p.id === selectedPlaylistId)?.name}
                                </h2>
                                <TrackList
                                    tracks={store.playlists.find(p => p.id === selectedPlaylistId)?.tracks || []}
                                    contextName="Playlist"
                                />
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${active
                ? 'bg-cyan-500 text-black'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
    >
        {label}
    </button>
);