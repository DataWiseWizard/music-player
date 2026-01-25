"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';
import { FiX, FiMusic } from 'react-icons/fi';
import { useEffect, useRef } from 'react';

interface QueueDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const QueueDrawer = ({ isOpen, onClose }: QueueDrawerProps) => {
    const { queue, activeTrack, playTrack } = usePlayerStore();
    const activeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && activeRef.current) {
            activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isOpen, activeTrack]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-900/95 border-l border-white/10 z-[70] shadow-2xl flex flex-col"
                    >
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <FiMusic className="text-cyan-400" />
                                Up Next
                                <span className="text-xs font-normal text-gray-400 bg-white/10 px-2 py-1 rounded-full">
                                    {queue.length} tracks
                                </span>
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {queue.map((track: any, index: number) => {
                                const isActive = activeTrack?.id === track.id;
                                return (
                                    <div
                                        key={`${track.id}-${index}`}
                                        ref={isActive ? activeRef : null}
                                        onClick={() => playTrack(track)}
                                        className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${isActive
                                                ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                                : 'hover:bg-white/5 border-transparent hover:border-white/5'
                                            }`}
                                    >
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <img
                                                src={track.coverUrl}
                                                className={`w-full h-full object-cover rounded-md ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}
                                            />
                                            {isActive && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] rounded-md">
                                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-medium truncate ${isActive ? 'text-cyan-400' : 'text-gray-200'}`}>
                                                {track.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 truncate group-hover:text-gray-400">
                                                {track.artist}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {queue.length === 0 && (
                                <div className="text-center text-gray-500 py-10">
                                    Your queue is empty.
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};