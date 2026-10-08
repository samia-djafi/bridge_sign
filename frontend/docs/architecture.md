# LSA Bridge — Architecture & Technical Design

## 1. System Architecture Overview

LSA Bridge is an offline-capable, Progressive Web App engineered to bridge communication between Algerian Sign Language (LSA) signers and hearing non-signers. The system is designed around a decoupled, reactive architecture ensuring sub-200ms processing, strict privacy boundaries, and accessibility compliance.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                            │
│                                                                        │
│  ┌───────────────────────┐                  ┌───────────────────────┐  │
│  │   Sign → Language     │                  │    Language → Sign    │  │
│  │       Pipeline        │                  │       Pipeline        │  │
│  │                       │                  │                       │  │
│  │  Webcam Stream        │                  │  Speech STT / Text    │  │
│  │         │             │                  │         │             │  │
│  │  MediaPipe Vision     │                  │  Text Normalizer      │  │
│  │  (Hands + Pose)       │                  │         │             │  │
│  │         │             │                  │  Slot/Duration Parser │  │
│  │  Landmark Normalizer  │                  │         │             │  │
│  │  & 48-Frame Window    │                  │  Damerau-Levenshtein  │  │
│  │         │             │                  │  Fuzzy / Exact Match  │  │
│  │  Recognition Adapter  │                  │         │             │  │
│  │  (Mock / Remote WS)   │                  │  Gloss Sequence Plan  │  │
│  │         │             │                  │         │             │  │
│  │  Gloss Buffer &       │                  │  SignPlayer Engine    │  │
│  │  800ms Rest Segmenter │                  │  (Canvas + Video/SVG) │  │
│  │         │             │                  │         │             │  │
│  │  Sentence Generator   │                  │  Multi-lingual Caption│  │
│  │         │             │                  └───────────────────────┘  │
│  │  User Confirmation    │                                             │
│  │         │             │                  ┌───────────────────────┐  │
│  │  Spoken TTS / Screen  │                  │   Persistence Layer   │  │
│  └───────────────────────┘                  │    (Dexie IndexedDB)  │  │
│                                             │                       │  │
│  ┌───────────────────────────────────────┐  │  • Sessions           │  │
│  │         Reactive State Store          │  │  • Messages           │  │
│  │  (Zustand: Settings, Session, UI)     │  │  • Phrase Favorites   │  │
│  └───────────────────────────────────────┘  │  • Soft Delete + Undo │  │
│                                             └───────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Pipelines

### 2.1 Sign → Language Pipeline (Deaf User to Spoken/Written Translation)

1. **Camera Ingestion:**
   - Captured via `navigator.mediaDevices.getUserMedia` at 1280x720 (or 640x480 fallback) at 30 FPS.
   - Screen WakeLock prevents display sleep during ongoing conversation.
   - Tab visibility changes automatically freeze camera streams to conserve device battery and compute.

2. **Landmark Extraction:**
   - Client-side `@mediapipe/tasks-vision` extracts 21 3D coordinates per hand and key upper-body pose joints.
   - Landmarks are normalized against chest-center and shoulder width to guarantee scale and position invariance.

3. **Temporal Windowing & Recognition Adapter:**
   - Normalized landmarks are buffered into fixed 48-frame sliding windows.
   - Passed to `ISignRecognitionAdapter`. In development/demo, the mock adapter matches gesture temporal characteristics with deterministic confidence tiers; in live deployments, packets stream over WebSocket to the AI inference service.

4. **Temporal Segmentation & Confirmation:**
   - Hand rest detection: when both hands drop below the chest line for $\ge 800\text{ ms}$, the current sign sequence is closed.
   - Safety limit: maximum utterance length is bounded to 12 seconds.
   - The user reviews the sequence in the `SentenceCard`, can discard or reorder chips, and confirms before transmission.
   - Once confirmed, speech synthesis announces the translated phrase, and the message appends to the conversation history.

### 2.2 Language → Sign Pipeline (Hearing User to LSA Video Playback)

1. **Input Ingestion:**
   - Hearing users communicate by typing or using browser Speech Recognition (`webkitSpeechRecognition` / `SpeechRecognition`).
   - Supports French, Arabic (Algerian dialectal variants and MSA), and English.

2. **Text Normalization & Fuzzy Slot Matching:**
   - Text is lowercased, stripped of diacritics, and parsed for medical quantities (e.g. "2 comprimés", "3 jours", "après le repas").
   - Fuzzy Damerau-Levenshtein distance matching queries the phrasebook and gloss dictionary.

3. **Sign Sequence Assembly:**
   - Matched phrases decompose into ordered LSA glosses (e.g., `HEADACHE` $\rightarrow$ `PAIN` $\rightarrow$ `MEDICINE`).
   - Each sign specifies an exact playback duration (e.g. 1800ms) and asset URI.

4. **SignPlayer Canvas Engine:**
   - The player cycles through pre-rendered sign video assets (`.webm` / `.mp4`).
   - If a clip file is absent or network fails, an animated high-contrast 2D anatomical avatar renders skeleton gestures on HTML5 canvas with zero stutter.
   - Displays synchronized high-visibility multilingual subtitles (FR / AR / EN).

---

## 3. Storage & State Management

### 3.1 Dexie IndexedDB Architecture
Data persistence operates entirely client-side inside the browser's IndexedDB:
- `sessions`: ID, context, participant roles, start/end timestamps, archive state, soft-delete timestamp.
- `messages`: UUID, session ID, direction (`sign-to-lang` vs `lang-to-sign`), gloss tokens, text translation, confidence score, confirmation status.
- `favorites`: Phrasebook entries bookmarked by the user for instant 1-click access.
- `meta`: Offline sync metrics, vocabulary version stamp, anonymous diagnostic counters.

### 3.2 Soft Deletion with 5-Second Undo
To prevent accidental loss of important medical conversation logs:
1. Deleting a session sets `deletedAt = Date.now()` without deleting records immediately.
2. The UI removes the session from view and displays a Toast notification with an "Undo" action.
3. If "Undo" is clicked within 5 seconds, `deletedAt` is reverted to `null`.
4. After 5 seconds, background garbage collection permanently purges soft-deleted sessions.

---

## 4. Progressive Web App & Offline Architecture

LSA Bridge is built with a strict offline-first requirement to ensure full utility in Algerian health centers with unreliable mobile networks:

1. **Service Worker (Workbox):**
   - Built with Vite PWA Plugin using `injectManifest`.
   - Pre-caches core JavaScript bundles, CSS stylesheets, HTML, and web fonts:
     - `Inter` Variable Font (Latin)
     - `IBM Plex Sans Arabic` (Weights 400, 500, 600, 700)
   - Cache-first strategy for static SVG icons and sign dictionary manifests (`public/signs/manifest.json`).

2. **Offline Fallback Page:**
   - `public/offline.html` is cached on initial load to serve clean emergency instructions if the client navigates without active cache.

3. **Installability Prompt:**
   - Intercepts `beforeinstallprompt` and exposes custom, accessible install banners via `useInstallPrompt`.
