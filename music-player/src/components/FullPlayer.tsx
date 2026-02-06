"use client";
import { motion } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';
import { audioController } from '../lib/audioController';
import { Visualizer } from './Visualizer';
import { FiChevronDown, FiSkipBack, FiSkipForward, FiPlay, FiPause, FiMoreHorizontal } from 'react-icons/fi';
import { useEffect, useState } from 'react';

export const FullPlayer = ({ onClose }: { onClose: () => void }) => {
    const { activeTrack, isPlaying, togglePlay, playNext, playPrev } = usePlayerStore();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const curr = audioController.currentTime;
            const dur = audioController.duration;
            if (dur) setProgress((curr / dur) * 100);
        };
        audioController.on('timeupdate', update);
        return () => audioController.off('timeupdate', update);
    }, []);

    if (!activeTrack) return null;

    return (
        <motion.div
            layoutId="player-container"
            className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-3xl flex flex-col overflow-y-auto"
        >
            <div className="flex items-center justify-between p-6 lg:px-12 w-full max-w-7xl mx-auto">
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-white/50 hover:text-white transition p-2 hover:bg-white/10 rounded-full">
                    <FiChevronDown size={32} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold tracking-widest text-white/50 uppercase">Now Playing</span>
                    <span className="text-xs font-bold text-white hidden sm:block">From {activeTrack.artist}</span>
                </div>
                <button className="text-white/50 hover:text-white p-2">
                    <FiMoreHorizontal size={24} />
                </button>
            </div>

            {/* Main Split Layout */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 p-8 w-full max-w-7xl mx-auto">

                {/* Left Column */}
                <div className="flex-1 flex justify-center lg:justify-end w-full">
                    <motion.div
                        layoutId="album-art-container"
                        className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl"
                    >
                        <motion.img
                            src={activeTrack.coverUrl}
                            className="w-full h-full rounded-3xl object-cover border border-white/10"
                        />
                        {/* Glow effect behind */}
                        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl -z-10 rounded-full opacity-50" />
                    </motion.div>
                </div>

                {/* Right Column: Controls */}
                <div className="flex-1 flex flex-col items-center lg:items-start w-full max-w-xl space-y-8 lg:space-y-10">

                    {/* Track Info */}
                    <div className="text-center lg:text-left w-full space-y-2">
                        <motion.h2 layoutId="track-title" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                            {activeTrack.title}
                        </motion.h2>
                        <motion.p layoutId="track-artist" className="text-xl sm:text-2xl text-cyan-400 font-medium">
                            {activeTrack.artist}
                        </motion.p>
                    </div>

                    <div className="w-full h-16 opacity-60">
                        <Visualizer />
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full group">
                        <div
                            className="h-2 bg-gray-800 rounded-full overflow-hidden cursor-pointer relative"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                audioController.seekTo(((e.clientX - rect.left) / rect.width) * audioController.duration);
                            }}
                        >
                            <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 relative transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition" />
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                            <span>{formatTime(audioController.currentTime)}</span>
                            <span>{formatTime(audioController.duration)}</span>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center justify-center lg:justify-start gap-8 sm:gap-12 w-full">
                        <button onClick={playPrev} className="text-gray-400 hover:text-white hover:scale-110 transition">
                            <FiSkipBack size={36} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition active:scale-95"
                        >
                            {isPlaying ?
                                <FiPause size={40} className="text-black ml-0.5" /> :
                                <FiPlay size={40} className="text-black ml-1.5" />
                            }
                        </button>

                        <button onClick={playNext} className="text-gray-400 hover:text-white hover:scale-110 transition">
                            <FiSkipForward size={36} />
                        </button>
                    </div>


                </div>
            </div>
        </motion.div>
    );
};

const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};