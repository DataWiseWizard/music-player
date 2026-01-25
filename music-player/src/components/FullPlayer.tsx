"use client";
import { motion } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';
import { audioController } from '../lib/audioController';
import { Visualizer } from './Visualizer';
import { FiChevronDown, FiSkipBack, FiSkipForward, FiPlay, FiPause } from 'react-icons/fi';
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
      className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-3xl flex flex-col"
    >
        <div className="flex items-center justify-between p-6">
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-white/50 hover:text-white">
                <FiChevronDown size={32} />
            </button>
            <span className="text-xs font-bold tracking-widest text-white/50 uppercase">Now Playing</span>
            <div className="w-8" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
            <motion.img 
                layoutId="album-art"
                src={activeTrack.coverUrl} 
                className="w-72 h-72 sm:w-96 sm:h-96 rounded-2xl shadow-2xl shadow-cyan-500/20 object-cover"
            />

            <div className="text-center space-y-2">
                <motion.h2 layoutId="track-title" className="text-3xl font-bold text-white">{activeTrack.title}</motion.h2>
                <motion.p layoutId="track-artist" className="text-xl text-gray-400">{activeTrack.artist}</motion.p>
            </div>

            <div className="w-full max-w-2xl h-32 opacity-50">
                <Visualizer />
            </div>
            
            <div className="w-full max-w-2xl h-2 bg-gray-800 rounded-full mt-4 overflow-hidden relative group cursor-pointer"
                 onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     audioController.seekTo(((e.clientX - rect.left) / rect.width) * audioController.duration);
                 }}>
                <div className="h-full bg-cyan-400" style={{ width: `${progress}%` }} />
            </div>

            <div className="flex items-center gap-12 mt-4">
                <button onClick={playPrev}><FiSkipBack size={42} className="text-white" /></button>
                <button 
                    onClick={togglePlay} 
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-105 transition"
                >
                    {isPlaying ? <FiPause size={40} className="text-black ml-1" /> : <FiPlay size={40} className="text-black ml-1" />}
                </button>
                <button onClick={playNext}><FiSkipForward size={42} className="text-white" /></button>
            </div>
        </div>
    </motion.div>
  );
};