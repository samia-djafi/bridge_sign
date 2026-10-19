# ConnectSign (جسر لغة الإشارة الجزائرية)

[![Production](https://img.shields.io/badge/Production-Live-0D9488?style=flat&logo=vercel)](https://bridge-sign.vercel.app/app)
[![WCAG 2.2 AA](https://img.shields.io/badge/A11y-WCAG%202.2%20AA%20Compliant-15803D?style=flat)](frontend/docs/a11y-manual-test.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](frontend/tsconfig.json)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat)](#license)

> **"Every Hand Has a Voice"**<br />
> *FR: "Chaque main a une voix"*<br />
> *AR: "لكل يد صوت"*

**ConnectSign** is an installable, offline-first Progressive Web App (PWA) facilitating real-time bidirectional communication between **Algerian Sign Language (LSA)** and spoken/written French, Arabic, and English. Engineered specifically for frontline accessibility scenarios—such as a Deaf patient consulting a pharmacist or medical clinic triage desk without an in-person interpreter.

- **Production Deployment:** [https://bridge-sign.vercel.app/app](https://bridge-sign.vercel.app/app)
- **Repository:** [https://github.com/samia-djafi/connect_sign](https://github.com/samia-djafi/connect_sign)

---

## 🌟 Key Capabilities

- **Bidirectional Communication Pipeline:**
  - **Sign $\rightarrow$ Language:** Real-time upper-body and hand landmark vision pipeline, 48-frame temporal windowing, automatic 800ms rest-posture utterance segmentation, contextual French/Arabic sentence synthesis, and high-quality Text-to-Speech (TTS).
  - **Language $\rightarrow$ Sign:** Spoken voice recognition (Web Speech STT) or text input, medical dosage and duration pattern extraction, fuzzy LSA gloss mapping, and synchronous visual playback via the high-definition `SignPlayer` with multilingual subtitles.
- **Offline-First Resilience:** Built with Workbox Service Worker pre-caching all UI assets, fonts (`Inter`, `IBM Plex Sans Arabic`), and local sign clips. 100% of conversation history and phrasebook data is persisted locally in IndexedDB (Dexie).
- **RTL-First Trilingual Support:** Instant zero-reload switching between **Français**, **العربية** (Native Right-to-Left with mirrored UI), and **English**. Fully validated parity across all 698 i18n keys.
- **Frontline Medical Utility:**
  - Specialized Healthcare & Pharmacy context models.
  - Interactive **Emergency Sheet** for rapid one-click medical distress signaling (asthma, severe bleeding, chest pain, allergic reactions).
  - Categorized **Phrasebook** with offline search, keyboard navigation, and persistent favorites.
- **Accessible & Inclusive Design:** WCAG 2.2 AA compliant. Strict color contrast ($\ge 5.2:1$ on text), full screen reader live announcements, full keyboard navigation with focus traps, and dedicated High Contrast (`hc`) and Reduced Motion modes.
- **Local-First Privacy:** Video frames and webcam feeds are processed entirely in memory on the client device. Patient conversations are saved locally in the browser's IndexedDB and never transmitted to external analytics or remote servers.
- **Honest AI Scope:** Operates on an explicit, statically tracked vocabulary scope (`VOCAB_SIZE: 54` signs in MVP). Transparently labels live adapters vs scripted demo modes and avoids speculative diagnostic claims.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                             CONNECTSIGN PWA                            │
│                                                                        │
│   [Deaf User] ────▶  Webcam Ingestion (720p @ 30FPS)                   │
│                              │                                         │
│                      MediaPipe Vision Pipeline                         │
│                      (Pose + 21 Hand Landmarks)                        │
│                              │                                         │
│                      48-Frame Sliding Window                           │
│                              │                                         │
│                      ISignRecognitionAdapter                           │
│                      ├─ Mock Adapter (Client Demo Scripting)           │
│                      └─ HTTP / WebSocket Adapter (Edge AI Service)     │
│                              │                                         │
│                      800ms Rest Segmentation & Gloss Buffer            │
│                              │                                         │
│                      Natural Language Generation                       │
│                              │                                         │
│                      Confirmation Card & Audio TTS ────▶ [Hearing User]│
│                                                                        │
│   [Hearing User] ─▶  Speech STT / Text Input                           │
│                              │                                         │
│                      Text Normalization & Slot Duration Extraction     │
│                              │                                         │
│                      Fuzzy Damerau-Levenshtein Gloss Matcher           │
│                              │                                         │
│                      SignPlayer Engine (Video Clips + Canvas Avatar)   │
│                              │                                         │
│                      Multilingual Captions ────────────▶ [Deaf User]   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
connect_sign/
├── .gitignore                    # Root repository ignore rules
├── README.md                     # Root project documentation
├── vercel.json                   # Root deployment & HTTP security headers configuration
└── frontend/                     # Core React PWA application
    ├── docs/                     # Technical documentation & ADRs
    ├── public/                   # Static assets, PWA icons, offline manifest
    ├── scripts/                  # Development & verification scripts
    ├── src/
    │   ├── app/                  # App shell, routing, error boundary, providers
    │   ├── components/
    │   │   ├── domain/           # Domain-specific components (Camera, Audio, Timeline, etc.)
    │   │   └── ui/               # Reusable accessible UI primitives (Modal, Sheet, Button, etc.)
    │   ├── data/                 # Contexts, vocabulary, model card, stories data
    │   ├── features/             # Feature views (Workspace, Phrasebook, History, Settings, etc.)
    │   ├── hooks/                # Camera & recognition hooks
    │   ├── i18n/                 # Trilingual localization dictionaries (FR, AR, EN)
    │   ├── lib/                  # Utilities (A11y, confidence, normalization, timing)
    │   ├── services/             # IndexedDB repository, audio, recognition adapters
    │   ├── stores/               # Zustand state stores
    │   └── test/                 # Vitest automated test suite
    ├── package.json              # Dependencies and lifecycle scripts
    └── vite.config.ts            # Vite & Workbox PWA configuration
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js $\ge 18.0.0$ (Tested on Node v20 & v24)
- npm $\ge 9.0.0$

### 1. Clone & Install
```bash
git clone https://github.com/samia-djafi/connect_sign.git
cd connect_sign/frontend
npm install
```

### 2. Configure Environment
Copy the example environment configuration:
```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_APP_NAME` | Application display name | `ConnectSign` |
| `VITE_AI_ADAPTER` | Active recognition adapter (`mock` \| `http`) | `mock` |
| `VITE_API_BASE_URL` | Base endpoint for REST AI inference | `http://localhost:8000` |
| `VITE_WS_URL` | WebSocket streaming endpoint | `ws://localhost:8000/ws/recognize` |
| `VITE_CONFIDENCE_THRESHOLD` | Minimum score to consider gesture detected | `0.70` |
| `VITE_CONFIDENCE_HIGH` | High-confidence visual threshold | `0.85` |
| `VITE_SEQUENCE_FRAMES` | Temporal frame window size | `48` |
| `VITE_APP_VERSION` | Application semver string | `0.1.0` |

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or Vite port [http://localhost:5173](http://localhost:5173)) in your browser.

---

## 🛠️ Verification & Quality Scripts

```bash
cd frontend

# Run complete test suite (Vitest)
npm run test

# Run tests in continuous watch mode
npm run test:watch

# Verify strict TypeScript type safety
npm run typecheck

# Check i18n translation key parity across FR, AR, EN
npm run i18n:check

# Build production bundle with PWA service worker
npm run build

# Preview production build locally
npm run preview
```

---

## 🔒 Security & Privacy Guarantees

- **No Remote Video Streaming:** Camera streams are processed locally in browser memory via MediaPipe and canvas overlays. No images or videos are transmitted to remote servers.
- **Client-Side Data Storage:** Conversation history and notes are saved strictly in IndexedDB (`connectsign`, with automatic idempotent backward compatibility for legacy `lsa-bridge`) and localStorage on the user's device.
- **Content Security Policy (CSP):** Configured in `vercel.json` with strict directives for scripts, styles, fonts, and network connections.
- **Clickjacking Protection:** Protected via `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`.
- **MIME Sniffing Prevention:** `X-Content-Type-Options: nosniff`.
- **Safe Feedback Ingestion:** Feedback submissions are securely posted directly to Google Forms via background requests without user tracking.

---

## 📚 Technical Documentation

Comprehensive engineering documents are located in the [`frontend/docs/`](frontend/docs) directory:
- [Architecture & Design Details](frontend/docs/architecture.md)
- [REST & WebSocket API Contracts](frontend/docs/api-contract.md)
- [Architecture Decision Records (ADRs)](frontend/docs/decisions.md)
- [LSA Video Recording & Asset Production Guide](frontend/docs/sign-clips-guide.md)
- [3-Minute Live Jury Demonstration Script](frontend/docs/jury-demo-script.md)
- [Manual Accessibility (A11y) Verification Protocol](frontend/docs/a11y-manual-test.md)

---

## 🤝 Community & Ethical Statement

ConnectSign is developed in active partnership and consultation with the Algerian Deaf community. All sign assets, gloss definitions, and regional variants adhere to cultural consensus across Algerian wilayas.

ConnectSign is **not** a medical diagnostic tool or a human interpreter replacement; it is an assistive communication bridge designed to ensure equity, privacy, and safety in healthcare encounters.
