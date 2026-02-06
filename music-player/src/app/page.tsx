"use client";
import { useState } from "react";
import { usePlayerStore, Track } from "../store/usePlayerStore";
import { FiHeart, FiPlay, FiPlus, FiMusic, FiFolder, FiCompass, FiDisc } from "react-icons/fi";
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

    // Card Component for Grid View
    const TrackCard = ({ track }: { track: Track }) => {
        const isPlaying = store.activeTrack?.id === track.id && store.isPlaying;

        return (
            <div className="group relative bg-white/5 border border-white/5 hover:bg-white/10 rounded-2xl p-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10">
                <div
                    className="relative aspect-square rounded-xl overflow-hidden mb-4 cursor-pointer"
                    onClick={() => {
                        store.setQueue(DISCOVERY_TRACKS); // Simple queue logic for now
                        store.playTrack(track);
                    }}
                >
                    <img src={track.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className="bg-cyan-400 text-black rounded-full p-3 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition">
                            {isPlaying ? <div className="w-4 h-4 rounded-sm animate-pulse bg-black" /> : <FiPlay size={24} className="ml-1" />}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-start">
                    <div className="min-w-0">
                        <h3 className={`font-semibold truncate ${isPlaying ? 'text-cyan-400' : 'text-white'}`}>{track.title}</h3>
                        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                    </div>
                    <button
                        onClick={() => store.toggleLike(track)}
                        className={`text-gray-400 hover:text-pink-500 transition ${store.likedTracks.some(t => t.id === track.id) ? 'text-pink-500' : ''}`}
                    >
                        <FiHeart fill={store.likedTracks.some(t => t.id === track.id) ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>
        );
    };

    // List Item for Playlists/Liked
    const TrackListItem = ({ track }: { track: Track }) => {
        const isPlaying = store.activeTrack?.id === track.id && store.isPlaying;
        return (
            <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/5">
                <div className="relative w-12 h-12 flex-shrink-0 cursor-pointer rounded-md overflow-hidden" onClick={() => store.playTrack(track)}>
                    <img src={track.coverUrl} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {isPlaying ? <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" /> : <FiPlay className="text-white text-xs" />}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className={`font-medium truncate ${isPlaying ? 'text-cyan-400' : 'text-white'}`}>{track.title}</h4>
                    <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => store.toggleLike(track)} className="p-2 hover:text-pink-500"><FiHeart /></button>
                    <button onClick={() => handleAddToPlaylist(track)} className="p-2 hover:text-cyan-400"><FiPlus /></button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-transparent overflow-hidden">

            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-black/20 backdrop-blur-xl hidden md:flex flex-col p-6">
                <div className="flex items-center gap-2 mb-10 text-cyan-400">
                    <FiDisc size={28} />
                    <h1 className="text-xl font-bold tracking-tight text-white">Sonic<span className="text-cyan-400">Stream</span></h1>
                </div>

                <nav className="space-y-2 flex-1">
                    <SidebarItem
                        icon={<FiCompass />}
                        label="Discover"
                        active={activeTab === 'discover'}
                        onClick={() => { setActiveTab('discover'); setSelectedPlaylistId(null); }}
                    />
                    <SidebarItem
                        icon={<FiHeart />}
                        label="Liked Songs"
                        active={activeTab === 'liked'}
                        onClick={() => { setActiveTab('liked'); setSelectedPlaylistId(null); }}
                    />
                    <SidebarItem
                        icon={<FiFolder />}
                        label="Playlists"
                        active={activeTab === 'playlists'}
                        onClick={() => setActiveTab('playlists')}
                    />
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <button onClick={() => { const name = prompt("Playlist Name:"); if (name) store.createPlaylist(name); }} className="flex items-center gap-3 text-gray-400 hover:text-white transition w-full p-2 rounded-lg hover:bg-white/5">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><FiPlus /></div>
                        <span className="text-sm font-medium">New Playlist</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6 pb-32 scroll-smooth">
                {/* Mobile Header */}
                <header className="md:hidden flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">SonicStream</h1>
                    <button onClick={() => setActiveTab(activeTab === 'discover' ? 'playlists' : 'discover')}><FiFolder /></button>
                </header>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-7xl mx-auto"
                >
                    {activeTab === 'discover' && (
                        <>
                            {/* Hero Section */}
                            <div className="relative h-[300px] rounded-3xl bg-gradient-to-r from-indigo-900 to-purple-900 mb-10 overflow-hidden group shadow-2xl shadow-purple-900/20">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=1200&q=80')] opacity-30 bg-cover bg-center group-hover:scale-105 transition duration-700" />
                                <div className="relative z-10 flex flex-col justify-end h-full p-8 bg-gradient-to-t from-black/80 via-transparent">
                                    <span className="text-cyan-400 font-medium tracking-wider mb-2 uppercase text-xs">Featured Mix</span>
                                    <h2 className="text-5xl font-bold mb-4 text-white">Midnight <br />Synthesizer</h2>
                                    <button onClick={() => store.playTrack(DISCOVERY_TRACKS[1])} className="bg-cyan-400 text-black px-8 py-3 rounded-full font-bold w-max flex items-center gap-2 hover:bg-cyan-300 transition shadow-lg shadow-cyan-400/20">
                                        <FiPlay fill="currentColor" /> Play Now
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Trending Now</h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {DISCOVERY_TRACKS.map(track => <TrackCard key={track.id} track={track} />)}
                            </div>
                        </>
                    )}

                    {activeTab === 'liked' && (
                        <div className="max-w-4xl">
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <span className="bg-pink-500/20 p-3 rounded-full text-pink-500"><FiHeart fill="currentColor" /></span>
                                Liked Songs
                            </h2>
                            {store.likedTracks.length === 0 ? (
                                <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                    <FiMusic size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="text-gray-400">No liked songs yet.</p>
                                    <button onClick={() => setActiveTab('discover')} className="text-cyan-400 mt-2 hover:underline">Go Discover</button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {store.likedTracks.map(track => <TrackListItem key={track.id} track={track} />)}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'playlists' && (
                        <div>
                            {!selectedPlaylistId ? (
                                <>
                                    <h2 className="text-3xl font-bold mb-6">Your Playlists</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {/* Create New Card */}
                                        <button
                                            onClick={() => { const name = prompt("Playlist Name:"); if (name) store.createPlaylist(name); }}
                                            className="aspect-square border border-dashed border-white/20 rounded-xl hover:bg-white/5 transition flex flex-col items-center justify-center text-gray-400 hover:text-white"
                                        >
                                            <FiPlus size={32} className="mb-2" />
                                            <span className="text-sm">Create New</span>
                                        </button>

                                        {store.playlists.map(playlist => (
                                            <div
                                                key={playlist.id}
                                                onClick={() => setSelectedPlaylistId(playlist.id)}
                                                className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 rounded-xl hover:scale-105 transition cursor-pointer flex flex-col items-center justify-center group shadow-lg"
                                            >
                                                <div className="w-16 h-16 bg-cyan-900/30 rounded-full flex items-center justify-center mb-4 text-cyan-400 group-hover:text-white transition">
                                                    <FiFolder size={32} />
                                                </div>
                                                <h3 className="font-bold truncate w-full text-center px-4">{playlist.name}</h3>
                                                <p className="text-xs text-gray-500">{playlist.tracks.length} tracks</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="max-w-4xl">
                                    <button onClick={() => setSelectedPlaylistId(null)} className="mb-6 text-sm text-gray-400 hover:text-white flex items-center gap-2">
                                        ← Back to Playlists
                                    </button>
                                    <div className="bg-white/5 p-8 rounded-3xl mb-8 flex items-end gap-6 border border-white/5">
                                        <div className="w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center">
                                            <FiMusic size={64} className="text-white/50" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">Playlist</span>
                                            <h1 className="text-4xl sm:text-6xl font-bold mt-2 mb-4">
                                                {store.playlists.find(p => p.id === selectedPlaylistId)?.name}
                                            </h1>
                                            <p className="text-gray-400 text-sm">
                                                {store.playlists.find(p => p.id === selectedPlaylistId)?.tracks.length} Songs
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        {store.playlists.find(p => p.id === selectedPlaylistId)?.tracks.map((track, i) => (
                                            <div key={track.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg group">
                                                <span className="text-gray-500 w-6 text-center">{i + 1}</span>
                                                <TrackListItem track={track} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}

// Sidebar Helper Component
const SidebarItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${active
                ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        {icon}
        {label}
    </button>
);



// "use client";
// import { useState } from "react";
// import { usePlayerStore, Track } from "../store/usePlayerStore";
// import { FiHeart, FiPlay, FiPlus, FiMusic, FiFolder } from "react-icons/fi";
// import { motion } from "framer-motion";

// const DISCOVERY_TRACKS: Track[] = [
//     {
//         id: '1',
//         title: 'Ambient Piano',
//         artist: 'Relaxing Sounds',
//         url: '/music/SoundHelix-Song-1.mp3',
//         coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80',
//     },
//     {
//         id: '2',
//         title: 'Electronic Vibes',
//         artist: 'Future Beats',
//         url: '/music/SoundHelix-Song-8.mp3',
//         coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
//     }
// ];

// export default function LibraryDashboard() {
//     const store = usePlayerStore();
//     const [activeTab, setActiveTab] = useState<'discover' | 'liked' | 'playlists'>('discover');
//     const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

//     const handleAddToPlaylist = (track: Track) => {
//         if (store.playlists.length === 0) {
//             alert("Create a playlist first!");
//             return;
//         }
//         const playlistName = prompt(
//             `Add "${track.title}" to which playlist?\n\nAvailable:\n${store.playlists.map(p => `- ${p.name}`).join('\n')}\n\nType the EXACT name:`
//         );

//         const target = store.playlists.find(p => p.name === playlistName);
//         if (target) {
//             store.addToPlaylist(target.id, track);
//             alert("Added!");
//         } else if (playlistName) {
//             alert("Playlist not found.");
//         }
//     };

//     const TrackList = ({ tracks, contextName }: { tracks: Track[], contextName: string }) => (
//         <div className="space-y-2">
//             {tracks.length === 0 && (
//                 <div className="text-center py-20 text-gray-500">
//                     <FiMusic size={48} className="mx-auto mb-4 opacity-50" />
//                     <p>No tracks found in {contextName}</p>
//                 </div>
//             )}

//             {tracks.map((track) => {
//                 const isLiked = store.likedTracks.some(t => t.id === track.id);
//                 const isPlaying = store.activeTrack?.id === track.id && store.isPlaying;

//                 return (
//                     <div
//                         key={track.id}
//                         className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/5"
//                     >
//                         <div className="relative w-12 h-12 flex-shrink-0 cursor-pointer" onClick={() => {
//                             store.setQueue(tracks);
//                             store.playTrack(track);
//                         }}>
//                             <img src={track.coverUrl} className="w-full h-full rounded-md object-cover" />
//                             <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
//                                 {isPlaying ? (
//                                     <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
//                                 ) : (
//                                     <FiPlay className="text-white" />
//                                 )}
//                             </div>
//                         </div>

//                         <div className="flex-1 min-w-0">
//                             <h4 className={`font-medium truncate ${isPlaying ? 'text-cyan-400' : 'text-white'}`}>{track.title}</h4>
//                             <p className="text-sm text-gray-400 truncate">{track.artist}</p>
//                         </div>


//                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <button
//                                 onClick={() => store.toggleLike(track)}
//                                 className={`p-2 rounded-full hover:bg-white/10 ${isLiked ? 'text-pink-500' : 'text-gray-400'}`}
//                                 title={isLiked ? "Unlike" : "Like"}
//                             >
//                                 <FiHeart fill={isLiked ? "currentColor" : "none"} />
//                             </button>

//                             <button
//                                 onClick={() => handleAddToPlaylist(track)}
//                                 className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
//                                 title="Add to Playlist"
//                             >
//                                 <FiPlus />
//                             </button>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-black text-white p-6 pb-40">
//             <header className="flex items-center justify-between mb-8">
//                 <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
//                     My Library
//                 </h1>
//                 <button
//                     onClick={() => {
//                         const name = prompt("Enter Playlist Name:");
//                         if (name) store.createPlaylist(name);
//                     }}
//                     className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition"
//                 >
//                     <FiFolder /> New Playlist
//                 </button>
//             </header>

//             <div className="flex gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
//                 <TabButton
//                     active={activeTab === 'discover'}
//                     onClick={() => { setActiveTab('discover'); setSelectedPlaylistId(null); }}
//                     label="Discover"
//                 />
//                 <TabButton
//                     active={activeTab === 'liked'}
//                     onClick={() => { setActiveTab('liked'); setSelectedPlaylistId(null); }}
//                     label="Liked Songs"
//                 />
//                 <TabButton
//                     active={activeTab === 'playlists'}
//                     onClick={() => setActiveTab('playlists')}
//                     label="Playlists"
//                 />
//             </div>

//             <motion.div
//                 key={activeTab}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.2 }}
//             >
//                 {activeTab === 'discover' && (
//                     <TrackList tracks={DISCOVERY_TRACKS} contextName="Discover" />
//                 )}

//                 {activeTab === 'liked' && (
//                     <TrackList tracks={store.likedTracks} contextName="Liked Songs" />
//                 )}

//                 {activeTab === 'playlists' && (
//                     <div>
//                         {!selectedPlaylistId ? (
//                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                                 {store.playlists.map(playlist => (
//                                     <div
//                                         key={playlist.id}
//                                         onClick={() => setSelectedPlaylistId(playlist.id)}
//                                         className="aspect-square bg-slate-900 border border-white/10 rounded-xl hover:bg-slate-800 transition cursor-pointer flex flex-col items-center justify-center group"
//                                     >
//                                         <FiFolder size={48} className="text-cyan-500 mb-2 group-hover:scale-110 transition" />
//                                         <h3 className="font-bold truncate w-full text-center px-2">{playlist.name}</h3>
//                                         <p className="text-xs text-gray-500">{playlist.tracks.length} tracks</p>
//                                     </div>
//                                 ))}
//                                 {store.playlists.length === 0 && (
//                                     <p className="col-span-full text-gray-500">No playlists yet. Create one above!</p>
//                                 )}
//                             </div>
//                         ) : (
//                             <div>
//                                 <button
//                                     onClick={() => setSelectedPlaylistId(null)}
//                                     className="mb-4 text-sm text-cyan-400 hover:underline"
//                                 >
//                                     ← Back to Playlists
//                                 </button>
//                                 <h2 className="text-2xl font-bold mb-4">
//                                     {store.playlists.find(p => p.id === selectedPlaylistId)?.name}
//                                 </h2>
//                                 <TrackList
//                                     tracks={store.playlists.find(p => p.id === selectedPlaylistId)?.tracks || []}
//                                     contextName="Playlist"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </motion.div>
//         </div>
//     );
// }

// const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
//     <button
//         onClick={onClick}
//         className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${active
//                 ? 'bg-cyan-500 text-black'
//                 : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
//             }`}
//     >
//         {label}
//     </button>
// );