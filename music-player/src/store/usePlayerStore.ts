import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { audioController } from '../lib/audioController';

export interface Track {
    id: string;
    title: string;
    artist: string;
    url: string;
    coverUrl: string;
    isLocal?: boolean;
}

export interface Playlist {
    id: string;
    name: string;
    tracks: Track[];
}

type RepeatMode = 'none' | 'all' | 'one';

interface PlayerState {
    // Core State
    isPlaying: boolean;
    isPaused: boolean;
    volume: number;
    activeTrack: Track | null;
    queue: Track[];
    originalQueue: Track[];

    // V2 Features
    isShuffling: boolean;
    repeatMode: RepeatMode;
    playlists: Playlist[];
    likedTracks: Track[];

    // Actions
    setIsPlaying: (status: boolean) => void;
    setVolume: (vol: number) => void;
    setQueue: (tracks: Track[]) => void;
    playTrack: (track: Track) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;

    toggleShuffle: () => void;
    toggleRepeat: () => void;

    toggleLike: (track: Track) => void;
    createPlaylist: (name: string) => void;
    addToPlaylist: (playlistId: string, track: Track) => void;
    importLocalTrack: (file: File) => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            isPlaying: false,
            isPaused: false,
            volume: 1,
            activeTrack: null,
            queue: [],
            originalQueue: [],
            isShuffling: false,
            repeatMode: 'none',
            playlists: [],
            likedTracks: [],

            setIsPlaying: (status) => set({ isPlaying: status }),
            setVolume: (vol) => set({ volume: vol }),
            setQueue: (tracks) => set({ queue: tracks, originalQueue: tracks }),

            playTrack: (track) => {
                set({ activeTrack: track, isPlaying: true, isPaused: false });
                audioController.setSource(track.url);
                audioController.play();
            },

            togglePlay: () => {
                const { isPlaying, activeTrack } = get();
                if (!activeTrack) return;
                if (isPlaying) {
                    audioController.pause();
                    set({ isPlaying: false, isPaused: true });
                } else {
                    audioController.play();
                    set({ isPlaying: true, isPaused: false });
                }
            },

            toggleShuffle: () => {
                const { isShuffling, queue, originalQueue, activeTrack } = get();
                if (isShuffling) {
                    set({ isShuffling: false, queue: originalQueue });
                } else {
                    const shuffled = [...queue].sort(() => Math.random() - 0.5);
                    if (activeTrack) {
                        const withoutActive = shuffled.filter(t => t.id !== activeTrack.id);
                        set({ isShuffling: true, queue: [activeTrack, ...withoutActive] });
                    } else {
                        set({ isShuffling: true, queue: shuffled });
                    }
                }
            },

            toggleRepeat: () => {
                const modes: RepeatMode[] = ['none', 'all', 'one'];
                const current = get().repeatMode;
                const next = modes[(modes.indexOf(current) + 1) % modes.length];
                set({ repeatMode: next });
            },

            playNext: () => {
                const { queue, activeTrack, repeatMode } = get();
                if (!activeTrack || queue.length === 0) return;

                if (repeatMode === 'one') {
                    audioController.seekTo(0);
                    audioController.play();
                    return;
                }

                const currentIndex = queue.findIndex((t) => t.id === activeTrack.id);
                let nextIndex = currentIndex + 1;

                if (nextIndex >= queue.length) {
                    if (repeatMode === 'all') nextIndex = 0;
                    else { set({ isPlaying: false, isPaused: true }); return; }
                }

                get().playTrack(queue[nextIndex]);
            },

            playPrev: () => {
                const { queue, activeTrack } = get();
                if (!activeTrack) return;
                if (audioController.currentTime > 3) { audioController.seekTo(0); return; }

                const currentIndex = queue.findIndex((t) => t.id === activeTrack.id);
                const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
                get().playTrack(queue[prevIndex]);
            },

            toggleLike: (track) => {
                const { likedTracks } = get();
                const exists = likedTracks.some(t => t.id === track.id);
                if (exists) {
                    set({ likedTracks: likedTracks.filter(t => t.id !== track.id) });
                } else {
                    set({ likedTracks: [track, ...likedTracks] });
                }
            },

            createPlaylist: (name) => {
                const newPlaylist: Playlist = {
                    id: Math.random().toString(36).substring(7),
                    name,
                    tracks: []
                };
                set(state => ({ playlists: [...state.playlists, newPlaylist] }));
            },

            addToPlaylist: (playlistId, track) => {
                set(state => ({
                    playlists: state.playlists.map(p =>
                        p.id === playlistId ? { ...p, tracks: [...p.tracks, track] } : p
                    )
                }));
            },

            importLocalTrack: (file) => {
                const url = URL.createObjectURL(file);
                const newTrack: Track = {
                    id: `local-${Math.random().toString(36).substring(7)}`,
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    artist: 'Local File',
                    url,
                    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80',
                    isLocal: true
                };

                const { playlists } = get();
                let localPlaylist = playlists.find(p => p.name === 'Local Files');

                set(state => {
                    let updatedPlaylists = [...state.playlists];
                    let targetPlaylistId = localPlaylist?.id;

                    if (!localPlaylist) {
                        const newPlaylist = {
                            id: 'local-files',
                            name: 'Local Files',
                            tracks: [newTrack]
                        };
                        updatedPlaylists = [newPlaylist, ...updatedPlaylists];
                    } else {
                        updatedPlaylists = updatedPlaylists.map(p =>
                            p.id === targetPlaylistId
                                ? { ...p, tracks: [newTrack, ...p.tracks] }
                                : p
                        );
                    }

                    return { playlists: updatedPlaylists };
                });
            }
        }),
        {
            name: 'player-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                volume: state.volume,
                likedTracks: state.likedTracks,
                playlists: state.playlists
            }),
        }
    )
);