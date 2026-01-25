"use client";

import { useEffect, useState, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { audioController } from '../lib/audioController';
import { FullPlayer } from './FullPlayer';
import { FiList } from 'react-icons/fi';
import { QueueDrawer } from './QueueDrawer';
import { Visualizer } from './Visualizer';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const PlayerContainer = () => {
    const {
        activeTrack,
        isPlaying,
        volume,
        togglePlay,
        playNext,
        playPrev,
        setVolume
    } = usePlayerStore();

    const [hasMounted, setHasMounted] = useState(false);
    const [progress, setProgress] = useState(0); // 0 to 100
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("0:00");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isQueueOpen, setIsQueueOpen] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!activeTrack) return;

        const updateProgress = () => {
            const curr = audioController.currentTime;
            const dur = audioController.duration;

            if (dur > 0) {
                setProgress((curr / dur) * 100);
                setCurrentTime(formatTime(curr));
                setDuration(formatTime(dur));
            }
        };

        audioController.on('timeupdate', updateProgress);
        audioController.on('ended', playNext);

        return () => {
            audioController.off('timeupdate', updateProgress);
            audioController.off('ended', playNext);
        };
    }, [activeTrack, playNext]);

    useEffect(() => {
        if (activeTrack) {
            audioController.setupMediaSession(activeTrack, {
                onPlay: togglePlay,
                onPause: togglePlay,
                onNext: playNext,
                onPrev: playPrev
            });

            audioController.setPlaybackState(isPlaying ? 'playing' : 'paused');
        }
    }, [activeTrack, isPlaying, togglePlay, playNext, playPrev]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        (audioController as any).audio.volume = newVol;
    };

    if (!hasMounted) return null;
    if (!activeTrack) return null;

    return (
        <>
            <AnimatePresence>
                {isExpanded ? (
                    <FullPlayer key="full-player" onClose={() => setIsExpanded(false)} />
                ) : (
                    <motion.div
                        layoutId="player-container"
                        className="fixed bottom-0 left-0 right-0 z-50 p-2 sm:p-4 cursor-pointer"
                        onClick={() => setIsExpanded(true)}
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                    >
                        <div className="mx-auto max-w-5xl bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden flex items-center p-3 pr-6 gap-4">
                            <motion.img
                                layoutId="album-art"
                                src={activeTrack.coverUrl}
                                className="w-12 h-12 rounded-md object-cover"
                            />

                            <div className="flex-1 overflow-hidden">
                                <motion.h3 layoutId="track-title" className="font-bold text-white truncate text-sm">{activeTrack.title}</motion.h3>
                                <motion.p layoutId="track-artist" className="text-xs text-gray-400 truncate">{activeTrack.artist}</motion.p>
                            </div>

                            <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                                <button onClick={togglePlay} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center">
                                    {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} ml-1 />}
                                </button>
                                <button
                                    onClick={() => setIsQueueOpen(true)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition"
                                    title="Open Queue"
                                >
                                    <FiList size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
        </>
    );
};


function formatTime(seconds: number) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}