interface MediaSessionActionDetails {
    action: MediaSessionAction;
}

class AudioController {
    private audio: HTMLAudioElement;
    private context: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private source: MediaElementAudioSourceNode | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.audio = new Audio();
            this.audio.crossOrigin = "anonymous";
        } else {
            this.audio = null as any;
        }
    }

    /**
     * Lazily initializes the AudioContext.
     * Must be called in response to a user gesture (e.g., Play button click).
     */
    public initAudioContext() {
        if (!this.context && typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

            this.context = new AudioContextClass();
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 2048;

            if (!this.source) {
                this.source = this.context.createMediaElementSource(this.audio);
                this.source.connect(this.analyser);
                this.analyser.connect(this.context.destination);
            }
        }

        if (this.context?.state === 'suspended') {
            this.context.resume();
        }
    }

    public setupMediaSession(
        track: { title: string; artist: string; coverUrl: string },
        handlers: {
            onPlay: () => void;
            onPause: () => void;
            onNext: () => void;
            onPrev: () => void;
        }
    ) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: track.artist,
                artwork: [
                    { src: track.coverUrl, sizes: '512x512', type: 'image/jpeg' },
                ],
            });

            navigator.mediaSession.setActionHandler('play', handlers.onPlay);
            navigator.mediaSession.setActionHandler('pause', handlers.onPause);
            navigator.mediaSession.setActionHandler('previoustrack', handlers.onPrev);
            navigator.mediaSession.setActionHandler('nexttrack', handlers.onNext);
        }
    }

    public setPlaybackState(state: 'playing' | 'paused') {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = state;
        }
    }

    public setSource(url: string) {
        if (!this.audio) return;
        this.audio.src = url;
        this.audio.load();
    }

    public play() {
        if (!this.audio) return;
        this.initAudioContext();
        this.audio.play()
            .then(() => this.setPlaybackState('playing'))
            .catch(e => console.error("Playback failed", e));
    }

    public pause() {
        if (!this.audio) return;
        this.audio.pause();
        this.setPlaybackState('paused');
    }

    /**
     * seekTo
     * @param time - Time in seconds
     */
    public seekTo(time: number) {
        if (!this.audio) return;
        this.audio.currentTime = time;
    }

    /**
     * Expose the AnalyserNode for the Visualizer component.
     * This allows the Visualizer to read frequency data directly without
     * passing it through React state. [cite: 92, 162]
     */
    public getAnalyser(): AnalyserNode | null {
        return this.analyser;
    }

    /**
     * Attach event listeners to the underlying Audio element.
     * This allows the Zustand store to subscribe to audio events.
     */
    public on(event: string, callback: EventListenerOrEventListenerObject) {
        if (this.audio) {
            this.audio.addEventListener(event, callback);
        }
    }

    public off(event: string, callback: EventListenerOrEventListenerObject) {
        if (this.audio) {
            this.audio.removeEventListener(event, callback);
        }
    }

    public get currentTime() {
        return this.audio ? this.audio.currentTime : 0;
    }

    public get duration() {
        return this.audio ? this.audio.duration : 0;
    }
}

export const audioController = new AudioController();