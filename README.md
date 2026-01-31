# Web-Based Music Player

A responsive, feature-rich music player application built with Next.js 14, TypeScript, and the Web Audio API. This project was developed as a submission for the Unified Mentor Web Development internship.

## 🚀 Features

### Core Playback
- **Audio Control:** Play, pause, seek, and volume control (with slider).
- **Advanced Modes:** Shuffle and Repeat (Repeat One / Repeat All).
- **Visualizer:** Real-time audio frequency visualization using the Web Audio API (FFT).
- **Queue System:** Dynamic "Up Next" queue with drag-and-drop capabilities.

### Library Management
- **Local Import:** Import audio files from your device. These are automatically organized into a "Local Files" folder.
- **Playlists:** Create custom playlists, add/remove tracks, and manage your library.
- **Favorites:** "Like" tracks to add them to a dedicated Favorites list.
- **Persistence:** Player state (volume, playlists, liked songs) is persisted to LocalStorage.

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand (with persistence middleware)
- **Animations:** Framer Motion
- **Audio Engine:** Custom Singleton `AudioController` class wrapping HTML5 Audio and AudioContext.

## 🛠️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DataWiseWizard/music-player
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Open the application:
Navigate to http://localhost:3000 in your browser.



## Project By:
Rudraksha Kumbhkar