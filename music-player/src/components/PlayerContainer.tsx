"use client";

import { useEffect, useState, useRef, SetStateAction } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { audioController } from '../lib/audioController';
import { FullPlayer } from './FullPlayer';
import { QueueDrawer } from './QueueDrawer';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiList, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const formatTime = (time: number): string => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const PlayerContainer = () => {
    const {
        activeTrack,
        isPlaying,
        volume,
        togglePlay,
        playNext,
        playPrev,
        setVolume,
        importLocalTrack
    } = usePlayerStore();

    const [hasMounted, setHasMounted] = useState(false);
    const [progress, setProgress] = useState(0); // 0 to 100
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("0:00");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isQueueOpen, setIsQueueOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        // (audioController as any).audio.volume = newVol;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) importLocalTrack(file);
    };

    if (!hasMounted) return null;
    if (!activeTrack) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold p-4 rounded-full shadow-lg flex items-center gap-2 transition"
                >
                    <FiUpload size={24} /> Import Song
                </button>
            </div>
        );
    }
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
                        <div className="mx-auto max-w-5xl bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden flex items-center p-3 pr-6 gap-4 relative">
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                                <div
                                    className="h-full bg-cyan-400"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <motion.img
                                layoutId="album-art"
                                src={activeTrack.coverUrl}
                                className="w-12 h-12 rounded-md object-cover"
                            />

                            <div className="flex-1 overflow-hidden">
                                <motion.h3 layoutId="track-title" className="font-bold text-white truncate text-sm">
                                    {activeTrack.title}
                                </motion.h3>
                                <motion.p layoutId="track-artist" className="text-xs text-gray-400 truncate">
                                    {activeTrack.artist}
                                </motion.p>
                            </div>

                            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                <button onClick={playPrev} className="text-gray-400 hover:text-white p-2">
                                    <FiSkipBack size={20} />
                                </button>

                                <button onClick={togglePlay} className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition">
                                    {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} className="ml-0.5" />}
                                </button>

                                <button onClick={playNext} className="text-gray-400 hover:text-white p-2">
                                    <FiSkipForward size={20} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 border-l border-white/10 pl-2 sm:pl-4 ml-2" onClick={(e) => e.stopPropagation()}>
                                <input type="file" accept="audio/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                                <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-cyan-400 p-2" title="Import Local File">
                                    <FiUpload size={18} />
                                </button>

                                <button
                                    onClick={() => setIsQueueOpen(true)}
                                    className="p-2 text-gray-400 hover:text-white"
                                >
                                    <FiList size={20} />
                                </button>
                            </div>                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
        </>
    );
};


