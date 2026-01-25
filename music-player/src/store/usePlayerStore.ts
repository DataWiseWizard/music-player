import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { audioController } from '../lib/audioController';

export interface Track {
    id: string;
    title: string;
    artist: string;
    url: string;
    coverUrl: string;
}

interface PlayerState {
    isPlaying: boolean;
    isPaused: boolean;
    volume: number; // 0.0 to 1.0
    activeTrack: Track | null;
    queue: Track[];

    setIsPlaying: (status: boolean) => void;
    setVolume: (vol: number) => void;
    setActiveTrack: (track: Track) => void;
    setQueue: (tracks: Track[]) => void;

    playTrack: (track: Track) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist(
        (set, get) => ({
            isPlaying: false,
            isPaused: false,
            volume: 1,
            activeTrack: null,
            queue: [],

            setIsPlaying: (status) => set({ isPlaying: status }),

            setVolume: (vol) => {
                set({ volume: vol });
            },

            setActiveTrack: (track) => set({ activeTrack: track }),

            setQueue: (tracks) => set({ queue: tracks }),

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

            playNext: () => {
                const { queue, activeTrack } = get();
                if (!activeTrack || queue.length === 0) return;

                const currentIndex = queue.findIndex((t) => t.id === activeTrack.id);
                const nextIndex = (currentIndex + 1) % queue.length; // Loop back to start

                const nextTrack = queue[nextIndex];
                get().playTrack(nextTrack);
            },

            playPrev: () => {
                const { queue, activeTrack } = get();
                if (!activeTrack || queue.length === 0) return;

                const currentIndex = queue.findIndex((t) => t.id === activeTrack.id);
                const prevIndex = (currentIndex - 1 + queue.length) % queue.length;

                const prevTrack = queue[prevIndex];
                get().playTrack(prevTrack);
            },
        }),
        {
            name: 'player-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                volume: state.volume,
                activeTrack: state.activeTrack,
                queue: state.queue
            }),
        }
    )
);