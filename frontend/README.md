# LSA Bridge (جسر لغة الإشارة الجزائرية)

> **"Two modalities. One conversation."**  
> *FR: "Deux modalités. Une seule conversation."*  
> *AR: "طريقتان للتواصل. محادثة واحدة."*

**LSA Bridge** is an installable, offline-first Progressive Web App (PWA) facilitating real-time bidirectional communication between Algerian Sign Language (LSA) and spoken/written French, Arabic, and English. Engineered specifically for critical frontline scenarios—such as a Deaf patient consulting a pharmacist or clinic triage desk without an in-person interpreter.

---

## 🌟 Key Capabilities

- **Bidirectional Communication Pipeline:**
  - **Sign $\rightarrow$ Language:** Real-time upper-body and hand landmark extraction via MediaPipe, 48-frame temporal windowing, automatic 800ms rest-posture utterance segmentation, contextual French/Arabic sentence synthesis, and high-quality Text-to-Speech (TTS).
  - **Language $\rightarrow$ Sign:** Spoken voice recognition (STT) or text input, medical dosage and duration pattern extraction, fuzzy LSA gloss mapping, and synchronous visual playback via the high-definition `SignPlayer` with multilingual subtitles.
- **Offline-First Resilience:** Built with Workbox Service Worker pre-caching all UI assets, fonts (`Inter`, `IBM Plex Sans Arabic`), and local sign clips. 100% of conversation history and phrasebook data is persisted locally in IndexedDB (Dexie).
- **RTL-First Trilingual Support:** Instant zero-reload switching between **Français**, **العربية** (Native Right-to-Left with mirrored UI), and **English**. Fully validated parity across all 306 i18n keys.
- **Frontline Medical Utility:**
  - Specialized Healthcare & Pharmacy context models.
  - Interactive **Emergency Sheet** for rapid one-click medical distress signaling (asthma, severe bleeding, chest pain, allergic reactions).
  - Categorized **Phrasebook** with offline search and persistent favorites.
- **Accessible & Inclusive Design:** WCAG 2.2 AA compliant. Strict color contrast ($\ge 5.2:1$ on text, zero gradients), full screen reader live announcements, full keyboard navigation with focus traps, and dedicated High Contrast and Reduced Motion modes.
- **Honest AI Scope:** Operates on an explicit, statically tracked vocabulary scope (`VOCAB_SIZE: 54` signs in MVP). Transparently labels live adapters vs scripted demo modes and avoids speculative diagnostic claims.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                              LSA BRIDGE PWA                            │
│                                                                        │
│   [Deaf User] ────▶  Webcam Ingestion (720p @ 30FPS)                   │
│                              │                                         │
│                      MediaPipe Vision Pipeline                         │
│                      (Pose + 21 Hand Landmarks)                        │
│                              │                                         │
│                      48-Frame Sliding Window                           │
│                              │                                         │
│                      ISignRecognitionAdapter                           │
│                      ├─ Mock Adapter (Demo Scripting)                  │
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

## 🚀 Quick Start

### Prerequisites
- Node.js $\ge 18.0.0$ (Tested on Node v20 & v24)
- npm $\ge 9.0.0$

### 1. Clone & Install
```bash
git clone https://github.com/awal-org/lsa-bridge.git
cd lsa-bridge
npm install
```

### 2. Configure Environment
Copy the example environment configuration:
```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_APP_NAME` | Application display name | `LSA Bridge` |
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
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Development & Quality Scripts

```bash
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

## 📱 Progressive Web App (PWA) Installation

LSA Bridge is configured with `vite-plugin-pwa` for immediate standalone desktop and mobile installation:
- **Desktop (Chrome / Edge / Brave):** Click the install icon in the address bar or use the in-app "Installer l'application" banner.
- **iOS (Safari):** Tap **Share** $\rightarrow$ **Add to Home Screen**.
- **Android (Chrome):** Tap **Menu** $\rightarrow$ **Install App**.

When offline, cached assets, fonts, and local databases ensure full functional continuity.

---

## 📚 Technical Documentation

Comprehensive engineering documents are located in the [`docs/`](file:///d:/Awal/docs) directory:
- [Architecture & Design Details](file:///d:/Awal/docs/architecture.md)
- [REST & WebSocket API Contracts](file:///d:/Awal/docs/api-contract.md)
- [Architecture Decision Records (ADRs)](file:///d:/Awal/docs/decisions.md)
- [LSA Video Recording & Asset Production Guide](file:///d:/Awal/docs/sign-clips-guide.md)
- [3-Minute Live Jury Demonstration Script](file:///d:/Awal/docs/jury-demo-script.md)
- [Manual Accessibility (A11y) Verification Protocol](file:///d:/Awal/docs/a11y-manual-test.md)

---

## 🤝 Community & Ethical Statement

LSA Bridge is developed in active partnership and consultation with the Algerian Deaf community. All sign assets, gloss definitions, and regional variants adhere to cultural consensus across Algerian wilayas.

LSA Bridge is **not** a medical diagnostic tool or an interpreter replacement; it is an assistive communication bridge designed to ensure equity, privacy, and safety in healthcare encounters.
