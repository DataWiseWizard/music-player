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
   git clone <repository-url>
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Open the application:
Navigate to http://localhost:3000 in your browser.

## 📂 Project Structure
/src/lib/audioController.ts: Singleton class managing the AudioContext, AnalyserNode, and HTML5 Audio element.

/src/store: Zustand store handling global state (queue, playlists, active track).

/src/components: UI components (Player, Visualizer, QueueDrawer).


---

### **2. Project Documentation (PDF Content)**
You are required to submit a "brief document that explains how to use your music player". Copy the content below into a Word document and save it as `Documentation.pdf`.

***

# Music Player Application - User Manual & Technical Documentation

**Submitted to:** Unified Mentor
**Project Title:** Music Player
**Difficulty Level:** Hard

## 1. Project Overview
This project is a modern, web-based music player designed to provide a seamless listening experience. It goes beyond basic playback by integrating professional features such as a real-time frequency visualizer, custom playlist management, and a persistent library system. The application is built using **Next.js** and **TypeScript**, ensuring a responsive design that works across various screen sizes.

## 2. User Guide

### **Importing Music**
1. Click the **"Import Song"** button (located in the bottom-right of the player bar or the empty state screen).
2. Select an audio file (MP3, WAV, etc.) from your device.
3. The song will be immediately added to the **"Local Files"** playlist in your library without interrupting your current playback.

### **Playback Controls**
- **Play/Pause:** Toggle playback using the center button.
- **Seek:** Click anywhere on the progress bar to jump to a specific timestamp.
- **Volume:** Use the slider on the right side of the player bar to adjust volume. Click the speaker icon to Mute/Unmute.
- **Shuffle:** Click the Shuffle icon (intertwined arrows) to randomize the queue.
- **Repeat:** Click the Repeat icon to cycle modes:
  - *No Repeat* (Gray)
  - *Repeat All* (Cyan)
  - *Repeat One* (Cyan with "1" badge)

### **Managing Playlists**
1. Click **"New Playlist"** in the top header.
2. Enter a name for your playlist.
3. To add a song, hover over any track in the "Discover" or "Local Files" list and click the **+ (Plus)** button.
4. Select the destination playlist from the prompt.

## 3. Technical Architecture

### **Audio Controller (The Engine)**
The application uses a **Singleton Design Pattern** for the `AudioController`. This ensures there is only one instance of the `HTMLAudioElement` and `AudioContext` active at any time, preventing memory leaks and overlapping audio.
- **Web Audio API:** Used to extract frequency data for the visualizer.
- **Media Session API:** Integrates with the operating system's media controls (allowing keyboard media keys to work).

### **State Management (The Brain)**
We utilize **Zustand** for global state management. This handles:
- **Queue Logic:** Managing the list of songs to play next.
- **Persistence:** Automatically saving your playlists and volume preferences to the browser's LocalStorage, so you don't lose your data on refresh.

### **Visualizer**
The visualizer renders a real-time frequency graph using the HTML5 `<canvas>` element. It connects to the `AnalyserNode` in the `AudioController` to sync the animation frame rate with the audio data.

***

## Project By:
Rudraksha Kumbhkar